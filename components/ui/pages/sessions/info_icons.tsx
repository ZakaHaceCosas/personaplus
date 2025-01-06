/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/components/ui/pages/sessions/info_icons.tsx
 * Basically: Informative icons for the session page
 *
 * <=============================================================================>
 */

import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import GapView from "@/components/ui/gap_view";
import { ActiveObjective } from "@/types/active_objectives";
import Colors from "@/constants/colors";
import { useTranslation } from "react-i18next";
import IconView from "../../icon_view";
import { PluralOrNot } from "@/toolkit/strings";
import { StringifyMinutes } from "@/toolkit/today";

const styles = StyleSheet.create({
    iconContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    secondIconContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
});

// TypeScript, supongo...
/**
 * InfoIconsProps
 *
 * @property {ActiveObjective} objective The objective of the current session.
 */
interface InfoIconsProps {
    /**
     * The objective of the current session.
     *
     * @type {ActiveObjective}
     */
    objective: ActiveObjective;
}

/**
 * Returns an array of icons containing info about a certain objective.
 *
 * @param {InfoIconsProps} p The properties for the InfoIcons component.
 * @param {Objective} p.objective The objective of the current session.
 * @returns {ReactElement} The JSX component displaying the icons.
 */
export default function SessionsPageInfoIcons({
    objective,
}: InfoIconsProps): ReactElement {
    const { t } = useTranslation();

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

    const restsString: string = PluralOrNot(
        t("pages.sessions.rests", {
            rests: objective.info.rests,
        }),
        objective.info.rests,
        "en", // TODO - should use userData, though it's not really needed (rest/rests & descanso/descansos work both with english ruling)
    );

    const handsString: string = PluralOrNot(
        t("pages.sessions.hands", {
            hands: objective.specificData.amountOfHands,
        }),
        objective.specificData.amountOfHands,
        "en", // TODO - also this
    );

    return (
        <>
            <View style={styles.iconContainer}>
                <IconView
                    name="snooze"
                    size={15}
                    color={Colors.BASIC.WHITE}
                    text={
                        objective.info.rests === 0
                            ? t("globals.interaction.none")
                            : `${restsString} (${StringifyMinutes(objective.info.restDurationMinutes)})`
                    }
                />
            </View>

            <View style={styles.secondIconContainer}>
                {objective.exercise === "Running" && (
                    <IconView
                        name="speed"
                        size={15}
                        color={Colors.BASIC.WHITE}
                        text={
                            objective.specificData.estimateSpeed !==
                                undefined &&
                            objective.specificData.estimateSpeed >= 0 &&
                            objective.specificData.estimateSpeed <
                                speedOptions.length
                                ? `~${
                                      speedOptions[
                                          objective.specificData.estimateSpeed
                                      ][1]
                                  }`
                                : "N/A"
                        }
                    />
                )}
                {objective.exercise === "Lifting" && (
                    <IconView
                        name="keyboard-double-arrow-down"
                        size={15}
                        color={Colors.BASIC.WHITE}
                        text={
                            objective?.specificData?.amountOfHands !== undefined
                                ? handsString
                                : "N/A"
                        }
                    />
                )}
                {objective.exercise === "Push Ups" && (
                    <>
                        <IconView
                            name="repeat"
                            size={15}
                            color={Colors.BASIC.WHITE}
                            text={
                                objective?.specificData?.amountOfPushUps !==
                                undefined
                                    ? PluralOrNot(
                                          t("pages.sessions.pushUps", {
                                              pushUps:
                                                  objective.specificData
                                                      .amountOfPushUps,
                                          }),
                                          objective.specificData
                                              .amountOfPushUps,
                                          "en",
                                      )
                                    : "N/A"
                            }
                        />
                        <GapView width={10} />
                        <IconView
                            name="front-hand"
                            size={15}
                            color={Colors.BASIC.WHITE}
                            text={
                                objective?.specificData?.amountOfHands !==
                                undefined
                                    ? handsString
                                    : "N/A"
                            }
                        />
                    </>
                )}
            </View>
        </>
    );
}
