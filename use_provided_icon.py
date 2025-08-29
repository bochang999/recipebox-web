#!/usr/bin/env python3
"""
提供されたレシピアイコンを各Android密度用にリサイズ（縮小のみ）
- 新規生成は行わず、提供画像をそのまま使用
- 高品質なLanczos filterでリサイズ
"""

import os
from PIL import Image

def resize_icon_from_source(source_path, target_size):
    """提供されたアイコンを指定サイズに縮小（新規生成は行わない）"""
    
    # 元画像を開く
    with Image.open(source_path) as img:
        # 高品質リサイズ（Lanczos filter使用）
        resized = img.resize((target_size, target_size), Image.LANCZOS)
        # PNGで透明度を保持
        if resized.mode != 'RGBA':
            resized = resized.convert('RGBA')
        return resized

def resize_all_icons_from_source():
    """提供された画像を全Android密度用にリサイズ（縮小のみ）"""
    
    # 提供されたアイコンファイルのパス
    # ローカル環境とCI環境両対応
    local_icon = '/storage/emulated/0/Pictures/recipe.png'
    repo_icon = './recipe-icon.png'
    
    if os.path.exists(local_icon):
        source_icon = local_icon
        print(f"📱 Using local icon: {local_icon}")
    elif os.path.exists(repo_icon):
        source_icon = repo_icon
        print(f"🔧 Using repository icon: {repo_icon}")
    else:
        print("❌ No source icon found in either location")
        exit(1)
    
    # 各Android密度のサイズ設定
    sizes = [
        ('mipmap-mdpi', 48),
        ('mipmap-hdpi', 72),
        ('mipmap-xhdpi', 96),
        ('mipmap-xxhdpi', 144),
        ('mipmap-xxxhdpi', 192)
    ]
    
    base_path = 'android/app/src/main/res'
    
    try:
        for folder, size in sizes:
            print(f"Generating {size}x{size} icon for {folder}...")
            
            # 提供された画像をリサイズ
            icon = resize_icon_from_source(source_icon, size)
            
            folder_path = os.path.join(base_path, folder)
            os.makedirs(folder_path, exist_ok=True)
            
            # 各種アイコンファイルを保存
            icon.save(os.path.join(folder_path, 'ic_launcher.png'))
            icon.save(os.path.join(folder_path, 'ic_launcher_round.png'))
            icon.save(os.path.join(folder_path, 'ic_launcher_foreground.png'))
            
            print(f"✅ {folder} icons saved ({size}x{size})")
        
        print("🎨 All RecipeBox icons resized from provided image!")
        
    except FileNotFoundError:
        print(f"❌ Source icon file not found at: {source_icon}")
        print("❌ Cannot proceed without source icon - no fallback generation")
        print("Please ensure the recipe.png file exists in /storage/emulated/0/Pictures/")
        exit(1)
    except Exception as e:
        print(f"❌ Error processing source icon: {e}")
        print("❌ Cannot proceed without source icon - no fallback generation")
        exit(1)

# フォールバック生成機能を削除
# 提供されたアイコンのリサイズのみに特化

if __name__ == "__main__":
    resize_all_icons_from_source()