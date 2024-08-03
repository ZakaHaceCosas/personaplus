// InfoIcons.tsx
// Informative icons for the session page

import React from "react";
import { View } from "react-native";
import GapView from "../GapView";
import { Objective } from "../types/Objective";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import BetterText from "../BetterText";
import colors from "../toolkit/design/colors";

// TypeScript, supongo...
/**
 * InfoIconProps
 *
 * @typedef {InfoIconsProps}
 */
type InfoIconsProps = {
    objective: Objective;
};

// I don't usually use React.FC, I prefer export default function
// This was the only fix I found for an IntrinsicAttributes error, tho
/**
 * Returns a JSX component with a list of icons containing info about a certain objective.
 *
 * @param {{ objective: any; }} param0
 * @param {*} param0.objective The Objective
 * @returns {*}
 */
const InfoIcons: React.FC<InfoIconsProps> = ({ objective }) => {
    const speedOptions: [string, string][] = [
        ["Brisk Walk", "1.6 - 3.2 km/h"],
        ["Light Jog", "3.2 - 4.0 km/h"],
        ["Moderate Run", "4.0 - 4.8 km/h"],
        ["Fast Run", "4.8 - 5.5 km/h"],
        ["Sprint", "5.5 - 6.4 km/h"],
        ["Fast Sprint", "6.4 - 8.0 km/h"],
        ["Running Fast", "8.0 - 9.6 km/h"],
        ["Very Fast Run", "9.6 - 11.3 km/h"],
        ["Sprinting", "11.3 - 12.9 km/h"],
        ["Fast Sprinting", "12.9 - 14.5 km/h"],
        ["Full Speed Sprinting", "14.5 - 16.1 km/h"],
        ["Maximum Speed", "more than 16.1 km/h"],
    ];

    return (
        <View>
            {objective.exercise.toLowerCase() === "running" && (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
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
                                color={colors.BASIC.WHITE}
                            />
                            <GapView width={5} />
                            <BetterText
                                fontWeight="Regular"
                                textColor={colors.BASIC.WHITE}
                                fontSize={15}
                            >
                                {objective?.extra?.barWeight !== undefined &&
                                objective?.extra?.liftWeight !== undefined &&
                                objective.extra.hands !== undefined
                                    ? String(
                                          objective.extra.barWeight +
                                              objective.extra.liftWeight *
                                                  objective.extra.hands
                                      )
                                    : "N/A"}{" "}
                                kg
                            </BetterText>
                            <GapView width={10} />
                            <Ionicons
                                name="change-circle"
                                size={15}
                                color={colors.BASIC.WHITE}
                            />
                            <GapView width={5} />
                            <BetterText
                                fontWeight="Regular"
                                textColor={colors.BASIC.WHITE}
                                fontSize={15}
                            >
                                {objective?.extra?.lifts !== undefined
                                    ? String(objective.extra.lifts)
                                    : "N/A"}{" "}
                                lifts
                            </BetterText>
                            <GapView width={10} />
                            <Ionicons
                                name="front-hand"
                                size={15}
                                color={colors.BASIC.WHITE}
                            />
                            <GapView width={5} />
                            <BetterText
                                fontWeight="Regular"
                                textColor={colors.BASIC.WHITE}
                                fontSize={15}
                            >
                                {objective?.extra?.hands !== undefined
                                    ? String(objective.extra.hands)
                                    : "N/A"}{" "}
                                hand
                            </BetterText>
                        </View>
                    )}
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
                                color={colors.BASIC.WHITE}
                            />
                            <GapView width={5} />
                            <BetterText
                                fontWeight="Regular"
                                textColor={colors.BASIC.WHITE}
                                fontSize={15}
                            >
                                {objective.extra.speed !== undefined &&
                                objective.extra.speed >= 0 &&
                                objective.extra.speed < speedOptions.length
                                    ? String(
                                          speedOptions[objective.extra.speed][0]
                                      ) +
                                      " (" +
                                      speedOptions[objective.extra.speed][1] +
                                      ")"
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
                                color={colors.BASIC.WHITE}
                            />
                            <GapView width={5} />
                            <BetterText
                                fontWeight="Regular"
                                textColor={colors.BASIC.WHITE}
                                fontSize={15}
                            >
                                {objective?.extra?.amount !== undefined
                                    ? String(objective.extra.amount)
                                    : "N/A"}{" "}
                                push-ups
                            </BetterText>
                            <GapView width={10} />
                            <Ionicons
                                name="front-hand"
                                size={15}
                                color={colors.BASIC.WHITE}
                            />
                            <GapView width={5} />
                            <BetterText
                                fontWeight="Regular"
                                textColor={colors.BASIC.WHITE}
                                fontSize={15}
                            >
                                {objective?.extra?.hands !== undefined
                                    ? String(objective.extra.hands)
                                    : "N/A"}{" "}
                                hand
                            </BetterText>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default InfoIcons;
