# RecipeBox Web 🍳

PWA recipe management app with CCLSP integration for advanced code analysis.

## 🚀 Quick Start with GitHub Codespaces

### Option 1: One-Click Launch (Recommended)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/bochang999/recipebox-web)

### Option 2: Manual Launch
1. Go to: https://github.com/bochang999/recipebox-web
2. Click green `< > Code` button
3. Select `Codespaces` tab
4. Click `Create codespace on main`

## ✨ Features
- **Recipe Management**: Create, edit, and organize recipes
- **Amount Calculator**: 1-4 servings adjustment slider
- **Salt Concentration Calculator**: Precise seasoning calculations
- **PWA Support**: Install as mobile app
- **CCLSP Integration**: Advanced code analysis with Language Server Protocol

## 🔧 Development Environment

The Codespace automatically sets up:
- Node.js 18+ environment
- TypeScript Language Server (fast initialization in cloud!)
- CCLSP with MCP integration
- Development server on port 8080

## 🎯 CCLSP Usage

Once in Codespaces, you can use powerful code analysis tools:

```bash
# Test CCLSP connection
cclsp --version

# Use MCP tools through Claude Code
# - find_definition: Locate function/variable definitions
# - find_references: Find all usage locations  
# - rename_symbol: Refactor variable names
# - get_diagnostics: Check for errors and warnings
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
