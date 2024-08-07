// DeveloperInterface.tsx
// Page that shows console logs and other stuff to help the developer debug the app

// THIS SHIT IS BROKEN (perchance)

import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    View,
    Text,
} from "react-native";
import BottomNav from "@/src/BottomNav";
import BetterText from "@/src/BetterText";
import GapView from "@/src/GapView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/src/Buttons";
import { version as ReactVersion } from "react";
import { version as PersonaPlusVersion } from "@/package.json";
import {
    clearObjectives,
    getObjectives,
    objectiveArrayToObject,
    getObjectivesDailyLog,
} from "@/src/toolkit/objectives";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { usePathname, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { termLog, getLogsFromStorage } from "@/src/toolkit/debug/console";
import colors from "@/src/toolkit/design/colors";
import Loading from "@/src/Loading";

// TypeScript, supongo
import { Objective } from "@/src/types/Objective";
import { Logs } from "@/src/types/Logs";

const styles = StyleSheet.create({
    consoleview: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.BASIC.BLACK,
        width: "100%",
        height: "100%",
        borderRadius: 5,
    },
    logText: {
        marginBottom: 5,
    },
    log: {
        color: colors.BASIC.WHITE,
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: colors.BASIC.WHITE,
    },
    success: {
        color: colors.PRIMARIES.GOD.GOD,
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: colors.PRIMARIES.GOD.GOD,
    },
    warn: {
        color: colors.PRIMARIES.HMM.HMM,
        paddingLeft: 10,
        borderLeftWidth: 4,
        borderLeftColor: colors.PRIMARIES.HMM.HMM,
    },
    error: {
        color: colors.PRIMARIES.WOR.WOR,
        paddingLeft: 10,
        borderLeftWidth: 6,
        borderLeftColor: colors.PRIMARIES.WOR.WOR,
    },
    containerview: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    mainview: {
        padding: 20,
        paddingTop: 40,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
});

export default function DeveloperInterface() {
    const { t } = useTranslation();
    const [logs, setLogs] = useState<Logs>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [everything, setEverything] = useState<object | null>(null); // everything = single object with all user data
    const [objectives, setObjectives] = useState<{
        [key: string]: Objective;
    } | null>(null);
    const [objectivesDailyLog, setObjectivesDailyLog] = useState<
        object | string
    >();

    useEffect(() => {
        // defines a function for each fetch
        // objectives
        const fetchObjectives = async () => {
            try {
                const objectives = await getObjectives();
                setObjectives(objectiveArrayToObject(objectives));
            } catch (e) {
                termLog(
                    "Could not get objectives fetched due to error: " + e,
                    "error"
                );
            }
        };
        // objectives daily log
        const fetchObjectivesDailyLog = async () => {
            try {
                const storedDbjectives = await getObjectivesDailyLog("object");
                setObjectivesDailyLog(storedDbjectives);
            } catch (e) {
                termLog(
                    "Could not get objectives fetched due to error: " + e,
                    "error"
                );
            }
        };
        // termlogs
        const fetchLogs = async () => {
            try {
                const fetchedLogs = await getLogsFromStorage();
                setLogs(fetchedLogs);
            } catch (e) {
                termLog("Error fetching termLogs! " + e, "error");
            }
        };
        // user data
        const fetchUserData = async () => {
            try {
                const data = await AsyncStorage.multiGet([
                    "hasLaunched",
                    "age",
                    "gender",
                    "height",
                    "weight",
                    "focuspoint",
                    "username",
                    "sleep",
                    "language",
                ]);
                setEverything(data);
            } catch (e) {
                termLog(
                    "Error fetching all user data for Dev Interface" + e,
                    "error"
                );
            }
        };

        // an async that try-catches all fetches togheter. if everything succeeds, switches from loading to loaded.
        const fetchEverything = async () => {
            try {
                await fetchUserData();
                await fetchObjectives();
                await fetchLogs();
                await fetchObjectivesDailyLog();
                setLoading(false);
            } catch (e) {
                termLog(
                    "Error with Dev Interface data fetching: " + e,
                    "error"
                );
            }
        };

        fetchEverything();
    }, []);

    const currentpage: string = usePathname(); // current page

    // this function is to clear "all data" (not all, that would be AsyncStorage.clear(), removes all that's used by the app EXCEPT logs)
    const devFunctionToClearAll = async () => {
        try {
            await AsyncStorage.multiRemove([
                "hasLaunched",
                "age",
                "gender",
                "height",
                "weight",
                "focuspoint",
                "username",
                "sleep",
                "language",
            ]);
            await AsyncStorage.setItem("objectives", JSON.stringify([]));
            termLog("DEV CLEARED ALL", "log");
        } catch (e) {
            termLog(t("globals.react_error" + e), "error");
        } finally {
            router.navigate("/");
        }
    };

    // exports logs to a logs.txt file
    const devExportLogs = async (logs: Logs) => {
        // formatting
        const logText = logs
            .map(log => {
                const date = new Date(log.timestamp);
                return `[${date.toDateString()} ${date.toLocaleTimeString()}] (${log.type.toUpperCase()}) ${log.message}`;
            })
            .join("\n");

        // the file's location and name
        const fileUri = FileSystem.cacheDirectory + "logs.txt";

        // tries to save (asking for permission if needed)
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
            // saves to downloads
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

    // this is the handler for log exporting
    const handleDevFunctionToExportLogs = async (logs: Logs) => {
        try {
            const fileUri = await devExportLogs(logs);
            if (fileUri) {
                Alert.alert(
                    t("globals.success"),
                    t("dev_interface.logs.exported", { path: fileUri })
                );
            }
        } catch (e) {
            Alert.alert(
                "Error",
                t("dev_interface.logs.not_exported", { err: e })
            );
        }
    };

    // function to clear all clear logs
    const clearLog = async () => {
        try {
            await AsyncStorage.setItem("globalLogs", "");
            termLog("Cleared logs.", "log");
            router.navigate("/Profile");
        } catch (e) {
            termLog(String(e), "error");
        }
    };

    // handler for clearing all logs
    const devFunctionToClearGlobalLogs = () => {
        Alert.alert(
            // shows a warning, cause' its a BAD PRACTICE to clear logs. dont clear logs!
            t("globals.are_you_sure"),
            t("dev_interface.logs.clear_warning"),
            [
                {
                    text: t("globals.nevermind"),
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: t("globals.go_ahead"),
                    onPress: clearLog,
                    style: "destructive",
                },
            ]
        );
    };

    // TODO
    // this is actually useless, just remove it!
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const e = await AsyncStorage.multiGet([
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

    if (loading) {
        return <Loading currentpage={currentpage} displayNav={true} />;
    }

    return (
        <View style={styles.containerview}>
            <ScrollView style={styles.mainview}>
                <GapView height={20} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={35}
                >
                    Dev interface
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
                <GapView height={5} />
                <Button
                    action={devFunctionToClearAll}
                    buttonText={t("dev_interface.clear.all")}
                    style="WOR"
                />
                <GapView height={15} />
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
                        {String(objectives)}
                    </BetterText>
                </View>
                <GapView height={15} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={20}>
                    {t("dev_interface.objectives_daily_log_object")}
                </BetterText>
                <GapView height={5} />
                <View style={styles.consoleview}>
                    <BetterText
                        fontWeight="Regular"
                        textAlign="normal"
                        fontSize={15}
                    >
                        {String(objectivesDailyLog)}
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
                    action={() => handleDevFunctionToExportLogs(logs)}
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
            <BottomNav currentLocation={currentpage} />
        </View>
    );
}
