import Loading from "@/components/static/Loading";
import {
    BetterTextHeader,
    BetterTextSmallText,
    BetterTextSmallerText,
} from "@/components/text/BetterTextPresets";
import { getLogsFromStorage, logToConsole } from "@/toolkit/debug/Console";
import { Logs } from "@/types/Logs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import getCommonScreenSize from "@/constants/Screen";
import BackButton from "@/components/navigation/GoBack";
import GapView from "@/components/ui/GapView";

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
        color: Colors.LABELS.TABLE_HEADER,
        borderLeftColor: Colors.LABELS.TABLE_HEADER,
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

export default function ErrorLogger() {
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

    // no i am not translating dev interface. it is just for BackButton to work.
    const { t } = useTranslation();

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <BackButton t={t} />
            <BetterTextHeader>Error Console View</BetterTextHeader>
            <GapView height={5} />
            <BetterTextSmallerText>
                Note: Logs are SOMETIMES formatted as MM/DD/YYYY due to React's
                constraints. Apologies for the inconvenience.
            </BetterTextSmallerText>
            <GapView height={5} />
            <BetterTextSmallerText>
                Note 2: Each log consists of two parts: the first entry is for
                type, timestamp, and traceback, while the second entry, contains
                the log's text. Both entries are color-coded.
            </BetterTextSmallerText>
            <View style={styles.consoleView}>
                {error ?
                    <BetterTextSmallText>{error}</BetterTextSmallText>
                : logs && logs.length > 0 && Array.isArray(logs) ?
                    // Filtra los logs para mostrar solo los de tipo "warn" o "error"
                    (
                        logs.filter(
                            (log) =>
                                log.type === "warn" || log.type === "error",
                        ).length > 0
                    ) ?
                        logs
                            .filter(
                                (log) =>
                                    log.type === "warn" || log.type === "error",
                            )
                            .map((log, index) => {
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
                                    <Text
                                        key={index}
                                        style={[styles.logText, logStyle]}
                                    >
                                        [{formattedDate}] (
                                        {log.type.toUpperCase()}){" "}
                                        {String(log.message)}
                                    </Text>
                                );
                            })
                    :   <BetterTextSmallText>
                            Great! There are no errors and no warnings! If you
                            want to see full logs, including regular and success
                            ones, tap "See all logs".
                        </BetterTextSmallText>

                :   <BetterTextSmallText>
                        No logs. If you recently cleared them it's alright, if
                        not, this shouldn't be empty, so you might be facing a
                        bug.
                    </BetterTextSmallText>
                }
            </View>
        </>
    );
}
