import BetterButton from "@/components/interaction/BetterButton";
import BackButton from "@/components/navigation/GoBack";
import Loading from "@/components/static/Loading";
import PageEnd from "@/components/static/PageEnd";
import {
    BetterTextHeader,
    BetterTextSmallText,
    BetterTextSmallerText,
} from "@/components/text/BetterTextPresets";
import GapView from "@/components/ui/GapView";
import Colors from "@/constants/Colors";
import getCommonScreenSize from "@/constants/Screen";
import StoredItemNames from "@/constants/StoredItemNames";
import { getLogsFromStorage, logToConsole } from "@/toolkit/debug/Console";
import { Logs } from "@/types/Logs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    consoleView: {
        backgroundColor: Colors.BASIC.BLACK,
        padding: 10,
        width: getCommonScreenSize("width"),
    },
    logText: {
        marginBottom: 5,
        fontFamily: "monospace",
        fontSize: 11,
        borderLeftWidth: 2,
        paddingLeft: 10,
    },
    log: {
        color: Colors.LBLS.TBLH,
        borderLeftColor: Colors.LBLS.TBLH,
    },
    success: {
        color: Colors.PRIMARIES.GOD.GOD,
        borderLeftColor: Colors.PRIMARIES.GOD.GOD,
    },
    warn: {
        color: Colors.PRIMARIES.HMM.HMM,
        borderLeftColor: Colors.PRIMARIES.HMM.HMM,
    },
    error: {
        color: Colors.PRIMARIES.WOR.WOR,
        borderLeftColor: Colors.PRIMARIES.WOR.WOR,
    },
});

export default function HomeScreen() {
    const [loading, setLoading] = useState<boolean>(true);
    const [logs, setLogs] = useState<Logs>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function handler() {
            try {
                // logs
                const bareLogs = await getLogsFromStorage();
                if (!bareLogs) {
                    throw new Error("HOW CAN LOGS BE NULL?");
                }
                setLogs(bareLogs);
            } catch (e) {
                const err = "Error fetching data at DevInterface: " + e;
                logToConsole(err, "error");
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        handler();
    }, []);

    function clearLogs() {
        async function actuallyClearLogs() {
            try {
                await AsyncStorage.setItem(StoredItemNames.consoleLogs, "");
            } catch (e) {
                logToConsole("Failed to clear logs: " + e, "error");
            }
        }

        actuallyClearLogs();
        router.replace("/DevInterface");
    }

    // no i am not translating dev interface. it is just for BackButton to work.
    const { t } = useTranslation();

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <BackButton t={t} />
            <BetterTextHeader>Full Console View</BetterTextHeader>
            <BetterTextSmallText>
                Note: This might get very long over time. It's recommended that
                you clear logs every once in a while (unless you're experiencing
                errors with the app!) to avoid taking too much storage + to
                ensure Dev Interface loads fast.
            </BetterTextSmallText>
            <BetterTextSmallerText>
                Note 2: Logs use MM/DD/YYYY. Sorry, it's not my fault. Blame it
                on React.
            </BetterTextSmallerText>
            <BetterTextSmallerText>
                Note 3: Each log takes two "entries": the first one is of its
                type-specific color, indicating type, timestamp, and traceback,
                and below, in white, is the log's actual text.
            </BetterTextSmallerText>
            <GapView height={5} />
            <BetterButton
                buttonText="Clear logs"
                style="HMM"
                action={clearLogs}
            />
            <View style={styles.consoleView}>
                {error ? (
                    <BetterTextSmallText>{error}</BetterTextSmallText>
                ) : logs && logs.length > 0 && Array.isArray(logs) ? (
                    logs.map((log, index) => {
                        const logStyle = styles[log.type] || {};
                        const options: Intl.DateTimeFormatOptions = {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false, // 24h format
                        };

                        // formats date in a more sense-making way than what R5 used to do
                        const formattedDate = new Date(log.timestamp)
                            .toLocaleString("es-ES", options)
                            .replace(",", "");

                        return (
                            <React.Fragment key={index}>
                                <Text style={[styles.logText, logStyle]}>
                                    ({log.type.toUpperCase()}) [{formattedDate}]{" "}
                                    {log.traceback
                                        ? `{\n  TRACEBACK:\n  location: ${
                                              log.traceback.location
                                          },\n  function: ${
                                              log.traceback.function
                                          },\n  isHandler: ${
                                              log.traceback.isHandler
                                          }\n${
                                              log.traceback.isHandler &&
                                              log.traceback.handlerName
                                                  ? `,\n  handlerName: ${log.traceback.handlerName}`
                                                  : ""
                                          }}`
                                        : "{ TRACEBACKN'T }"}
                                </Text>
                                <Text
                                    style={[
                                        styles.logText,
                                        logStyle,
                                        {
                                            color: "#FFF",
                                            borderLeftColor: "#FFF",
                                        },
                                    ]}
                                >
                                    {String(log.message)}
                                </Text>
                                <GapView height={10} />
                            </React.Fragment>
                        );
                    })
                ) : (
                    <BetterTextSmallText>
                        No logs. If you recently cleared them it's alright, if
                        not, this shouldn't be empty, so you might be facing a
                        bug.
                    </BetterTextSmallText>
                )}
            </View>
            <PageEnd includeText={true} />
        </>
    );
}
