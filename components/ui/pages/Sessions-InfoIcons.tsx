// InfoIcons.tsx
// Informative icons for the session page

import React, { ReactElement } from "react";
import { View } from "react-native";
import GapView from "@/components/ui/GapView";
import { ActiveObjective } from "@/types/ActiveObjectives";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import BetterText from "@/components/text/BetterText";
import Colors from "@/constants/Colors";
import { TFunction } from "i18next";

// TypeScript, supongo...
/**
 * InfoIconsProps
 *
 * @typedef {Object} InfoIconsProps
 * @property {ActiveObjective} objective The objective of the current session.
 * @property {TFunction} t The translate function.
 */
interface InfoIconsProps {
    /**
     * The objective of the current session.
     *
     * @type {ActiveObjective}
     */
    objective: ActiveObjective;
    t: TFunction;
}

/**
 * Returns an array of icons containing info about a certain objective.
 *
 * @param {InfoIconsProps} p The properties for the InfoIcons component.
 * @param {Objective} p.objective The objective of the current session.
 * @param {1 | 2} p.row Whether to show the 1st row (generic data) or the 2nd row (exercise-specific) data.
 * @param {TFunction} p.t The translate function.
 * @returns {ReactElement} The JSX component displaying the icons.
 */
export default function SessionsPageInfoIcons({
    objective,
    t,
}: InfoIconsProps): ReactElement {
    /**
     * @deprecated Only use until the tracker experiment fully rolls out.
     */
    const speedOptions: [string, string][] = [
        [t("Brisk Walk"), t("1.6 - 3.2 km/h")],
        [t("Light Jog"), t("3.2 - 4.0 km/h")],
        [t("Moderate Run"), t("4.0 - 4.8 km/h")],
        [t("Fast Run"), t("4.8 - 5.5 km/h")],
        [t("Sprint"), t("5.5 - 6.4 km/h")],
        [t("Fast Sprint"), t("6.4 - 8.0 km/h")],
        [t("Running Fast"), t("8.0 - 9.6 km/h")],
        [t("Very Fast Run"), t("9.6 - 11.3 km/h")],
        [t("Sprinting"), t("11.3 - 12.9 km/h")],
        [t("Fast Sprinting"), t("12.9 - 14.5 km/h")],
        [t("Full Speed Sprinting"), t("14.5 - 16.1 km/h")],
        [t("Maximum Speed"), t("more than 16.1 km/h")],
    ];

    return (
        <>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Ionicons name="snooze" size={15} color={Colors.BASIC.WHITE} />
                <GapView width={5} />
                <BetterText fontWeight="Regular" fontSize={15}>
                    {objective.info.rests === 0
                        ? t("globals.interaction.none")
                        : t("pages.sessions.rests", {
                              rests: objective.info.rests,
                              duration: objective.info.restDurationMinutes,
                          })}
                </BetterText>
            </View>
            {objective.exercise.toLowerCase() === "running" && (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 10,
                    }}
                >
                    <Ionicons
                        name="speed"
                        size={15}
                        color={Colors.BASIC.WHITE}
                    />
                    <GapView width={5} />
                    <BetterText
                        fontWeight="Regular"
                        textColor={Colors.BASIC.WHITE}
                        fontSize={15}
                    >
                        {objective.specificData.estimateSpeed !== undefined &&
                        objective.specificData.estimateSpeed >= 0 &&
                        objective.specificData.estimateSpeed <
                            speedOptions.length
                            ? `${speedOptions[objective.specificData.estimateSpeed][0]} (${speedOptions[objective.specificData.estimateSpeed][1]})`
                            : "N/A"}
                    </BetterText>
                </View>
            )}
            {objective.exercise.toLowerCase() === "lifting" && (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 10,
                    }}
                >
                    <Ionicons
                        name="keyboard-double-arrow-down"
                        size={15}
                        color={Colors.BASIC.WHITE}
                    />
                    <BetterText
                        fontWeight="Regular"
                        textColor={Colors.BASIC.WHITE}
                        fontSize={15}
                    >
                        {objective?.specificData?.amountOfHands !== undefined
                            ? t("pages.sessions.hands", {
                                  hands: objective.specificData.amountOfHands,
                              })
                            : "N/A"}
                    </BetterText>
                </View>
            )}
            {objective.exercise.toLowerCase() === "push up" && (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 10,
                    }}
                >
                    <Ionicons
                        name="repeat"
                        size={15}
                        color={Colors.BASIC.WHITE}
                    />
                    <GapView width={5} />
                    <BetterText
                        fontWeight="Regular"
                        textColor={Colors.BASIC.WHITE}
                        fontSize={15}
                    >
                        {objective?.specificData?.amountOfPushUps !== undefined
                            ? t("pages.sessions.pushUps", {
                                  pushUps:
                                      objective.specificData.amountOfPushUps,
                              })
                            : "N/A"}
                    </BetterText>
                    <GapView width={10} />
                    <Ionicons
                        name="front-hand"
                        size={15}
                        color={Colors.BASIC.WHITE}
                    />
                    <GapView width={5} />
                    <BetterText
                        fontWeight="Regular"
                        textColor={Colors.BASIC.WHITE}
                        fontSize={15}
                    >
                        {objective?.specificData?.amountOfHands !== undefined
                            ? t("pages.sessions.hands", {
                                  hands: objective.specificData.amountOfHands,
                              })
                            : "N/A"}
                    </BetterText>
                </View>
            )}
        </>
    );
}
