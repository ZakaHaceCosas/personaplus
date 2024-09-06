import AsyncStorage from "@react-native-async-storage/async-storage";
import { Log } from "@/types/Logs";
import { Platform, ToastAndroid } from "react-native";

// Función para obtener logs desde AsyncStorage
/**
 * Returns logs saved on the AsyncStorage.
 *
 * @async
 * @returns {Promise<Log[]>} A Log array (`Log[]`)
 */
export const getLogsFromStorage = async (): Promise<Log[]> => {
    try {
        const logsString = await AsyncStorage.getItem("globalLogs");
        if (logsString) {
            try {
                return JSON.parse(logsString) || [];
            } catch (e) {
                logToConsole("Error parsing logs from AsyncStorage: " + e, "error");
                return [];
            }
        }
        return [];
    } catch (e) {
        logToConsole("Error accessing logs from AsyncStorage: " + e, "error");
        return [];
    }
};

/**
 * Saves a given array of Logs (`Log[]`) to the AsyncStorage.
 *
 * @async
 * @param {Log[]} logs An array of logs
 * @returns {0 | 1} 0 if success, 1 if failure.
 */
const saveLogsToStorage = async (logs: Log[]): Promise<0 | 1> => {
    try {
        await AsyncStorage.setItem("globalLogs", JSON.stringify(logs));
        return 0
    } catch (e) {
        logToConsole("Error saving logs to AsyncStorage: " + e, "error");
        return 1
    }
};

/**
 * Securely updates logs in the AsyncStorage. ("securely" means if you used the `saveLogsToStorage()` function directly it would overwrite the file, while this one will keep the past logs).
 *
 * @async
 * @param {Log} log The log to be added.
 * @returns {0 | 1} 0 if success, 1 if failure.
 */
const addLogToGlobal = async (log: Log): Promise<0 | 1> => {
    try {
        const currentLogs = await getLogsFromStorage();
        const updatedLogs = [...currentLogs, log];
        await saveLogsToStorage(updatedLogs);
        return 0
    } catch (e) {
        logToConsole("Error adding log to AsyncStorage: " + e, "error");
        return 1
    }
};

/**
 * Logs stuff. Generates a standard `console.log` AND also saves the log to an app-generated file (well, an AsyncStorage item that can be exported), so logs can be viewed from the production APK. And by the way, also adds a fourth "success" kind of log, on top of log, error, and warn. On the console appears as a log, but on the device appears as a cool-looking green log ;]
 *
 * @param {string} message The message to be logged
 * @param {("log" | "warn" | "error" | "success")} type The kind of message you're logging. Either a standard log, warning, error message, or success message.
 * @param {boolean} displayToEndUser Whether to show the end user the message in an Android toast message. **Note: Logs with `type` "error" will always be shown to the end user!** This is just if you want to explicitly show anything that isn't an error.
 * @returns Nothing, it just works.
 */
export const logToConsole = (
    message: string,
    type: "log" | "warn" | "error" | "success",
    displayToEndUser?: boolean
) => {
    // Regular console log / warn / error / log again because no one thought about success logs (i'm a fucking genious)
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
            console.log(message); // Not-regular console success (PersonaPlus exclusive :literallyogering:)
            break;
    }
    const timestamp = Date.now(); // Exact timestamp
    const newLog: Log = { message: message, type, timestamp }; // Generates the log
    addLogToGlobal(newLog); // Pushes it so it gets stored
    if (Platform.OS === "android" && (type === "error" || (typeof displayToEndUser !== 'undefined' && displayToEndUser === true))) {
        ToastAndroid.show(message, ToastAndroid.LONG); // Shows a toast if it's an error or if displayToEndUser is explicitly true.
    }
};
