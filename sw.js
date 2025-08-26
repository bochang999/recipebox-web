// Service Worker for PWA Template
const CACHE_NAME = 'pwa-template-v1.0.0';
const STATIC_CACHE_NAME = 'pwa-template-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'pwa-template-dynamic-v1.0.0';

// キャッシュするファイルリスト
const STATIC_FILES = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
    './icons/apple-touch-icon.png',
    './icons/favicon-32x32.png',
    './icons/favicon-16x16.png'
];

// インストールイベント
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker インストール開始');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('📦 静的ファイルをキャッシュ中...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Service Worker インストール完了');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker インストールエラー:', error);
            })
    );
});

// アクティベーションイベント
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker アクティベーション開始');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // 古いキャッシュを削除
                        if (cacheName !== STATIC_CACHE_NAME && 
                            cacheName !== DYNAMIC_CACHE_NAME &&
                            cacheName.startsWith('pwa-template-')) {
                            console.log('🗑️ 古いキャッシュを削除:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker アクティベーション完了');
                return self.clients.claim();
            })
            .catch((error) => {
                console.error('❌ Service Worker アクティベーションエラー:', error);
            })
    );
});

// フェッチイベント（Cache First Strategy）
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // 同じオリジンのリクエストのみ処理
    if (url.origin !== location.origin) {
        return;
    }
    
    // ナビゲーションリクエストの場合
    if (request.mode === 'navigate') {
        event.respondWith(handleNavigate(request));
        return;
    }
    
    // 静的ファイルの場合
    if (isStaticFile(request.url)) {
        event.respondWith(handleStaticFile(request));
        return;
    }
    
    // その他のリクエスト
    event.respondWith(handleOtherRequests(request));
});

// ナビゲーションリクエストの処理
async function handleNavigate(request) {
    try {
        // ネットワークを最初に試す
        const networkResponse = await fetch(request);
        return networkResponse;
    } catch (error) {
        // ネットワークが失敗した場合はキャッシュからindex.htmlを返す
        console.log('🌐 オフライン: キャッシュからindex.htmlを返します');
        const cache = await caches.open(STATIC_CACHE_NAME);
        const cachedResponse = await cache.match('./index.html');
        return cachedResponse || new Response('オフライン中です', {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }
}

// 静的ファイルの処理（Cache First）
async function handleStaticFile(request) {
    try {
        const cache = await caches.open(STATIC_CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // バックグラウンドでキャッシュを更新
            updateCache(request);
            return cachedResponse;
        }
        
        // キャッシュにない場合はネットワークから取得
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('静的ファイル取得エラー:', error);
        return new Response('ファイルが見つかりません', { status: 404 });
    }
}

// その他のリクエストの処理（Network First）
async function handleOtherRequests(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('リソースを取得できませんでした', { status: 503 });
    }
}

// バックグラウンドでキャッシュを更新
async function updateCache(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE_NAME);
            await cache.put(request, networkResponse);
            console.log('🔄 キャッシュ更新:', request.url);
        }
    } catch (error) {
        // バックグラウンド更新なのでエラーは無視
    }
}

// 静的ファイルかどうかを判定
function isStaticFile(url) {
    return STATIC_FILES.some(file => url.endsWith(file)) ||
           url.includes('.css') ||
           url.includes('.js') ||
           url.includes('.png') ||
           url.includes('.jpg') ||
           url.includes('.ico');
}

// メッセージリスナー（キャッシュクリア等）
self.addEventListener('message', (event) => {
    const { action } = event.data;
    
    switch (action) {
        case 'CLEAR_CACHE':
            clearAllCaches()
                .then(() => {
                    event.ports[0].postMessage({ success: true });
                })
                .catch((error) => {
                    event.ports[0].postMessage({ success: false, error: error.message });
                });
            break;
            
        case 'UPDATE_CACHE':
            updateAllStaticFiles()
                .then(() => {
                    event.ports[0].postMessage({ success: true });
                })
                .catch((error) => {
                    event.ports[0].postMessage({ success: false, error: error.message });
                });
            break;
            
        case 'GET_CACHE_SIZE':
            getCacheSize()
                .then((size) => {
                    event.ports[0].postMessage({ success: true, size });
                })
                .catch((error) => {
                    event.ports[0].postMessage({ success: false, error: error.message });
                });
            break;
    }
});

// すべてのキャッシュをクリア
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    const deletePromises = cacheNames.map(cacheName => caches.delete(cacheName));
    await Promise.all(deletePromises);
    console.log('🗑️ すべてのキャッシュをクリアしました');
}

// 静的ファイルのキャッシュを更新
async function updateAllStaticFiles() {
    const cache = await caches.open(STATIC_CACHE_NAME);
    await cache.addAll(STATIC_FILES);
    console.log('🔄 静的ファイルキャッシュを更新しました');
}

// キャッシュサイズを取得
async function getCacheSize() {
    let totalSize = 0;
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
    }
    
    return totalSize;
}

// 同期イベント（バックグラウンド同期）
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('🔄 バックグラウンド同期開始');
        event.waitUntil(doBackgroundSync());
    }
});

// バックグラウンド同期処理
async function doBackgroundSync() {
    try {
        // ここで必要な同期処理を実行
        console.log('✅ バックグラウンド同期完了');
    } catch (error) {
        console.error('❌ バックグラウンド同期エラー:', error);
    }
}

// プッシュ通知イベント
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body || 'PWA Template通知',
        icon: './icons/icon-192x192.png',
        badge: './icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: data.data || {},
        actions: data.actions || []
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'PWA Template', options)
    );
});

// 通知クリックイベント
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const { action, data } = event.notification;
    
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then((clientList) => {
                // 既に開いているタブがあれば、そこにフォーカス
                for (const client of clientList) {
                    if (client.url.includes(location.origin) && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                // なければ新しいタブを開く
                if (clients.openWindow) {
                    const url = action === 'open' ? data.url || './' : './';
                    return clients.openWindow(url);
                }
            })
    );
});

console.log('🚀 Service Worker スクリプト読み込み完了');