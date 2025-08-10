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

        // レシピ追加ボタン（無効化）
        const addRecipeBtn = document.getElementById('add-recipe-btn');
        if (addRecipeBtn) {
            addRecipeBtn.style.display = 'none';
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
                name: '至高の沼（食べきりサイズ）',
                category: 'main',
                isStarred: true,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '米（白米・無洗米どちらでも）', amount: 100, unit: 'g' },
                    { name: 'えのき', amount: 135, unit: 'g' },
                    { name: '冷凍オクラ', amount: 45, unit: 'g' },
                    { name: '冷凍ブロッコリー', amount: 67, unit: 'g' },
                    { name: '鶏むね肉（皮なし）', amount: 235, unit: 'g' },
                    { name: '水', amount: 530, unit: 'g' },
                    { name: 'コショウ（粉末）', amount: 0.5, unit: 'g', note: '目安4振り' },
                    { name: 'ガーリックパウダー', amount: 1.2, unit: 'g', note: '約5〜6振り' },
                    { name: '鶏がらスープの素（顆粒）', amount: 4, unit: 'g' },
                    { name: '塩（精製塩）', amount: 2, unit: 'g' },
                    { name: 'カレー粉（S&Bなどの市販品）', amount: 5, unit: 'g' },
                    { name: 'アジシオ（味変用）', amount: 0, unit: 'お好み', note: '1振り≒0.2g目安' }
                ],
                steps: [
                    'すべての材料を炊飯器に入れる',
                    '通常の炊飯モードで炊く',
                    '炊き上がったらよく混ぜる',
                    'アジシオで味を調整する'
                ],
                cookingTime: '炊飯時間',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_002',
                name: 'カロリーメイト風ブロック',
                category: 'dessert',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '約10本分',
                ingredients: [
                    { name: '小麦粉', amount: 200, unit: 'g' },
                    { name: 'スキムミルク', amount: 50, unit: 'g' },
                    { name: 'きな粉', amount: 50, unit: 'g' },
                    { name: '砂糖', amount: 40, unit: 'g' },
                    { name: '食塩', amount: 2, unit: 'g', note: '小さじ1/3' },
                    { name: '溶かしバター', amount: 50, unit: 'g' },
                    { name: '卵', amount: 50, unit: 'g', note: '1個' },
                    { name: 'レシチン', amount: 2.5, unit: 'g', note: '2〜3g' },
                    { name: '水 or 牛乳', amount: 50, unit: 'g' },
                    { name: 'チョコチップ', amount: 60, unit: 'g' },
                    { name: 'バニラエッセンス', amount: 0, unit: '少々' }
                ],
                steps: [
                    'オーブンを170度に予熱する',
                    '乾燥材料をすべてボウルで混ぜる',
                    '溶かしバター、卵、水（牛乳）、バニラエッセンスを加える',
                    'よく混ぜ合わせ、チョコチップを加える',
                    '型に流し込み170度で15分焼く'
                ],
                cookingTime: '30分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_003',
                name: 'パイの実風チョコチップ風スコーン',
                category: 'dessert',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '16個くらい',
                ingredients: [
                    { name: '薄力粉', amount: 120, unit: 'g' },
                    { name: 'バター', amount: 50, unit: 'g' },
                    { name: '牛乳', amount: 50, unit: 'g' },
                    { name: '砂糖', amount: 30, unit: 'g' },
                    { name: 'チョコチップ', amount: 30, unit: 'g' },
                    { name: 'ベーキングパウダー', amount: 6, unit: 'g' },
                    { name: '塩', amount: 1.2, unit: 'g' },
                    { name: 'バニラエッセンス', amount: 0, unit: '少々' }
                ],
                steps: [
                    'オーブンを180度に予熱する',
                    '薄力粉、ベーキングパウダー、塩、砂糖をボウルで混ぜる',
                    '冷たいバターを加えてそぼろ状にする',
                    '牛乳、バニラエッセンスを加えて軽く混ぜる',
                    'チョコチップを加える',
                    '成形して180度で15分焼く'
                ],
                cookingTime: '30分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_004',
                name: '豚の角煮',
                category: 'main',
                isStarred: true,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '酒', amount: 40, unit: 'g' },
                    { name: '砂糖', amount: 30, unit: 'g', note: '大さじ2' },
                    { name: 'ハイミー', amount: 0, unit: '適量' },
                    { name: 'カツオパウダー', amount: 0, unit: '適量' },
                    { name: 'しょうゆ', amount: 30, unit: 'g', note: '大さじ2' },
                    { name: 'にんにく', amount: 0, unit: '薄切り' },
                    { name: 'しょうが', amount: 0, unit: '薄切り' },
                    { name: '長ネギ', amount: 0, unit: 'ひとかけら' },
                    { name: '水', amount: 160, unit: 'g' }
                ],
                steps: [
                    '一度ホットクック スープで30分',
                    'その後角煮モードで調理'
                ],
                equipment: ['ホットクック'],
                cookingTime: '1時間',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_005',
                name: '角煮タレ',
                category: 'sauce',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '出来上がり重量約40g分',
                ingredients: [
                    { name: '酒', amount: 15, unit: 'g', note: '大さじ1' },
                    { name: 'みりん', amount: 15, unit: 'g', note: '大さじ1' },
                    { name: '砂糖', amount: 7.5, unit: 'g', note: '大さじ1/2' },
                    { name: 'しょうゆ', amount: 15, unit: 'g', note: '大さじ1' },
                    { name: '白だし', amount: 5, unit: 'g', note: '小さじ1' },
                    { name: 'しょうが（薄切り）', amount: 0, unit: '2枚' },
                    { name: '水', amount: 15, unit: 'g', note: '大さじ1' }
                ],
                steps: [
                    '全ての材料を鍋に入れる',
                    '豚バラなら40分煮込みモードの後に角煮モード',
                    '肩ロースなら表面に焼き目をつけて角煮モード'
                ],
                equipment: ['ホットクック'],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_006',
                name: '鶏ささみむね肉干し肉',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '鶏ささみ', amount: 0, unit: '適量' }
                ],
                steps: [
                    '65℃で18時間低温調理する'
                ],
                equipment: ['低温調理器'],
                cookingTime: '18時間',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_007',
                name: '蒸しじゃがいも',
                category: 'side',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: 'じゃがいも', amount: 0, unit: '適量' }
                ],
                steps: [
                    '沸騰した水でじゃがいもを茹でる',
                    '25分間茹でる'
                ],
                cookingTime: '25分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_008',
                name: '大豆（オーブン焼き）',
                category: 'side',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '大豆', amount: 0, unit: '適量' }
                ],
                steps: [
                    'オーブンを150度に予熱する',
                    '大豆をオーブンで30分焼く'
                ],
                cookingTime: '30分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_009',
                name: 'マイルド経口補水液',
                category: 'drink',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '500g',
                ingredients: [
                    { name: '水', amount: 500, unit: 'g' },
                    { name: '砂糖', amount: 7.5, unit: 'g', note: '大さじ1（約6〜9g）' },
                    { name: '塩', amount: 0.3, unit: 'g', note: 'ひとつまみより少なめ' },
                    { name: 'レモン果汁', amount: 5, unit: 'g', note: '小さじ1' }
                ],
                steps: [
                    '全ての材料をよく混ぜ合わせる',
                    '塩と砂糖が完全に溶けるまで撹拌する'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_010',
                name: 'ガチの経口補水液',
                category: 'drink',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '500g',
                ingredients: [
                    { name: '水', amount: 500, unit: 'g' },
                    { name: '砂糖', amount: 9, unit: 'g', note: '大さじ3' },
                    { name: '塩', amount: 1.5, unit: 'g', note: '小さじ1/4' }
                ],
                steps: [
                    '全ての材料をよく混ぜ合わせる',
                    '塩と砂糖が完全に溶けるまで撹拌する'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_011',
                name: 'コーントルティーヤ',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '1枚（50g）',
                ingredients: [
                    { name: 'マサ粉', amount: 70, unit: 'g' },
                    { name: '水', amount: 80, unit: 'g' },
                    { name: '塩', amount: 0, unit: 'ひとつまみ' }
                ],
                steps: [
                    'マサ粉、水、塩を混ぜてこねる',
                    '生地をまとめて休ませる',
                    '薄く伸ばして焼く'
                ],
                cookingTime: '20分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_012',
                name: 'うなぎの蒲焼のタレ',
                category: 'sauce',
                isStarred: true,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: 'しょうゆ', amount: 22.5, unit: 'g', note: '大さじ1と1/2' },
                    { name: 'みりん', amount: 22.5, unit: 'g', note: '大さじ1と1/2' },
                    { name: '料理酒', amount: 11.25, unit: 'g', note: '大さじ3/4' },
                    { name: '砂糖', amount: 11.25, unit: 'g', note: '大さじ3/4' }
                ],
                steps: [
                    '全ての材料を混ぜ合わせる',
                    '中火で煮詰めてとろみをつける'
                ],
                cookingTime: '10分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_013',
                name: '1.6mmパスタ',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '1.6mmパスタ', amount: 100, unit: 'g', note: '1人前' },
                    { name: '水（1人前）', amount: 240, unit: 'g' },
                    { name: '水（1.5人前）', amount: 320, unit: 'g' },
                    { name: '水（2人前）', amount: 400, unit: 'g' }
                ],
                steps: [
                    '記載の茹で時間（5〜7分）で茹でる',
                    '冷蔵するときは1分多めに茹で油をかける'
                ],
                cookingTime: '5〜7分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_014',
                name: '生パスタ（2mm）',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '生パスタ（2mm）', amount: 100, unit: 'g' }
                ],
                steps: [
                    'アルデンテは1分30秒で茹でる'
                ],
                cookingTime: '1分30秒',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_015',
                name: '玄米甘酒',
                category: 'drink',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '150g',
                ingredients: [
                    { name: '米', amount: 150, unit: 'g' },
                    { name: '水', amount: 300, unit: 'g' },
                    { name: '冷まし用水', amount: 360, unit: 'g' }
                ],
                steps: [
                    '米を炊く',
                    '炊いた米に水を加える',
                    '冷まし用の水で温度調整する',
                    '発酵させる'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_016',
                name: '紅茶',
                category: 'drink',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '茶葉', amount: 2.5, unit: 'g', note: '2-3g' },
                    { name: 'お湯', amount: 160, unit: 'g', note: '100度' }
                ],
                steps: [
                    'お湯を100度に沸かす',
                    '茶葉にお湯を注ぐ',
                    '2-3分間抽出する'
                ],
                cookingTime: '2-3分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_017',
                name: '塩ダレ',
                category: 'sauce',
                isStarred: true,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '水', amount: 280, unit: 'g' },
                    { name: '塩', amount: 27.9, unit: 'g' },
                    { name: '料理酒', amount: 27.9, unit: 'g' },
                    { name: '濃口しょうゆ', amount: 16.7, unit: 'g' },
                    { name: 'ホタテ顆粒ダシ', amount: 15.6, unit: 'g' },
                    { name: 'みりん', amount: 11.2, unit: 'g' },
                    { name: 'うま味調味料', amount: 4, unit: 'g', note: '溶けなかったら2g' },
                    { name: 'かつお節（厚削り）', amount: 4.5, unit: 'g' }
                ],
                steps: [
                    '全ての材料を混ぜ合わせる',
                    'うま味調味料が溶けない場合は2gに減らす',
                    '味玉3個には塩ダレ21g + 水9g'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_018',
                name: 'ドライトマト',
                category: 'side',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: 'トマト', amount: 0, unit: '適量' }
                ],
                steps: [
                    'オーブンを130度に予熱する',
                    'トマトを切って天板に並べる',
                    '130度で60分乾燥させる'
                ],
                cookingTime: '60分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_019',
                name: 'プリン',
                category: 'dessert',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: 'ミルク', amount: 150, unit: 'g' },
                    { name: '卵', amount: 1, unit: '個' },
                    { name: 'キビ砂糖', amount: 15, unit: 'g', note: '大さじ1' }
                ],
                steps: [
                    '材料を全て混ぜる',
                    'スチームオーブン5分予熱',
                    '150度で13分20秒',
                    '冷却終わるまで待つ'
                ],
                cookingTime: '20分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_020',
                name: 'ミルクプリン',
                category: 'dessert',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '白身', amount: 1, unit: '個' },
                    { name: '牛乳', amount: 90, unit: 'g' },
                    { name: '砂糖', amount: 15, unit: 'g', note: '大さじ1' }
                ],
                steps: [
                    '材料を全て混ぜる',
                    'オーブン150度で23分'
                ],
                cookingTime: '23分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_021',
                name: '白マヨネーズ',
                category: 'sauce',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '卵白', amount: 50, unit: 'g' },
                    { name: '米油', amount: 125, unit: 'g' },
                    { name: 'ワインビネガー', amount: 10, unit: 'g' },
                    { name: '塩', amount: 2.5, unit: 'g' }
                ],
                steps: [
                    '卵白をしっかりと泡立てる',
                    '米油を少しずつ加えて乳化させる',
                    'ワインビネガーと塩で調味する'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_022',
                name: 'パン',
                category: 'main',
                isStarred: true,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '600g (一個あたり100g)',
                ingredients: [
                    { name: '強力粉', amount: 230, unit: 'g' },
                    { name: 'ビタミンC', amount: 0.2, unit: 'g' },
                    { name: 'バター', amount: 17, unit: 'g', note: 'サラダ油なら16g' },
                    { name: 'きび砂糖', amount: 17, unit: 'g' },
                    { name: '塩', amount: 4, unit: 'g' },
                    { name: 'イースト', amount: 3, unit: 'g' },
                    { name: '水', amount: 160, unit: 'g', note: '高加水だと230g' },
                    { name: 'スキムミルク', amount: 6, unit: 'g' },
                    { name: 'じゃがいも', amount: 100, unit: 'g' }
                ],
                steps: [
                    '室温が25℃以上のときは約5℃、室温が10℃以下のときは約20℃の水を使う',
                    '食パンモードで3時間で発酵終了',
                    '200℃予熱で15分まとめて焼いたら25分'
                ],
                equipment: ['ホームベーカリー', 'オーブン'],
                cookingTime: '3時間（発酵含む）',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_023',
                name: 'ドーナツ',
                category: 'dessert',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '強力粉', amount: 100, unit: 'g' },
                    { name: 'イースト菌', amount: 2, unit: 'g' },
                    { name: '砂糖', amount: 20, unit: 'g' },
                    { name: '塩', amount: 2, unit: 'g' }
                ],
                steps: [
                    '材料を混ぜてこねる',
                    'クッキングシートを敷いて成形',
                    '真ん中に穴を開ける',
                    '180度の油で揚げる'
                ],
                cookingTime: '30分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_024',
                name: 'お好み焼き（大盛り）',
                category: 'main',
                isStarred: true,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '薄力粉', amount: 75, unit: 'g' },
                    { name: '山芋粉', amount: 2, unit: 'g' },
                    { name: '白だし', amount: 15, unit: 'g' },
                    { name: '水', amount: 60, unit: 'g' },
                    { name: '牛乳', amount: 25, unit: 'g' },
                    { name: '卵', amount: 1, unit: '個' },
                    { name: 'キャベツ', amount: 120, unit: 'g', note: '粗みじん切り／大きめ葉3枚分程度' },
                    { name: '豚バラ', amount: 52.5, unit: 'g', note: '3〜5枚（45〜60g程度）' },
                    { name: '天かす', amount: 22.5, unit: 'g', note: '大さじ1.5' },
                    { name: '紅しょうが', amount: 7.5, unit: 'g', note: '小さじ1.5' },
                    { name: '青ねぎ', amount: 2.5, unit: 'g', note: '小さじ1.5' },
                    { name: 'サラダ油', amount: 0, unit: '適量' }
                ],
                steps: [
                    'キャベツは粗みじん切りにし、ラップせず冷蔵庫で1時間水分を飛ばす',
                    '薄力粉、山芋粉、白だし、水、牛乳で生地を作り、冷蔵庫で最低30分、できれば3時間寝かせる',
                    '焼く直前に卵、キャベツ、天かす、紅しょうが、青ねぎを加え、空気を含ませるように大きくふんわり混ぜる',
                    'フライパンを200℃に熱し、サラダ油を薄くひく',
                    '生地を丸く流し入れ（直径16cm、厚さ2cmほど）、豚バラ肉を上に乗せる',
                    '触らず中火で3分半焼く',
                    '生地のフチが乾いてきたら一気にひっくり返す',
                    'フタをして弱めの中火で3分半焼く',
                    'お好み焼きソース・マヨネーズ・青のり・かつお節をトッピング'
                ],
                cookingTime: '15分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_025',
                name: 'お好み焼き（普通盛り）',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '液175g',
                ingredients: [
                    { name: 'お好み焼き粉', amount: 50, unit: 'g', note: '山芋・だし入り推奨。なければ薄力粉＋だしの素' },
                    { name: '山芋粉', amount: 2, unit: 'g' },
                    { name: 'ベーキングパウダー', amount: 2, unit: 'g' },
                    { name: '白だし', amount: 8, unit: 'g' },
                    { name: '水', amount: 30, unit: 'g' },
                    { name: '牛乳', amount: 15, unit: 'g', note: '大さじ1' },
                    { name: '卵', amount: 1, unit: '個' },
                    { name: 'キャベツ', amount: 80, unit: 'g', note: '粗みじん切り・大きめ葉2枚分' },
                    { name: '豚バラ薄切り肉', amount: 35, unit: 'g', note: '2〜3枚（30〜40g）' },
                    { name: '天かす', amount: 15, unit: 'g', note: '大さじ1' },
                    { name: '紅しょうが', amount: 5, unit: 'g', note: '小さじ1' },
                    { name: '青ねぎ', amount: 2.5, unit: 'g', note: '小さじ1（小口切り）' },
                    { name: 'サラダ油', amount: 0, unit: '適量' }
                ],
                steps: [
                    'キャベツは粗みじん切りにし、ラップせず冷蔵庫で1時間水分を飛ばす',
                    'お好み焼き粉、水、牛乳を入れて軽く混ぜ、冷蔵庫で最低30分、できれば3時間寝かせる',
                    '焼く直前に卵、キャベツ、天かす、紅しょうが、青ねぎを加える',
                    '空気を含ませるように大きくふんわり混ぜる（直前混ぜがポイント）',
                    'フライパンまたはホットプレートを200℃に熱し、サラダ油を薄くひく',
                    '生地を丸く流し入れ（直径16cm、厚さ2cmほど）、豚バラ肉を上に乗せる',
                    'そのまま触らず、中火で3分半焼く',
                    '生地のフチが乾いてきたら一気にひっくり返す（コテで押さえつけない）',
                    'フタをして弱めの中火で3分半焼く',
                    'お好み焼きソース（20g）・マヨネーズ（10g）・青のり・かつお節をトッピング'
                ],
                cookingTime: '両面弱火で4分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_026',
                name: 'シンプルホットケーキ',
                category: 'dessert',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '約2枚分・卵1個のまま',
                ingredients: [
                    { name: '薄力粉', amount: 100, unit: 'g' },
                    { name: 'ベーキングパウダー', amount: 3.75, unit: 'g', note: '小さじ3/4〜1' },
                    { name: '塩', amount: 0, unit: 'ひとつまみ' },
                    { name: '卵', amount: 1, unit: '個' },
                    { name: '砂糖', amount: 22.5, unit: 'g', note: '15〜30g' },
                    { name: '牛乳', amount: 75, unit: 'g' },
                    { name: 'サラダ油', amount: 15, unit: 'g', note: '大さじ1' },
                    { name: 'バニラオイル', amount: 0, unit: '少々' }
                ],
                steps: [
                    'ボウルに薄力粉、ベーキングパウダー、塩を入れて泡立て器で混ぜ、中央をくぼませる',
                    '別のボウルに卵を溶きほぐし、砂糖、牛乳、サラダ油、バニラオイル（あれば）の順に加えてよく混ぜる（必ず卵を溶きほぐしてから砂糖を入れること）',
                    '粉類の中央に液体を流し入れ、泡立て器で中心から円を描くように混ぜてなめらかにする（生地がかたい場合は牛乳で調整）',
                    'フライパンに薄くサラダ油をひいて温め、ぬれぶきんの上で温度を調節する',
                    '再び弱火にかけ、おたま1杯分の生地を流し入れる',
                    '弱火で3分焼き、周りに気泡ができてきたら表面が乾かないうちに裏返す',
                    '軽く押さえて厚みを均等にし、さらに3分焼く',
                    'バターをのせてシロップをかける'
                ],
                cookingTime: '20分',
                note: 'シロップ：きび砂糖75g + 水50g',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_027',
                name: 'ラーメン麺（自作）',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '強力粉', amount: 100, unit: 'g', note: '加水率35%が実用的' },
                    { name: '水', amount: 35, unit: 'g' },
                    { name: '塩', amount: 1, unit: 'g', note: '1%' },
                    { name: 'かんすい', amount: 1, unit: 'g', note: '1%' }
                ],
                steps: [
                    '材料を全て混ぜてこねる',
                    '生地をまとめて寝かせる',
                    '2mmでカットして麺にする'
                ],
                note: '加水率：低30% 中35% 高45%',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_028',
                name: '餃子の皮',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '10枚（水餃子なら5枚）',
                ingredients: [
                    { name: '強力粉', amount: 70, unit: 'g' },
                    { name: '水', amount: 24, unit: 'g' }
                ],
                steps: [
                    '強力粉と水を混ぜてこねる',
                    '小分けにして打ち粉をかける',
                    '丸めて手で押しつぶす',
                    '麺棒で上下に動かし押さえながら伸ばす',
                    '焼き時間：お湯入れて強火で4分、水を捨てて油を入れて中火で1分30秒',
                    '水餃子は3分30秒'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_029',
                name: '餃子の具',
                category: 'main',
                isStarred: true,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '総重量234g',
                note: '肉2:香味1:ダシ1:アブラ0.5、塩分量は1％の2.35g',
                ingredients: [
                    { name: '豚ひき肉', amount: 100, unit: 'g' },
                    { name: 'ニラ', amount: 25, unit: 'g' },
                    { name: '長ねぎ', amount: 25, unit: 'g' },
                    { name: 'にんにく', amount: 3, unit: 'g' },
                    { name: '生姜', amount: 3, unit: 'g' },
                    { name: '黒コショウ', amount: 0.2, unit: 'g', note: '適量（約0.2g目安）' },
                    { name: '出汁もしくは水', amount: 50, unit: 'g', note: '大さじ3' },
                    { name: 'うま味調味料', amount: 0.6, unit: 'g', note: '4振り' },
                    { name: 'オイスターソース', amount: 6, unit: 'g', note: '小さじ1' },
                    { name: '醤油', amount: 3, unit: 'g', note: '小さじ1/2' },
                    { name: '塩', amount: 1.2, unit: 'g', note: '2つまみ' },
                    { name: 'ごま油', amount: 4, unit: 'g', note: '小さじ1' },
                    { name: 'ラード', amount: 18, unit: 'g', note: '大さじ1と1/2' }
                ],
                steps: [
                    '香味野菜（ニラ、長ねぎ、にんにく、生姜）を細かく切る',
                    '豚ひき肉に調味料を加えて練る',
                    '野菜と出汁を加えてよく混ぜる',
                    '最後に油分を加えて混ぜる'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_030',
                name: '簡単な醤油ラーメンスープ',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '濃口醤油', amount: 30, unit: 'g', note: 'カエシ' },
                    { name: 'たまり醤油', amount: 4, unit: 'g', note: 'カエシ' },
                    { name: 'みりん', amount: 1, unit: 'g', note: 'カエシ' },
                    { name: '味の素', amount: 1, unit: 'g', note: 'スープ' },
                    { name: '水', amount: 280, unit: 'g', note: 'スープ' },
                    { name: '鶏皮', amount: 67, unit: 'g', note: '鶏油用' },
                    { name: 'ネギの青い部分', amount: 3, unit: 'g', note: '鶏油用' }
                ],
                steps: [
                    'カエシ（濃口醤油、たまり醤油、みりん）を混ぜる',
                    'スープ（味の素、水）を温める',
                    '鶏油を作る：鶏皮とネギを炒めて油を出す（出来高10g）',
                    'カエシ、スープ、鶏油を組み合わせる'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_031',
                name: 'トマトラーメンスープ',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: 'チョーコー醤油白だし', amount: 30, unit: 'g', note: '大さじ2（塩分4.8g）' },
                    { name: 'トマト缶', amount: 30, unit: 'g' },
                    { name: '味の素', amount: 1, unit: 'g' },
                    { name: 'お湯', amount: 280, unit: 'g' },
                    { name: 'オリーブオイル', amount: 15, unit: 'g', note: '大さじ1' },
                    { name: 'にんにく', amount: 1, unit: 'かけ' },
                    { name: 'バジルの茎', amount: 0, unit: '適量' },
                    { name: '粉チーズ', amount: 0, unit: 'お好み' }
                ],
                steps: [
                    'カエシ（白だし）を用意する',
                    'スープ（トマト缶、味の素、お湯）を温める',
                    'アブラ（オリーブオイル、にんにく、バジルの茎）を作る',
                    '組み合わせて仕上げに粉チーズをお好みで'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_032',
                name: '出汁',
                category: 'sauce',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '水', amount: 1000, unit: 'g' },
                    { name: '昆布', amount: 10, unit: 'g', note: 'もしくは椎茸10g' },
                    { name: 'かつお節', amount: 30, unit: 'g', note: '一番だし用、60g入れたら炊き出し' }
                ],
                steps: [
                    '昆布（または椎茸）を1時間ほど水につける',
                    '60度で40分煮込む（70度なら30分）',
                    'かつお節を加えて5分ほど煮込めば一番だし',
                    '魚ガラなら15-20分'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_033',
                name: 'かけつゆ（150g）',
                category: 'sauce',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '150g',
                note: '塩分濃度1.5%位',
                ingredients: [
                    { name: '出汁', amount: 150, unit: 'g' },
                    { name: '薄口醤油', amount: 5.36, unit: 'g' },
                    { name: '塩', amount: 0.45, unit: 'g' },
                    { name: '酒', amount: 7.5, unit: 'g' },
                    { name: 'みりん', amount: 3.75, unit: 'g' }
                ],
                steps: [
                    '出汁を温める',
                    '調味料を全て加えて混ぜる',
                    '味を調整する'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_034',
                name: '鶏ささみ（低温調理）',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '鶏ささみ', amount: 0, unit: '適量' }
                ],
                steps: [
                    '63℃で1時間低温調理する',
                    'シャーキーならスティック状にする',
                    '余熱で170度に熱したオーブンで40分焼く',
                    'こんがりいい色がついたら完成'
                ],
                equipment: ['低温調理器', 'オーブン'],
                cookingTime: '1時間+40分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_035',
                name: 'オーロラソース',
                category: 'sauce',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: 'マヨネーズ', amount: 10, unit: 'g' },
                    { name: 'ケチャップ', amount: 5, unit: 'g' },
                    { name: 'マスタード', amount: 5, unit: 'g' },
                    { name: 'ピクルス', amount: 15, unit: 'g' }
                ],
                steps: [
                    '材料を全て混ぜ合わせる'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_036',
                name: 'ヨーグルト',
                category: 'dessert',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '牛乳', amount: 200, unit: 'g' },
                    { name: 'ヨーグルト種菌', amount: 0, unit: '適量' }
                ],
                steps: [
                    '200gの水を入れてホットクックにセット',
                    '低温調理40℃で8時間でスタート',
                    '混ぜて冷蔵庫へ',
                    'ヨーグルト100gで継ぎ足し',
                    'カスピ海は種菌だと27度で24時間、継ぎ足しは100gで10時間'
                ],
                equipment: ['ホットクック'],
                cookingTime: '8時間',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_037',
                name: '飲むヨーグルト',
                category: 'drink',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: 'ヨーグルト', amount: 150, unit: 'g' },
                    { name: '牛乳', amount: 150, unit: 'g' },
                    { name: '砂糖', amount: 22.5, unit: 'g', note: '大さじ1.5' },
                    { name: 'レモン汁', amount: 7.5, unit: 'g', note: '大さじ0.5' }
                ],
                steps: [
                    '材料を全て混ぜ合わせる',
                    'よく撹拌して完成'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_038',
                name: 'チーズブリトー',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '小麦粉', amount: 40, unit: 'g' },
                    { name: '水', amount: 60, unit: 'g' },
                    { name: 'サラダ油', amount: 5, unit: 'g', note: '小さじ1' },
                    { name: '塩', amount: 1, unit: 'g', note: 'ひとつまみ' },
                    { name: 'チーズ', amount: 30, unit: 'g' },
                    { name: 'ハム薄いの', amount: 1, unit: '枚' },
                    { name: '砂糖', amount: 3, unit: 'g', note: '1枚あたり小さじ1' },
                    { name: 'レモン', amount: 15, unit: 'g', note: '大さじ1 10滴' }
                ],
                steps: [
                    '小麦粉、水、サラダ油、塩を混ぜて生地を作る',
                    'チーズとハムを包む',
                    'レンジ500wで1分加熱する',
                    'お好みで砂糖やレモンを添える'
                ],
                cookingTime: '1分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_039',
                name: 'クレープ',
                category: 'dessert',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '薄力粉', amount: 40, unit: 'g' },
                    { name: '牛乳', amount: 50, unit: 'g' },
                    { name: '砂糖', amount: 15, unit: 'g' },
                    { name: '卵', amount: 1, unit: '個' },
                    { name: '油', amount: 7.5, unit: 'g', note: '大さじ0.5' }
                ],
                steps: [
                    '材料を全て混ぜ合わせる',
                    'フライパンで薄く焼く',
                    'お好みの具材を包む'
                ],
                cookingTime: '10分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_040',
                name: '美味いクレープ生地',
                category: 'dessert',
                isStarred: true,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '2枚 80g',
                ingredients: [
                    { name: '薄力粉', amount: 13, unit: 'g' },
                    { name: '強力粉', amount: 13, unit: 'g' },
                    { name: '片栗粉', amount: 13, unit: 'g' },
                    { name: 'グラニュー糖', amount: 13, unit: 'g' },
                    { name: '卵', amount: 1, unit: '個' },
                    { name: '牛乳', amount: 50, unit: 'g' },
                    { name: 'バター', amount: 5, unit: 'g' }
                ],
                steps: [
                    '粉類をすべて混ぜ合わせる',
                    '卵、牛乳、溶かしバターを加える',
                    'よく混ぜてなめらかにする',
                    'フライパンで焼く'
                ],
                cookingTime: '15分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_041',
                name: 'クラッカー',
                category: 'dessert',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '天板1枚分',
                ingredients: [
                    { name: '薄力粉', amount: 100, unit: 'g' },
                    { name: '塩', amount: 2.5, unit: 'g', note: 'ふたつまみ' },
                    { name: 'オイル', amount: 30, unit: 'g', note: '大さじ2' },
                    { name: '水', amount: 30, unit: 'g', note: '大さじ2' },
                    { name: 'ベーキングパウダー', amount: 1, unit: 'g' },
                    { name: '砂糖', amount: 30, unit: 'g', note: '甘いやつは大さじ2' }
                ],
                steps: [
                    'オーブンを180℃に予熱する',
                    '材料を全て混ぜてこねる',
                    '薄く伸ばしてカットする',
                    '180℃で15分焼く'
                ],
                cookingTime: '30分',
                note: '甘いクラッカーは砂糖大さじ2、塩はひとつまみ',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_042',
                name: 'クリスピーピザ生地',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '薄力粉', amount: 75, unit: 'g' },
                    { name: '砂糖', amount: 1.25, unit: 'g' },
                    { name: '塩', amount: 0.75, unit: 'g' },
                    { name: 'ぬるま湯', amount: 35, unit: 'g' },
                    { name: 'オリーブ油', amount: 6.5, unit: 'g' }
                ],
                steps: [
                    '材料を全て混ぜてこねる',
                    '生地をまとめて休ませる',
                    '薄く伸ばしてピザソースを塗る',
                    'トッピングを乗せて焼く'
                ],
                cookingTime: '20分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_043',
                name: 'りんごのケーキ',
                category: 'dessert',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '直径18cmの丸型1台分',
                ingredients: [
                    { name: 'りんご', amount: 75, unit: 'g' },
                    { name: '砂糖（りんご用）', amount: 15, unit: 'g' },
                    { name: 'レモン汁', amount: 10, unit: 'g', note: '小さじ2' },
                    { name: '砂糖（生地用）', amount: 30, unit: 'g' },
                    { name: '薄力粉', amount: 100, unit: 'g' },
                    { name: 'バター', amount: 50, unit: 'g' },
                    { name: 'ゼラチン', amount: 1, unit: 'g', note: '40g水で溶く' }
                ],
                steps: [
                    'りんごを砂糖、レモン汁と無水で20分煮る',
                    '生地材料を混ぜ合わせる',
                    'りんごと生地を型に入れる',
                    '180度で20分焼く'
                ],
                cookingTime: '50分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_044',
                name: 'パンチェッタ',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                yield: '1kg分',
                ingredients: [
                    { name: '肉', amount: 1000, unit: 'g' },
                    { name: '塩', amount: 20, unit: 'g' },
                    { name: '砂糖', amount: 4, unit: 'g' }
                ],
                steps: [
                    '塩と砂糖をふりかけてビニール袋に入れる',
                    '一週間冷蔵庫で寝かせる',
                    '袋から出して塩分を洗い流す',
                    'ペーパータオルで水気を拭く',
                    '網の上に乗せて一週間冷蔵庫で乾燥させる'
                ],
                cookingTime: '2週間',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_045',
                name: '鶏油の取り方',
                category: 'sauce',
                isStarred: true,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '鶏皮', amount: 0, unit: '適量' },
                    { name: '塩（鶏皮の1％）', amount: 0, unit: '適量' },
                    { name: '長ネギの青い部分', amount: 0, unit: '適量' },
                    { name: '片栗粉（出がらし鶏皮1gに対して）', amount: 0.39, unit: 'g' }
                ],
                steps: [
                    '鶏皮の1％の塩を降って10分放置',
                    '50度のお湯で洗って水分をペーパータオルで取る',
                    '長ネギの青い部分を入れて低温調理器で75度で2時間',
                    '一度冷蔵庫で冷やして固まらせる',
                    '底にある水分を抜く',
                    '出がらし鶏皮1gに対して片栗粉0.39gでまぶす',
                    '200度予熱で15分焼く'
                ],
                equipment: ['低温調理器'],
                cookingTime: '2時間+15分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_046',
                name: '鶏出汁の取り方',
                category: 'sauce',
                isStarred: true,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '胸肉のミンチ', amount: 500, unit: 'g' },
                    { name: '水', amount: 1500, unit: 'g' },
                    { name: '昆布', amount: 15, unit: 'g' },
                    { name: '塩（ミンチに対して1％）', amount: 5, unit: 'g' }
                ],
                steps: [
                    '鶏胸ミンチに塩をし約10分マリネする',
                    '鍋に鶏ミンチを入れ、冷たいミネラルウォーターを少しづつ入れミンチになじませる',
                    '加熱し90℃まで温度をあげる（60℃までは木べらで底を混ぜる）',
                    '90℃に達したらごく弱火にし約30分キープしシノワで濾す',
                    '熱々の越した出汁に昆布を入れて冷めたら完成',
                    '2番出汁は半量の水で同じ時間煮出す'
                ],
                cookingTime: '1時間',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_047',
                name: '塩ラーメンスープの黄金比',
                category: 'main',
                isStarred: true,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: 'スープ', amount: 360, unit: 'g' },
                    { name: '鮎の魚醤', amount: 7, unit: 'g' },
                    { name: '太白ごま油', amount: 15, unit: 'g' },
                    { name: '白髪ネギ', amount: 10, unit: 'g' }
                ],
                steps: [
                    'スープを温める',
                    '鮎の魚醤を加える',
                    '太白ごま油を加える',
                    '白髪ネギをトッピング'
                ],
                cookingTime: '5分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_048',
                name: 'ラーメンベース',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '水', amount: 300, unit: 'g', note: '醤油豚骨なら100g、豚骨なら150g豆乳に変える' },
                    { name: 'ガラ', amount: 5, unit: 'g', note: '小さじ1（豚骨醤油は1、豚骨は2）' },
                    { name: '醤油', amount: 30, unit: 'g', note: '大さじ2（豚骨醤油のみ）' },
                    { name: 'オイスターソース', amount: 10, unit: 'g', note: '小さじ2' },
                    { name: '酒かみりん', amount: 30, unit: 'g', note: '大さじ2（豚骨のみ）' },
                    { name: '砂糖', amount: 2.5, unit: 'g', note: '小さじ1/2' },
                    { name: 'ラード', amount: 30, unit: 'g', note: '大さじ2' },
                    { name: 'おろしにんにく', amount: 0, unit: 'ひと欠片' }
                ],
                steps: [
                    '水またはスープベースを温める',
                    '調味料を順番に加える',
                    'よく混ぜ合わせる'
                ],
                cookingTime: '10分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_049',
                name: '半とんこつラーメン',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '水', amount: 100, unit: 'g' },
                    { name: '豆乳', amount: 50, unit: 'g' },
                    { name: 'ガラ', amount: 2.5, unit: 'g', note: '小さじ1/2' },
                    { name: 'オイスターソース', amount: 5, unit: 'g', note: '小さじ1' },
                    { name: 'みりん', amount: 15, unit: 'g', note: '大さじ1' },
                    { name: '砂糖', amount: 1, unit: 'g', note: 'ひとつまみ' },
                    { name: 'ラードとごま油', amount: 15, unit: 'g', note: '合わせて大さじ1' },
                    { name: 'おろしにんにく', amount: 0, unit: 'ひと欠片' }
                ],
                steps: [
                    '水と豆乳を混ぜて温める',
                    '調味料を順番に加える',
                    'よく混ぜ合わせる'
                ],
                cookingTime: '10分',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_050',
                name: '冷やし中華醤油ダレ',
                category: 'sauce',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '醤油', amount: 15, unit: 'g', note: '大さじ1' },
                    { name: '酢', amount: 15, unit: 'g', note: '大さじ1' },
                    { name: '砂糖', amount: 10, unit: 'g', note: '小さじ2' },
                    { name: 'ごま油', amount: 10, unit: 'g', note: '小さじ2' },
                    { name: 'ハイミー', amount: 2.5, unit: 'g', note: '小さじ1/2' }
                ],
                steps: [
                    '材料を全て混ぜ合わせる',
                    '冷やし中華の麺にかける'
                ],
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
                ]
            },
            {
                id: 'recipe_051',
                name: '16cmのフライパンでつくるピザ生地',
                category: 'main',
                isStarred: false,
                createdAt: '2025-08-10',
                updatedAt: '2025-08-10',
                servings: 1,
                ingredients: [
                    { name: '強力粉', amount: 80, unit: 'g' },
                    { name: '水', amount: 50, unit: 'g' },
                    { name: 'イースト菌', amount: 0.8, unit: 'g' },
                    { name: 'オリーブオイル', amount: 1.6, unit: 'g' },
                    { name: '砂糖', amount: 0.2, unit: 'g' },
                    { name: '塩', amount: 2.1, unit: 'g' },
                    { name: 'トマト缶', amount: 50, unit: 'g' }
                ],
                steps: [
                    '材料を混ぜてこねる',
                    '発酵させる',
                    'フライパンサイズに伸ばす',
                    'トマトソースを塗ってトッピングを乗せる',
                    'フライパンで焼く'
                ],
                cookingTime: '30分（発酵含む）',
                versions: [
                    { version: '1.0', date: '2025-08-10', changes: '初版作成' }
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

        const htg = this.recipes.map(recipe => {
            const starIcon = recipe.isStarred ? '⭐' : '☆';
            const ingredientsSummary = recipe.ingredients.slice(0, 3).map(ing => {
                let amountText = '';
                if (ing.amount > 0) {
                    amountText = `${ing.amount}${ing.unit}`;
                } else {
                    amountText = ing.unit;
                }
                return `${ing.name} ${amountText}`;
            }).join('、');
            
            return `
                <div class="recipe-item" data-id="${recipe.id}" onclick="app.viewRecipe('${recipe.id}')" style="cursor: pointer;">
                    <div class="recipe-header">
                        <h3 class="recipe-title">${recipe.name}</h3>
                        <button class="star-button" onclick="event.stopPropagation(); app.toggleStar('${recipe.id}')">${starIcon}</button>
                    </div>
                    <div class="recipe-meta">
                        <span class="recipe-servings">${recipe.servings}人前</span>
                        <span class="recipe-date">${recipe.updatedAt}</span>
                    </div>
                    <div class="recipe-ingredients">
                        ${ingredientsSummary}${recipe.ingredients.length > 3 ? ' など...' : ''}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = htg;
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

        const htg = ingredients.map(ing => {
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

        container.innerHTML = htg;
    }

    renderSteps(steps, portion = 1) {
        const container = document.getElementById('steps-list');
        if (!container) return;

        const htg = steps.map((step, index) => {
            // 手順内の数値を分量に応じて調整
            let adjustedStep = this.adjustStepPortions(step, portion);
            
            return `
                <div class="step-item">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-text">${adjustedStep}</div>
                </div>
            `;
        }).join('');

        container.innerHTML = htg;
    }

    adjustStepPortions(step, portion) {
        if (portion === 1) return step;
        
        // 正規表現で数値+単位のパターンを検出して調整
        return step.replace(/(\d+(?:\.\d+)?)\s*(g|g|L|kg|個|枚|本|かけ|杯)/g, (match, number, unit) => {
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

        const htg = versions.map(version => {
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

        container.innerHTML = htg;
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