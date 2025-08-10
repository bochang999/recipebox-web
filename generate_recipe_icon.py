#!/usr/bin/env python3
"""
RecipeBox アイコン生成スクリプト
レシピブック風のデザインでスパゲッティが描かれた美しいアイコンを生成
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont

def create_recipe_icon(size):
    """レシピブック風アイコンを生成"""
    
    # 高解像度で作成して後でリサイズ（アンチエイリアス効果）
    scale = 4
    canvas_size = size * scale
    img = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 色定義（提供された画像から抽出）
    book_bg = (218, 165, 108)      # レシピブックの背景色
    page_bg = (252, 246, 235)      # ページの色
    pasta_orange = (255, 165, 0)   # パスタの色
    tomato_red = (220, 50, 50)     # トマトの色
    basil_green = (60, 179, 113)   # バジルの色
    text_brown = (101, 67, 33)     # テキストの色
    
    # アイコン全体の角丸四角形
    margin = canvas_size // 12
    draw.rounded_rectangle(
        [margin, margin, canvas_size - margin, canvas_size - margin],
        radius=canvas_size // 8,
        fill=book_bg
    )
    
    # レシピブックページ（左側）
    page_left = canvas_size // 6
    page_top = canvas_size // 5
    page_right = canvas_size - canvas_size // 8
    page_bottom = canvas_size - canvas_size // 8
    
    draw.rounded_rectangle(
        [page_left, page_top, page_right, page_bottom],
        radius=canvas_size // 24,
        fill=page_bg
    )
    
    # "Recipes" テキスト
    text_y = page_top + canvas_size // 12
    try:
        # フォントサイズを調整
        font_size = canvas_size // 8
        font = ImageFont.load_default()
    except:
        font_size = canvas_size // 10
        font = None
    
    text_x = page_left + canvas_size // 12
    draw.text((text_x, text_y), "Recipes", fill=text_brown, font=font)
    
    # レシピの行（装飾）
    line_start_y = text_y + canvas_size // 6
    line_x_start = text_x
    line_x_end = page_right - canvas_size // 12
    line_spacing = canvas_size // 20
    
    for i in range(4):
        y_pos = line_start_y + i * line_spacing
        draw.rectangle([line_x_start, y_pos, line_x_end - i * canvas_size // 30, y_pos + 2], 
                      fill=(200, 190, 170))
    
    # お皿（円形）
    plate_center_x = page_right - canvas_size // 4
    plate_center_y = page_bottom - canvas_size // 4
    plate_radius = canvas_size // 8
    
    draw.ellipse([
        plate_center_x - plate_radius, 
        plate_center_y - plate_radius,
        plate_center_x + plate_radius, 
        plate_center_y + plate_radius
    ], fill=(240, 240, 240), outline=(200, 200, 200), width=3)
    
    # スパゲッティ（曲線で表現）
    pasta_lines = 8
    for i in range(pasta_lines):
        angle = (i / pasta_lines) * 2 * math.pi
        start_radius = plate_radius * 0.3
        end_radius = plate_radius * 0.7
        
        start_x = plate_center_x + start_radius * math.cos(angle)
        start_y = plate_center_y + start_radius * math.sin(angle)
        end_x = plate_center_x + end_radius * math.cos(angle + 0.5)
        end_y = plate_center_y + end_radius * math.sin(angle + 0.5)
        
        draw.line([(start_x, start_y), (end_x, end_y)], 
                 fill=pasta_orange, width=max(1, canvas_size // 200))
    
    # トマトスライス（円形）
    tomato_positions = [
        (plate_center_x - plate_radius // 3, plate_center_y - plate_radius // 4),
        (plate_center_x + plate_radius // 4, plate_center_y - plate_radius // 3),
        (plate_center_x, plate_center_y + plate_radius // 4)
    ]
    
    for tx, ty in tomato_positions:
        tomato_radius = canvas_size // 30
        draw.ellipse([tx - tomato_radius, ty - tomato_radius, 
                     tx + tomato_radius, ty + tomato_radius], 
                    fill=tomato_red)
        # トマトの種
        seed_radius = tomato_radius // 4
        for angle in [0, math.pi/2, math.pi, 3*math.pi/2]:
            sx = tx + seed_radius * math.cos(angle)
            sy = ty + seed_radius * math.sin(angle)
            draw.ellipse([sx-1, sy-1, sx+1, sy+1], fill=(255, 255, 200))
    
    # バジルの葉
    basil_x = plate_center_x + plate_radius // 6
    basil_y = plate_center_y - plate_radius // 6
    leaf_size = canvas_size // 40
    
    # 簡単な楕円でバジルの葉を表現
    draw.ellipse([basil_x - leaf_size, basil_y - leaf_size//2,
                 basil_x + leaf_size, basil_y + leaf_size//2], 
                fill=basil_green)
    
    # 蒸気の表現（曲線）
    steam_x = plate_center_x - plate_radius // 2
    steam_y = plate_center_y - plate_radius
    steam_height = canvas_size // 10
    
    for i in range(3):
        x_offset = i * canvas_size // 40
        points = []
        for y in range(0, steam_height, canvas_size // 80):
            wave = math.sin((y + i * 20) * 0.1) * (canvas_size // 60)
            points.append((steam_x + x_offset + wave, steam_y - y))
        
        if len(points) > 1:
            for j in range(len(points) - 1):
                draw.line([points[j], points[j + 1]], fill=(220, 220, 220, 128), width=2)
    
    # 高解像度から目標サイズにリサイズ
    img = img.resize((size, size), Image.LANCZOS)
    return img

def generate_all_icons():
    """全てのサイズのアイコンを生成"""
    
    sizes = [
        ('mipmap-mdpi', 48),
        ('mipmap-hdpi', 72),
        ('mipmap-xhdpi', 96),
        ('mipmap-xxhdpi', 144),
        ('mipmap-xxxhdpi', 192)
    ]
    
    base_path = 'android/app/src/main/res'
    
    for folder, size in sizes:
        print(f"Generating {size}x{size} icon for {folder}...")
        
        icon = create_recipe_icon(size)
        folder_path = os.path.join(base_path, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        # 通常のアイコンと丸型アイコン両方を保存
        icon.save(os.path.join(folder_path, 'ic_launcher.png'))
        icon.save(os.path.join(folder_path, 'ic_launcher_round.png'))
        icon.save(os.path.join(folder_path, 'ic_launcher_foreground.png'))
        
        print(f"✅ {folder} icons saved")
    
    print("🎨 All RecipeBox icons generated successfully!")

if __name__ == "__main__":
    generate_all_icons()