export default [
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                console: "readonly",
                localStorage: "readonly",
                fetch: "readonly",
                alert: "readonly",
                confirm: "readonly",
                history: "readonly",
                navigator: "readonly",
                URLSearchParams: "readonly",
                URL: "readonly",
                FileReader: "readonly",
                Blob: "readonly"
            }
        },
        rules: {
            "no-unused-vars": ["warn", { "args": "none", "ignoreRestSiblings": true }],
            "no-undef": "error",
            "semi": ["error", "always"],
            "quotes": ["warn", "single", { "allowTemplateLiterals": true, "avoidEscape": true }],
            "no-console": "off"
        }
    }
];