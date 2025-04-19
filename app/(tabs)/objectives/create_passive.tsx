/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
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
    useMemo,
    useRef,
    useState,
} from "react";
import GapView from "@/components/ui/gap_view";
import { useTranslation } from "react-i18next";
import BetterButton from "@/components/interaction/better_button";
import PageEnd from "@/components/static/page_end";
import {
    router,
    UnknownOutputParams,
    useGlobalSearchParams,
} from "expo-router";
import { Routes } from "@/constants/routes";
import TopBar from "@/components/navigation/top_bar";
import { GenerateRandomMessage } from "@/toolkit/strings";
import {
    CreatePassiveObjective,
    EditPassiveObjective,
    GetPassiveObjective,
} from "@/toolkit/objectives/passive_objectives";
import { GetCurrentDateCorrectly } from "@/toolkit/today";
import BetterInputField from "@/components/interaction/better_input_field";
import { TextInput } from "react-native";
import { HandleEditObjective } from "@/toolkit/objectives/common";
import { ShowToast } from "@/toolkit/android";

// We create the function
export default function CreatePassiveObjectivePage(): ReactElement {
    const { t } = useTranslation();

    const [goalToCreate, updateGoalToCreate] = useState<string>("");

    // validation
    const [canCreateGoal, setCanCreateGoal] = useState<boolean>(false);

    // random message
    const randomMessage: string = useMemo(
        (): string => GenerateRandomMessage("createPassiveObjective", t),
        [t],
    );

    // edit handler
    const params: UnknownOutputParams = useGlobalSearchParams();

    const [edit, setEdit] = useState<{
        enable: boolean;
        id: number | null;
    }>({
        enable: false,
        id: null,
    });

    useEffect((): void => {
        const edit: number | "invalidData" | "noEdit" = HandleEditObjective(
            params,
            "passive",
        );
        if (edit === "invalidData") {
            ShowToast(t("errors.activeObjectives.invalidData"));
            router.replace(Routes.MAIN.HOME);
            return;
        }
        if (edit === "noEdit") return;
        setEdit({
            enable: true,
            id: edit,
        });
    }, [params, t]);

    useEffect(() => {
        if (edit.enable === false) return;
        async function handler() {
            if (!edit.id) return;
            const o = await GetPassiveObjective(edit.id);
            if (!o) {
                console.error(
                    "Impossible: attempted to edit null objective after verifying it's not null",
                );
                return;
            }
            updateGoalToCreate(o.goal);
        }
        handler();
    }, [edit]);

    useEffect((): void => {
        setCanCreateGoal(
            goalToCreate.trim().length === 0
                ? false
                : goalToCreate.trim().length >= 3 &&
                goalToCreate.trim().length < 120,
        );
    }, [goalToCreate]);

    async function handleCreation(): Promise<void> {
        if (!canCreateGoal) return;

        if (edit.enable && edit.id) {
            await EditPassiveObjective(
                {
                    goal: goalToCreate,
                    createdAt: GetCurrentDateCorrectly().string,
                },
                edit.id,
                t,
            );
        } else {
            await CreatePassiveObjective(
                {
                    goal: goalToCreate,
                    createdAt: GetCurrentDateCorrectly().string,
                },
                t,
            );
        }
        router.replace(Routes.MAIN.HOME);

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
                label={t("pages.createPassiveObjective.subHeader")}
                placeholder={t("pages.createPassiveObjective.placeholder")}
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
                validatorMessage={t("pages.createPassiveObjective.validator")}
            />
            <GapView height={10} />
            <BetterButton
                style={canCreateGoal ? "ACE" : "DEFAULT"}
                buttonText={
                    canCreateGoal
                        ? t("globals.interaction.goAheadGood")
                        : t("globals.interaction.somethingIsWrong")
                }
                buttonHint={t("pages.createPassiveObjective.createButtonHint")}
                action={async (): Promise<void> => {
                    await handleCreation();
                }}
            />
            <PageEnd includeText={false} size="tiny" />
        </>
    );
}
