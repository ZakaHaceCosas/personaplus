import React from "react";
import getCommonScreenSize from "@/constants/screen";
import { View, Text, StyleSheet } from "react-native";
import { BetterTextSmallText } from "../text/better_text_presets";
import GapView from "./gap_view";
import { Logs } from "@/types/logs";
import Colors from "@/constants/colors";

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

export default function Console({
    logs,
    errorOnly,
}: {
    logs: Logs;
    errorOnly: boolean;
}) {
    const timeFormatOptions: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // 24h format
    };

    const errorLogs = logs.filter(
        (log) => log.type === "warn" || log.type === "error",
    );

    const workingLogs = errorOnly ? errorLogs : logs;

    if (errorLogs.length === 0) {
        if (errorOnly) {
            return (
                <View style={styles.consoleView}>
                    <BetterTextSmallText>
                        Great! There are no errors and no warnings! If you want
                        to see full logs, including regular and success ones,
                        tap "See all logs".
                    </BetterTextSmallText>
                </View>
            );
        } else {
            if (logs.length === 0)
                return (
                    <View style={styles.consoleView}>
                        <BetterTextSmallText>
                            No logs. If you recently cleared them it's alright,
                            if not, this shouldn't be empty, so you might be
                            facing a bug.
                        </BetterTextSmallText>
                    </View>
                );
        }
    }

    return (
        <View style={styles.consoleView}>
            {workingLogs.map((log, index) => {
                const logStyle = styles[log.type] || {};

                // formats date in a more sense-making way than what R5 used to do
                const formattedDate = new Date(log.timestamp)
                    .toLocaleString("es-ES", timeFormatOptions)
                    .replace(",", "");

                let finalMessage: string;

                if (!log.message) {
                    finalMessage = "";
                } else if (typeof log.message === "string") {
                    finalMessage = log.message;
                } else if (Array.isArray(log.message)) {
                    finalMessage = (log.message as typeof Array).toString();
                } else if (typeof log.message === "object") {
                    finalMessage = JSON.stringify(log.message);
                } else {
                    finalMessage = String(log.message);
                }

                const finalContent = {
                    type: log.type ? log.type.toUpperCase() : "",
                    date: formattedDate,
                    trace: log.traceback
                        ? `{ TRACEBACK:\n  location:    ${
                              log.traceback.location
                          },\n  function:    ${
                              log.traceback.function
                          },\n  isHandler:   ${log.traceback.isHandler},\n${
                              log.traceback.isHandler &&
                              log.traceback.handlerName
                                  ? `  handlerName: ${log.traceback.handlerName}`
                                  : ""
                          }\n}`
                        : "{ NO TRACEBACK }",
                    message: finalMessage,
                };

                return (
                    <React.Fragment key={index}>
                        <Text style={[styles.logText, logStyle]}>
                            {`(${finalContent.type} ${finalContent.date}) ${finalContent.trace}`}
                        </Text>
                        <Text style={[styles.logText, logStyle]}>
                            {finalContent.message}
                        </Text>
                        <GapView height={10} />
                    </React.Fragment>
                );
            })}
        </View>
    );
}
