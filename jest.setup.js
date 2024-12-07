/* eslint-env jest */

jest.mock(
    "expo-sqlite/kv-store",
    () => require("expo-sqlite/kv-store/jest/kv-store-mock"), // idk if it even exists but okay
);
