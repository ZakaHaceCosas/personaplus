import AsyncStorage from "@react-native-async-storage/async-storage";
import { termLog, getLogsFromStorage } from "@/src/toolkit/debug/console";
import { Log } from "@/src/types/Logs";
import { ToastAndroid } from "react-native";

// mocks, AFAIK this fakes the functions we depend on so the test works
jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));
jest.mock("react-native", () => ({
    Platform: {
        OS: "android",
    },
    ToastAndroid: {
        show: jest.fn(),
    },
}));

// if this gets removed, type error happens :v
const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;

describe("termLog Toolkit", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getLogsFromStorage", () => {
        // it should fetch objectives
        test("should return logs from AsyncStorage", async () => {
            const mockLogs: Log[] = [
                { message: "hello chat", type: "log", timestamp: 1620000000000 },
                { message: "error: 404", type: "error", timestamp: 1620000000001 },
            ];

            mockGetItem.mockResolvedValueOnce(JSON.stringify(mockLogs));

            const logs = await getLogsFromStorage();

            expect(logs).toEqual(mockLogs);
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

            const logs = await getLogsFromStorage();

            expect(logs).toEqual([]);
            expect(AsyncStorage.getItem).toHaveBeenCalledWith("globalLogs");
        });
    });

    describe("termLog", () => {
        // these tests are all the same, it waits for console.* to be called with the same args that were passed to termLog. if that happens, it means it works.
        // on error / log with displayToEndUser=true, does the same with ToastAndroid
        test("should log a message with 'log' type", () => {
            const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
            termLog("hi", "log");

            expect(consoleLogSpy).toHaveBeenCalledWith("hi");
            consoleLogSpy.mockRestore();
        });

        test("should log a message with 'warn' type", () => {
            const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
            termLog("Warning: hi", "warn");

            expect(consoleWarnSpy).toHaveBeenCalledWith("Warning: hi");
            consoleWarnSpy.mockRestore();
        });

        test("should log a message with 'error' type and display a toast", () => {
            const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
            termLog("Error: yes", "error");

            expect(consoleErrorSpy).toHaveBeenCalledWith("Error: yes");
            expect(ToastAndroid.show).toHaveBeenCalledWith("Error: yes", ToastAndroid.LONG);
            consoleErrorSpy.mockRestore();
        });

        test("should log a message with 'success' type", () => {
            const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
            termLog("it works :D", "success");

            expect(consoleLogSpy).toHaveBeenCalledWith("it works :D");
            consoleLogSpy.mockRestore();
        });

        test("should log a message and display a toast if displayToEndUser is true", () => {
            const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
            termLog("this is a toast", "log", true);

            expect(consoleLogSpy).toHaveBeenCalledWith("this is a toast");
            expect(ToastAndroid.show).toHaveBeenCalledWith("this is a toast", ToastAndroid.LONG);
            consoleLogSpy.mockRestore();
        });
    });
});
