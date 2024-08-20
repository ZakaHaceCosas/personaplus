/** @type {import('jest').Config} */
const config = {
    preset: "react-native",
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
    transformIgnorePatterns: [
        // i wont even try to claim i know whats going on in here
        // i just want it to work :sob:
        "node_modules/(?!(@react-native|react-native|expo|@expo|@unimodules)/)",
    ],
};

module.exports = config;
