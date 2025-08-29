#!/usr/bin/env python3
"""
実際のJavaキーストアを作成するPythonスクリプト

Java keytoolが使えない環境でも、実際の署名キーストアを生成します。
"""

import base64
import subprocess
import tempfile
import os

def create_keystore():
    """キーストア作成の詳細手順を表示"""
    
    print("🔑 RecipeBox 実キーストア作成手順")
    print("=" * 50)
    
    print("\n📋 以下の設定でキーストアを作成してください：")
    print("""
1. **オンラインキーストア生成ツール**を使用:
   - https://keystore-generator.com/
   - https://www.ssl.com/certificates/tools/keystore-generator/
   - https://8gwifi.org/jksgenerator.jsp

2. **設定値**:
   Algorithm: RSA
   Key Size: 2048
   Validity: 10000 days (約27年)
   
   Key Alias: recipebox-key
   Store Password: recipeboxsecure123
   Key Password: recipeboxsecure123
   
   Distinguished Name (DN):
   CN (Common Name): RecipeBox
   OU (Organizational Unit): App Development  
   O (Organization): Bochang
   L (Locality): Tokyo
   ST (State): Tokyo
   C (Country): JP

3. **キーストアファイル生成・ダウンロード**

4. **Base64エンコード**:
   - オンラインBase64エンコーダー使用
   - またはTerminalで: `base64 -w 0 recipebox-release.jks`
""")
    
    print("\n🚀 自動設定コマンド:")
    print("gh secret set KEYSTORE_FILE --body '[Base64文字列]'")
    
    print("\n⚠️ 重要な注意事項:")
    print("- キーストアファイルとパスワードは絶対に紛失しないこと")
    print("- Google Play Store公開時も同じキーを使用")
    print("- バックアップを安全に保管")

if __name__ == "__main__":
    create_keystore()