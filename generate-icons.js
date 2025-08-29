// RecipeBox アイコン生成スクリプト
// NovelAI API を使用してアプリアイコンを自動生成

const fs = require('fs');
const path = require('path');

class IconGenerator {
    constructor(apiToken) {
        this.apiToken = apiToken;
        this.baseUrl = 'https://api.novelai.net/ai/generate-image';
    }

    // PWA用アイコンサイズ一覧
    getIconSizes() {
        return [
            { size: 72, name: 'icon-72x72.png' },
            { size: 96, name: 'icon-96x96.png' },
            { size: 128, name: 'icon-128x128.png' },
            { size: 144, name: 'icon-144x144.png' },
            { size: 152, name: 'icon-152x152.png' },
            { size: 192, name: 'icon-192x192.png' },
            { size: 384, name: 'icon-384x384.png' },
            { size: 512, name: 'icon-512x512.png' }
        ];
    }

    // レシピアプリ用のプロンプト生成
    generatePrompt(style = 'modern') {
        const prompts = {
            modern: "minimalist recipe book app icon, flat design, cooking utensils, clean white background, professional mobile app icon style, vector art",
            cute: "kawaii recipe book icon, cute cooking theme, pastel colors, friendly design, mobile app icon",
            classic: "elegant recipe book with chef hat, classic cooking theme, warm colors, professional restaurant style icon"
        };
        return prompts[style] || prompts.modern;
    }

    // NovelAI API リクエスト
    async generateImage(prompt, size = 512) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    input: prompt,
                    model: 'nai-diffusion-3',
                    action: 'generate',
                    parameters: {
                        width: size,
                        height: size,
                        scale: 5,
                        sampler: 'k_euler_ancestral',
                        steps: 20,
                        n_samples: 1,
                        ucPreset: 0,
                        qualityToggle: true
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`NovelAI API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.arrayBuffer();
            return Buffer.from(data);
        } catch (error) {
            console.error('Image generation failed:', error);
            throw error;
        }
    }

    // 画像のリサイズ (Sharp使用)
    async resizeImage(imageBuffer, targetSize) {
        try {
            const sharp = require('sharp');
            return await sharp(imageBuffer)
                .resize(targetSize, targetSize, { fit: 'cover' })
                .png()
                .toBuffer();
        } catch (error) {
            console.error('Image resize failed:', error);
            throw error;
        }
    }

    // アイコンセット生成
    async generateIconSet(style = 'modern') {
        const iconsDir = path.join(__dirname, 'icons');
        
        // iconsディレクトリ作成
        if (!fs.existsSync(iconsDir)) {
            fs.mkdirSync(iconsDir, { recursive: true });
        }

        console.log('🎨 RecipeBox アイコン生成開始...');
        console.log(`スタイル: ${style}`);

        try {
            // 512x512 のベース画像を生成
            const prompt = this.generatePrompt(style);
            console.log(`プロンプト: ${prompt}`);
            
            const baseImage = await this.generateImage(prompt, 512);
            console.log('✅ ベース画像生成完了');

            // 各サイズにリサイズして保存
            const sizes = this.getIconSizes();
            for (const { size, name } of sizes) {
                const resizedImage = await this.resizeImage(baseImage, size);
                const filePath = path.join(iconsDir, name);
                
                fs.writeFileSync(filePath, resizedImage);
                console.log(`✅ ${name} (${size}x${size}) 生成完了`);
            }

            console.log('🎉 全てのアイコン生成完了！');
            console.log(`保存先: ${iconsDir}`);

        } catch (error) {
            console.error('❌ アイコン生成失敗:', error.message);
            
            // フォールバック: シンプルなSVGアイコンを生成
            console.log('🔄 フォールバックアイコンを生成中...');
            await this.generateFallbackIcons();
        }
    }

    // フォールバック用のSVGアイコン生成
    async generateFallbackIcons() {
        const iconsDir = path.join(__dirname, 'icons');
        
        const svgTemplate = `
<svg width="{size}" height="{size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100%" height="100%" rx="{radius}" fill="url(#grad)"/>
    <text x="50%" y="50%" text-anchor="middle" dy=".35em" 
          font-family="Arial, sans-serif" font-size="{fontSize}" 
          font-weight="bold" fill="white">R</text>
</svg>`;

        const sizes = this.getIconSizes();
        
        for (const { size, name } of sizes) {
            const radius = Math.round(size * 0.2); // 20% 角丸
            const fontSize = Math.round(size * 0.4); // 40% フォントサイズ
            
            const svg = svgTemplate
                .replace(/{size}/g, size)
                .replace(/{radius}/g, radius)
                .replace(/{fontSize}/g, fontSize);
            
            const svgPath = path.join(iconsDir, name.replace('.png', '.svg'));
            fs.writeFileSync(svgPath, svg.trim());
            console.log(`✅ フォールバック ${name.replace('.png', '.svg')} 生成完了`);
        }
    }

    // 使用方法をコンソールに表示
    static showUsage() {
        console.log(`
📱 RecipeBox アイコン生成ツール

使用方法:
1. NovelAI APIトークンを取得: https://novelai.net/
2. 以下のコマンドを実行:

node generate-icons.js [style] [token]

スタイルオプション:
- modern: モダンでミニマルなデザイン (デフォルト)
- cute: かわいいアニメ風デザイン  
- classic: クラシックで上品なデザイン

例:
node generate-icons.js modern your_api_token_here
node generate-icons.js cute your_api_token_here

APIトークンがない場合、フォールバック用SVGアイコンを生成します。
        `);
    }
}

// コマンドライン実行
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        IconGenerator.showUsage();
        return;
    }

    const style = args[0] || 'modern';
    const apiToken = args[1] || process.env.NOVELAI_API_TOKEN;

    if (!apiToken) {
        console.log('⚠️  NovelAI APIトークンが指定されていません。');
        console.log('フォールバック用SVGアイコンを生成します...\n');
        
        const generator = new IconGenerator();
        await generator.generateFallbackIcons();
        return;
    }

    const generator = new IconGenerator(apiToken);
    await generator.generateIconSet(style);
}

// スクリプトが直接実行された場合
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { IconGenerator };