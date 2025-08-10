// レシピアプリ専用のSVGアイコンを生成
const fs = require('fs');
const path = require('path');

class RecipeIconGenerator {
    generateSvgIcon(size, style = 'modern') {
        const radius = Math.round(size * 0.2);
        const iconSize = Math.round(size * 0.5);
        const strokeWidth = Math.round(size * 0.08);
        
        const styles = {
            modern: {
                bgGradient: {
                    start: '#667eea',
                    end: '#764ba2'
                },
                iconColor: '#ffffff',
                design: this.getModernRecipeIcon(iconSize, strokeWidth)
            },
            warm: {
                bgGradient: {
                    start: '#ff9a56',
                    end: '#ff6b9d'
                },
                iconColor: '#ffffff',
                design: this.getWarmRecipeIcon(iconSize, strokeWidth)
            },
            minimal: {
                bgGradient: {
                    start: '#f8f9fa',
                    end: '#e9ecef'
                },
                iconColor: '#495057',
                design: this.getMinimalRecipeIcon(iconSize, strokeWidth)
            }
        };

        const currentStyle = styles[style] || styles.modern;
        
        return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="bgGrad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${currentStyle.bgGradient.start};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${currentStyle.bgGradient.end};stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100%" height="100%" rx="${radius}" fill="url(#bgGrad${size})"/>
    <g transform="translate(${size/2}, ${size/2})" fill="${currentStyle.iconColor}">
        ${currentStyle.design}
    </g>
</svg>`;
    }

    getModernRecipeIcon(size, strokeWidth) {
        const bookWidth = size * 0.6;
        const bookHeight = size * 0.7;
        const x = -bookWidth / 2;
        const y = -bookHeight / 2;
        
        return `
        <!-- レシピブック -->
        <rect x="${x}" y="${y}" width="${bookWidth}" height="${bookHeight}" rx="2" stroke="none" fill="currentColor"/>
        <rect x="${x + 4}" y="${y + 4}" width="${bookWidth - 8}" height="${bookHeight - 8}" rx="1" fill="rgba(0,0,0,0.1)"/>
        
        <!-- ページライン -->
        <line x1="${x + 8}" y1="${y + bookHeight * 0.3}" x2="${x + bookWidth - 8}" y2="${y + bookHeight * 0.3}" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
        <line x1="${x + 8}" y1="${y + bookHeight * 0.5}" x2="${x + bookWidth - 8}" y2="${y + bookHeight * 0.5}" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
        <line x1="${x + 8}" y1="${y + bookHeight * 0.7}" x2="${x + bookWidth - 8}" y2="${y + bookHeight * 0.7}" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
        
        <!-- シェフハット -->
        <ellipse cx="${bookWidth * 0.2}" cy="${y - 8}" rx="12" ry="6" fill="currentColor"/>
        <rect x="${bookWidth * 0.2 - 12}" y="${y - 14}" width="24" height="8" rx="12" fill="currentColor"/>
        `;
    }

    getWarmRecipeIcon(size, strokeWidth) {
        const centerX = 0;
        const centerY = 0;
        
        return `
        <!-- クッキングポット -->
        <ellipse cx="${centerX}" cy="${centerY + 8}" rx="18" ry="16" fill="currentColor"/>
        <rect x="${centerX - 18}" y="${centerY - 8}" width="36" height="16" fill="currentColor"/>
        <ellipse cx="${centerX}" cy="${centerY - 8}" rx="18" ry="6" fill="rgba(0,0,0,0.2)"/>
        
        <!-- ハンドル -->
        <ellipse cx="${centerX - 22}" cy="${centerX}" rx="3" ry="8" fill="none" stroke="currentColor" stroke-width="2"/>
        <ellipse cx="${centerX + 22}" cy="${centerX}" rx="3" ry="8" fill="none" stroke="currentColor" stroke-width="2"/>
        
        <!-- 蒸気 -->
        <path d="M -8 -20 Q -8 -25 -4 -25 Q -4 -30 0 -30 Q 0 -25 4 -25 Q 4 -20 8 -20" stroke="currentColor" stroke-width="2" fill="none" opacity="0.7"/>
        `;
    }

    getMinimalRecipeIcon(size, strokeWidth) {
        return `
        <!-- シンプルなRアイコン -->
        <text x="0" y="0" text-anchor="middle" dy=".35em" 
              font-family="Arial, sans-serif" font-size="${size * 0.8}" 
              font-weight="bold" fill="currentColor">R</text>
        `;
    }

    async generateIconSet(style = 'modern') {
        const iconsDir = path.join(__dirname, 'icons');
        
        if (!fs.existsSync(iconsDir)) {
            fs.mkdirSync(iconsDir, { recursive: true });
        }

        const sizes = [
            { size: 72, name: 'icon-72x72.svg' },
            { size: 96, name: 'icon-96x96.svg' },
            { size: 128, name: 'icon-128x128.svg' },
            { size: 144, name: 'icon-144x144.svg' },
            { size: 152, name: 'icon-152x152.svg' },
            { size: 192, name: 'icon-192x192.svg' },
            { size: 384, name: 'icon-384x384.svg' },
            { size: 512, name: 'icon-512x512.svg' }
        ];

        console.log(`🎨 RecipeBox専用アイコン生成開始 (${style}スタイル)...`);

        for (const { size, name } of sizes) {
            const svg = this.generateSvgIcon(size, style);
            const filePath = path.join(iconsDir, name);
            
            fs.writeFileSync(filePath, svg.trim());
            console.log(`✅ ${name} (${size}x${size}) 生成完了`);
        }

        console.log('🎉 料理アプリ専用アイコンセット完成！');
    }

    static showStyles() {
        console.log(`
🎨 RecipeBox アイコンスタイル

利用可能なスタイル:
- modern: モダンなレシピブック + シェフハット (デフォルト)
- warm: 温かみのあるクッキングポット + 蒸気
- minimal: シンプルなRロゴ

使用例:
node create-recipe-icon.js modern
node create-recipe-icon.js warm
node create-recipe-icon.js minimal
        `);
    }
}

// コマンドライン実行
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        RecipeIconGenerator.showStyles();
        return;
    }

    const style = args[0] || 'modern';
    const generator = new RecipeIconGenerator();
    await generator.generateIconSet(style);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { RecipeIconGenerator };