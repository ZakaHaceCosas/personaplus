import AsyncStorage from "@react-native-async-storage/async-storage";
import { Log } from "@/src/types/Logs";

// Función para obtener logs desde AsyncStorage
export const getLogsFromStorage = async (): Promise<Log[]> => {
    try {
        const logsString = await AsyncStorage.getItem("globalLogs");
        if (logsString) {
            return JSON.parse(logsString);
        }
    } catch (e) {
        termLog("Error fetching logs from AsyncStorage: " + e, "error");
    }
    return [];
};

const saveLogsToStorage = async (logs: Log[]) => {
    try {
        await AsyncStorage.setItem("globalLogs", JSON.stringify(logs));
    } catch (e) {
        termLog("Error saving logs to AsyncStorage: " + e, "error");
    }
};

export const addLogToGlobal = async (log: Log) => {
    try {
        const currentLogs = await getLogsFromStorage();
        const updatedLogs = [...currentLogs, log];
        await saveLogsToStorage(updatedLogs);
    } catch (e) {
        termLog("Error adding log to AsyncStorage: " + e, "error");
    }
};

/**
 * Logs stuff. Generates a standard console.log AND also saves the log to an app-generated file (well, an AsyncStorage item that can be exported), so logs can be viewed from the production APK.
 * @param message  The message you'd like to log
 * @param type What type of message you're logging.
 */
export const termLog = (
    message: string,
    type: "log" | "warn" | "error" | "success"
) => {
    console.log(message);
    const timestamp = Date.now();
    const newLog: Log = { message: message, type, timestamp };
    addLogToGlobal(newLog);
};
