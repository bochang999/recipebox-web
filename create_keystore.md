# RecipeBox APK署名キーストア作成ガイド

## 🔑 キーストア作成手順

### Step 1: キーストアファイルの作成

```bash
# RecipeBox用のキーストアを作成
keytool -genkey -v -keystore recipebox-release-key.p12 \
    -alias recipebox-key \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storetype PKCS12

# 入力項目：
# キーストアパスワード: 強力なパスワードを設定
# キーパスワード: キーストアパスワードと同じでOK
# 姓名: bochang
# 組織単位: RecipeBox
# 組織名: bochang development
# 市区町村名: Tokyo
# 都道府県名: Tokyo
# 国コード: JP
```

### Step 2: キーストア情報の確認

```bash
# キーストア内容の確認
keytool -list -v -keystore recipebox-release-key.p12 -storetype PKCS12

# 出力例で確認すべき項目：
# - Alias name: recipebox-key
# - Creation date: 作成日時
# - Entry type: PrivateKeyEntry
# - Certificate fingerprint: 署名フィンガープリント
```

### Step 3: GitHub Secretsの設定

1. **キーストアファイルをBase64エンコード**
```bash
base64 -i recipebox-release-key.p12 > keystore_base64.txt
cat keystore_base64.txt
```

2. **GitHub リポジトリの設定**
   - GitHub リポジトリページ → Settings → Secrets and variables → Actions
   - 以下のSecretsを新規作成：

**必要なSecrets:**
- `KEYSTORE_FILE`: `keystore_base64.txt` の内容全体をコピー&ペースト
- `KEYSTORE_PASSWORD`: キーストア作成時に設定したパスワード
- `KEY_ALIAS`: `recipebox-key` （キーストア作成時に指定したエイリアス名）

### Step 4: 設定確認

GitHub Secretsが正しく設定されると、次回のPush時に以下が実行されます：

✅ **自動で実行される機能：**
- versionCode自動増分（APK競合回避）
- RecipeBoxカスタムアイコンの適用
- 高度なAPK署名（v1+v2+v3対応）
- APK構造診断・検証
- シームレスなAPK更新対応

✅ **APK更新・上書き問題の解決：**
- 一貫した署名キーによる継続的更新
- Android端末での「パッケージ競合」エラー解決
- PlayStoreスタイルの自動更新体験

## 🚨 重要な注意点

### セキュリティ
- **キーストアファイルのバックアップを安全に保管**
- パスワードを忘れないよう記録
- 本番環境では絶対に紛失しないこと

### 継続性
- **同じキーストアを使い続けること**
- キーを変更すると既存ユーザーは手動でアンインストール→再インストールが必要
- PlayStore公開時も同じキーを使用

### トラブルシューティング
- GitHub Actions失敗時は「Actions」タブでログを確認
- キーストア設定エラーの場合、デバッグビルドにフォールバック
- エイリアス名の不一致でも自動検出機能により復旧

## 📱 期待される結果

設定完了後の初回ビルドで以下を確認：

1. **GitHub Actions成功**
   - 「Build RecipeBox Android App with Advanced Signing」が成功
   - 「RecipeBox-v[番号].apk」ファイルが Releases に登録

2. **カスタムアイコン適用**
   - APK内のアイコンがRecipeBoxのオリジナルアイコンに変更
   - Android端末のアプリ一覧でRecipeBoxアイコンが表示

3. **シームレス更新**
   - 2回目以降のビルドAPKは上書きインストール可能
   - 「パッケージ競合」エラーが発生しない
   - アプリデータが保持される

## 🚀 セットアップ完了後の次のステップ

### キーストア作成後のすぐやること

1. **GitHub Secrets設定確認**
   ```bash
   # 設定されたSecretsを確認（リポジトリ設定ページで）
   - KEYSTORE_FILE ✅
   - KEYSTORE_PASSWORD ✅  
   - KEY_ALIAS ✅
   ```

2. **初回ビルドテスト**
   ```bash
   # リポジトリルートで変更をプッシュ
   git add .
   git commit -m "Enable advanced APK signing system"
   git push
   
   # GitHub Actions結果を確認
   # -> "Build RecipeBox Android App with Advanced Signing" が成功するはず
   ```

3. **APK更新テスト手順**
   ```bash
   # 1回目：初回インストール
   # - GitHub Releasesから app-release.apk をダウンロード
   # - Android端末にインストール
   
   # 2回目：更新テスト
   # - 小さな変更（例：index.html内のテキスト修正）
   # - git push でビルド実行
   # - 新しい app-release.apk をダウンロード
   # - 既存アプリの上からインストール（エラーが出ないことを確認）
   ```

### トラブルシューティング拡張

#### Q1: GitHub Actions で「KEYSTORE_FILE not found」エラー
```bash
# A1: Base64エンコードを再確認
base64 -w 0 recipebox-release-key.p12 > keystore_base64.txt
# 改行なしで全文をGitHub Secretsに貼り付け
```

#### Q2: 「Keystore alias not found」エラー
```bash
# A2: エイリアス名を確認
keytool -list -keystore recipebox-release-key.p12 -storetype PKCS12
# 出力の "Alias name: XXX" をKEY_ALIASに設定
```

#### Q3: APK署名は成功するが、Android端末で「パッケージ解析エラー」
```bash
# A3: APK構造問題 - ワークフローのAAPT診断ログを確認
# GitHub Actions -> Jobs -> "Build Signed APK" -> "🔍 APK Structure Diagnostic"
```

#### Q4: 2回目以降のAPKで「アプリ更新不可」エラー
```bash
# A4: 署名一貫性問題
# - 同じキーストアファイルを使用していることを確認
# - versionCodeが増加していることを確認（GitHub run_number使用）
# - 一度だけ手動アンインストール→再インストールで解決
```

### 📊 成功指標

完全に設定できた場合の確認項目：

#### GitHub Actions成功ログ例
```
✅ APK structure valid
✅ APK signature verification successful  
🎨 Replaced APK icons with custom RecipeBox icon
🔐 Signed APK with alias: recipebox-key
📦 Created Release: RecipeBox v20
```

#### Android端末での確認項目
- [ ] RecipeBoxカスタムアイコンが表示される
- [ ] アプリが正常に起動する  
- [ ] 2回目以降のAPKが上書きインストールできる
- [ ] データが保持される（レシピ、設定等）
- [ ] 「パッケージ競合」エラーが発生しない

設定が完了したらお知らせください。次のステップに進みます。

### 🎯 上級者向け：カスタムアイコン置換

ユーザー提供の画像を使用したい場合：

```bash
# 1. 画像をプロジェクトに追加
cp /path/to/your-icon.png icons/custom-icon.png

# 2. ワークフローを修正して使用
# .github/workflows/android-build.yml の該当部分で
# create_icon.py の代わりに画像ファイルを使用
```