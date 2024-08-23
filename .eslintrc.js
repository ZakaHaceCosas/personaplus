// https://docs.expo.dev/guides/using-eslint/
module.exports = {
    extends: [
        "expo",
        "prettier",
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint", "prettier"],
    rules: {
        "@typescript-eslint/ban-types": "error",
        "space-infix-ops": ["error", { int32Hint: false }],
    },
};
