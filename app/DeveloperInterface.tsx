// DeveloperInterface.tsx
// Página que muestra ciertos logs de la consola para ayudar al desarrollador

// esto es un autentico fiasco, ya lo arreglaré

import * as React from "react";
import * as Native from "react-native";
import * as Router from "expo-router";
import Footer from "@/components/Footer";
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
    type: "log" | "warn" | "error" | "success" = "log"
) => {
    const logMessage = message.toString();
    const timestamp = Date.now();
    // @ts-expect-error: Assigned an extra "success" type to console.log which is not existing, therefore gives a type error.
    const newLog: Log = { message: logMessage, type, timestamp };

    // Add the log to the global logs array
    addLogToGlobal(newLog);

    // Log with the appropriate console method
    console[type === "success" ? "log" : type](logMessage);

    // Styled log with prefixes
    let prefix = "";
    let style = "";
    switch (type) {
        case "success":
            prefix = "GOD";
            style =
                "font-weight: bold; background: #30FF97; color: black; padding: 2px 4px; border-radius: 2px;";
            break;
        case "error":
            prefix = "ERR";
            style = "color: #ff0000; font-weight: bold;";
            break;
        case "warn":
            prefix = "WAR";
            style = "color: #ff9900; font-weight: bold;";
            break;
        default:
            prefix = "LOG";
            style = "color: #000000; font-weight: bold;";
            break;
    }

    console.log(`%c${prefix} %c${logMessage}`, style, "");
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
    console.log(log, style, "background: transparent; color: white;");
    testLog(message, type);
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
                    buttonText="Go to /Welc (Welcome page)"
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
                    fontWeight="Regular"
                    fontSize={15}
                    textColor="#FFC832"
                >
                    they may not look properly due to the usage of %c for
                    desktop / browser logs (but they are still readable so no
                    problem)
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
                    fontWeight="Italic"
                    fontSize={10}
                    textColor="#FFC832"
                >
                    puede que no se vean del todo bien al usar %c para los logs
                    de consola / navegador (pero se siguen leyendo bien asi que
                    no hay problema)
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
                <Footer />
            </Native.ScrollView>
        </Native.View>
    );
}
