#!/usr/bin/env python3
"""
提供されたレシピアイコンを使用してAndroid用の各サイズを生成
"""

import os
from PIL import Image

def resize_icon_from_source(source_path, target_size):
    """提供されたアイコンを指定サイズにリサイズ"""
    
    # 元画像を開く
    with Image.open(source_path) as img:
        # 高品質リサイズ（Lanczos filter使用）
        resized = img.resize((target_size, target_size), Image.LANCZOS)
        # PNGで透明度を保持
        if resized.mode != 'RGBA':
            resized = resized.convert('RGBA')
        return resized

def generate_all_icons_from_source():
    """提供された画像から全サイズのアイコンを生成"""
    
    # 提供されたアイコンファイルのパス
    source_icon = '/storage/emulated/0/Pictures/recipe.png'
    
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
        
        print("🎨 All RecipeBox icons generated from provided image!")
        
    except FileNotFoundError:
        print(f"❌ Source icon file not found at: {source_icon}")
        print("🔄 Using fallback generation...")
        # フォールバック: 元の生成コードを使用
        generate_fallback_icons()
    except Exception as e:
        print(f"❌ Error processing source icon: {e}")
        print("🔄 Using fallback generation...")
        generate_fallback_icons()

def generate_fallback_icons():
    """ソースファイルがない場合のフォールバック"""
    import math
    from PIL import ImageDraw
    
    sizes = [
        ('mipmap-mdpi', 48),
        ('mipmap-hdpi', 72),
        ('mipmap-xhdpi', 96),
        ('mipmap-xxhdpi', 144),
        ('mipmap-xxxhdpi', 192)
    ]
    
    base_path = 'android/app/src/main/res'
    
    for folder, size in sizes:
        print(f"Generating fallback {size}x{size} icon for {folder}...")
        
        # 簡単なフォールバックアイコンを生成
        scale = 4
        canvas_size = size * scale
        img = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # 基本的なレシピブック風デザイン
        book_bg = (218, 165, 108)
        page_bg = (252, 246, 235)
        
        margin = canvas_size // 12
        draw.rounded_rectangle(
            [margin, margin, canvas_size - margin, canvas_size - margin],
            radius=canvas_size // 8,
            fill=book_bg
        )
        
        page_margin = canvas_size // 6
        draw.rounded_rectangle(
            [page_margin, page_margin, canvas_size - page_margin//2, canvas_size - page_margin],
            radius=canvas_size // 24,
            fill=page_bg
        )
        
        # 高解像度から目標サイズにリサイズ
        img = img.resize((size, size), Image.LANCZOS)
        
        folder_path = os.path.join(base_path, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        img.save(os.path.join(folder_path, 'ic_launcher.png'))
        img.save(os.path.join(folder_path, 'ic_launcher_round.png'))
        img.save(os.path.join(folder_path, 'ic_launcher_foreground.png'))
        
        print(f"✅ {folder} fallback icons saved")

if __name__ == "__main__":
    generate_all_icons_from_source()