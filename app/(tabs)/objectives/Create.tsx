// app/CreateObjective.tsx
// Objective creation

import React, { useEffect, useState } from "react";
import { View, Pressable, StyleSheet, TextInput } from "react-native";
import {
    BetterTextNormalText,
    BetterTextSmallHeader,
    BetterTextSmallText,
    BetterTextSmallerText,
} from "@/components/text/BetterTextPresets";
import GapView from "@/components/ui/GapView";
import { useTranslation } from "react-i18next";
import {
    ActiveObjectiveWithoutId,
    SupportedActiveObjectivesList,
    SupportedActiveObjectives,
    WeekTuple,
} from "@/types/ActiveObjectives";
import GenerateRandomMessage from "@/toolkit/RandomMessage";
import BetterText from "@/components/text/BetterText";
import Colors from "@/constants/Colors";
import FontSizes from "@/constants/FontSizes";
import { UniversalItemStyle } from "@/constants/ui/Pressables";
import Select, { SelectOption } from "@/components/interaction/Select";
import { logToConsole } from "@/toolkit/debug/Console";
import BetterButton from "@/components/interaction/BetterButton";
import getCommonScreenSize from "@/constants/Screen";
import PageEnd from "@/components/static/PageEnd";
import { CreateActiveObjective } from "@/toolkit/objectives/ActiveObjectives";
import { router } from "expo-router";
import ROUTES from "@/constants/Routes";
import { Experiments } from "@/types/User";
import { GetExperiments } from "@/toolkit/Experiments";
import TopBar from "@/components/navigation/TopBar";

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
        width: getCommonScreenSize("width"),
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
export default function CreateActiveObjectivePage() {
    const { t } = useTranslation(); // translate function

    // objective and stuff
    const exerciseOptions: SelectOption[] = SupportedActiveObjectivesList.map(
        (option: string): SelectOption => ({
            label: t(`globals.supportedActiveObjectives.${option}`),
            value: option,
            enabled: true,
        }),
    );
    const [objectiveToCreate, updateObjectiveToCreate] =
        useState<ActiveObjectiveWithoutId>({
            exercise: "",
            info: {
                days: [false, false, false, false, false, false, false],
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
    useEffect(() => {
        async function handle() {
            setExperiments(await GetExperiments());
        }
        handle();
    }, []);

    function handleToggle(
        operation: "increase" | "decrease",
        value: Value,
    ): void {
        updateObjectiveToCreate((prev: ActiveObjectiveWithoutId) => {
            const delta = operation === "increase" ? 1 : -1;
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
                    estimateSpeed = op(estimateSpeed);
                    break;
                case "reps":
                    reps = op(reps);
                    break;
                case "amountOfHands":
                    if (operation === "increase" && amountOfHands < 2) {
                        amountOfHands = (amountOfHands + 1) as 1 | 2;
                    } else if (operation === "decrease" && amountOfHands > 1) {
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
        });
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

    function handleChange(associatedValue: Value, value: number) {
        switch (associatedValue) {
            case "rests":
            case "restDurationMinutes":
            case "durationMinutes":
                updateObjectiveToCreate((prev) => {
                    return {
                        ...prev,
                        info: {
                            ...prev.info,
                            [associatedValue]: value,
                        },
                    };
                });
                break;
            case "amountOfHands":
            case "amountOfPushUps":
            case "dumbbellWeight":
            case "estimateSpeed":
            case "reps":
                updateObjectiveToCreate((prev) => {
                    return {
                        ...prev,
                        specificData: {
                            ...prev.specificData,
                            [associatedValue]: value,
                        },
                    };
                });
                break;
        }
    }

    function spawnToggle(associatedValue: Value) {
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
                        onChangeText={(value) => {
                            const parsedValue = parseFloat(value);
                            const validValue = isNaN(parsedValue)
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
                        action={() => handleToggle("increase", associatedValue)}
                    />
                </View>
                <GapView height={20} />
            </>
        );
    }

    useEffect(() => {
        function validate() {
            const isInfoValid =
                objectiveToCreate.exercise !== "" &&
                !objectiveToCreate.info.days.every((day) => day === false) && // not all 7 days are false
                objectiveToCreate.info.durationMinutes > 0; // no 0 minutes of exercise

            let isSpecificDataValid = false;

            if (objectiveToCreate.exercise === "Lifting") {
                isSpecificDataValid =
                    (objectiveToCreate.specificData?.dumbbellWeight || 0) > 0 &&
                    [1, 2].includes(
                        objectiveToCreate.specificData?.amountOfHands || 0,
                    ) &&
                    (objectiveToCreate.specificData?.reps || 0) > 0;
            } else if (objectiveToCreate.exercise === "Push Ups") {
                isSpecificDataValid =
                    objectiveToCreate.specificData.amountOfPushUps > 0;
            } else {
                isSpecificDataValid = true; // heh. no validation required.
            }

            return isInfoValid && isSpecificDataValid;
        }

        setCanCreateObjective(validate());
    }, [objectiveToCreate]);

    function handleCreation(): void {
        async function createObjective(): Promise<void> {
            if (canCreateObjective) {
                const response: 0 =
                    await CreateActiveObjective(objectiveToCreate);

                if (response !== 0) {
                    logToConsole(
                        "Error? Got something else than 0 as the CreateActiveObjective() response",
                        "error",
                    );
                }
                router.replace(ROUTES.MAIN.HOME);
            }
        }

        createObjective();
    }

    return (
        <>
            <TopBar
                includeBackButton={true}
                header={t("pages.createActiveObjective.header")}
                subHeader={randomMessage}
            />
            <BetterTextSmallHeader>
                {t("pages.createActiveObjective.questions.whatToDo.question")}
            </BetterTextSmallHeader>
            <GapView height={10} />
            <Select
                currentValue={objectiveToCreate.exercise}
                mode="dropdown"
                dialogPrompt={t(
                    "pages.createActiveObjective.questions.whatToDo.options.title",
                )}
                selectOptions={exerciseOptions}
                changeAction={(value: string | number) => {
                    if (
                        SupportedActiveObjectivesList.includes(
                            value as SupportedActiveObjectives,
                        )
                    ) {
                        updateObjectiveToCreate((prev) => {
                            return {
                                ...prev,
                                exercise: value as SupportedActiveObjectives,
                            };
                        });
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
                            "Invalid exercise value: " + value,
                            "error",
                            undefined,
                            false,
                        );
                    }
                }}
                t={t}
            />
            <GapView height={20} />
            <BetterTextSmallHeader>
                {t("pages.createActiveObjective.questions.whenToDo.question")}
            </BetterTextSmallHeader>
            <BetterTextSmallText>
                {t("pages.createActiveObjective.questions.whenToDo.proTip")}
            </BetterTextSmallText>
            <GapView height={10} />
            <View style={styles.dayContainer}>
                {objectiveToCreate.info.days.map((day, index) => {
                    const daysOfWeek: string[] = [
                        t("globals.daysOfTheWeek.monday.key"),
                        t("globals.daysOfTheWeek.tuesday.key"),
                        t("globals.daysOfTheWeek.wednesday.key"),
                        t("globals.daysOfTheWeek.thursday.key"),
                        t("globals.daysOfTheWeek.friday.key"),
                        t("globals.daysOfTheWeek.saturday.key"),
                        t("globals.daysOfTheWeek.sunday.key"),
                    ];
                    const thisDay = daysOfWeek[index];

                    return (
                        <React.Fragment key={index}>
                            <View
                                style={[
                                    styles.day,
                                    {
                                        borderColor: day
                                            ? Colors.PRIMARIES.ACE.ACE_STROKE
                                            : Colors.MAIN.DEFAULT_ITEM.STROKE,
                                        backgroundColor: day
                                            ? Colors.PRIMARIES.ACE.ACE
                                            : Colors.MAIN.DEFAULT_ITEM
                                                  .BACKGROUND,
                                    },
                                ]}
                            >
                                <Pressable
                                    onPress={() =>
                                        updateObjectiveToCreate((prev) => {
                                            const updatedDays: WeekTuple = [
                                                ...prev.info.days,
                                            ];
                                            updatedDays[index] =
                                                !updatedDays[index];
                                            return {
                                                ...prev,
                                                info: {
                                                    ...prev.info,
                                                    days: updatedDays,
                                                },
                                            };
                                        })
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
                })}
            </View>
            <GapView height={20} />
            {spawnToggle("durationMinutes")}
            {spawnToggle("rests")}
            {objectiveToCreate.info.restDurationMinutes &&
                objectiveToCreate.info.restDurationMinutes > 0 &&
                spawnToggle("restDurationMinutes")}
            {
                // forgive me for promising that R6 would address all code duplication and yet making this
                // i got no fucking spare time to deal with this
                // this is still my first react / typescript actual project, hope you don't expect more than this :[
                // (im writing this like weeks before making this public, who am i asking forgiveness too)
                // (javascript made me go weird :skull:)
                // (02/12/2024: everything should be fixed by now but realizing i wrote this back then feels so funny im gonna leave this comment for now LOL)
            }
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
                            action={() =>
                                handleToggle("decrease", "estimateSpeed")
                            }
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
                            action={() =>
                                handleToggle("increase", "estimateSpeed")
                            }
                        />
                    </View>
                    <GapView height={10} />
                    {experiments?.exp_tracker && (
                        <>
                            <BetterTextSmallerText>
                                PS. You have the tracker experiment enabled, so
                                this value is useless and won't be used.
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
                buttonHint="Creates the desired active objective. In case of missing or invalid fields, it won't do anything."
                action={canCreateObjective ? () => handleCreation() : () => {}}
            />
            <PageEnd includeText={false} size="tiny" />
        </>
    );
}
