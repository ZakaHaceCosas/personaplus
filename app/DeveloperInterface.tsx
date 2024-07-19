// DeveloperInterface.tsx
// Página que muestra ciertos logs de la consola para ayudar al desarrollador

import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    View,
    Text,
    Platform,
    ToastAndroid,
} from "react-native";
import BottomNav from "@/src/BottomNav";
import BetterText from "@/src/BetterText";
import GapView from "@/src/GapView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/src/Buttons";
import { version as ReactVersion } from "react";
import { version as PersonaPlusVersion } from "@/package.json";
import { isDevelopmentBuild } from "expo-dev-client";
import { clearObjectives, fetchObjectives } from "@/src/toolkit/objectives";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { usePathname, router } from "expo-router";
import { useTranslation } from "react-i18next";

// TypeScript, supongo
import { Objective } from "@/src/types/Objective";

const styles = StyleSheet.create({
    consoleview: {
        flex: 1,
        padding: 10,
        backgroundColor: "#000",
        width: "100%",
        height: "100%",
        borderRadius: 5,
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
        color: "#FFFFFF",
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: "#FFFFFF",
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
    type: "log" | "warn" | "error" | "success"
) => {
    console.log(message);
    const timestamp = Date.now();
    const newLog: Log = { message: message, type, timestamp };
    addLogToGlobal(newLog);
};

export default function DeveloperInterface() {
    const { t } = useTranslation();
    const [logs, setLogs] = useState<Log[]>([]);

    useEffect(() => {
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

    const [objs, setObjs] = useState<{ [key: string]: Objective } | null>(null);

    useEffect(() => {
        const handleFetchObjectives = async () => {
            try {
                const objectives = await fetchObjectives("string");
                setObjs(JSON.parse(objectives));
            } catch (e) {
                const log = `Could not get objectives fetched due to error: ${e}`;
                termLog(log, "error");
            }
        };

        handleFetchObjectives();
    }, []);

    const currentPage: string = usePathname();

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
            termLog("DEV CLEARED ALL", "log");
        } catch (e) {
            termLog(String(e), "error");
            if (Platform.OS === "android") {
                ToastAndroid.show(
                    `${t("globals.react_error")} - ${e}`,
                    ToastAndroid.LONG
                );
            }
        } finally {
            router.navigate("/");
        }
    };

    const devFunctionToGenerateLogs = async (logs: Log[]) => {
        const logText = logs
            .map(log => {
                const date = new Date(log.timestamp);
                return `[${date.toDateString()} ${date.toLocaleTimeString()}] (${log.type.toUpperCase()}) ${log.message}`;
            })
            .join("\n");

        const fileUri = FileSystem.cacheDirectory + "logs.txt";

        try {
            await FileSystem.writeAsStringAsync(fileUri, logText);

            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                termLog(
                    "No permission for saving stuff to Downloads folder",
                    "warn"
                );
                return;
            }

            const asset = await MediaLibrary.createAssetAsync(fileUri);
            const album = await MediaLibrary.getAlbumAsync("Download");
            if (album == null) {
                await MediaLibrary.createAlbumAsync("Download", asset, false);
            } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }

            termLog("Logs filed to downloads folder: " + asset.uri, "success");
            return asset.uri;
        } catch (e) {
            termLog("Error al guardar el archivo: " + e, "error");
            throw e;
        }
    };

    const handleDevFunctionToGenerateLogs = async (logs: Log[]) => {
        try {
            const fileUri = await devFunctionToGenerateLogs(logs);
            if (fileUri) {
                Alert.alert("Success", `File saved on: ${fileUri}`);
            }
        } catch (e) {
            Alert.alert("Error", "There was an error saving the file: " + e);
        }
    };

    const clearLog = async () => {
        try {
            await AsyncStorage.setItem("globalLogs", "");
            termLog("Cleared logs.", "log");
            router.navigate("/Profile");
        } catch (e) {
            termLog(String(e), "error");
        }
    };

    const devFunctionToClearGlobalLogs = () => {
        Alert.alert(
            "Are you sure?",
            "Logs are very useful in case you get an error, especially now that the app is still in a testing version. However, for privacy, we do allow removing them. Do it at your own will.",
            [
                {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: "Go ahead",
                    onPress: clearLog,
                    style: "destructive",
                },
            ]
        );
    };

    const [everything, setEverything] = useState<object | null>(null);

    useEffect(() => {
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
        <View style={styles.containerview}>
            <BottomNav currentLocation={currentPage} />
            <ScrollView style={styles.mainview}>
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
                        ? t("dev_interface.is_development_build.true")
                        : t("dev_interface.is_development_build.false")}
                </BetterText>
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={20}>
                    {t("globals.options")}
                </BetterText>
                <GapView height={5} />
                <Button
                    action={() => router.navigate("/WelcomeScreen")}
                    buttonText={t("globals.go_to_place", {
                        place: "Welcome Screen",
                    })}
                    style="ACE"
                />
                <GapView height={5} />
                <Button
                    action={() => router.navigate("/openhealthtest")}
                    buttonText={t("globals.go_to_place", {
                        place: "OpenHealthJS Testing",
                    })}
                    style="ACE"
                />
                <GapView height={5} />
                <Button
                    action={clearObjectives}
                    buttonText={t("dev_interface.clear.objectives")}
                    style="HMM"
                />
                <GapView height={5} />
                <Button
                    action={devFunctionToClearGlobalLogs}
                    buttonText={t("dev_interface.clear.logs")}
                    style="WOR"
                />
                <GapView height={20} />
                <Button
                    action={devFunctionToClearAll}
                    buttonText={t("dev_interface.clear.all")}
                    style="WOR"
                />
                <GapView height={5} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={20}>
                    {t("dev_interface.objectives_object")}
                </BetterText>
                <GapView height={5} />
                <View style={styles.consoleview}>
                    <BetterText
                        fontWeight="Regular"
                        textAlign="normal"
                        fontSize={15}
                    >
                        {JSON.stringify(objs)}
                    </BetterText>
                </View>
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={20}>
                    {t("dev_interface.all_asyncstorage_items")}
                </BetterText>
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={15}>
                    item,value,otheritem,otheritemvalue...
                </BetterText>
                <GapView height={5} />
                <View style={styles.consoleview}>
                    <BetterText
                        fontWeight="Regular"
                        textAlign="normal"
                        fontSize={15}
                    >
                        {String(everything)}
                    </BetterText>
                </View>
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={20}>
                    {t("dev_interface.logs.logs")}
                </BetterText>
                <Button
                    style="GOD"
                    buttonText={t("dev_interface.logs.export")}
                    action={() => handleDevFunctionToGenerateLogs(logs)}
                />
                <GapView height={5} />
                <View style={styles.consoleview}>
                    {logs.map((log, index) => (
                        <Text
                            key={index}
                            style={[styles.logText, styles[log.type]]}
                        >
                            [{new Date(log.timestamp).toDateString()}{" "}
                            {new Date(log.timestamp).toLocaleTimeString()}] (
                            {log.type.toUpperCase()}) {log.message}{" "}
                        </Text>
                    ))}
                </View>
                <GapView height={10} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={12}>
                    Running React Native v{ReactVersion} and PersonaPlus v
                    {PersonaPlusVersion}
                </BetterText>
                <GapView height={80} />
            </ScrollView>
        </View>
    );
}
