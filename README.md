# RecipeBox Web版

## 概要
分量調整と塩分濃度計算ができるシンプルな料理レシピ管理Webアプリ

## 特徴
- **PWA対応**: アプリとしてインストール可能
- **オフライン動作**: Service Workerによるキャッシュ機能
- **レスポンシブデザイン**: スマホ・タブレット・PC対応
- **LocalStorage**: ブラウザ内でのデータ永続化

## 機能
- 料理レシピ管理（追加・編集・検索・ソート）
- 分量調整（1-4人前スライダー）
- 塩分濃度計算機
- 容器重量データ参照
- 星マーク（お気に入り）機能

## 開発・テスト
```bash
# 開発サーバー起動
http-server -p 8080 -o

# ブラウザで http://localhost:8080 にアクセス
```

## PWAインストール
1. Chrome/Edgeで開く
2. アドレスバーの「インストール」ボタンをクリック
3. またはメニュー → 「アプリをインストール」

## ファイル構成
```
recipebox-web/
├── index.html          # メインHTML
├── style.css           # スタイルシート
├── script.js           # JavaScript（メイン機能）
├── manifest.json       # PWAマニフェスト
├── sw.js              # Service Worker
├── icons/             # PWAアイコン（作成予定）
└── README.md          # このファイル
```

## 完成機能
- ✅ レシピ詳細表示機能
- ✅ 分量調整スライダー（1-4人前）
- ✅ アプリ化（Capacitor）
- ✅ GitHub Actions APKビルド
- ✅ PWA対応（Service Worker）

## APKビルド方法
```bash
# GitHub Actionsで自動ビルド（推奨）
git push origin main

# ローカルビルド（要Android SDK）
npx cap sync android
cd android
./gradlew assembleDebug
```

## 今後の予定
- レシピ追加・編集機能
- アイコン作成
- UI最適化
- 自動デプロイ設定# Test commit to trigger build
