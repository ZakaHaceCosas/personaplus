// DeveloperInterface.tsx
// Página que muestra ciertos logs de la consola para ayudar al desarrollador

import * as React from "react";
import * as Native from "react-native";
import * as Router from "expo-router";
import BottomNav from "@/components/BottomNav";
import BetterText from "@/components/BetterText";
import GapView from "@/components/GapView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/Buttons";
import { version as ReactVersion } from "react";
import { version as PersonaPlusVersion } from "@/package.json";
import * as ObjectiveToolkit from "@/components/toolkit/objectives";
import { isDevelopmentBuild } from "expo-dev-client";
import * as FileSystem from "expo-file-system";

// TypeScript, supongo
import { Objective } from "@/components/types/Objective";

const styles = Native.StyleSheet.create({
    consoleview: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f0f0f0",
        width: "100%",
        height: "100%",
    },
    mainview: {
        padding: 20,
        flex: 1,
        flexDirection: "column",
        overflow: "scroll",
    },
    logText: {
        marginBottom: 5,
    },
    log: {
        color: "#000000",
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: "#000000",
    },
    success: {
        color: "#28a745",
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: "#28a745",
    },
    warn: {
        color: "#ff9900",
        paddingLeft: 10,
        borderLeftWidth: 4,
        borderLeftColor: "#ff9900",
    },
    error: {
        color: "#ff0000",
        paddingLeft: 10,
        borderLeftWidth: 6,
        borderLeftColor: "#ff0000",
    },
    containerview: {
        width: "100%",
        height: "100%",
    },
});

interface Log {
    message: string;
    type: "log" | "warn" | "error" | "success";
    timestamp: number;
}

// Función para obtener logs desde AsyncStorage
const getLogsFromStorage = async (): Promise<Log[]> => {
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

// Función para guardar logs en AsyncStorage
const saveLogsToStorage = async (logs: Log[]) => {
    try {
        await AsyncStorage.setItem("globalLogs", JSON.stringify(logs));
    } catch (e) {
        termLog("Error saving logs to AsyncStorage: " + e, "error");
    }
};

const addLogToGlobal = async (log: Log) => {
    try {
        const currentLogs = await getLogsFromStorage();
        const updatedLogs = [...currentLogs, log];
        await saveLogsToStorage(updatedLogs);
    } catch (e) {
        termLog("Error adding log to AsyncStorage: " + e, "error");
    }
};

export const termLog = (
    message: string,
    type: "log" | "warn" | "error" | "success" = "log"
) => {
    console.log(message);
    const timestamp = Date.now();
    const newLog: Log = { message: message, type, timestamp };
    addLogToGlobal(newLog);
};

export default function DeveloperInterface() {
    const [logs, setLogs] = React.useState<Log[]>([]);

    React.useEffect(() => {
        const fetchLogs = async () => {
            const fetchedLogs = await getLogsFromStorage();
            setLogs(fetchedLogs);
        };

        const updateLogs = async (newLog: Log) => {
            setLogs(prevLogs => [...prevLogs, newLog]);
            await addLogToGlobal(newLog);
        };

        const originalConsoleLog = console.log;
        const originalConsoleWarn = console.warn;
        const originalConsoleError = console.error;

        console.log = (message: string, ...optionalParams: unknown[]) => {
            const newLog: Log = {
                message: message.toString(),
                type: "log",
                timestamp: Date.now(),
            };
            updateLogs(newLog);
            originalConsoleLog(message, ...optionalParams);
        };

        console.warn = (message: string, ...optionalParams: unknown[]) => {
            const newLog: Log = {
                message: message.toString(),
                type: "warn",
                timestamp: Date.now(),
            };
            updateLogs(newLog);
            originalConsoleWarn(message, ...optionalParams);
        };

        console.error = (message: string, ...optionalParams: unknown[]) => {
            const newLog: Log = {
                message: message.toString(),
                type: "error",
                timestamp: Date.now(),
            };
            updateLogs(newLog);
            originalConsoleError(message, ...optionalParams);
        };

        // Fetch logs on component mount
        fetchLogs();

        return () => {
            console.log = originalConsoleLog;
            console.warn = originalConsoleWarn;
            console.error = originalConsoleError;
        };
    }, []);

    const [objs, setObjs] = React.useState<{ [key: string]: Objective } | null>(
        null
    );

    React.useEffect(() => {
        const fetchObjectives = async () => {
            try {
                const objectives =
                    await ObjectiveToolkit.fetchObjectives("string");
                setObjs(JSON.parse(objectives));
            } catch (e) {
                const log = `Could not get objectives fetched due to error: ${e}`;
                termLog(log, "error");
            }
        };

        fetchObjectives();
    }, []);

    const currentPage: string = Router.usePathname();

    const devFunctionToClearAll = async () => {
        try {
            await AsyncStorage.multiRemove([
                "useDevTools",
                "hasLaunched",
                "age",
                "gender",
                "height",
                "weight",
                "focuspoint",
                "username",
                "sleep",
            ]);
            await AsyncStorage.setItem("objectives", JSON.stringify([]));
            Router.router.navigate("/");
            termLog("DEV CLEARED ALL", "log");
        } catch (e) {
            termLog(String(e), "error");
        }
    };

    const devFunctionToGenerateLogs = async (logs: Log[]) => {
        const logText = logs
            .map(log => {
                const date = new Date(log.timestamp);
                return `[${date.toDateString()} ${date.toLocaleTimeString()}] (${log.type.toUpperCase()}) ${log.message}`;
            })
            .join("\n");

        const fileUri = FileSystem.documentDirectory + "logs.personaplus.txt";

        try {
            await FileSystem.writeAsStringAsync(fileUri, logText);
            console.log("Archivo guardado en:", fileUri);
            return fileUri;
        } catch (error) {
            console.error("Error al guardar el archivo:", error);
        }
    };

    const handleDevFunctionToGenerateLogs = async () => {
        try {
            const fileUri = await devFunctionToGenerateLogs(logs);
            if (fileUri) {
                Native.Alert.alert("Success", `File saved on: ${fileUri}`);
            }
        } catch (e) {
            Native.Alert.alert(
                "Error",
                "There was an error savin the file: " + e
            );
        }
    };

    const clelog = async () => {
        try {
            await AsyncStorage.setItem("globalLogs", "");
            Router.router.navigate("/DeveloperInterface");
        } catch (e) {
            termLog(String(e), "error");
        }
    };

    const devFunctionToClearGlobalLogs = () => {
        Native.Alert.prompt(
            "Are you sure?",
            "Logs are very useful in the case you get an error, specially now that the app is still in a testing version. However, for privacy, we do allow to remove them. Do it at your own will.",
            [
                {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: "Go ahead",
                    onPress: clelog,
                    style: "destructive",
                },
            ]
        );
    };

    const [everything, setEverything] = React.useState<object | null>(null);

    React.useEffect(() => {
        const fetchAll = async () => {
            try {
                const e = await AsyncStorage.multiGet([
                    "useDevTools",
                    "hasLaunched",
                    "age",
                    "gender",
                    "height",
                    "weight",
                    "focuspoint",
                    "username",
                    "sleep",
                ]);
                setEverything(e);
            } catch (e) {
                termLog("Error fetching all" + e, "error");
            }
        };

        fetchAll();
    }, []);

    return (
        <Native.View style={styles.containerview}>
            <BottomNav currentLocation={currentPage} />
            <Native.ScrollView style={styles.mainview}>
                <GapView height={20} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={35}
                >
                    Dev interface
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="Italic"
                    fontSize={15}
                >
                    {isDevelopmentBuild() === true
                        ? "Using Development Build"
                        : "Using a standard release"}
                </BetterText>
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={20}>
                    Options
                </BetterText>
                <GapView height={5} />
                <Button
                    action={() => Router.router.navigate("/WelcomeScreen")}
                    buttonText="Go to Welcome Screen"
                    style="ACE"
                />
                <GapView height={5} />
                <Button
                    action={() => Router.router.navigate("/openhealthtest")}
                    buttonText="Go to Open Health test page"
                    style="ACE"
                />
                <GapView height={5} />
                <Button
                    action={ObjectiveToolkit.clearObjectives}
                    buttonText="CLEAR OBJECTIVES"
                    style="HMM"
                />
                <GapView height={5} />
                <Button
                    action={devFunctionToClearAll}
                    buttonText="CLEAR ALL (Reset app, basically)"
                    style="WOR"
                />
                <GapView height={5} />
                <Button
                    action={devFunctionToClearGlobalLogs}
                    buttonText="CLEAR LOGS"
                    style="WOR"
                />
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={20}>
                    Objectives JSON
                </BetterText>
                <GapView height={5} />
                <Native.View style={styles.consoleview}>
                    <BetterText
                        fontWeight="Regular"
                        textColor="#000"
                        textAlign="normal"
                        fontSize={15}
                    >
                        {JSON.stringify(objs)}
                    </BetterText>
                </Native.View>
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={20}>
                    All AsyncStorage items
                </BetterText>
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={15}>
                    item,value,otheritem,otheritemvalue...
                </BetterText>
                <GapView height={5} />
                <Native.View style={styles.consoleview}>
                    <BetterText
                        fontWeight="Regular"
                        textColor="#000"
                        textAlign="normal"
                        fontSize={15}
                    >
                        {String(everything)}
                    </BetterText>
                </Native.View>
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={20}>
                    Logs
                </BetterText>
                <Button
                    style="GOD"
                    buttonText="EXPORT LOGS TO FILE"
                    action={handleDevFunctionToGenerateLogs}
                />
                <GapView height={5} />
                <Native.View style={styles.consoleview}>
                    {logs.map((log, index) => (
                        <Native.Text
                            key={index}
                            style={[styles.logText, styles[log.type]]}
                        >
                            [{new Date(log.timestamp).toDateString()}{" "}
                            {new Date(log.timestamp).toLocaleTimeString()}] (
                            {log.type.toUpperCase()}) {log.message}{" "}
                        </Native.Text>
                    ))}
                </Native.View>
                <GapView height={10} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={12}>
                    Running React Native v{ReactVersion} and PersonaPlus v
                    {PersonaPlusVersion}
                </BetterText>
                <GapView height={80} />
            </Native.ScrollView>
        </Native.View>
    );
}
