// https://docs.expo.dev/guides/using-eslint/

module.exports = {
    extends: ["expo", "prettier"],
    plugins: ["prettier"],
    // disabled prettier warnings because they're making me go crazy
    ignorePatterns: ["fknode.yaml", "**/assets/*"],
};
