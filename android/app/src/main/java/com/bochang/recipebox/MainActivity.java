package com.bochang.recipebox;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // WebViewキャッシュ問題根本解決: APK反映を確実にする
        WebView webview = getBridge().getWebView();
        
        // 1. 既存のキャッシュを強制的に完全削除
        webview.clearCache(true);
        
        // 2. 今後一切キャッシュを使用しないモードに設定
        WebSettings webSettings = webview.getSettings();
        webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
    }
}
