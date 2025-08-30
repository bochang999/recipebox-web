// RecipeBox 設定ファイル
const APP_CONFIG = {
    name: 'RecipeBox',
    version: '2.16.0',
    defaultPortion: 1,
    maxPortion: 4,
    storageKeys: {
        recipes: 'recipebox_recipes',
        settings: 'recipebox_settings'
    },
    debug: false
};

// Sentry設定 (エラー監視)
window.SENTRY_DSN = "https://f33ed55dd2721d876d01b9f2fd39d4ac@o4509917034840064.ingest.us.sentry.io/4509917059284992";
window.SENTRY_ORG = "bochangs-labo"; 
window.SENTRY_PROJECT = "recipebox-web";

// デバッグモード
if (APP_CONFIG.debug) {
    console.log('🍴 RecipeBox Debug Mode:', APP_CONFIG.version);
}