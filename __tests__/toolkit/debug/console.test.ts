import AsyncStorage from "expo-sqlite/kv-store";
import { logToConsole, getLogsFromStorage } from "@/toolkit/debug/console";
import { Logs } from "@/types/logs";
import { ShowToast } from "@/toolkit/android";
import StoredItemNames from "@/constants/stored_item_names";

jest.mock("expo-sqlite/kv-store", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock("react-native", () => ({
    Platform: {
        OS: "android",
    },
}));

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<
    typeof AsyncStorage.getItem
>;
const mockShowToast = ShowToast as jest.MockedFunction<typeof ShowToast>;

const sampleLogs: Logs = [
    {
        message: "hello chat",
        type: "log",
        timestamp: 1620000000000,
        traceback: {
            location: "@/somewhere.ts",
            function: "something()",
            isHandler: false,
        },
    },
    {
        message: "error: 404",
        type: "error",
        timestamp: 1620000000001,
        traceback: {
            location: "@/someplace/somewhereElse.ts",
            function: "somethingFailing()",
            isHandler: true,
            handlerName: "handleSomeChange()",
        },
    },
];

describe("logToConsole Toolkit", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getLogsFromStorage", () => {
        // it should fetch objectives
        test("should return logs from AsyncStorage", async () => {
            mockGetItem.mockResolvedValueOnce(JSON.stringify(sampleLogs));

            const logs = await getLogsFromStorage();

            expect(logs).toEqual(sampleLogs);
            expect(AsyncStorage.getItem).toHaveBeenCalledWith("globalLogs");
        });

        // upon empty logs, empty array
        test("should return an empty array if there are no logs", async () => {
            mockGetItem.mockResolvedValueOnce(null);

            const logs = await getLogsFromStorage();

            expect(logs).toEqual([]);
            expect(AsyncStorage.getItem).toHaveBeenCalledWith("globalLogs");
        });

        // upon error, empty array also
        test("should return an empty array if there is an error", async () => {
            mockGetItem.mockRejectedValueOnce(new Error("AsyncStorage error"));

            const logs = getLogsFromStorage();

            expect(logs).toEqual([]);
            expect(AsyncStorage.getItemSync).toHaveBeenCalledWith(
                StoredItemNames.consoleLogs,
            );
        });
    });

    describe("logToConsole", () => {
        // these tests are all the same, it waits for console.* to be called with the same args that were passed to logToConsole. if that happens, it means it works.
        // on error / log with displayToEndUser=true, does the same with ToastAndroid
        // expect one console.error() warning by JEST when testing error logs, it is normal.
        test("should log a message with 'log' type", () => {
            const consoleLogSpy = jest
                .spyOn(console, "log")
                .mockImplementation();
            logToConsole("hi", "log");

            expect(consoleLogSpy).toHaveBeenCalledWith("hi");
            consoleLogSpy.mockRestore();
        });

        test("should log a message with 'warn' type", () => {
            const consoleWarnSpy = jest
                .spyOn(console, "warn")
                .mockImplementation();
            logToConsole("Warning: hi", "warn");

            expect(consoleWarnSpy).toHaveBeenCalledWith("Warning: hi");
            consoleWarnSpy.mockRestore();
        });

        test("should log a message with 'success' type", () => {
            const consoleLogSpy = jest
                .spyOn(console, "log")
                .mockImplementation();
            logToConsole("it works :D", "success");

            expect(consoleLogSpy).toHaveBeenCalledWith("it works :D");
            consoleLogSpy.mockRestore();
        });

        test("should log a message and display a toast if displayToEndUser is true", () => {
            const consoleLogSpy = jest
                .spyOn(console, "log")
                .mockImplementation();
            logToConsole("this is a toast", "log", undefined, true);

            expect(consoleLogSpy).toHaveBeenCalledWith("this is a toast");
            expect(mockShowToast).toHaveBeenCalledWith("this is a toast");
            consoleLogSpy.mockRestore();
        });
    });
});
