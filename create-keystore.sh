#!/bin/bash
# RecipeBox用署名キーストア作成スクリプト

echo "🔑 RecipeBox 署名キーストア作成"

# Dockerでキーストア作成（オンライン環境で実行）
cat << 'DOCKER_COMMAND' > create-keystore-docker.sh
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
DOCKER_COMMAND

# 実行可能にする
chmod +x create-keystore-docker.sh

echo "✅ キーストア作成スクリプト準備完了"
echo ""
echo "📋 次の手順："
echo "1. Docker環境でスクリプト実行: ./create-keystore-docker.sh"
echo "2. キーストアをBase64エンコード: base64 -w 0 recipebox-release.jks > keystore.b64"
echo "3. GitHub Secretsに設定:"
echo "   - KEYSTORE_FILE: keystore.b64の内容"
echo "   - KEYSTORE_PASSWORD: recipeboxsecure123"
echo "   - KEY_ALIAS: recipebox-key"
echo "   - KEY_PASSWORD: recipeboxsecure123"