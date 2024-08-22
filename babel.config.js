const path = require("path");

module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo", "@babel/preset-typescript"],
        plugins: [
            [
                "module-resolver",
                {
                    alias: {
                        "@": path.resolve(__dirname),
                    },
                },
            ],
        ],
    };
};
