import React, { ReactElement } from "react";
import { GetCommonScreenSize } from "@/constants/screen";
import { StyleSheet, Text, View } from "react-native";
import { BetterTextSmallText } from "../text/better_text_presets";
import GapView from "./gap_view";
import { Log } from "@/types/logs";
import Colors from "@/constants/colors";
import { HexColorString } from "@/types/color";

const styles = StyleSheet.create({
    consoleView: {
        backgroundColor: Colors.BASIC.BLACK,
        padding: 10,
        width: GetCommonScreenSize("width"),
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

/**
 * Renders a console view with the given logs.
 * @author ZakaHaceCosas
 *
 * @export
 * @param {{
 *     logs: Log[];
 *     errorOnly: boolean;
 * }} p0
 * @param {Log[]} p0.logs Logs to be rendered.
 * @param {boolean} p0.errorOnly If true, only warning and error logs from your `Log[]` array will be shown.
 * @returns {ReactElement}
 */
export default function Console({
    logs,
    errorOnly,
}: {
    logs: Log[];
    errorOnly: boolean;
}): ReactElement {
    const errorLogs: Log[] = logs.filter(
        (log: Log): boolean => log.type === "warn" || log.type === "error",
    );

    const workingLogs: Log[] = errorOnly ? errorLogs : logs;

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
            if (logs.length === 0) {
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
    }

    return (
        <View style={styles.consoleView}>
            {workingLogs.map((log: Log, index: number): ReactElement => {
                const logStyle: {
                    color: HexColorString;
                    borderLeftColor: HexColorString;
                } = styles[log.type];

                // formats date in a more sense-making way than what R5 used to do
                const formattedDate: string = new Date(log.timestamp)
                    .toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false, // 24h format
                    })
                    .replace(",", "");

                let finalMessage: string;

                if (!log.message) {
                    finalMessage = "<<< empty log >>>";
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
                    type: log.type ? log.type.toUpperCase() : "?LOG",
                    date: formattedDate,
                    trace: log.traceback
                        ? `{ TRACEBACK:\n  location:    ${log.traceback.location},\n  function:    ${log.traceback.function},\n  isHandler:   ${log.traceback.isHandler},\n${
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
