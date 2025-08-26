// ===== PWA→APK Template JavaScript =====

// アプリケーションメインクラス
class PWATemplate {
    constructor() {
        this.counter = 0;
        this.settings = {
            appName: 'PWA Template',
            theme: 'default',
            autoSave: true
        };
        this.init();
    }

    // 初期化
    init() {
        console.log('🚀 PWA Template 初期化開始');
        
        // 時刻表示の開始
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
        
        // 保存されたデータの読み込み
        this.loadSettings();
        this.loadCounter();
        
        // UI更新
        this.updateUI();
        
        // PWA機能の初期化
        this.initPWA();
        
        console.log('✅ PWA Template 初期化完了');
    }

    // 現在時刻の更新
    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const element = document.getElementById('currentTime');
        if (element) {
            element.textContent = timeString;
        }
    }

    // ===== カウンター機能 =====
    
    incrementCounter() {
        this.counter++;
        this.updateCounterDisplay();
        if (this.settings.autoSave) {
            this.saveCounter();
        }
        this.showNotification('カウンター +1', 'success');
    }

    decrementCounter() {
        this.counter--;
        this.updateCounterDisplay();
        if (this.settings.autoSave) {
            this.saveCounter();
        }
        this.showNotification('カウンター -1', 'info');
    }

    resetCounter() {
        this.counter = 0;
        this.updateCounterDisplay();
        if (this.settings.autoSave) {
            this.saveCounter();
        }
        this.showNotification('カウンターリセット', 'warning');
    }

    updateCounterDisplay() {
        const element = document.getElementById('counterValue');
        if (element) {
            element.textContent = this.counter;
            element.classList.add('fade-in');
            setTimeout(() => element.classList.remove('fade-in'), 300);
        }
    }

    // ===== データ管理 =====
    
    saveData() {
        try {
            const data = {
                counter: this.counter,
                timestamp: new Date().toISOString(),
                settings: this.settings
            };
            localStorage.setItem('pwa-template-data', JSON.stringify(data));
            this.updateDataStatus('データ保存完了');
            this.showNotification('データを保存しました', 'success');
        } catch (error) {
            console.error('データ保存エラー:', error);
            this.showNotification('データ保存に失敗しました', 'danger');
        }
    }

    loadData() {
        try {
            const savedData = localStorage.getItem('pwa-template-data');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.counter = data.counter || 0;
                this.settings = { ...this.settings, ...data.settings };
                this.updateUI();
                this.updateDataStatus(`データ読み込み完了 (${new Date(data.timestamp).toLocaleString()})`);
                this.showNotification('データを読み込みました', 'success');
            } else {
                this.updateDataStatus('保存されたデータがありません');
                this.showNotification('データが見つかりません', 'warning');
            }
        } catch (error) {
            console.error('データ読み込みエラー:', error);
            this.showNotification('データ読み込みに失敗しました', 'danger');
        }
    }

    clearData() {
        if (confirm('すべてのデータを削除しますか？')) {
            localStorage.removeItem('pwa-template-data');
            this.counter = 0;
            this.settings = {
                appName: 'PWA Template',
                theme: 'default',
                autoSave: true
            };
            this.updateUI();
            this.updateDataStatus('データクリア完了');
            this.showNotification('データを削除しました', 'info');
        }
    }

    updateDataStatus(message) {
        const element = document.getElementById('dataStatus');
        if (element) {
            element.textContent = message;
            element.classList.add('fade-in');
            setTimeout(() => element.classList.remove('fade-in'), 300);
        }
    }

    // ===== 設定管理 =====
    
    showSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            // 現在の設定値をフォームに反映
            document.getElementById('settingAppName').value = this.settings.appName;
            document.getElementById('settingTheme').value = this.settings.theme;
            document.getElementById('settingAutoSave').checked = this.settings.autoSave;
            
            modal.classList.add('active');
        }
    }

    hideSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    saveSettings() {
        // フォームから値を取得
        this.settings.appName = document.getElementById('settingAppName').value;
        this.settings.theme = document.getElementById('settingTheme').value;
        this.settings.autoSave = document.getElementById('settingAutoSave').checked;
        
        // LocalStorageに保存
        localStorage.setItem('pwa-template-settings', JSON.stringify(this.settings));
        
        // UI更新
        this.updateUI();
        this.hideSettings();
        this.showNotification('設定を保存しました', 'success');
    }

    resetSettings() {
        if (confirm('設定をデフォルトに戻しますか？')) {
            this.settings = {
                appName: 'PWA Template',
                theme: 'default',
                autoSave: true
            };
            localStorage.removeItem('pwa-template-settings');
            this.updateUI();
            this.hideSettings();
            this.showNotification('設定をリセットしました', 'info');
        }
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('pwa-template-settings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            }
        } catch (error) {
            console.error('設定読み込みエラー:', error);
        }
    }

    // ===== カウンター保存/読み込み =====
    
    saveCounter() {
        try {
            localStorage.setItem('pwa-template-counter', this.counter.toString());
        } catch (error) {
            console.error('カウンター保存エラー:', error);
        }
    }

    loadCounter() {
        try {
            const savedCounter = localStorage.getItem('pwa-template-counter');
            if (savedCounter) {
                this.counter = parseInt(savedCounter, 10) || 0;
            }
        } catch (error) {
            console.error('カウンター読み込みエラー:', error);
        }
    }

    // ===== UI更新 =====
    
    updateUI() {
        // カウンター表示更新
        this.updateCounterDisplay();
        
        // アプリ名更新
        document.title = this.settings.appName;
        const headerTitle = document.querySelector('.header-title h1');
        if (headerTitle) {
            headerTitle.innerHTML = `🚀 ${this.settings.appName}`;
        }
        
        // テーマ適用
        this.applyTheme();
    }

    applyTheme() {
        document.body.className = '';
        if (this.settings.theme === 'dark') {
            document.body.classList.add('theme-dark');
        } else if (this.settings.theme === 'light') {
            document.body.classList.add('theme-light');
        }
    }

    // ===== 通知システム =====
    
    showNotification(message, type = 'info') {
        // 既存の通知を削除
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 通知要素を作成
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // アニメーション
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // 自動削除
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationColor(type) {
        const colors = {
            success: '#27AE60',
            warning: '#F39C12',
            danger: '#E74C3C',
            info: '#3498DB'
        };
        return colors[type] || colors.info;
    }

    // ===== PWA機能 =====
    
    initPWA() {
        // インストールプロンプト
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
        
        // オフライン/オンライン状態監視
        window.addEventListener('online', () => {
            this.showNotification('オンラインに戻りました', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('オフライン状態です', 'warning');
        });
        
        // Service Worker更新通知
        navigator.serviceWorker?.addEventListener('controllerchange', () => {
            this.showNotification('アプリが更新されました', 'info');
        });
    }

    showInstallButton() {
        // インストールボタンを表示（実装例）
        console.log('📱 PWAインストール可能');
    }

    // ===== ユーティリティ関数 =====
    
    // モーダルの外側クリックで閉じる
    setupModalClickHandlers() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    // ESCキーでモーダルを閉じる
    setupKeyboardHandlers() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    activeModal.classList.remove('active');
                }
            }
        });
    }

    // フォーカス管理
    setupAccessibility() {
        // フォーカストラップなどのアクセシビリティ機能
        console.log('♿ アクセシビリティ機能初期化');
    }
}

// アプリケーションインスタンスを作成
const app = new PWATemplate();

// DOMContentLoaded後に追加設定
document.addEventListener('DOMContentLoaded', () => {
    app.setupModalClickHandlers();
    app.setupKeyboardHandlers();
    app.setupAccessibility();
    
    console.log('🎯 PWA Template 完全起動完了');
});

// エクスポート（モジュール使用時）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWATemplate;
}

// Capacitor対応の初期化
document.addEventListener('deviceready', () => {
    console.log('📱 Capacitor初期化完了');
    app.showNotification('APKモードで実行中', 'success');
}, false);