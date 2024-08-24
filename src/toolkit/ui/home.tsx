import React, { ReactElement } from "react";
import { View } from "react-native";
import BetterText from "@/src/BetterText";
import { TFunction } from "i18next";
import generateRandomMessage from "@/src/toolkit/design/randomMessages";
import colors from "../design/colors";
import GapView from "@/src/GapView";
import type { Objective } from "@/src/types/Objective";
import Division from "@/src/section/Division";
import Button from "@/src/Buttons";
import { startSessionFromObjective } from "@/src/toolkit/objectives";

// To prevent code from being super nested / unreadable, I've moved some things here, so they act as separate components

/**
 * Generates an "All objectives done!" view. Use it inside of the `<Section kind="objectives">`, for when there are objectives for today but are all done.
 *
 * @export
 * @param {TFunction} t Pass the translate function, please.
 * @returns {ReactElement}
 */
export function RenderAllObjectivesDoneDivision(t: TFunction): ReactElement {
    const message: string = generateRandomMessage("all_done", t);

    return (
        <View
            style={{
                padding: 20,
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <BetterText
                textAlign="center"
                fontSize={30}
                textColor={colors.BASIC.WHITE}
                fontWeight="Bold"
            >
                {t("page_home.no_objectives.all_done")}
            </BetterText>
            <GapView height={10} />
            <BetterText
                textAlign="center"
                fontSize={15}
                textColor={colors.BASIC.WHITE}
                fontWeight="Regular"
            >
                {message}
            </BetterText>
        </View>
    );
}

/**
 * Renders a `<Division>` for a given objective that's due today.
 *
 * @param {Objective} obj The `Objective`
 * @param {TFunction} t Pass here the translate function, please.
 * @returns {ReactElement} A JSX element (a `<Division>`).
 */
export function RenderObjectiveDivision(
    obj: Objective,
    t: TFunction,
    handlerForMarkingAsDone: (arg: number) => void
): ReactElement {
    return (
        <Division
            key={obj.identifier}
            status="REGULAR"
            preheader={t("sections.divisions.active_objective")}
            header={t(`globals.supported_active_objectives.${obj.exercise}`)}
        >
            <Button
                style="ACE"
                action={() => startSessionFromObjective(obj.identifier)}
                buttonText={t("globals.lets_go")}
            />
            <Button
                style="GOD"
                action={() => handlerForMarkingAsDone(obj.identifier)}
                buttonText={t("globals.already_done_it")}
            />
        </Division>
    );
}

/**
 * Shows a header and a button, stating that there are no objectives. Use it when there are no created objectives at all.
 *
 * @param {TFunction} t Pass here the translate function, please.
 * @param {() => void} create A void function to create an objective.
 * @returns {ReactElement} A JSX element.
 */
export function RenderNoObjectivesDivision(
    t: TFunction,
    create: () => void
): ReactElement {
    return (
        <View
            style={{
                padding: 20,
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <BetterText
                textAlign="center"
                fontSize={30}
                textColor={colors.BASIC.WHITE}
                fontWeight="Bold"
            >
                {t("page_home.no_objectives.not_any_objective")}
            </BetterText>
            <GapView height={15} />
            <Button
                width="fill"
                style="ACE"
                buttonText={t("globals.lets_go")}
                action={create}
            />
        </View>
    );
}
