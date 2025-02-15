/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2025 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/app/(tabs)/objectives/create_passive.tsx
 * Basically: A page to create passive objectives.
 *
 * <=============================================================================>
 */

import React, {
    MutableRefObject,
    ReactElement,
    useEffect,
    useRef,
    useState,
} from "react";
import GapView from "@/components/ui/gap_view";
import { useTranslation } from "react-i18next";
import { logToConsole } from "@/toolkit/console";
import BetterButton from "@/components/interaction/better_button";
import PageEnd from "@/components/static/page_end";
import { router } from "expo-router";
import { Routes } from "@/constants/routes";
import TopBar from "@/components/navigation/top_bar";
import { GenerateRandomMessage } from "@/toolkit/strings";
import { CreatePassiveObjective } from "@/toolkit/objectives/passive_objectives";
import { GetCurrentDateCorrectly } from "@/toolkit/today";
import BetterInputField from "@/components/interaction/better_input_field";
import { TextInput } from "react-native";

// We create the function
export default function CreatePassiveObjectivePage(): ReactElement {
    const { t } = useTranslation();

    const [goalToCreate, updateGoalToCreate] = useState<string>("");

    // validation
    const [canCreateGoal, setCanCreateGoal] = useState<boolean>(false);

    // random message
    const [randomMessage, setRandomMessage] = useState<string>("");
    useEffect((): void => {
        setRandomMessage(GenerateRandomMessage("createPassiveObjective", t));
    }, [t]);

    useEffect((): void => {
        setCanCreateGoal(
            goalToCreate.trim().length === 0
                ? false
                : goalToCreate.trim().length > 3 &&
                      goalToCreate.trim().length < 120,
        );
    }, [goalToCreate]);

    async function handleCreation(): Promise<void> {
        try {
            if (!canCreateGoal) return;
            const response: 0 | 1 = await CreatePassiveObjective(
                {
                    goal: goalToCreate,
                    createdAt: GetCurrentDateCorrectly().string,
                },
                t,
            );

            if (response !== 0) {
                logToConsole(
                    "Got 1 as the CreatePassiveObjective() response",
                    "error",
                );
            }

            router.replace(Routes.MAIN.HOME);
        } catch (e) {
            logToConsole(`Error with CreatePassiveObjective()\n${e}`, "error");
        }
        return;
    }
    const inputRef: MutableRefObject<TextInput[]> = useRef<TextInput[]>([]);

    return (
        <>
            <TopBar
                includeBackButton={true}
                header={t("pages.createPassiveObjective.header")}
                subHeader={randomMessage}
            />
            <BetterInputField
                label="What's your goal? Write anything you'd like to do daily."
                placeholder="e.g. 'Don't smoke'"
                value={goalToCreate}
                name="goalToCreateInput"
                refIndex={0}
                keyboardType="default"
                length={120}
                changeAction={(text: string): void => updateGoalToCreate(text)}
                readOnly={false}
                refParams={{
                    inputRefs: inputRef,
                    totalRefs: 1,
                }}
                isValid={
                    goalToCreate.trim().length === 0 ? true : canCreateGoal
                }
                validatorMessage={"Write at least 3 characters."}
            />
            <GapView height={10} />
            <BetterButton
                style={canCreateGoal ? "GOD" : "DEFAULT"}
                buttonText={
                    canCreateGoal
                        ? t("globals.interaction.goAheadGood")
                        : t("globals.interaction.somethingIsWrong")
                }
                buttonHint={t("pages.createPassiveObjective.createButtonHint")}
                action={async (): Promise<void> => {
                    if (canCreateGoal) {
                        await handleCreation();
                    }
                    return;
                }}
            />
            <PageEnd includeText={false} size="tiny" />
        </>
    );
}
