// RecipeBox Web App JavaScript

class RecipeBoxApp {
    constructor() {
        this.currentScreen = 'main-screen';
        this.recipes = this.loadRecipes();
        this.containers = this.loadContainers();
        this.saltReferences = this.loadSaltReferences();
        this.init();
    }

    init() {
        // イベントリスナーの設定
        this.setupEventListeners();
        
        // 初期データの読み込み
        this.renderRecipes();
        
        // PWA関連の初期化
        this.initPWA();
    }

    setupEventListeners() {
        // 検索機能
        const searchInput = document.getElementById('recipe-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchRecipes(e.target.value);
            });
        }

        // ソートタブ
        document.querySelectorAll('.sort-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setSortMode(e.target.dataset.sort);
            });
        });

        // 塩分濃度計算
        const calcButton = document.getElementById('calc-button');
        if (calcButton) {
            calcButton.addEventListener('click', this.calculateSalt.bind(this));
        }

        // レシピ追加ボタン
        const addRecipeBtn = document.getElementById('add-recipe-btn');
        if (addRecipeBtn) {
            addRecipeBtn.addEventListener('click', this.addRecipe.bind(this));
        }

        // 分量調整スライダー
        const portionSlider = document.getElementById('portion-slider');
        if (portionSlider) {
            portionSlider.addEventListener('input', (e) => {
                this.updatePortion(e.target.value);
            });
        }
    }

    // 画面切り替え
    showScreen(screenId) {
        // 現在の画面を非表示
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // 指定された画面を表示
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }
    }

    // レシピ関連
    loadRecipes() {
        const stored = localStorage.getItem('recipebox-recipes');
        if (stored) {
            return JSON.parse(stored);
        }
        return this.getInitialRecipes();
    }

    getInitialRecipes() {
        return [
            {
                id: 'recipe_001',
                name: 'チョコレートムース',
                category: 'dessert',
                isStarred: true,
                createdAt: '2025-08-09',
                updatedAt: '2025-08-09',
                servings: 1,
                ingredients: [
                    { name: '生クリーム', amount: 200, unit: 'ml' },
                    { name: 'ミルクチョコレート', amount: 100, unit: 'g' }
                ],
                steps: [
                    '生クリームを100mlを泡立てる',
                    'チョコレートをみじん切りにして600w1分レンチン',
                    '溶けたチョコをかき混ぜる',
                    '泡立ててない生クリームを入れてかき混ぜる',
                    'よく混ぜたあと泡立てたものを混ぜて器に盛る'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-09', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_002',
                name: 'カラメルソース',
                category: 'sauce',
                isStarred: false,
                createdAt: '2025-08-09',
                updatedAt: '2025-08-09',
                servings: 1,
                ingredients: [
                    { name: '砂糖', amount: 100, unit: 'g' },
                    { name: '水', amount: 100, unit: 'g' },
                    { name: '仕上げの水', amount: 50, unit: 'g' }
                ],
                steps: [
                    '砂糖と水を混ぜて茶色になるまで茹でる',
                    '茶色になったたら仕上げの熱湯を混ぜてひと煮立ち'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-09', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_003',
                name: 'うなぎの蒲焼のタレ',
                category: 'sauce',
                isStarred: true,
                createdAt: '2025-08-09',
                updatedAt: '2025-08-09',
                servings: 1,
                ingredients: [
                    { name: 'しょうゆ', amount: 22.5, unit: 'ml', note: '大さじ1と1/2' },
                    { name: 'みりん', amount: 22.5, unit: 'ml', note: '大さじ1と1/2' },
                    { name: '料理酒', amount: 11.25, unit: 'ml', note: '大さじ3/4' },
                    { name: '砂糖', amount: 11.25, unit: 'ml', note: '大さじ3/4' }
                ],
                steps: [
                    '全ての材料を混ぜ合わせる',
                    '中火で煮詰めてとろみをつける'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-09', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_004',
                name: '豚の角煮',
                category: 'main',
                isStarred: true,
                createdAt: '2025-08-09',
                updatedAt: '2025-08-09',
                servings: 1,
                ingredients: [
                    { name: '酒', amount: 40, unit: 'ml' },
                    { name: '砂糖', amount: 30, unit: 'g', note: '大さじ2' },
                    { name: 'ハイミー', amount: 0, unit: '適量' },
                    { name: 'カツオパウダー', amount: 0, unit: '適量' },
                    { name: 'しょうゆ', amount: 30, unit: 'ml', note: '大さじ2' },
                    { name: 'にんにく', amount: 0, unit: '薄切り' },
                    { name: 'しょうが', amount: 0, unit: '薄切り' },
                    { name: '長ネギ', amount: 0, unit: 'ひとかけら' },
                    { name: '水', amount: 160, unit: 'ml' }
                ],
                steps: [
                    '一度ホットクック スープで30分',
                    'その後角煮モードで調理'
                ],
                cookingMethod: 'ホットクック',
                versions: [
                    { version: '1.0', date: '2025-08-09', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_005',
                name: 'マイルド経口補水液',
                category: 'drink',
                isStarred: false,
                createdAt: '2025-08-09',
                updatedAt: '2025-08-09',
                servings: 1,
                yield: '500ml',
                ingredients: [
                    { name: '水', amount: 500, unit: 'ml' },
                    { name: '砂糖', amount: 9, unit: 'g', note: '大さじ1（約6〜9g）' },
                    { name: '塩', amount: 0.3, unit: 'g', note: 'ひとつまみより少なめ' },
                    { name: 'レモン果汁', amount: 5, unit: 'g', note: '小さじ1' }
                ],
                steps: [
                    '全ての材料をよく混ぜ合わせる',
                    '塩と砂糖が完全に溶けるまで撹拌する'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-09', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_006',
                name: 'エアロプレスコーヒー',
                category: 'drink',
                isStarred: true,
                createdAt: '2025-08-09',
                updatedAt: '2025-08-09',
                servings: 1,
                yield: '180cc',
                ingredients: [
                    { name: 'コーヒー豆', amount: 17, unit: 'g' },
                    { name: 'お湯', amount: 180, unit: 'ml', note: '92℃～93℃' }
                ],
                steps: [
                    'TIMEMORE C3: 16clicks で豆を挽く',
                    'エアロプレスにコーヒーを入れる',
                    'お湯を注いで10回混ぜる',
                    '30秒蒸らしてプレスする'
                ],
                equipment: ['エアロプレスコントロールフィルター', 'TIMEMORE C3'],
                versions: [
                    { version: '1.0', date: '2025-08-09', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_007',
                name: 'シンプルホットケーキ',
                category: 'dessert',
                isStarred: false,
                createdAt: '2025-08-09',
                updatedAt: '2025-08-09',
                servings: 1,
                yield: '約2枚分',
                ingredients: [
                    { name: '薄力粉', amount: 100, unit: 'g' },
                    { name: 'ベーキングパウダー', amount: 3.75, unit: 'g', note: '小さじ3/4〜1' },
                    { name: '塩', amount: 0, unit: 'ひとつまみ' },
                    { name: '卵', amount: 1, unit: '個' },
                    { name: '砂糖', amount: 22.5, unit: 'g', note: '15〜30g' },
                    { name: '牛乳', amount: 75, unit: 'ml' },
                    { name: 'サラダ油', amount: 15, unit: 'ml', note: '大さじ1' },
                    { name: 'バニラオイル', amount: 0, unit: '少々' }
                ],
                steps: [
                    '薄力粉、ベーキングパウダー、塩をボウルで混ぜ中央をくぼませる',
                    '別のボウルで卵を溶きほぐし、砂糖、牛乳、サラダ油、バニラオイルを混ぜる',
                    '粉類に液体を加えて軽く混ぜる',
                    'フライパンで両面を焼く'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-09', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_008',
                name: 'お好み焼き（普通盛り）',
                category: 'main',
                isStarred: true,
                createdAt: '2025-08-09',
                updatedAt: '2025-08-09',
                servings: 1,
                ingredients: [
                    { name: 'お好み焼き粉', amount: 50, unit: 'g' },
                    { name: '山芋粉', amount: 2, unit: 'g' },
                    { name: 'ベーキングパウダー', amount: 2, unit: 'g' },
                    { name: '白だし', amount: 8, unit: 'g' },
                    { name: '水', amount: 30, unit: 'ml' },
                    { name: '牛乳', amount: 15, unit: 'ml', note: '大さじ1' },
                    { name: '卵', amount: 1, unit: '個' },
                    { name: 'キャベツ', amount: 80, unit: 'g', note: '粗みじん切り・大きめ葉2枚分' },
                    { name: '豚バラ薄切り肉', amount: 35, unit: 'g', note: '2〜3枚' },
                    { name: '天かす', amount: 15, unit: 'g', note: '大さじ1' },
                    { name: '紅しょうが', amount: 5, unit: 'g', note: '小さじ1' },
                    { name: '青ねぎ', amount: 5, unit: 'g', note: '小さじ1・小口切り' }
                ],
                steps: [
                    'キャベツは粗みじん切りにし、冷蔵庫で1時間ほど水分を飛ばす',
                    '生地材料を混ぜ、冷蔵庫で30分〜3時間寝かせる',
                    'ボウルに生地、卵、キャベツ、天かす、紅しょうが、青ねぎを加える',
                    '焼く直前に空気を含ませるように大きくふんわり混ぜる',
                    'フライパンで両面弱火で4分ずつ焼く'
                ],
                cookingTime: '両面弱火で四分',
                versions: [
                    { version: '1.0', date: '2025-08-09', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_008',
                name: 'チキンカレー',
                category: 'main',
                isStarred: true,
                createdAt: '2025-08-09',
                updatedAt: '2025-08-09',
                servings: 2,
                ingredients: [
                    { name: '鶏もも肉', amount: 300, unit: 'g' },
                    { name: '玉ねぎ', amount: 150, unit: 'g', note: '中1個' },
                    { name: 'にんにく', amount: 10, unit: 'g', note: '1かけ' },
                    { name: 'しょうが', amount: 10, unit: 'g', note: '1かけ' },
                    { name: 'トマト缶', amount: 200, unit: 'g', note: '半缶' },
                    { name: 'カレー粉', amount: 15, unit: 'g', note: '大さじ1' },
                    { name: '水', amount: 300, unit: 'ml' },
                    { name: 'ココナッツミルク', amount: 100, unit: 'ml' },
                    { name: '塩', amount: 3, unit: 'g', note: '小さじ1/2' },
                    { name: 'オリーブオイル', amount: 15, unit: 'ml', note: '大さじ1' }
                ],
                steps: [
                    '鶏肉を一口大に切る',
                    '玉ねぎ、にんにく、しょうがをみじん切りにする',
                    'フライパンに油15mlを熱し、にんにくとしょうがを炒める',
                    '玉ねぎを加えて透明になるまで炒める',
                    'カレー粉15gを加えて香りが立つまで炒める',
                    '鶏肉を加えて全体に焼き色をつける',
                    'トマト缶200gを加えて煮詰める',
                    '水300mlを加えて15分煮込む',
                    'ココナッツミルク100mlと塩3gで味を調える'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-09', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_009',
                name: '基本のパスタ（アーリオ・オーリオ）',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-09',
                updatedAt: '2025-08-09',
                servings: 1,
                ingredients: [
                    { name: 'パスタ', amount: 100, unit: 'g' },
                    { name: 'にんにく', amount: 10, unit: 'g', note: '2かけ' },
                    { name: '赤唐辛子', amount: 1, unit: '本' },
                    { name: 'オリーブオイル', amount: 30, unit: 'ml', note: '大さじ2' },
                    { name: 'パセリ', amount: 0, unit: '適量' },
                    { name: '塩', amount: 0, unit: '茹で水用' }
                ],
                steps: [
                    '大きめの鍋に水1Lと塩10gを入れて沸騰させる',
                    'にんにくを薄切り、赤唐辛子を輪切りにする',
                    'フライパンにオリーブオイル30mlとにんにくを入れて弱火で加熱',
                    'にんにくが色づいてきたら赤唐辛子を加える',
                    'パスタ100gを沸騰したお湯で表示時間より1分短く茹でる',
                    '茹で汁30mlをフライパンに加える',
                    '茹でたパスタをフライパンに加えて30秒炒め合わせる',
                    'パセリを散らして完成'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-09', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_010',
                name: '和風だし（基本）',
                category: 'sauce',
                isStarred: true,
                createdAt: '2025-08-09',
                updatedAt: '2025-08-09',
                servings: 1,
                yield: '500ml',
                ingredients: [
                    { name: '昆布', amount: 5, unit: 'g', note: '5cm角1枚' },
                    { name: 'かつお節', amount: 10, unit: 'g' },
                    { name: '水', amount: 500, unit: 'ml' }
                ],
                steps: [
                    '昆布5gを水500mlに30分以上つけておく',
                    '中火で加熱し、沸騰直前に昆布を取り出す',
                    '沸騰したらかつお節10gを加える',
                    '再び沸騰したら火を止めて2分待つ',
                    'キッチンペーパーでかつお節を濾して完成'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-09', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_011',
                name: 'チャーハン',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-09',
                updatedAt: '2025-08-09',
                servings: 1,
                ingredients: [
                    { name: 'ご飯', amount: 150, unit: 'g', note: '茶碗1杯分' },
                    { name: '卵', amount: 1, unit: '個' },
                    { name: '長ネギ', amount: 30, unit: 'g', note: '1/3本' },
                    { name: 'ハム', amount: 40, unit: 'g', note: '2枚' },
                    { name: '中華だしの素', amount: 2, unit: 'g', note: '小さじ1/2' },
                    { name: '醤油', amount: 5, unit: 'ml', note: '小さじ1' },
                    { name: 'ごま油', amount: 10, unit: 'ml', note: '小さじ2' },
                    { name: 'サラダ油', amount: 15, unit: 'ml', note: '大さじ1' }
                ],
                steps: [
                    '長ネギ30gとハム40gを細かく切る',
                    '卵1個を溶いておく',
                    'フライパンにサラダ油15mlを熱して強火にする',
                    '溶き卵を入れて半熟状態でご飯150gを加える',
                    'ご飯と卵をよく混ぜ合わせる',
                    '長ネギとハムを加えて炒める',
                    '中華だしの素2g、醤油5ml、ごま油10mlで味付け',
                    'パラパラになるまで炒めて完成'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-09', changes: '初版作成' }
                ]
            }
        ];
    }

    saveRecipes() {
        localStorage.setItem('recipebox-recipes', JSON.stringify(this.recipes));
    }

    renderRecipes() {
        const container = document.getElementById('recipes-list');
        if (!container) return;

        if (this.recipes.length === 0) {
            container.innerHTML = '<p class="empty-message">レシピがまだありません。「＋追加」でレシピを追加しましょう。</p>';
            return;
        }

        const html = this.recipes.map(recipe => {
            const starIcon = recipe.isStarred ? '⭐' : '☆';
            const ingredientsSummary = recipe.ingredients.slice(0, 3).map(ing => ing.name).join('、');
            
            return `
                <div class="recipe-item" data-id="${recipe.id}">
                    <div class="recipe-header">
                        <h3 class="recipe-title">${recipe.name}</h3>
                        <button class="star-button" onclick="app.toggleStar('${recipe.id}')">${starIcon}</button>
                    </div>
                    <div class="recipe-meta">
                        <span class="recipe-servings">${recipe.servings}人前</span>
                        <span class="recipe-date">${recipe.updatedAt}</span>
                    </div>
                    <div class="recipe-ingredients">
                        ${ingredientsSummary}${recipe.ingredients.length > 3 ? ' など...' : ''}
                    </div>
                    <div class="recipe-actions">
                        <button onclick="app.viewRecipe('${recipe.id}')" class="view-button">詳細</button>
                        <button onclick="app.editRecipe('${recipe.id}')" class="edit-button">編集</button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    searchRecipes(query) {
        const filteredRecipes = this.recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(query.toLowerCase())
        );
        
        const container = document.getElementById('recipes-list');
        if (filteredRecipes.length === 0 && query) {
            container.innerHTML = '<p class="empty-message">検索条件に一致するレシピがありません。</p>';
            return;
        }
        
        // 一時的にrecipesを変更してレンダリング
        const originalRecipes = this.recipes;
        this.recipes = filteredRecipes;
        this.renderRecipes();
        this.recipes = originalRecipes;
    }

    setSortMode(mode) {
        // タブの状態更新
        document.querySelectorAll('.sort-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-sort="${mode}"]`).classList.add('active');

        // ソート実行
        switch (mode) {
            case 'time':
                this.recipes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                break;
            case 'name':
                this.recipes.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'starred':
                this.recipes.sort((a, b) => {
                    if (a.isStarred && !b.isStarred) return -1;
                    if (!a.isStarred && b.isStarred) return 1;
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                });
                break;
        }
        
        this.renderRecipes();
    }

    toggleStar(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (recipe) {
            recipe.isStarred = !recipe.isStarred;
            this.saveRecipes();
            this.renderRecipes();
        }
    }

    viewRecipe(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        this.currentRecipe = recipe;
        this.currentPortion = 1;
        
        this.renderRecipeDetail(recipe);
        this.showScreen('recipe-detail-screen');
    }

    renderRecipeDetail(recipe) {
        // タイトル設定
        document.getElementById('recipe-detail-title').textContent = recipe.name;

        // 分量スライダーの初期化
        const portionSlider = document.getElementById('portion-slider');
        const portionValue = document.getElementById('portion-value');
        if (portionSlider && portionValue) {
            portionSlider.value = 1;
            portionValue.textContent = 1;
        }

        // 材料リストの表示
        this.renderIngredients(recipe.ingredients, 1);

        // 手順の表示
        this.renderSteps(recipe.steps);

        // 追加情報の表示
        this.renderAdditionalInfo(recipe);

        // バージョン履歴の表示
        this.renderVersionHistory(recipe.versions);
    }

    renderIngredients(ingredients, portion = 1) {
        const container = document.getElementById('ingredients-list');
        if (!container) return;

        const html = ingredients.map(ing => {
            let amountText = '';
            if (ing.amount > 0) {
                const adjustedAmount = (ing.amount * portion).toFixed(ing.amount % 1 === 0 ? 0 : 1);
                amountText = `${adjustedAmount}${ing.unit}`;
            } else {
                amountText = ing.unit;
            }

            const noteText = ing.note ? `<span class="ingredient-note">(${ing.note})</span>` : '';

            return `
                <div class="ingredient-item">
                    <span class="ingredient-name">${ing.name}</span>
                    <div>
                        <span class="ingredient-amount">${amountText}</span>
                        ${noteText}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    renderSteps(steps, portion = 1) {
        const container = document.getElementById('steps-list');
        if (!container) return;

        const html = steps.map((step, index) => {
            // 手順内の数値を分量に応じて調整
            let adjustedStep = this.adjustStepPortions(step, portion);
            
            return `
                <div class="step-item">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-text">${adjustedStep}</div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    adjustStepPortions(step, portion) {
        if (portion === 1) return step;
        
        // 正規表現で数値+単位のパターンを検出して調整
        return step.replace(/(\d+(?:\.\d+)?)\s*(ml|g|L|kg|個|枚|本|かけ|杯)/g, (match, number, unit) => {
            const originalAmount = parseFloat(number);
            const adjustedAmount = originalAmount * portion;
            
            // 整数の場合は小数点なし、小数の場合は1桁まで表示
            const formattedAmount = adjustedAmount % 1 === 0 ? 
                adjustedAmount.toString() : 
                adjustedAmount.toFixed(1);
            
            return `${formattedAmount}${unit}`;
        });
    }

    renderAdditionalInfo(recipe) {
        const categoryEl = document.getElementById('recipe-category');
        const yieldEl = document.getElementById('recipe-yield');
        const equipmentEl = document.getElementById('recipe-equipment');
        const cookingTimeEl = document.getElementById('recipe-cooking-time');

        if (categoryEl) {
            categoryEl.innerHTML = `<span class="info-label">カテゴリ:</span>${this.getCategoryName(recipe.category)}`;
        }

        if (yieldEl && recipe.yield) {
            yieldEl.innerHTML = `<span class="info-label">分量:</span>${recipe.yield}`;
        }

        if (equipmentEl && recipe.equipment) {
            equipmentEl.innerHTML = `<span class="info-label">器具:</span>${recipe.equipment.join(', ')}`;
        }

        if (cookingTimeEl && recipe.cookingTime) {
            cookingTimeEl.innerHTML = `<span class="info-label">調理時間:</span>${recipe.cookingTime}`;
        }
    }

    renderVersionHistory(versions) {
        const container = document.getElementById('version-list');
        if (!container) return;

        const html = versions.map(version => {
            return `
                <div class="version-item">
                    <div class="version-info">
                        <div>
                            <span class="version-number">v${version.version}</span>
                            <span class="version-date">${version.date}</span>
                        </div>
                        <div class="version-changes">${version.changes}</div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    getCategoryName(category) {
        const categories = {
            'main': 'メイン料理',
            'dessert': 'デザート',
            'sauce': 'タレ・調味料',
            'drink': '飲み物',
            'side': '副菜'
        };
        return categories[category] || category;
    }

    updatePortion(portion) {
        this.currentPortion = parseInt(portion);
        const portionValue = document.getElementById('portion-value');
        if (portionValue) {
            portionValue.textContent = portion;
        }

        if (this.currentRecipe) {
            this.renderIngredients(this.currentRecipe.ingredients, this.currentPortion);
            this.renderSteps(this.currentRecipe.steps, this.currentPortion);
        }
    }

    editRecipe(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe) return;
        
        this.currentEditingRecipe = recipe;
        this.showRecipeForm(recipe);
    }

    addRecipe() {
        this.currentEditingRecipe = null;
        this.showRecipeForm();
    }
    
    showRecipeForm(recipe = null) {
        // フォームタイトル設定
        const title = document.getElementById('recipe-form-title');
        title.textContent = recipe ? 'レシピ編集' : 'レシピ追加';
        
        // フォーム初期化
        this.resetRecipeForm();
        
        if (recipe) {
            this.populateRecipeForm(recipe);
        }
        
        this.showScreen('recipe-form-screen');
    }
    
    resetRecipeForm() {
        document.getElementById('recipe-form').reset();
        
        // 材料入力を1つだけにリセット
        const ingredientsContainer = document.getElementById('ingredients-container');
        ingredientsContainer.innerHTML = `
            <div class="ingredient-input">
                <input type="text" placeholder="材料名" class="ingredient-name">
                <input type="number" placeholder="量" class="ingredient-amount" step="0.1">
                <input type="text" placeholder="単位" class="ingredient-unit" value="g">
                <input type="text" placeholder="メモ" class="ingredient-note">
                <button type="button" class="remove-ingredient">×</button>
            </div>
        `;
        
        // 手順入力を1つだけにリセット
        const stepsContainer = document.getElementById('steps-container');
        stepsContainer.innerHTML = `
            <div class="step-input">
                <span class="step-number">1</span>
                <textarea placeholder="手順を詳しく説明してください" class="step-text" rows="2"></textarea>
                <button type="button" class="remove-step">×</button>
            </div>
        `;
        
        // イベントリスナー再設定
        this.setupFormEventListeners();
    }
    
    populateRecipeForm(recipe) {
        // 基本情報
        document.getElementById('recipe-name').value = recipe.name || '';
        document.getElementById('recipe-category').value = recipe.category || 'main';
        document.getElementById('recipe-servings').value = recipe.servings || 1;
        document.getElementById('recipe-time').value = recipe.cookingTime || '';
        document.getElementById('recipe-equipment').value = recipe.equipment ? recipe.equipment.join(', ') : '';
        document.getElementById('recipe-notes').value = recipe.notes || '';
        document.getElementById('recipe-starred').checked = recipe.isStarred || false;
        
        // 材料
        const ingredientsContainer = document.getElementById('ingredients-container');
        ingredientsContainer.innerHTML = '';
        
        recipe.ingredients.forEach((ing, index) => {
            const ingredientDiv = document.createElement('div');
            ingredientDiv.className = 'ingredient-input';
            ingredientDiv.innerHTML = `
                <input type="text" placeholder="材料名" class="ingredient-name" value="${ing.name || ''}">
                <input type="number" placeholder="量" class="ingredient-amount" step="0.1" value="${ing.amount || ''}">
                <input type="text" placeholder="単位" class="ingredient-unit" value="${ing.unit || 'g'}">
                <input type="text" placeholder="メモ" class="ingredient-note" value="${ing.note || ''}">
                <button type="button" class="remove-ingredient">×</button>
            `;
            ingredientsContainer.appendChild(ingredientDiv);
        });
        
        // 手順
        const stepsContainer = document.getElementById('steps-container');
        stepsContainer.innerHTML = '';
        
        recipe.steps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step-input';
            stepDiv.innerHTML = `
                <span class="step-number">${index + 1}</span>
                <textarea placeholder="手順を詳しく説明してください" class="step-text" rows="2">${step}</textarea>
                <button type="button" class="remove-step">×</button>
            `;
            stepsContainer.appendChild(stepDiv);
        });
        
        this.setupFormEventListeners();
    }
    
    setupFormEventListeners() {
        // 材料追加
        const addIngredientBtn = document.getElementById('add-ingredient');
        addIngredientBtn.removeEventListener('click', this.addIngredientHandler);
        this.addIngredientHandler = () => this.addIngredient();
        addIngredientBtn.addEventListener('click', this.addIngredientHandler);
        
        // 手順追加
        const addStepBtn = document.getElementById('add-step');
        addStepBtn.removeEventListener('click', this.addStepHandler);
        this.addStepHandler = () => this.addStep();
        addStepBtn.addEventListener('click', this.addStepHandler);
        
        // 保存
        const saveBtn = document.getElementById('save-recipe-btn');
        saveBtn.removeEventListener('click', this.saveRecipeHandler);
        this.saveRecipeHandler = () => this.saveRecipe();
        saveBtn.addEventListener('click', this.saveRecipeHandler);
        
        // 削除ボタンのイベント設定
        this.setupRemoveButtonListeners();
    }
    
    setupRemoveButtonListeners() {
        // 材料削除
        document.querySelectorAll('.remove-ingredient').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const container = document.getElementById('ingredients-container');
                if (container.children.length > 1) {
                    e.target.parentElement.remove();
                }
            });
        });
        
        // 手順削除
        document.querySelectorAll('.remove-step').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const container = document.getElementById('steps-container');
                if (container.children.length > 1) {
                    e.target.parentElement.remove();
                    this.updateStepNumbers();
                }
            });
        });
    }
    
    addIngredient() {
        const container = document.getElementById('ingredients-container');
        const ingredientDiv = document.createElement('div');
        ingredientDiv.className = 'ingredient-input';
        ingredientDiv.innerHTML = `
            <input type="text" placeholder="材料名" class="ingredient-name">
            <input type="number" placeholder="量" class="ingredient-amount" step="0.1">
            <input type="text" placeholder="単位" class="ingredient-unit" value="g">
            <input type="text" placeholder="メモ" class="ingredient-note">
            <button type="button" class="remove-ingredient">×</button>
        `;
        container.appendChild(ingredientDiv);
        this.setupRemoveButtonListeners();
    }
    
    addStep() {
        const container = document.getElementById('steps-container');
        const stepNumber = container.children.length + 1;
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-input';
        stepDiv.innerHTML = `
            <span class="step-number">${stepNumber}</span>
            <textarea placeholder="手順を詳しく説明してください" class="step-text" rows="2"></textarea>
            <button type="button" class="remove-step">×</button>
        `;
        container.appendChild(stepDiv);
        this.setupRemoveButtonListeners();
    }
    
    updateStepNumbers() {
        document.querySelectorAll('.step-number').forEach((numberSpan, index) => {
            numberSpan.textContent = index + 1;
        });
    }
    
    saveRecipe() {
        // フォームデータ収集
        const formData = this.collectFormData();
        
        if (!this.validateRecipeData(formData)) {
            return;
        }
        
        if (this.currentEditingRecipe) {
            // 編集
            this.updateExistingRecipe(formData);
        } else {
            // 新規追加
            this.createNewRecipe(formData);
        }
        
        this.saveRecipes();
        this.renderRecipes();
        this.showScreen('recipes-screen');
        
        alert(this.currentEditingRecipe ? 'レシピを更新しました！' : 'レシピを追加しました！');
    }
    
    collectFormData() {
        const name = document.getElementById('recipe-name').value.trim();
        const category = document.getElementById('recipe-category').value;
        const servings = parseInt(document.getElementById('recipe-servings').value) || 1;
        const cookingTime = document.getElementById('recipe-time').value.trim();
        const equipment = document.getElementById('recipe-equipment').value.split(',').map(s => s.trim()).filter(s => s);
        const notes = document.getElementById('recipe-notes').value.trim();
        const isStarred = document.getElementById('recipe-starred').checked;
        
        // 材料収集
        const ingredients = [];
        document.querySelectorAll('.ingredient-input').forEach(input => {
            const name = input.querySelector('.ingredient-name').value.trim();
            const amount = parseFloat(input.querySelector('.ingredient-amount').value) || 0;
            const unit = input.querySelector('.ingredient-unit').value.trim() || '';
            const note = input.querySelector('.ingredient-note').value.trim();
            
            if (name) {
                ingredients.push({ name, amount, unit, note });
            }
        });
        
        // 手順収集
        const steps = [];
        document.querySelectorAll('.step-text').forEach(textarea => {
            const step = textarea.value.trim();
            if (step) {
                steps.push(step);
            }
        });
        
        return {
            name,
            category,
            servings,
            cookingTime,
            equipment,
            notes,
            isStarred,
            ingredients,
            steps
        };
    }
    
    validateRecipeData(data) {
        if (!data.name) {
            alert('レシピ名を入力してください。');
            return false;
        }
        
        if (data.ingredients.length === 0) {
            alert('材料を最低1つは入力してください。');
            return false;
        }
        
        if (data.steps.length === 0) {
            alert('手順を最低1つは入力してください。');
            return false;
        }
        
        return true;
    }
    
    createNewRecipe(data) {
        const newId = 'recipe_' + String(Date.now()).slice(-8);
        const now = new Date().toISOString().split('T')[0];
        
        const newRecipe = {
            id: newId,
            name: data.name,
            category: data.category,
            isStarred: data.isStarred,
            createdAt: now,
            updatedAt: now,
            servings: data.servings,
            cookingTime: data.cookingTime,
            equipment: data.equipment,
            notes: data.notes,
            ingredients: data.ingredients,
            steps: data.steps,
            versions: [{
                version: '1.0',
                date: now,
                changes: '初回作成'
            }]
        };
        
        this.recipes.unshift(newRecipe);
    }
    
    updateExistingRecipe(data) {
        const recipe = this.currentEditingRecipe;
        const now = new Date().toISOString().split('T')[0];
        
        // 変更内容を記録
        const changes = [];
        if (recipe.name !== data.name) changes.push(`名前変更: ${recipe.name} → ${data.name}`);
        if (recipe.ingredients.length !== data.ingredients.length) changes.push('材料変更');
        if (recipe.steps.length !== data.steps.length) changes.push('手順変更');
        
        // レシピ更新
        Object.assign(recipe, {
            name: data.name,
            category: data.category,
            isStarred: data.isStarred,
            updatedAt: now,
            servings: data.servings,
            cookingTime: data.cookingTime,
            equipment: data.equipment,
            notes: data.notes,
            ingredients: data.ingredients,
            steps: data.steps
        });
        
        // バージョン履歴追加
        if (!recipe.versions) recipe.versions = [];
        const nextVersion = (recipe.versions.length + 1).toFixed(1);
        recipe.versions.push({
            version: nextVersion,
            date: now,
            changes: changes.length > 0 ? changes.join(', ') : '軽微な修正'
        });
    }

    // 容器データ
    loadContainers() {
        return [
            { name: 'マグカップ', weight: 170 },
            { name: '水筒', weight: 77 },
            { name: 'プラコップ', weight: 46 },
            { name: '大きいボトル', weight: 188 },
            { name: 'ホットクック内釜', weight: 555 },
            { name: '炊飯器釜', weight: 664 }
        ];
    }

    // 塩分濃度参考データ
    loadSaltReferences() {
        return {
            general: 0.7,
            soup: 1.0,
            noodleSoup: 1.5,
            dippingSauce: 1.9,
            tsukemen: 2.8
        };
    }

    // 塩分濃度計算
    calculateSalt() {
        const targetConcentration = parseFloat(document.getElementById('target-concentration').value) || 0;
        const totalWeight = parseFloat(document.getElementById('total-weight').value) || 0;
        
        if (targetConcentration === 0 || totalWeight === 0) {
            alert('目標塩分濃度と総重量の両方を入力してください。');
            return;
        }
        
        // 必要な塩分量を計算 (総重量 × 塩分濃度 / 100)
        const requiredSalt = (totalWeight * targetConcentration) / 100;
        const resultElement = document.getElementById('calc-result');
        
        resultElement.innerHTML = `
            <div class="result-main">必要な塩分: <strong>${requiredSalt.toFixed(1)}g</strong></div>
            <div class="result-detail">
                総重量 ${totalWeight}g × 塩分濃度 ${targetConcentration}% = ${requiredSalt.toFixed(1)}g
            </div>
        `;
        resultElement.className = 'salt-calc-result show';
    }

    // PWA関連
    initPWA() {
        // Service Workerの登録
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }

        // インストールプロンプト
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('PWA install prompt available');
            // TODO: インストールボタンの表示
        });
    }
}

// グローバル関数（HTMLから呼び出し用）
function showScreen(screenId) {
    if (window.app) {
        window.app.showScreen(screenId);
    }
}

// アプリ初期化
document.addEventListener('DOMContentLoaded', () => {
    window.app = new RecipeBoxApp();
});

// CSS for recipe items (動的に追加)
const recipeItemStyles = `
<style>
.recipe-item {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    transition: box-shadow 0.2s;
}

.recipe-item:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.recipe-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.recipe-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.star-button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
}

.recipe-meta {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
}

.recipe-ingredients {
    color: #555;
    font-size: 14px;
    margin-bottom: 12px;
}

.recipe-actions {
    display: flex;
    gap: 10px;
}

.view-button, .edit-button {
    background: #f0f0f0;
    border: 1px solid #ddd;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.view-button:hover {
    background: #2196F3;
    color: white;
    border-color: #2196F3;
}

.edit-button:hover {
    background: #FF9800;
    color: white;
    border-color: #FF9800;
}
</style>
`;

// CSS を動的に追加
document.head.insertAdjacentHTML('beforeend', recipeItemStyles);