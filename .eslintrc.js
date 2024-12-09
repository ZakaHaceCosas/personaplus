// https://docs.expo.dev/guides/using-eslint/
module.exports = {
    extends: ["expo", "prettier"],
    plugins: ["prettier"],
    rules: {
        "prettier/prettier": [
            "warn",
            {
                endOfLine: "crlf",
                trailingComma: "all",
                semi: true,
                tabWidth: 4,
                singleQuote: false,
                arrowParens: "always",
                jsxSingleQuote: false,
                useTabs: false,
                parser: "typescript",
                bracketSameLine: false,
                bracketSpacing: true,
                printWidth: 80,
            },
        ],
    },
};
