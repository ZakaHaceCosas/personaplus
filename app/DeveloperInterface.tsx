// DeveloperInterface.tsx
// Página que muestra ciertos logs de la consola para ayudar al desarrollador

// aviso: codigo no entendible

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

// TypeScript, supongo
interface Objective {
    exercise: string;
    days: boolean[];
    duration: number;
    repetitions: number;
    rests: number;
    restDuration: number;
    id: number;
    wasDone: boolean;
}

interface Log {
    message: string;
    type: "log" | "warn" | "error" | "success";
    timestamp: number;
}

const styles = Native.StyleSheet.create({
    consoleview: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f0f0f0",
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
    },
    mainview: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
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
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
    },
});

const globalLogs: Log[] = [];

/*
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
*/

const addLogToGlobal = (log: Log) => {
    globalLogs.push(log);
};

export const testLog = (
    message: string,
    type: "log" | "warn" | "error" | "success" = "log"
) => {
    const logMessage = message.toString();
    const timestamp = Date.now();
    const newLog: Log = { message: logMessage, type, timestamp };

    addLogToGlobal(newLog);

    console[type === "success" ? "log" : type](logMessage);

    let prefix = "";
    switch (type) {
        case "success":
            prefix = "GOD";
            break;
        case "error":
            prefix = "ERR";
            break;
        case "warn":
            prefix = "WAR";
            break;
        default:
            prefix = "LOG";
            break;
    }

    const log = prefix + " " + message;
    console.log(log);
};

export const termLog = (
    message: string,
    type: "log" | "warn" | "error" | "success" = "log"
) => {
    let prefix;
    let style;
    switch (type) {
        case "log":
            prefix = "LOG";
            style =
                "font-weight: bold; background: #FFF; color: black; padding: 2px 4px; border-radius: 2px;";
            break;
        case "success":
            prefix = "GOD";
            style =
                "font-weight: bold; background: #30FF97; color: black; padding: 2px 4px; border-radius: 2px;";
            break;
        case "warn":
            prefix = "WAR";
            style =
                "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;";
            break;
        case "error":
            prefix = "ERR";
            style =
                "font-weight: bold; background: #FF3232; color: black; padding: 2px 4px; border-radius: 2px;";
    }

    const log = "%c" + prefix + "%c " + message;
    console.log(log, style, "background: transparent;");
    testLog(message, type);
};

export default function ConsoleLogger() {
    const [logs, setLogs] = React.useState<Log[]>([]);

    React.useEffect(() => {
        const updateLogs = (newLog: Log) => {
            /*setLogs(prevLogs => [...prevLogs, newLog]);
            ;*/
            addLogToGlobal(newLog);
            setLogs(prevLogs => [...prevLogs, newLog]);
            globalLogs.push(newLog);
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
                const storedObjs = await AsyncStorage.getItem("objs");
                if (storedObjs) {
                    setObjs(JSON.parse(storedObjs));
                    termLog("Objectives (OBJS) fetched and parsed!", "success");
                } else {
                    await AsyncStorage.setItem("objs", JSON.stringify({}));
                    setObjs({});
                    termLog(
                        "Could not get objectives (OBJS) fetched! Setting them to an empty array ( {} )",
                        "warn"
                    );
                }
            } catch (e) {
                const log =
                    "Could not get objectives (OBJS) fetched due to error: " +
                    e;
                termLog(log, "error");
            }
        };

        fetchObjectives();
    }, []);

    const currentPage: string = Router.usePathname();

    const devFCclearobjs = async () => {
        try {
            await AsyncStorage.setItem("objs", "");
            console.log("DEV CLEARED OBJS");
            termLog("DEV CLEARED OBJS", "log");
            Router.router.navigate("/");
        } catch (e) {
            console.error(e);
            termLog(String(e), "error");
        }
    };
    const devFCclearall = async () => {
        try {
            await AsyncStorage.setItem("useDevTools", "");
            await AsyncStorage.setItem("hasLaunched", "");
            await AsyncStorage.setItem("age", "");
            await AsyncStorage.setItem("gender", "");
            await AsyncStorage.setItem("height", "");
            await AsyncStorage.setItem("weight", "");
            await AsyncStorage.setItem("focuspoint", "");
            await AsyncStorage.setItem("objs", "");
            await AsyncStorage.setItem("username", "");
            await AsyncStorage.setItem("sleep", "");
            Router.router.navigate("/WelcomeScreen");
            console.log("DEV CLEARED ALL");
            termLog("DEV CLEARED ALL", "log");
        } catch (e) {
            console.error(e);
            termLog(String(e), "error");
        }
    };

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
                    Interfaz de devs
                </BetterText>
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={20}>
                    Options
                </BetterText>
                <GapView height={5} />
                <Button
                    action={() => Router.router.navigate("/WelcomeScreen")}
                    buttonText="Go to /WelcomeScreen"
                    style="ACE"
                />
                <GapView height={5} />
                <Button
                    action={() => Router.router.navigate("/openhealthtest")}
                    buttonText="Go to /openhealthtest"
                    style="ACE"
                />
                <GapView height={5} />
                <Button
                    action={() => devFCclearobjs()}
                    buttonText="Clear OBJS"
                    style="HMM"
                />
                <GapView height={5} />
                <Button
                    action={() => devFCclearall()}
                    buttonText="Clear all"
                    style="WOR"
                />
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={20}>
                    Versions
                </BetterText>
                <GapView height={5} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={15}
                >
                    React: {ReactVersion}
                </BetterText>
                <GapView height={5} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={15}
                >
                    PersonaPlus: {PersonaPlusVersion}
                </BetterText>
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={20}>
                    OBJS
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={15}
                >
                    OBJS = objectives - the base of the app. this is the
                    stringified JSON for the active objectives (OBJS).
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="Italic"
                    fontSize={10}
                >
                    OBJS = objetivos - la base de la app. this is the
                    stringified JSON for the active objectives (OBJS).
                </BetterText>
                <GapView height={20} />
                <Native.View style={styles.consoleview}>
                    <BetterText
                        textColor="#000"
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={15}
                    >
                        {JSON.stringify(objs)}
                    </BetterText>
                </Native.View>
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={20}>
                    Console logs
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={15}
                >
                    meant for testing from mobile / Expo Go. From the desktop,
                    use the browsers console
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="Italic"
                    fontSize={10}
                >
                    pensados para el uso desde móvil / Expo Go - en PC usa la
                    consola del navegador
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="BoldItalic"
                    fontSize={15}
                    textColor="#FFC832"
                >
                    some logs will only be on the desktops terminal, not here
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="BoldItalic"
                    fontSize={10}
                    textColor="#FFC832"
                >
                    algunos logs solo apareceran en la terminal del escritorio,
                    no aquí
                </BetterText>
                <GapView height={20} />
                <Native.ScrollView style={styles.consoleview}>
                    {logs.map((log, index) => (
                        <Native.Text
                            key={index}
                            style={[styles.logText, styles[log.type]]}
                        >
                            {new Date(log.timestamp).toLocaleTimeString()} -{" "}
                            {log.message}
                        </Native.Text>
                    ))}
                </Native.ScrollView>
            </Native.ScrollView>
        </Native.View>
    );
}
