#!/usr/bin/env python3
"""
RecipeBox アプリ用カスタムアイコン作成スクリプト
料理をテーマとしたシンプルで認識しやすいアイコンを生成
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("PIL (Pillow) が必要です。インストール中...")
    import subprocess
    subprocess.run(["pip", "install", "pillow"], check=True)
    from PIL import Image, ImageDraw, ImageFont

def create_recipe_icon(size=512):
    """RecipeBox用アイコンを作成"""
    
    # 背景色：温かみのあるオレンジ
    bg_color = "#FF6B35"  # 鮮やかなオレンジ
    
    # アイコン作成
    img = Image.new('RGBA', (size, size), bg_color)
    draw = ImageDraw.Draw(img)
    
    # マージン設定
    margin = size * 0.15
    inner_size = size - (margin * 2)
    
    # 料理本（レシピブック）のデザイン
    book_width = inner_size * 0.7
    book_height = inner_size * 0.8
    book_x = (size - book_width) // 2
    book_y = (size - book_height) // 2
    
    # 本の背景（白）
    draw.rounded_rectangle(
        [book_x, book_y, book_x + book_width, book_y + book_height],
        radius=size * 0.05,
        fill="white",
        outline="#333333",
        width=max(1, size // 128)
    )
    
    # 本の線（ページの表現）
    line_margin = book_width * 0.15
    line_spacing = book_height * 0.12
    line_width = max(1, size // 64)
    
    for i in range(5):
        y_pos = book_y + book_height * 0.25 + (i * line_spacing)
        if y_pos < book_y + book_height - book_height * 0.1:
            draw.rectangle(
                [book_x + line_margin, y_pos, 
                 book_x + book_width - line_margin, y_pos + line_width],
                fill="#666666"
            )
    
    # シェフハット（料理帽）のシルエット
    hat_size = inner_size * 0.3
    hat_x = book_x + book_width - hat_size * 0.6
    hat_y = book_y - hat_size * 0.4
    
    # ハットの本体（白）
    draw.ellipse(
        [hat_x, hat_y + hat_size * 0.6, 
         hat_x + hat_size, hat_y + hat_size],
        fill="white",
        outline="#333333",
        width=max(1, size // 128)
    )
    
    # ハットの上部（白）
    draw.ellipse(
        [hat_x + hat_size * 0.2, hat_y, 
         hat_x + hat_size * 0.8, hat_y + hat_size * 0.7],
        fill="white",
        outline="#333333",
        width=max(1, size // 128)
    )
    
    # スプーンとフォークのシルエット（シンプル）
    utensil_color = "#333333"
    utensil_width = max(2, size // 64)
    
    # フォーク
    fork_x = book_x - inner_size * 0.15
    fork_y = book_y + book_height * 0.3
    fork_length = inner_size * 0.4
    
    # フォークのハンドル
    draw.rectangle(
        [fork_x, fork_y, fork_x + utensil_width, fork_y + fork_length],
        fill=utensil_color
    )
    
    # フォークの歯
    for i in range(3):
        tooth_x = fork_x - utensil_width + (i * utensil_width)
        draw.rectangle(
            [tooth_x, fork_y - utensil_width * 3, 
             tooth_x + utensil_width, fork_y + utensil_width],
            fill=utensil_color
        )
    
    # スプーン
    spoon_x = book_x + book_width + inner_size * 0.08
    spoon_y = book_y + book_height * 0.3
    
    # スプーンのハンドル
    draw.rectangle(
        [spoon_x, spoon_y, spoon_x + utensil_width, spoon_y + fork_length],
        fill=utensil_color
    )
    
    # スプーンのボウル
    bowl_size = utensil_width * 4
    draw.ellipse(
        [spoon_x - bowl_size//2 + utensil_width//2, spoon_y - bowl_size,
         spoon_x + bowl_size//2 + utensil_width//2, spoon_y + utensil_width],
        fill=utensil_color
    )
    
    return img

def main():
    """メイン処理：複数サイズのアイコンを生成"""
    
    print("RecipeBox カスタムアイコンを作成中...")
    
    # 基本アイコン作成（512px）
    icon_512 = create_recipe_icon(512)
    
    # 複数サイズで保存
    sizes = [512, 192, 152, 144, 128, 96, 72, 48, 36]
    
    for size in sizes:
        if size == 512:
            resized_icon = icon_512
        else:
            resized_icon = icon_512.resize((size, size), Image.Resampling.LANCZOS)
        
        filename = f"recipebox_icon_{size}.png"
        resized_icon.save(filename, "PNG")
        print(f"✅ {filename} 作成完了")
    
    print("\n🎯 RecipeBox アイコン作成完了！")
    print("主要ファイル:")
    print("- recipebox_icon_512.png (高解像度版)")
    print("- recipebox_icon_192.png (PWA用)")
    print("- recipebox_icon_152.png (iOS用)")
    print("- recipebox_icon_144.png (Android用)")

if __name__ == "__main__":
    main()