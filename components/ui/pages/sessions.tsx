/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/components/ui/pages/sessions.tsx
 * Basically: UI components specific to the sessions page.
 *
 * <=============================================================================>
 */

import React, { ReactElement, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActiveObjective } from "@/types/active_objectives";
import Colors from "@/constants/colors";
import { useTranslation } from "react-i18next";
import IconView from "@/components/ui/icon_view";
import { PluralOrNot } from "@/toolkit/strings";
import BetterText from "@/components/text/better_text";
import GapView from "@/components/ui/gap_view";
import BetterButton from "@/components/interaction/better_button";
import {
    BetterTextSmallHeader,
    BetterTextSmallText,
} from "@/components/text/better_text_presets";
import IslandDivision from "../sections/island_division";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import { ErrorUserData, OrchestrateUserData } from "@/toolkit/user";
import { FullProfile } from "@/types/user";

const styles = StyleSheet.create({
    helpContainer: {
        backgroundColor: Colors.MAIN.SECTION,
        position: "absolute",
        top: "40%",
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "visible",
        padding: 20,
        borderRadius: 20,
        borderColor: Colors.MAIN.DIVISION_BORDER,
        borderWidth: 4,
    },
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

/**
 * A view with helpful info for the user during a session.
 *
 * @export
 * @param {HelpViewProps} p HelpViewProps
 * @param {ActiveObjective} p.objective The ActiveObjective you want help with.
 * @param {() => void} p.toggleHelpMenu The stateful function you'll use to close / toggle this menu.
 * @returns {ReactElement}
 */
export function HelpView({
    objective,
    toggleHelpMenu,
}: {
    /**
     * The ActiveObjective you want help with.
     *
     * @type {ActiveObjective}
     */
    objective: ActiveObjective;
    /**
     * The stateful function you'll use to close / toggle this menu.
     *
     * @type {() => void}
     */
    toggleHelpMenu: () => void;
}): ReactElement {
    const { t } = useTranslation();

    return (
        <View style={styles.helpContainer}>
            <BetterTextSmallHeader>
                {t("globals.interaction.help")}
            </BetterTextSmallHeader>
            <BetterTextSmallText>
                {t(
                    `globals.supportedActiveObjectives.${objective.exercise}.name`,
                )}
            </BetterTextSmallText>
            <GapView height={10} />
            <BetterTextSmallText>
                {t(
                    `globals.supportedActiveObjectives.${objective.exercise}.help`,
                )}
            </BetterTextSmallText>
            <GapView height={10} />
            <BetterButton
                style="ACE"
                buttonText={t("globals.interaction.gotIt")}
                buttonHint="Closes the help menu"
                action={toggleHelpMenu}
            />
            <GapView height={10} />
            <BetterText
                fontSize={10}
                fontWeight="Light"
                textColor={Colors.LABELS.SDD}
                textAlign="center"
            >
                {t("pages.sessions.helpTimerPaused")}
            </BetterText>
        </View>
    );
}

/**
 * Returns an array of icons containing info about a certain objective.
 *
 * @param {InfoIconsProps} p The properties for the InfoIcons component.
 * @param {Objective} p.objective The objective of the current session.
 * @returns {ReactElement} The JSX component displaying the icons.
 */
function InfoIcons({
    objective,
}: {
    /**
     * The objective of the current session.
     *
     * @type {ActiveObjective}
     */
    objective: ActiveObjective;
}): ReactElement {
    const { t } = useTranslation();
    const [user, setUser] = useState<FullProfile>(ErrorUserData);

    useEffect((): void => {
        async function handle(): Promise<void> {
            const userData: FullProfile = await OrchestrateUserData();
            setUser(userData);
        }
        handle();
    }, []);

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

    const handsString: string = PluralOrNot(
        t("pages.sessions.hands", {
            hands: objective.specificData.amountOfHands,
        }),
        objective.specificData.amountOfHands,
        user.language,
    );

    const weightString: string = PluralOrNot(
        t("pages.sessions.weight", {
            weight: objective.specificData.dumbbellWeight,
        }),
        objective.specificData.dumbbellWeight,
        user.language,
    );

    const repsString: string = PluralOrNot(
        t("pages.sessions.reps", {
            reps: objective.specificData.reps,
        }),
        objective.specificData.reps,
        user.language,
    );

    const pushUpsString: string = PluralOrNot(
        t("pages.sessions.pushUps", {
            pushUps: objective.specificData.amountOfPushUps,
        }),
        objective.specificData.amountOfPushUps,
        user.language,
    );

    return (
        <>
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
                                      ]![1]
                                  }`
                                : "N/A"
                        }
                    />
                )}
                {objective.exercise === "Lifting" && (
                    <>
                        <IconView
                            name="front-hand"
                            size={15}
                            color={Colors.BASIC.WHITE}
                            text={handsString ?? "N/A"}
                        />
                        <GapView width={10} />
                        <IconView
                            name="scale"
                            size={15}
                            color={Colors.BASIC.WHITE}
                            text={weightString ?? "N/A"}
                        />
                        <GapView width={10} />
                        <IconView
                            name="loop"
                            size={15}
                            color={Colors.BASIC.WHITE}
                            text={repsString ?? "N/A"}
                        />
                    </>
                )}
                {objective.exercise === "Push Ups" && (
                    <>
                        <IconView
                            name="repeat"
                            size={15}
                            color={Colors.BASIC.WHITE}
                            text={pushUpsString ?? "N/A"}
                        />
                        <GapView width={10} />
                        <IconView
                            name="front-hand"
                            size={15}
                            color={Colors.BASIC.WHITE}
                            text={handsString ?? "N/A"}
                        />
                    </>
                )}
            </View>
        </>
    );
}

/**
 * The top view for the sessions page.
 *
 * @param {{
 *     objective: ActiveObjective;
 *     verbalName: string;
 * }} p0
 * @param {ActiveObjective} p0.objective Objective to show data for.
 * @param {string} p0.verbalName "Verbal name" of the objective.
 * @returns {ReactElement}
 */
export function TopView({
    objective,
    verbalName,
}: {
    /**
     * Objective to show data for.
     *
     * @type {ActiveObjective}
     */
    objective: ActiveObjective;
    /**
     * "Verbal name" of the objective.
     *
     * @type {string}
     */
    verbalName: string;
}): ReactElement {
    const { t } = useTranslation();

    return (
        <>
            <IslandDivision alignment="start" direction="horizontal">
                <Ionicons
                    name="play-arrow"
                    size={20}
                    color={Colors.LABELS.SHL}
                />
                <GapView width={10} />
                <BetterText
                    fontSize={15}
                    fontWeight="Bold"
                    textColor={Colors.LABELS.SHL}
                >
                    {t("pages.sessions.live").toUpperCase()}
                </BetterText>
            </IslandDivision>
            <GapView height={20} />
            <IslandDivision direction="vertical" alignment="center">
                <BetterText
                    fontWeight="Regular"
                    fontSize={12}
                    textAlign="center"
                >
                    {t("pages.sessions.currentObjective")}
                </BetterText>
                <GapView height={10} />
                <BetterText fontWeight="Bold" fontSize={25} textAlign="center">
                    {verbalName}
                </BetterText>
                <InfoIcons objective={objective} />
            </IslandDivision>
        </>
    );
}
