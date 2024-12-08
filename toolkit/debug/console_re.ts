import AsyncStorage from "expo-sqlite/kv-store";
import { Log, LogTraceback } from "@/types/logs_re";
import StoredItemNames from "@/constants/stored_item_names";
import { ShowToast } from "../android_re";

/**
 * Returns logs saved on the AsyncStorage.
 *
 * @returns {Log[]} A Log array (`Log[]`)
 */
export function getLogsFromStorage(): Log[] {
    try {
        const logsString: string | null = AsyncStorage.getItemSync(
            StoredItemNames.consoleLogs,
        );
        if (!logsString) return [];
        try {
            const parsedLogs = JSON.parse(logsString);
            if (Array.isArray(parsedLogs)) {
                return parsedLogs;
            } else {
                return [];
            }
        } catch (e) {
            logToConsole(
                "Error parsing logs from AsyncStorage: " + e,
                "error",
                {
                    location: "toolkit/debug/console",
                    function: "getLogsFromStorage()",
                    isHandler: false,
                },
            );
            return [];
        }
    } catch (e) {
        console.error("Error accessing logs from AsyncStorage: " + e, "error", {
            location: "toolkit/debug/console",
            function: "getLogsFromStorage()",
            isHandler: false,
        });
        return [];
    }
}

/**
 * Saves a given array of Logs (`Log[]`) to the AsyncStorage.
 *
 * @param {Log[]} logs An array of logs
 * @returns {0 | 1} 0 if success, 1 if failure.
 */
function saveLogsToStorage(logs: Log[]): 0 | 1 {
    try {
        AsyncStorage.setItemSync(
            StoredItemNames.consoleLogs,
            JSON.stringify(logs),
        );
        return 0;
    } catch (e) {
        console.error(
            "Error saving logs to AsyncStorage: " + e,
            "error",
            undefined,
        );
        return 1;
    }
}

/**
 * Securely updates logs in the AsyncStorage. ("securely" means if you used the `saveLogsToStorage()` function directly it would overwrite the file, while this one will keep the past logs).
 *
 * @param {Log} log The log to be added.
 * @returns {0 | 1} 0 if success, 1 if failure.
 */
function addLogToGlobal(log: Log): 0 | 1 {
    try {
        const currentLogs: Log[] = getLogsFromStorage();
        const updatedLogs: Log[] = [...currentLogs, log];
        saveLogsToStorage(updatedLogs);
        return 0;
    } catch (e) {
        console.error(
            "Error adding log to AsyncStorage: " + e,
            "error",
            undefined,
        );
        return 1;
    }
}

/**
 * Logs stuff to the console in a more advanced way and saves it so it can be viewed from the app. It is mandatory to use this except for debug logs you don't want to be saved.
 *
 * @param {string} message The message to be logged
 * @param {("log" | "warn" | "error" | "success")} type The kind of message you're logging. Either a standard log, warning, error message, or success message.
 * @param {?LogTraceback} traceback A traceback. Specify the file location, the function name, and whether it is a main function or a handler function inside of it.
 * @param {boolean} displayToEndUser Whether to show the end user the message in an Android toast message. **Note: Logs with `type` "error" will be shown to the end user by default!** This is just if you want to explicitly show anything that isn't an error.
 * @returns Nothing, it just works.
 */
export function logToConsole(
    message: string,
    type: "log" | "warn" | "error" | "success",
    traceback?: LogTraceback,
    displayToEndUser?: boolean,
): void {
    try {
        // Regular console log / warn / error / log again because no one thought about success logs (i'm a fucking genius)
        switch (type) {
            default:
            case "log":
                console.log(message); // Regular console log (AKA default)
                break;
            case "warn":
                console.warn(message); // Regular console warn
                break;
            case "error":
                console.error(message); // Regular console error
                break;
            case "success":
                console.log(message); // Not-regular console success (PersonaPlus exclusive :mrBeast:)
                break;
        }
        const timestamp: number = Date.now(); // Exact timestamp
        const newLog: Log = {
            message: message,
            type,
            timestamp,
            traceback,
        }; // Generates the log

        addLogToGlobal(newLog); // Pushes it so it gets stored

        if (displayToEndUser !== undefined && displayToEndUser === true) {
            ShowToast(message); // Shows a toast if the dev wants to.
        }
    } catch (e) {
        console.error("Error with logging:", e);
    }
}
