# 手動キーストア作成手順

## オプション1: オンラインツールを使用（推奨）

1. **キーストア生成サイト**にアクセス:
   - https://keystore-generator.com/
   - または他のJavaキーストア生成ツール

2. **設定値を入力**:
   ```
   Algorithm: RSA
   Key Size: 2048 bits
   Validity Period: 10000 days
   Key Alias: recipebox-key
   Store Password: recipeboxsecure123
   Key Password: recipeboxsecure123
   
   Distinguished Name:
   - CN (Common Name): RecipeBox
   - OU (Organizational Unit): App Development
   - O (Organization): Bochang
   - L (Locality): Tokyo
   - ST (State): Tokyo
   - C (Country): JP
   ```

3. **キーストアファイル生成・ダウンロード**

4. **Base64エンコード**:
   - オンラインBase64エンコーダを使用
   - または `base64 -w 0 recipebox-release.jks` コマンド

## オプション2: GitHub Secretsに直接設定

生成されたBase64文字列を以下のGitHub Secretsに設定:

**リポジトリURL**: https://github.com/bochang999/recipebox-web/settings/secrets/actions

**設定するSecrets**:
```
KEYSTORE_FILE = [Base64エンコードされたキーストアファイル全体]
KEYSTORE_PASSWORD = recipeboxsecure123
KEY_ALIAS = recipebox-key
KEY_PASSWORD = recipeboxsecure123
```

## 確認手順

1. Secrets設定完了後にリポジトリに何かをプッシュ
2. GitHub Actionsが署名済みAPKを生成
3. Releaseページでapp-release.apkが配布される