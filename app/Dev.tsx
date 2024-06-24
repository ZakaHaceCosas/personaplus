// Dev.tsx
// Página que muestra ciertos logs de la consola para ayudar al desarrollador

import Foot from "@/components/Foot";
import * as React from "react";
import * as Native from "react-native";
import * as Router from "expo-router";
import BeText from "@/components/Text";
import GapView from "@/components/GapView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Btn from "@/components/Btns";
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
    type: "log" | "warn" | "error";
    timestamp: number;
}

const styles = Native.StyleSheet.create({
    consoleview: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f0f0f0",
        width: "100%" as Native.DimensionValue,
        height: "100%" as Native.DimensionValue,
    },
    mainview: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as Native.DimensionValue,
        height: "100vw" as Native.DimensionValue,
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
        height: "100vw" as Native.DimensionValue,
    },
});

const globalLogs: Log[] = [];

const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

const addLogToGlobal = (log: Log) => {
    globalLogs.push(log);
};

export const testLog = (
    message: string,
    type: "log" | "warn" | "error" = "log"
) => {
    const newLog: Log = {
        message: message.toString(),
        type,
        timestamp: Date.now(),
    };
    addLogToGlobal(newLog);
    console[type](message);
};

export default function ConsoleLogger() {
    const [logs, setLogs] = React.useState<Log[]>([]);

    React.useEffect(() => {
        setLogs(globalLogs);

        console.log = (message: string, ...optionalParams: unknown[]) => {
            const newLog: Log = {
                message: message.toString(),
                type: "log",
                timestamp: Date.now(),
            };
            addLogToGlobal(newLog);
            setLogs(prevLogs => [...prevLogs, newLog]);
            originalConsoleLog(message, ...optionalParams);
        };

        console.warn = (message: string, ...optionalParams: unknown[]) => {
            const newLog: Log = {
                message: message.toString(),
                type: "warn",
                timestamp: Date.now(),
            };
            addLogToGlobal(newLog);
            setLogs(prevLogs => [...prevLogs, newLog]);
            originalConsoleWarn(message, ...optionalParams);
        };

        console.error = (message: string, ...optionalParams: unknown[]) => {
            const newLog: Log = {
                message: message.toString(),
                type: "error",
                timestamp: Date.now(),
            };
            addLogToGlobal(newLog);
            setLogs(prevLogs => [...prevLogs, newLog]);
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
                    console.log(
                        "%cGOD%cAll is ok%c Objectives (OBJS) fetched and parsed!",
                        "font-weight: bold; background: #30FF97; color: black; padding: 2px 4px; border-radius: 2px;",
                        "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                        "color: #30FF97;"
                    );
                } else {
                    await AsyncStorage.setItem("objs", JSON.stringify({}));
                    setObjs({});
                    console.log(
                        "%cWOR%cDev error%c Could not get objectives (OBJS) fetched! Setting them to an empty array ( {} )",
                        "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                        "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                        "color: #FFD700;"
                    );
                }
            } catch (e) {
                const log =
                    "Could not get objectives (OBJS) fetched due to error: " +
                    e;
                console.log(
                    "%cWOR%cDev error%c " + log,
                    "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                    "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                    "color: #FFD700;"
                );
            }
        };

        fetchObjectives();
    }, []);

    const currentPage: string = Router.usePathname();

    const devFCclearobjs = async () => {
        try {
            await AsyncStorage.setItem("objs", "");
            console.log("DEV CLEARED OBJS");
            testLog("DEV CLEARED OBJS", "log");
            Router.router.navigate("/");
        } catch (e) {
            console.error(e);
            testLog(String(e), "error");
        }
    };
    const devFCclearall = async () => {
        try {
            await AsyncStorage.setItem("objs", "");
            await AsyncStorage.setItem("hasLaunched", "");
            await AsyncStorage.setItem("uname", "");
            Router.router.navigate("/");
            console.log("DEV CLEARED ALL");
            testLog("DEV CLEARED ALL", "log");
        } catch (e) {
            console.error(e);
            testLog(String(e), "error");
        }
    };

    return (
        <Native.View style={styles.containerview}>
            <Foot page={currentPage} />
            <Native.ScrollView style={styles.mainview}>
                <GapView height={20} />
                <BeText align="normal" weight="Regular" size={35}>
                    Dev interface
                </BeText>
                <BeText align="normal" weight="Italic" size={15}>
                    Interfaz de devs
                </BeText>
                <GapView height={20} />
                <BeText align="normal" weight="Bold" size={20}>
                    Options
                </BeText>
                <GapView height={5} />
                <Btn
                    onclick={() => Router.router.navigate("/Welc")}
                    text="Go to /Welc (Welcome page)"
                    kind="ACE"
                />
                <GapView height={5} />
                <Btn
                    onclick={() => devFCclearobjs()}
                    text="Clear OBJS"
                    kind="HMM"
                />
                <GapView height={5} />
                <Btn
                    onclick={() => devFCclearall()}
                    text="Clear all"
                    kind="WOR"
                />
                <GapView height={20} />
                <BeText align="normal" weight="Bold" size={20}>
                    Versions
                </BeText>
                <GapView height={5} />
                <BeText align="normal" weight="Regular" size={15}>
                    React: {ReactVersion}
                </BeText>
                <GapView height={5} />
                <BeText align="normal" weight="Regular" size={15}>
                    PersonaPlus: {PersonaPlusVersion}
                </BeText>
                <GapView height={20} />
                <BeText align="normal" weight="Bold" size={20}>
                    OBJS
                </BeText>
                <BeText align="normal" weight="Regular" size={15}>
                    OBJS = objectives - the base of the app. this is the
                    stringified JSON for the active objectives (OBJS).
                </BeText>
                <BeText align="normal" weight="Italic" size={10}>
                    OBJS = objetivos - la base de la app. this is the
                    stringified JSON for the active objectives (OBJS).
                </BeText>
                <GapView height={20} />
                <Native.View style={styles.consoleview}>
                    <BeText
                        color="#000"
                        align="normal"
                        weight="Regular"
                        size={15}
                    >
                        {JSON.stringify(objs)}
                    </BeText>
                </Native.View>
                <GapView height={20} />
                <BeText align="normal" weight="Bold" size={20}>
                    Console logs
                </BeText>
                <BeText align="normal" weight="Regular" size={15}>
                    meant for testing from mobile / Expo Go. From the desktop,
                    use the browsers console
                </BeText>
                <BeText
                    align="normal"
                    weight="Regular"
                    size={15}
                    color="#FFC832"
                >
                    they may not look properly due to the usage of %c for
                    desktop / browser logs (but they are still readable so no
                    problem)
                </BeText>
                <BeText align="normal" weight="Italic" size={10}>
                    pensados para el uso desde móvil / Expo Go - en PC usa la
                    consola del navegador
                </BeText>
                <BeText
                    align="normal"
                    weight="BoldItalic"
                    size={15}
                    color="#FFC832"
                >
                    some logs will only be on the desktops terminal, not here
                </BeText>
                <BeText
                    align="normal"
                    weight="Italic"
                    size={10}
                    color="#FFC832"
                >
                    puede que no se vean del todo bien al usar %c para los logs
                    de consola / navegador (pero se siguen leyendo bien asi que
                    no hay problema)
                </BeText>
                <BeText
                    align="normal"
                    weight="BoldItalic"
                    size={10}
                    color="#FFC832"
                >
                    algunos logs solo apareceran en la terminal del escritorio,
                    no aquí
                </BeText>
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
