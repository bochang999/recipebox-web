// SVGアイコンをPNGに変換するスクリプト
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convertSvgToPng() {
    const iconsDir = path.join(__dirname, 'icons');
    
    if (!fs.existsSync(iconsDir)) {
        console.error('iconsディレクトリが見つかりません');
        return;
    }

    const svgFiles = fs.readdirSync(iconsDir).filter(file => file.endsWith('.svg'));
    
    console.log('🔄 SVG → PNG 変換開始...');
    
    for (const svgFile of svgFiles) {
        const svgPath = path.join(iconsDir, svgFile);
        const pngFile = svgFile.replace('.svg', '.png');
        const pngPath = path.join(iconsDir, pngFile);
        
        try {
            await sharp(svgPath)
                .png()
                .toFile(pngPath);
            
            console.log(`✅ ${svgFile} → ${pngFile}`);
        } catch (error) {
            console.error(`❌ ${svgFile} 変換失敗:`, error.message);
        }
    }
    
    console.log('🎉 PNG変換完了！');
}

convertSvgToPng().catch(console.error);