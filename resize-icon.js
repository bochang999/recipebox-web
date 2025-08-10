// 1024x1024のアイコンを全サイズに変換するスクリプト
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execAsync = util.promisify(exec);

class IconResizer {
    constructor() {
        this.sourceImage = 'recipe-icon-1024.png';
        this.iconsDir = path.join(__dirname, 'icons');
        this.sizes = [
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

    async checkImageMagick() {
        try {
            await execAsync('convert -version');
            return 'convert';
        } catch {
            try {
                await execAsync('magick -version');
                return 'magick';
            } catch {
                console.log('⚠️  ImageMagickが見つかりません。インストール中...');
                try {
                    await execAsync('pkg install imagemagick');
                    return 'convert';
                } catch (error) {
                    throw new Error('ImageMagickのインストールに失敗しました: ' + error.message);
                }
            }
        }
    }

    async resizeImage(command, inputPath, outputPath, size) {
        const resizeCmd = `${command} "${inputPath}" -resize ${size}x${size} "${outputPath}"`;
        await execAsync(resizeCmd);
    }

    async generateAllSizes() {
        // iconsディレクトリ作成
        if (!fs.existsSync(this.iconsDir)) {
            fs.mkdirSync(this.iconsDir, { recursive: true });
        }

        // ソース画像の存在確認
        if (!fs.existsSync(this.sourceImage)) {
            throw new Error(`ソース画像が見つかりません: ${this.sourceImage}`);
        }

        console.log('🎨 NovelAI生成アイコンのリサイズ開始...');
        console.log(`ソース: ${this.sourceImage} (1024x1024)`);

        try {
            // ImageMagickの確認
            const command = await this.checkImageMagick();
            console.log(`✅ ImageMagick準備完了 (${command})`);

            // 各サイズにリサイズ
            for (const { size, name } of this.sizes) {
                const outputPath = path.join(this.iconsDir, name);
                await this.resizeImage(command, this.sourceImage, outputPath, size);
                console.log(`✅ ${name} (${size}x${size}) 生成完了`);
            }

            console.log('🎉 全サイズ変換完了！');
            console.log(`保存先: ${this.iconsDir}`);

        } catch (error) {
            console.error('❌ リサイズ処理エラー:', error.message);
            console.log('🔄 フォールバック処理...');
            await this.fallbackResize();
        }
    }

    async fallbackResize() {
        console.log('⚠️  代替手段でリサイズを試みます...');
        
        // Node.jsのcanvasライブラリを使用した代替手段
        try {
            const { createCanvas, loadImage } = require('canvas');
            
            const sourceImg = await loadImage(this.sourceImage);
            
            for (const { size, name } of this.sizes) {
                const canvas = createCanvas(size, size);
                const ctx = canvas.getContext('2d');
                
                ctx.drawImage(sourceImg, 0, 0, size, size);
                
                const outputPath = path.join(this.iconsDir, name);
                const buffer = canvas.toBuffer('image/png');
                fs.writeFileSync(outputPath, buffer);
                
                console.log(`✅ ${name} (${size}x${size}) Canvas生成完了`);
            }
            
            console.log('🎉 Canvas代替処理完了！');
            
        } catch (canvasError) {
            console.log('Canvas代替処理も失敗しました。手動でリサイズしてください。');
            console.error(canvasError.message);
        }
    }

    async updateManifest() {
        console.log('📝 manifest.json更新中...');
        
        const manifestPath = 'manifest.json';
        if (fs.existsSync(manifestPath)) {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            
            // PNGアイコンに変更
            manifest.icons = this.sizes.map(({ size, name }) => ({
                src: `icons/${name}`,
                sizes: `${size}x${size}`,
                type: 'image/png'
            }));
            
            fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
            console.log('✅ manifest.json更新完了');
        }
    }

    async updateHTML() {
        console.log('📝 index.html更新中...');
        
        const htmlPath = 'index.html';
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf8');
            
            // アイコン参照をPNGに変更
            html = html.replace(
                /href="icons\/icon-192x192\.svg"/g,
                'href="icons/icon-192x192.png"'
            );
            html = html.replace(
                /href="icons\/icon-512x512\.svg"/g,
                'href="icons/icon-512x512.png"'
            );
            html = html.replace(
                /type="image\/svg\+xml"/g,
                'type="image/png"'
            );
            
            fs.writeFileSync(htmlPath, html);
            console.log('✅ index.html更新完了');
        }
    }
}

// 実行
async function main() {
    try {
        const resizer = new IconResizer();
        await resizer.generateAllSizes();
        await resizer.updateManifest();
        await resizer.updateHTML();
        
        console.log('\n🎉 RecipeBoxアイコン設定完了！');
        console.log('NovelAI生成の美しいアイコンがアプリで使用されます。');
        
    } catch (error) {
        console.error('エラー:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { IconResizer };