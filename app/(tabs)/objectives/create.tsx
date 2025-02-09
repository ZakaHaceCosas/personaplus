/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/app/(tabs)/objectives/create.tsx
 * Basically: A page to create active objectives.
 *
 * <=============================================================================>
 */

import React, { ReactElement, useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import {
    BetterTextNormalText,
    BetterTextSmallerText,
    BetterTextSmallHeader,
    BetterTextSmallText,
} from "@/components/text/better_text_presets";
import GapView from "@/components/ui/gap_view";
import { useTranslation } from "react-i18next";
import {
    ActiveObjectiveWithoutId,
    EditObjectiveParams,
    RealEditObjectiveParams,
    SupportedActiveObjectives,
    SupportedActiveObjectivesList,
    ValidateActiveObjective,
    WeekTuple,
} from "@/types/active_objectives";
import BetterText from "@/components/text/better_text";
import Colors from "@/constants/colors";
import FontSizes from "@/constants/font_sizes";
import { UniversalItemStyle } from "@/constants/ui/pressables";
import Select, { SelectOption } from "@/components/interaction/select";
import { logToConsole } from "@/toolkit/console";
import BetterButton from "@/components/interaction/better_button";
import { GetCommonScreenSize } from "@/constants/screen";
import PageEnd from "@/components/static/page_end";
import {
    CreateActiveObjective,
    EditActiveObjective,
} from "@/toolkit/objectives/active_objectives";
import {
    router,
    UnknownOutputParams,
    useGlobalSearchParams,
} from "expo-router";
import { Routes } from "@/constants/routes";
import { Experiments } from "@/types/user";
import { GetExperiments } from "@/toolkit/experiments";
import TopBar from "@/components/navigation/top_bar";
import { ShowToast } from "@/toolkit/android";
import { GetCurrentDateCorrectly } from "@/toolkit/today";
import { GenerateRandomMessage } from "@/toolkit/strings";

const styles = StyleSheet.create({
    dayContainer: {
        display: "flex",
        flexDirection: "row",
    },
    day: {
        borderRadius: UniversalItemStyle.borderRadius,
        borderWidth: UniversalItemStyle.borderWidth,
        height: 45, // stupid yet functional visual fix.
        alignItems: "center",
        justifyContent: "center",
        flex: 7,
    },
    toggleView: {
        width: GetCommonScreenSize("width"),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    textInput: {
        color: Colors.BASIC.WHITE,
        fontFamily: "BeVietnamPro-Regular",
        fontSize: FontSizes.LARGE,
        flex: 1,
        textAlign: "center",
    },
    dayActualContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
});

// We create the function
export default function CreateActiveObjectivePage(): ReactElement {
    const { t } = useTranslation();
    const params: UnknownOutputParams = useGlobalSearchParams();

    // objective and stuff
    const exerciseOptions: SelectOption[] = SupportedActiveObjectivesList.map(
        (option: string): SelectOption => ({
            label: t(`globals.supportedActiveObjectives.${option}.name`),
            value: option,
            enabled: true,
        }),
    );
    const [objectiveToCreate, updateObjectiveToCreate] =
        useState<ActiveObjectiveWithoutId>({
            exercise: "",
            createdAt: GetCurrentDateCorrectly().string,
            info: {
                days: {
                    MO: false,
                    TU: false,
                    WE: false,
                    TH: false,
                    FR: false,
                    SA: false,
                    SU: false,
                },
                durationMinutes: 0,
                rests: 0,
                restDurationMinutes: 0,
            },
            specificData: {
                dumbbellWeight: 0,
                reps: 0,
                amountOfHands: 2,
                amountOfPushUps: 0,
                estimateSpeed: 0,
            },
        });

    interface EditData {
        enable: boolean;
        id: number | undefined;
    }

    // edit state handling
    const [edit, setEdit] = useState<EditData>({
        enable: false,
        id: undefined,
    });

    useEffect((): void => {
        const typedParams: EditObjectiveParams = params as EditObjectiveParams;
        const realParams: RealEditObjectiveParams = {
            edit: typedParams.edit === "true" ? true : false,
            objective:
                typedParams.edit === "true"
                    ? JSON.parse(typedParams.objective)
                    : "",
        };
        const typedRealParams: RealEditObjectiveParams =
            realParams as RealEditObjectiveParams;
        if (typedRealParams.edit === true) {
            if (ValidateActiveObjective(realParams.objective)) {
                updateObjectiveToCreate(realParams.objective);
                setEdit({
                    enable: true,
                    id: realParams.objective.identifier,
                });
            } else {
                ShowToast(t("errors.activeObjectives.invalidData"));
            }
        }
    }, [params, t]);

    // validation
    const [canCreateObjective, setCanCreateObjective] =
        useState<boolean>(false);

    // random message
    const [randomMessage, setRandomMessage] = useState<string>("");
    useEffect((): void => {
        setRandomMessage(GenerateRandomMessage("createActiveObjective", t));
    }, [t]);

    // some types to avoid duplication
    type InfoValue = "durationMinutes" | "rests" | "restDurationMinutes";
    type SpecificDataValue =
        | "dumbbellWeight"
        | "reps"
        | "amountOfHands"
        | "estimateSpeed"
        | "amountOfPushUps";
    type Value = InfoValue | SpecificDataValue;

    // experiments
    const [experiments, setExperiments] = useState<Experiments>();
    useEffect((): void => {
        async function handle(): Promise<void> {
            setExperiments(await GetExperiments());
        }
        handle();
    }, []);

    function handleToggle(
        operation: "increase" | "decrease",
        value: Value,
    ): void {
        updateObjectiveToCreate(
            (prev: ActiveObjectiveWithoutId): ActiveObjectiveWithoutId => {
                const delta: 1 | -1 = operation === "increase" ? 1 : -1;
                let { durationMinutes, rests, restDurationMinutes } = prev.info;
                let {
                    reps,
                    amountOfHands,
                    estimateSpeed,
                    dumbbellWeight,
                    amountOfPushUps,
                } = prev.specificData;

                function op(num: number): number {
                    return Math.max(parseFloat(String(num)) + delta, 0);
                }

                switch (value) {
                    case "durationMinutes":
                        durationMinutes = op(durationMinutes);
                        break;
                    case "rests":
                        rests = op(rests);
                        /* restDurationMinutes =
                        rests === 0 ? 0 : restDurationMinutes || 1; */
                        break;
                    case "restDurationMinutes":
                        restDurationMinutes = op(restDurationMinutes);
                        break;
                    case "amountOfPushUps":
                        amountOfPushUps = op(amountOfPushUps);
                        break;
                    case "dumbbellWeight":
                        dumbbellWeight = op(dumbbellWeight);
                        break;
                    case "estimateSpeed":
                        const result: number = op(estimateSpeed);
                        if (result >= speedOptions.length) {
                            estimateSpeed = estimateSpeed; // don't do the operation
                            break;
                        }
                        estimateSpeed = result;
                        break;
                    case "reps":
                        reps = op(reps);
                        break;
                    case "amountOfHands":
                        if (operation === "increase" && amountOfHands < 2) {
                            amountOfHands = (amountOfHands + 1) as 1 | 2;
                        } else if (
                            operation === "decrease" &&
                            amountOfHands > 1
                        ) {
                            amountOfHands = (amountOfHands - 1) as 1 | 2;
                        }
                        break;
                }

                return {
                    ...prev,
                    info: {
                        days: prev.info.days, // (glue stick fix)
                        durationMinutes,
                        rests,
                        restDurationMinutes,
                    },
                    specificData: {
                        reps,
                        estimateSpeed,
                        dumbbellWeight,
                        amountOfHands,
                        amountOfPushUps,
                    },
                };
            },
        );
    }

    /**
     * @deprecated
     * @type {[string, string][]}
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

    function handleChange(associatedValue: Value, value: number): void {
        switch (associatedValue) {
            case "rests":
            case "restDurationMinutes":
            case "durationMinutes":
                updateObjectiveToCreate(
                    (
                        prev: ActiveObjectiveWithoutId,
                    ): ActiveObjectiveWithoutId => {
                        return {
                            ...prev,
                            info: {
                                ...prev.info,
                                [associatedValue]: value,
                            },
                        };
                    },
                );
                break;
            case "amountOfHands":
            case "amountOfPushUps":
            case "dumbbellWeight":
            case "estimateSpeed":
            case "reps":
                updateObjectiveToCreate(
                    (
                        prev: ActiveObjectiveWithoutId,
                    ): ActiveObjectiveWithoutId => {
                        return {
                            ...prev,
                            specificData: {
                                ...prev.specificData,
                                [associatedValue]: value,
                            },
                        };
                    },
                );
                break;
        }
    }

    function spawnToggle(associatedValue: Value): ReactElement {
        let displayValue;
        let target;

        const baseTranslateKey =
            "pages.createActiveObjective.questions.actualQuestions";

        const translateKeys = {
            header: `${baseTranslateKey}.${associatedValue}`,
            subHeader:
                associatedValue === "amountOfHands"
                    ? objectiveToCreate.exercise === "Push Ups"
                        ? `${baseTranslateKey}.amountOfHandsPushUpHint`
                        : `${baseTranslateKey}.amountOfHandsLiftingHint`
                    : `${baseTranslateKey}.${associatedValue}Hint`,
        };

        switch (associatedValue) {
            case "rests":
            case "restDurationMinutes":
            case "durationMinutes":
                target = objectiveToCreate.info[associatedValue];
                break;
            case "amountOfHands":
            case "amountOfPushUps":
            case "dumbbellWeight":
            case "estimateSpeed":
            case "reps":
                target = objectiveToCreate.specificData[associatedValue];
                break;
        }

        displayValue = String(target);

        return (
            <>
                <BetterTextSmallHeader>
                    {t(translateKeys.header)}
                </BetterTextSmallHeader>
                <BetterTextSmallText>
                    {t(translateKeys.subHeader)}
                </BetterTextSmallText>
                <GapView height={10} />
                <View style={styles.toggleView}>
                    <BetterButton
                        layout="box"
                        buttonText="-"
                        buttonHint="Reduces the value this button is associated to"
                        style="ACE"
                        action={() => handleToggle("decrease", associatedValue)}
                    />
                    <TextInput
                        placeholder={t(translateKeys.header)}
                        value={displayValue}
                        placeholderTextColor={Colors.MAIN.DEFAULT_ITEM.TEXT}
                        style={styles.textInput}
                        autoCorrect={false}
                        multiline={false}
                        maxLength={5}
                        textAlign="center"
                        keyboardType="decimal-pad"
                        inputMode="decimal"
                        returnKeyType="done"
                        enterKeyHint="done"
                        onChangeText={(value: string): void => {
                            const parsedValue: number = parseFloat(value);
                            const validValue: number = isNaN(parsedValue)
                                ? 0
                                : Math.max(0, parsedValue);
                            handleChange(associatedValue, validValue);
                        }}
                    />
                    <BetterButton
                        layout="box"
                        buttonText="+"
                        buttonHint="Increases the value this button is associated to"
                        style="ACE"
                        action={(): void => {
                            handleToggle("increase", associatedValue);
                        }}
                    />
                </View>
                <GapView height={20} />
            </>
        );
    }

    useEffect((): void => {
        setCanCreateObjective(ValidateActiveObjective(objectiveToCreate, true));
    }, [objectiveToCreate]);

    async function handleCreation(): Promise<void> {
        try {
            if (canCreateObjective) {
                let response: 0 | 1;

                if (edit.enable && edit.id !== undefined) {
                    response = await EditActiveObjective(
                        objectiveToCreate,
                        edit.id,
                        t,
                    );
                } else {
                    response = await CreateActiveObjective(
                        objectiveToCreate,
                        t,
                    );
                }
                if (response !== 0) {
                    logToConsole(
                        `Got 1 as the ${
                            edit.enable
                                ? "EditActiveObjective()"
                                : "CreateActiveObjective()"
                        } response`,
                        "error",
                    );
                }
                router.replace(Routes.MAIN.HOME);
            }
        } catch (e) {
            logToConsole(
                `Error with ${
                    edit.enable
                        ? "EditActiveObjective()"
                        : "CreateActiveObjective()"
                }:\n${e}`,
                "error",
            );
        }
        return;
    }

    return (
        <>
            <TopBar
                includeBackButton={true}
                header={t("pages.createActiveObjective.header")}
                subHeader={randomMessage}
            />
            <BetterTextSmallHeader>
                {t("pages.createActiveObjective.questions.exercise.question")}
            </BetterTextSmallHeader>
            <GapView height={10} />
            <Select
                currentValue={objectiveToCreate.exercise}
                mode="dropdown"
                dialogPrompt={t(
                    "pages.createActiveObjective.questions.exercise.options.title",
                )}
                selectOptions={exerciseOptions}
                changeAction={(value: string | number): void => {
                    if (
                        SupportedActiveObjectivesList.includes(
                            value as SupportedActiveObjectives,
                        )
                    ) {
                        updateObjectiveToCreate(
                            (
                                prev: ActiveObjectiveWithoutId,
                            ): ActiveObjectiveWithoutId => {
                                return {
                                    ...prev,
                                    exercise:
                                        value as SupportedActiveObjectives,
                                };
                            },
                        );
                    } else if (value === "") {
                        logToConsole(
                            t(
                                "errors.pages.createActiveObjective.chooseAnOptionIsNotValid",
                            ),
                            "warn",
                            undefined,
                            true,
                        );
                    } else {
                        logToConsole(
                            `Invalid exercise value: ${value}`,
                            "error",
                        );
                    }
                }}
                t={t}
            />
            <GapView height={20} />
            <BetterTextSmallHeader>
                {t("pages.createActiveObjective.questions.whatDays.question")}
            </BetterTextSmallHeader>
            <BetterTextSmallText>
                {t("pages.createActiveObjective.questions.whatDays.proTip")}
            </BetterTextSmallText>
            <GapView height={10} />
            <View style={styles.dayContainer}>
                {Object.entries(objectiveToCreate.info.days).map(
                    (
                        [key, day]: [string, boolean],
                        index: number,
                    ): ReactElement => {
                        const daysOfWeek: Record<keyof WeekTuple, string> = {
                            MO: t("globals.daysOfTheWeek.Monday.key"),
                            TU: t("globals.daysOfTheWeek.Tuesday.key"),
                            WE: t("globals.daysOfTheWeek.Wednesday.key"),
                            TH: t("globals.daysOfTheWeek.Thursday.key"),
                            FR: t("globals.daysOfTheWeek.Friday.key"),
                            SA: t("globals.daysOfTheWeek.Saturday.key"),
                            SU: t("globals.daysOfTheWeek.Sunday.key"),
                        };
                        const thisDay: string =
                            daysOfWeek[key as keyof WeekTuple];

                        return (
                            <React.Fragment key={key}>
                                <View
                                    style={[
                                        styles.day,
                                        {
                                            borderColor: day
                                                ? Colors.PRIMARIES.ACE
                                                      .ACE_STROKE
                                                : Colors.MAIN.DEFAULT_ITEM
                                                      .STROKE,
                                            backgroundColor: day
                                                ? Colors.PRIMARIES.ACE.ACE
                                                : Colors.MAIN.DEFAULT_ITEM
                                                      .BACKGROUND,
                                        },
                                    ]}
                                >
                                    <Pressable
                                        onPress={(): void =>
                                            updateObjectiveToCreate(
                                                (
                                                    prev: ActiveObjectiveWithoutId,
                                                ): ActiveObjectiveWithoutId => {
                                                    const updatedDays = {
                                                        ...prev.info.days,
                                                        [key]: !day,
                                                    };
                                                    return {
                                                        ...prev,
                                                        info: {
                                                            ...prev.info,
                                                            days: updatedDays,
                                                        },
                                                    };
                                                },
                                            )
                                        }
                                        style={styles.dayActualContainer}
                                    >
                                        <BetterText
                                            textColor={Colors.BASIC.WHITE}
                                            fontSize={FontSizes.REGULAR}
                                            fontWeight="Medium"
                                        >
                                            {thisDay.toUpperCase()}
                                        </BetterText>
                                    </Pressable>
                                </View>
                                {index !== 6 && <GapView width={10} />}
                            </React.Fragment>
                        );
                    },
                )}
            </View>
            <GapView height={20} />
            {spawnToggle("durationMinutes")}
            {spawnToggle("rests")}
            {objectiveToCreate.info.rests > 0 &&
                spawnToggle("restDurationMinutes")}
            {objectiveToCreate.exercise === "Push Ups" &&
                spawnToggle("amountOfPushUps")}
            {objectiveToCreate.exercise === "Lifting" && spawnToggle("reps")}
            {objectiveToCreate.exercise === "Lifting" &&
                spawnToggle("dumbbellWeight")}
            {objectiveToCreate.exercise === "Running" && (
                <>
                    <BetterTextSmallHeader>
                        {t(
                            "pages.createActiveObjective.questions.actualQuestions.estimateSpeed",
                        )}
                    </BetterTextSmallHeader>
                    <BetterTextSmallText>
                        {t(
                            "pages.createActiveObjective.questions.actualQuestions.estimateSpeedHint",
                        )}
                    </BetterTextSmallText>
                    <GapView height={20} />
                    <View style={styles.toggleView}>
                        <BetterButton
                            layout="box"
                            buttonText="-"
                            buttonHint="Reduces the value this button is associated to"
                            style="ACE"
                            action={(): void => {
                                handleToggle("decrease", "estimateSpeed");
                            }}
                        />
                        <View
                            style={{
                                alignItems: "center", // non optimal, but non permanent anyway
                            }}
                        >
                            <BetterTextNormalText>
                                {
                                    speedOptions[
                                        objectiveToCreate.specificData
                                            .estimateSpeed
                                    ][0]
                                }
                            </BetterTextNormalText>
                            <BetterTextSmallText>
                                {
                                    speedOptions[
                                        objectiveToCreate.specificData
                                            .estimateSpeed
                                    ][1]
                                }
                            </BetterTextSmallText>
                        </View>
                        <BetterButton
                            layout="box"
                            buttonText="+"
                            buttonHint="Increases the value this button is associated to"
                            style="ACE"
                            action={(): void => {
                                handleToggle("increase", "estimateSpeed");
                            }}
                        />
                    </View>
                    <GapView height={10} />
                    {experiments?.exp_tracker && (
                        <>
                            <BetterTextSmallerText>
                                {t("experimentNotes.exp_tracker")}
                            </BetterTextSmallerText>
                            <GapView height={10} />
                        </>
                    )}
                </>
            )}

            {(objectiveToCreate.exercise === "Lifting" ||
                objectiveToCreate.exercise === "Push Ups") &&
                spawnToggle("amountOfHands")}
            <BetterButton
                style={canCreateObjective ? "GOD" : "DEFAULT"}
                buttonText={
                    canCreateObjective
                        ? t("globals.interaction.goAheadGood")
                        : t("globals.interaction.somethingIsWrong")
                }
                buttonHint={t("pages.createActiveObjective.createButtonHint")}
                action={async (): Promise<void> => {
                    if (canCreateObjective) {
                        await handleCreation();
                    }
                    return;
                }}
            />
            <PageEnd includeText={false} size="tiny" />
        </>
    );
}
