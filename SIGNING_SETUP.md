# 🔑 RecipeBox 署名キー設定手順書

毎回アンインストールが必要な問題を解決するための設定です。

## 📋 必要な手順

### 1. 署名キーストアの作成

#### 方法A: Docker環境で作成 (推奨)
```bash
# キーストア作成
docker run --rm -v $(pwd):/workspace -w /workspace openjdk:21-jdk \
  keytool -genkey -v \
  -keystore recipebox-release.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias recipebox-key \
  -dname "CN=RecipeBox, OU=App Development, O=Bochang, L=Tokyo, S=Tokyo, C=JP" \
  -storepass recipeboxsecure123 \
  -keypass recipeboxsecure123

# Base64エンコード
base64 -w 0 recipebox-release.jks > keystore.b64
```

#### 方法B: オンラインツールで作成
1. https://keystore-generator.com/ などを利用
2. 以下の設定で作成:
   - Algorithm: RSA
   - Key Size: 2048
   - Validity: 10000 days
   - Alias: recipebox-key
   - Password: recipeboxsecure123

### 2. GitHub Secrets設定

リポジトリの **Settings > Secrets and variables > Actions** で以下を設定:

```
KEYSTORE_FILE      = [keystore.b64の内容全体]
KEYSTORE_PASSWORD  = recipeboxsecure123
KEY_ALIAS          = recipebox-key
KEY_PASSWORD       = recipeboxsecure123
```

### 3. 設定後の確認

1. 修正をpush
2. GitHub Actionsで自動ビルド実行
3. Release APKが生成されることを確認
4. 署名済みAPKをダウンロードして動作確認

## ✅ 効果

- ✅ **毎回の上書きインストール対応**
- ✅ **アンインストール不要**
- ✅ **継続的な更新配信**
- ✅ **Google Play Store対応準備完了**

## 🔧 トラブルシューティング

### Q: ビルドが失敗する
A: GitHub Secretsが正しく設定されているか確認

### Q: 署名エラーが出る
A: パスワードとエイリアス名を再確認

### Q: 依然として競合エラーが出る
A: 一度だけ手動アンインストール→新しい署名APKをインストール

## 📱 使用方法

設定完了後は:
1. リリースページから `app-release.apk` をダウンロード
2. 初回のみ既存アプリをアンインストール
3. 署名済みAPKをインストール
4. **以降は上書きインストールが可能**

---

## 🔒 重要な注意事項

**キーストアファイルとパスワードは極めて重要です:**
- ❌ 紛失すると永久に回復不可能
- ❌ 変更すると全ユーザーが再インストール必要
- ✅ 安全にバックアップを保管
- ✅ Google Play Store公開時も同じキーを使用