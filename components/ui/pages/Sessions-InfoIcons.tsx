// InfoIcons.tsx
// Informative icons for the session page

import React, { ReactElement } from "react";
import { View } from "react-native";
import GapView from "../GapView";
import { ActiveObjective } from "@/types/ActiveObjectives";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import BetterText from "@/components/text/BetterText";
import Colors from "@/constants/Colors";
import { TFunction } from "i18next";
import FontSizes from "@/constants/FontSizes";

// TypeScript, supongo...
/**
 * InfoIconsProps
 *
 * @typedef {Object} InfoIconsProps
 * @property {ActiveObjective} objective The objective of the current session.
 * @property {1 | 2} row Whether to show the 1st row (generic data) or the 2nd row (exercise-specific) data.
 * @property {TFunction} t The translate function.
 * @property {number} laps The `laps` stateful value.
 */
type InfoIconsProps = {
    objective: ActiveObjective;
    row: 1 | 2;
    t: TFunction;
    laps: number;
};

// I don't usually use React.FC, I prefer export default function
// This was the only fix I found for an IntrinsicAttributes error, tho
/**
 * Returns a JSX component with a list of icons containing info about a certain objective.
 *
 * @param {InfoIconsProps} props The properties for the InfoIcons component.
 * @param {Objective} props.objective The objective of the current session.
 * @param {1 | 2} props.row Whether to show the 1st row (generic data) or the 2nd row (exercise-specific) data.
 * @param {TFunction} props.t The translate function.
 * @param {number} props.laps The `laps` stateful value.
 * @returns {ReactElement} The JSX component displaying the icons.
 */
const SessionsPageInfoIcons: React.FC<InfoIconsProps> = ({
    objective,
    row,
    t,
    laps,
}: InfoIconsProps): ReactElement => {
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
    if (row === 1) {
        return (
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Ionicons name="loop" size={15} color={Colors.BASIC.WHITE} />
                <GapView width={5} />
                <BetterText fontWeight="Regular" fontSize={15}>
                    {laps === 0
                        ? t("globals.none")
                        : laps === 1
                          ? `${laps} repetition`
                          : `${laps} repetitions`}
                </BetterText>
                <GapView width={15} />
                <Ionicons name="snooze" size={15} color={Colors.BASIC.WHITE} />
                <GapView width={5} />
                <BetterText fontWeight="Regular" fontSize={15}>
                    {objective.info.rests === 0
                        ? t("globals.none")
                        : objective.info.rests === 1
                          ? `${objective.info.rests} rest of ${objective.info.restDurationMinutes} mins`
                          : `${objective.info.rests} rests (${objective.info.restDurationMinutes} mins)`}
                </BetterText>
            </View>
        );
    } else if (row === 2) {
        return (
            <>
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
                            {objective.specificData.estimateSpeed !==
                                undefined &&
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
                            {objective?.specificData?.amountOfHands !==
                            undefined
                                ? String(objective.specificData.amountOfHands)
                                : "N/A"}{" "}
                            hand
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
                            {objective?.specificData?.amountOfPushUps !==
                            undefined
                                ? String(objective.specificData.amountOfPushUps)
                                : "N/A"}{" "}
                            push-ups
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
                            {objective?.specificData?.amountOfHands !==
                            undefined
                                ? String(objective.specificData.amountOfHands)
                                : "N/A"}{" "}
                            hand
                        </BetterText>
                    </View>
                )}
            </>
        );
    } else {
        return (
            <View>
                <BetterText
                    fontSize={FontSizes.SMALL}
                    textColor={Colors.LABELS.SDD}
                    fontWeight="Regular"
                >
                    Error. Invalid `row` parameter.
                </BetterText>
            </View>
        );
    }
};

export default SessionsPageInfoIcons;
