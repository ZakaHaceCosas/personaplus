// TODO: finish this thing
// app/CreateObjective.tsx
// Objective creation

import React, { useEffect, useState } from "react";
import { View, Pressable, StyleSheet, TextInput } from "react-native";
import {
    BetterTextHeader,
    BetterTextSmallHeader,
    BetterTextSmallText,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import GapView from "@/components/ui/GapView";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/navigation/GoBack";
import {
    ActiveObjectiveWithoutId,
    SupportedActiveObjectivesList,
    SupportedActiveObjectives,
} from "@/types/ActiveObjectives";
import GenerateRandomMessage from "@/toolkit/RandomMessage";
import BetterText from "@/components/text/BetterText";
import Colors from "@/constants/Colors";
import FontSizes from "@/constants/FontSizes";
import { UniversalPressableStyle } from "@/constants/ui/Pressables";
import Select, { SelectOption } from "@/components/interaction/Select";
import { logToConsole } from "@/toolkit/debug/Console";
import BetterButton from "@/components/interaction/BetterButton";
import getCommonScreenSize from "@/constants/Screen";
import PageEnd from "@/components/static/PageEnd";
import { CreateActiveObjective } from "@/toolkit/objectives/ActiveObjectives";
import { router } from "expo-router";
import ROUTES from "@/constants/Routes";

const styles = StyleSheet.create({
    dayContainer: {
        display: "flex",
        flexDirection: "row",
    },
    day: {
        borderRadius: UniversalPressableStyle.borderRadius,
        borderWidth: UniversalPressableStyle.borderWidth,
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
    const exercises: string[] = SupportedActiveObjectivesList;
    const exerciseOptions: SelectOption[] = exercises.map(
        (option: string): SelectOption => ({
            label: option,
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
                repetitions: 0,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // some types to avoid duplication
    type Operation = "increase" | "decrease";
    type Value =
        | "durationMinutes"
        | "rests"
        | "restDurationMinutes"
        | "repetitions";

    function handleToggle(operation: Operation, value: Value): void {
        updateObjectiveToCreate((prev: ActiveObjectiveWithoutId) => {
            let updatedInfo = { ...prev.info };

            if (value === "durationMinutes") {
                const currentDurationMinutes = prev.info.durationMinutes;
                updatedInfo.durationMinutes =
                    operation === "increase"
                        ? currentDurationMinutes + 1
                        : Math.max(currentDurationMinutes - 1, 0);
            } else if (value === "rests") {
                const currentRests = prev.info.rests;

                if (currentRests !== null) {
                    updatedInfo.rests =
                        operation === "increase"
                            ? currentRests + 1
                            : Math.max(currentRests - 1, 0);
                    if (updatedInfo.rests === 0) {
                        updatedInfo.rests = 0;
                        updatedInfo.restDurationMinutes = 0;
                    } else {
                        updatedInfo.restDurationMinutes =
                            prev.info.restDurationMinutes || 1;
                    }
                } else {
                    updatedInfo.rests = operation === "increase" ? 1 : 0;
                    if (updatedInfo.rests === 0) {
                        updatedInfo.restDurationMinutes = 0;
                    } else {
                        updatedInfo.restDurationMinutes = 1;
                    }
                }
            } else if (value === "restDurationMinutes") {
                const currentRestDuration = prev.info.restDurationMinutes ?? 0;
                updatedInfo.restDurationMinutes =
                    operation === "increase"
                        ? currentRestDuration + 1
                        : Math.max(currentRestDuration - 1, 0);
            } else if (value === "repetitions") {
                const currentRepetitions = prev.info.repetitions;
                updatedInfo.repetitions =
                    operation === "increase"
                        ? (currentRepetitions ?? 0) + 1
                        : Math.max((currentRepetitions ?? 0) - 1, 0);
            }

            return {
                ...prev,
                info: updatedInfo,
            };
        });
    }

    function handleSpecificToggle(
        action: "increase" | "decrease",
        value:
            | "dumbbellWeight"
            | "reps"
            | "amountOfHands"
            | "estimateSpeed"
            | "amountOfPushUps",
    ): void {
        if (value !== "amountOfHands") {
            if (action === "increase") {
                if (value === "amountOfPushUps") {
                    updateObjectiveToCreate(
                        (prev: ActiveObjectiveWithoutId) => ({
                            ...prev,
                            specificData: {
                                ...prev.specificData,
                                amountOfPushUps:
                                    prev.specificData.amountOfPushUps + 1,
                            },
                        }),
                    );
                } else if (value === "dumbbellWeight") {
                    updateObjectiveToCreate(
                        (prev: ActiveObjectiveWithoutId) => ({
                            ...prev,
                            specificData: {
                                ...prev.specificData,
                                barWeight: prev.specificData.dumbbellWeight + 1,
                            },
                        }),
                    );
                } else if (value === "estimateSpeed") {
                    updateObjectiveToCreate(
                        (prev: ActiveObjectiveWithoutId) => ({
                            ...prev,
                            specificData: {
                                ...prev.specificData,
                                estimateSpeed:
                                    prev.specificData.estimateSpeed + 1,
                            },
                        }),
                    );
                } else if (value === "reps") {
                    updateObjectiveToCreate(
                        (prev: ActiveObjectiveWithoutId) => ({
                            ...prev,
                            specificData: {
                                ...prev.specificData,
                                reps: prev.specificData.reps + 1,
                            },
                        }),
                    );
                }
            } else if (action === "decrease") {
                if (value === "amountOfPushUps") {
                    updateObjectiveToCreate(
                        (prev: ActiveObjectiveWithoutId) => ({
                            ...prev,
                            specificData: {
                                ...prev.specificData,
                                amountOfPushUps:
                                    prev.specificData.amountOfPushUps - 1,
                            },
                        }),
                    );
                } else if (value === "dumbbellWeight") {
                    updateObjectiveToCreate(
                        (prev: ActiveObjectiveWithoutId) => ({
                            ...prev,
                            specificData: {
                                ...prev.specificData,
                                barWeight: prev.specificData.dumbbellWeight - 1,
                            },
                        }),
                    );
                } else if (value === "estimateSpeed") {
                    updateObjectiveToCreate(
                        (prev: ActiveObjectiveWithoutId) => ({
                            ...prev,
                            specificData: {
                                ...prev.specificData,
                                estimateSpeed:
                                    prev.specificData.estimateSpeed - 1,
                            },
                        }),
                    );
                } else if (value === "reps") {
                    updateObjectiveToCreate(
                        (prev: ActiveObjectiveWithoutId) => ({
                            ...prev,
                            specificData: {
                                ...prev.specificData,
                                reps: prev.specificData.reps - 1,
                            },
                        }),
                    );
                }
            }
        } else if (value === "amountOfHands") {
            if (
                action === "increase" &&
                objectiveToCreate.specificData.amountOfHands < 2
            ) {
                updateObjectiveToCreate((prev: ActiveObjectiveWithoutId) => ({
                    ...prev,
                    specificData: {
                        ...prev.specificData,
                        amountOfHands:
                            (prev.specificData.amountOfHands += 1) as 2 | 1,
                    },
                }));
            } else if (
                action === "decrease" &&
                objectiveToCreate.specificData.amountOfHands > 1
            ) {
                updateObjectiveToCreate((prev: ActiveObjectiveWithoutId) => ({
                    ...prev,
                    specificData: {
                        ...prev.specificData,
                        amountOfHands:
                            (prev.specificData.amountOfHands -= 1) as 2 | 1,
                    },
                }));
            }
        }
    }

    function spawnToggle(associatedValue: Value) {
        return (
            <>
                <BetterTextSmallHeader>
                    {t(
                        `pages.createActiveObjective.questions.toggles.${associatedValue}`,
                    )}
                </BetterTextSmallHeader>
                <BetterTextSmallText>
                    {t(
                        `pages.createActiveObjective.questions.toggles.${associatedValue}Hint`,
                    )}
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
                        placeholder={t(
                            `pages.createActiveObjective.questions.toggles.${associatedValue}Hint`,
                        )}
                        value={String(objectiveToCreate.info[associatedValue])}
                        placeholderTextColor={Colors.MAIN.DEFAULT_ITEM.TEXT}
                        style={styles.textInput}
                        autoCorrect={false}
                        multiline={false}
                        maxLength={3}
                        textAlign="center"
                        keyboardType="decimal-pad"
                        inputMode="decimal"
                        key={`${associatedValue}input`}
                        returnKeyType="done"
                        enterKeyHint="done"
                        // FIXME: i have to write the entire app and i am not wasting my time fixing decimal support
                        // adding the ability to write custom numbers was Alvaro's idea, i'll tell him to fix it
                        // Alvaro842DEV do your magic here pls!!1!1
                        onChangeText={(value) => {
                            // i didn't write this regex, but hopefully it works
                            // (it does not)
                            const cleanedValue = value.replace(/[^0-9.]/g, "");
                            const numericValue = parseFloat(cleanedValue);

                            // this thing is to avoid it placing a huge ass "0" if you remove everything to write it yourself
                            if (cleanedValue === "" || isNaN(numericValue)) {
                                if (associatedValue === "durationMinutes") {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        info: {
                                            ...prev.info,
                                            durationMinutes: 0,
                                        },
                                    }));
                                } else if (associatedValue === "repetitions") {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        info: {
                                            ...prev.info,
                                            repetitions: 0,
                                        },
                                    }));
                                } else if (
                                    associatedValue === "restDurationMinutes"
                                ) {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        info: {
                                            ...prev.info,
                                            restDuration: 0,
                                        },
                                    }));
                                } else if (associatedValue === "rests") {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        info: {
                                            ...prev.info,
                                            rests: 0,
                                        },
                                    }));
                                }
                            } else {
                                if (associatedValue === "durationMinutes") {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        info: {
                                            ...prev.info,
                                            durationMinutes: numericValue,
                                        },
                                    }));
                                } else if (associatedValue === "repetitions") {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        info: {
                                            ...prev.info,
                                            repetitions: numericValue,
                                        },
                                    }));
                                } else if (
                                    associatedValue === "restDurationMinutes"
                                ) {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        info: {
                                            ...prev.info,
                                            restDuration: numericValue,
                                        },
                                    }));
                                } else if (associatedValue === "rests") {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        info: {
                                            ...prev.info,
                                            rests: numericValue,
                                        },
                                    }));
                                }
                            }
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
                !objectiveToCreate.info.days.every((day) => day === false) && // not all 7 days are false
                objectiveToCreate.info.durationMinutes > 0; // no 0 minutes of exercise

            let isSpecificDataValid = false;

            if (objectiveToCreate.exercise === "lifting") {
                isSpecificDataValid =
                    (objectiveToCreate.specificData?.dumbbellWeight || 0) > 0 &&
                    [1, 2].includes(
                        objectiveToCreate.specificData?.amountOfHands || 0,
                    ) &&
                    (objectiveToCreate.specificData?.reps || 0) > 0;
            } else if (objectiveToCreate.exercise === "push_ups") {
                isSpecificDataValid =
                    objectiveToCreate.specificData.amountOfPushUps > 0;
            } else if (objectiveToCreate.exercise === "running") {
                isSpecificDataValid =
                    !!objectiveToCreate.specificData.estimateSpeed; // ensure it's boolean
            }

            return isInfoValid && isSpecificDataValid;
        }

        setCanCreateObjective(validate());
    }, [objectiveToCreate]);

    function handleCreation() {
        async function createObjective() {
            if (canCreateObjective) {
                // TODO: this function is tied to the toolkit, which is also a TODO
                const response = await CreateActiveObjective(objectiveToCreate);

                if (response !== 0) {
                    logToConsole(
                        "Error? Got something else than 0 as the CreateActiveObjective() response",
                        "error",
                    );
                }
                router.navigate(ROUTES.MAIN.HOME);
            }
        }

        createObjective();
    }

    return (
        <>
            <BackButton t={t} />
            <GapView height={10} />
            <BetterTextHeader>
                {t("pages.createActiveObjective.header")}
            </BetterTextHeader>
            <BetterTextSubHeader>{randomMessage}</BetterTextSubHeader>
            <GapView height={20} />
            <BetterTextSmallHeader>
                {t("pages.createActiveObjective.questions.whatToDo.question")}
            </BetterTextSmallHeader>
            <GapView height={10} />
            <Select
                currentValue={objectiveToCreate.exercise}
                mode="dialog"
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
                            logToConsole(
                                "prev" +
                                    JSON.stringify(prev) +
                                    "value:" +
                                    value,
                                "log",
                            );

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
                    const thisDay: string =
                        index === 0
                            ? t("globals.daysOfTheWeek.monday.key")
                            : index === 1
                              ? t("globals.daysOfTheWeek.tuesday.key")
                              : index === 2
                                ? t("globals.daysOfTheWeek.wednesday.key")
                                : index === 3
                                  ? t("globals.daysOfTheWeek.thursday.key")
                                  : index === 4
                                    ? t("globals.daysOfTheWeek.friday.key")
                                    : index === 5
                                      ? t("globals.daysOfTheWeek.saturday.key")
                                      : t("globals.daysOfTheWeek.sunday.key");
                    return (
                        <React.Fragment key={index}>
                            <View
                                style={{
                                    ...styles.day,
                                    borderColor: day
                                        ? Colors.PRIMARIES.ACE.ACE_STROKE
                                        : Colors.MAIN.DEFAULT_ITEM.STROKE,
                                    backgroundColor: day
                                        ? Colors.PRIMARIES.ACE.ACE
                                        : Colors.MAIN.DEFAULT_ITEM.BACKGROUND,
                                }}
                            >
                                <Pressable
                                    onPress={() =>
                                        updateObjectiveToCreate((prev) => {
                                            const updatedDays: [
                                                boolean,
                                                boolean,
                                                boolean,
                                                boolean,
                                                boolean,
                                                boolean,
                                                boolean,
                                            ] = [...prev.info.days]; // sorry for this, but otherwise an error (type error actually) happens
                                            updatedDays[index] =
                                                !updatedDays[index]; // basically reverts

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
            {objectiveToCreate.info.restDurationMinutes! > 0 &&
                spawnToggle("restDurationMinutes")}
            {spawnToggle("repetitions")}
            {
                // forgive me for promising that R6 would address all code duplication and yet making this
                // i got no fucking spare time to deal with this
                // this is still my first react / typescript actual project, hope you don't expect more than this :[
                // (im writing this like weeks before making this public, who am i asking forgiveness too)
                // (javascript made me go weird :skull:)
            }
            {objectiveToCreate.exercise === "push_ups" && (
                <>
                    <BetterTextSmallHeader>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.pushUps.howManyPushUps.question",
                        )}
                    </BetterTextSmallHeader>
                    <BetterTextSmallText>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.pushUps.howManyPushUps.proTip",
                        )}
                    </BetterTextSmallText>
                    <GapView height={10} />
                    <View style={styles.toggleView}>
                        <BetterButton
                            layout="box"
                            buttonText="-"
                            buttonHint="Reduces the value this button is associated to"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle(
                                    "decrease",
                                    "amountOfPushUps",
                                )
                            }
                        />
                        <TextInput
                            value={String(
                                objectiveToCreate.specificData.amountOfPushUps,
                            )}
                            placeholderTextColor={Colors.MAIN.DEFAULT_ITEM.TEXT}
                            style={styles.textInput}
                            autoCorrect={false}
                            multiline={false}
                            maxLength={3}
                            textAlign="center"
                            keyboardType="decimal-pad"
                            inputMode="decimal"
                            key={`${objectiveToCreate.specificData.amountOfPushUps}input`}
                            returnKeyType="done"
                            enterKeyHint="done"
                            // FIXME: i have to write the entire app and i am not wasting my time fixing decimal support
                            // adding the ability to write custom numbers was Alvaro's idea, i'll tell him to fix it
                            // Alvaro842DEV do your magic here pls!!1!1
                            onChangeText={(value) => {
                                // this thing is to avoid it placing a huge ass "0" if you remove everything to write it yourself
                                updateObjectiveToCreate((prev) => ({
                                    ...prev,
                                    specificData: {
                                        ...prev.specificData,
                                        amountOfPushUps: Number(value),
                                    },
                                }));
                            }}
                        />
                        <BetterButton
                            layout="box"
                            buttonText="+"
                            buttonHint="Increases the value this button is associated to"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle(
                                    "increase",
                                    "amountOfPushUps",
                                )
                            }
                        />
                    </View>
                    <GapView height={20} />
                </>
            )}
            {objectiveToCreate.exercise === "lifting" && (
                <>
                    <BetterTextSmallHeader>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.lifting.howManyReps.question",
                        )}
                    </BetterTextSmallHeader>
                    <BetterTextSmallText>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.lifting.howManyReps.proTip",
                        )}
                    </BetterTextSmallText>
                    <GapView height={10} />
                    <View style={styles.toggleView}>
                        <BetterButton
                            layout="box"
                            buttonText="-"
                            buttonHint="Reduces the value this button is associated to"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle("decrease", "reps")
                            }
                        />
                        <TextInput
                            value={String(objectiveToCreate.specificData.reps)}
                            placeholderTextColor={Colors.MAIN.DEFAULT_ITEM.TEXT}
                            style={styles.textInput}
                            autoCorrect={false}
                            multiline={false}
                            maxLength={3}
                            textAlign="center"
                            keyboardType="decimal-pad"
                            inputMode="decimal"
                            key={`${objectiveToCreate.specificData.reps}input`}
                            returnKeyType="done"
                            enterKeyHint="done"
                            onChangeText={(value) => {
                                const cleanedValue = value.replace(
                                    /[^0-9.]/g,
                                    "",
                                );
                                const numericValue = parseFloat(cleanedValue);
                                if (
                                    cleanedValue === "" ||
                                    isNaN(numericValue)
                                ) {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        specificData: {
                                            ...prev.specificData,
                                            reps: 0,
                                        },
                                    }));
                                } else {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        specificData: {
                                            ...prev.specificData,
                                            reps: numericValue,
                                        },
                                    }));
                                }
                            }}
                        />
                        <BetterButton
                            layout="box"
                            buttonText="+"
                            buttonHint="Increases the value this button is associated to"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle("increase", "reps")
                            }
                        />
                    </View>
                    <GapView height={20} />
                    <BetterTextSmallHeader>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.lifting.howMuchWeight.question",
                        )}
                    </BetterTextSmallHeader>
                    <BetterTextSmallText>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.lifting.howMuchWeight.proTip",
                        )}
                    </BetterTextSmallText>
                    <GapView height={10} />
                    <View style={styles.toggleView}>
                        <BetterButton
                            layout="box"
                            buttonText="-"
                            buttonHint="Reduces the value this button is associated to"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle(
                                    "decrease",
                                    "dumbbellWeight",
                                )
                            }
                        />
                        <TextInput
                            value={String(
                                objectiveToCreate.specificData.dumbbellWeight,
                            )}
                            placeholderTextColor={Colors.MAIN.DEFAULT_ITEM.TEXT}
                            style={styles.textInput}
                            autoCorrect={false}
                            multiline={false}
                            maxLength={5}
                            textAlign="center"
                            keyboardType="decimal-pad"
                            inputMode="decimal"
                            key={`${objectiveToCreate.specificData.dumbbellWeight}input`}
                            returnKeyType="done"
                            enterKeyHint="done"
                            onChangeText={(value) => {
                                const cleanedValue = value.replace(
                                    /[^0-9.]/g,
                                    "",
                                );
                                const numericValue = parseFloat(cleanedValue);
                                if (
                                    cleanedValue === "" ||
                                    isNaN(numericValue)
                                ) {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        specificData: {
                                            ...prev.specificData,
                                            dumbbellWeight: 0,
                                        },
                                    }));
                                } else {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        specificData: {
                                            ...prev.specificData,
                                            dumbbellWeight: numericValue,
                                        },
                                    }));
                                }
                            }}
                        />
                        <BetterButton
                            layout="box"
                            buttonText="+"
                            buttonHint="Increases the value this button is associated to"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle(
                                    "increase",
                                    "dumbbellWeight",
                                )
                            }
                        />
                    </View>
                    <GapView height={20} />
                </>
            )}

            {objectiveToCreate.exercise === "running" && (
                <>
                    <BetterTextSmallHeader>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.running.howFastToRun.question",
                        )}
                    </BetterTextSmallHeader>
                    <BetterTextSmallText>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.running.howFastToRun.proTip",
                        )}
                    </BetterTextSmallText>
                    <GapView height={10} />
                    <View style={styles.toggleView}>
                        <BetterButton
                            layout="box"
                            buttonText="-"
                            buttonHint="Reduces the value this button is associated to"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle(
                                    "decrease",
                                    "estimateSpeed",
                                )
                            }
                        />
                        <TextInput
                            value={String(
                                objectiveToCreate.specificData.estimateSpeed,
                            )}
                            placeholderTextColor={Colors.MAIN.DEFAULT_ITEM.TEXT}
                            style={styles.textInput}
                            autoCorrect={false}
                            multiline={false}
                            maxLength={3}
                            textAlign="center"
                            keyboardType="decimal-pad"
                            inputMode="decimal"
                            key={`${objectiveToCreate.specificData.estimateSpeed}input`}
                            returnKeyType="done"
                            enterKeyHint="done"
                            onChangeText={(value) => {
                                const cleanedValue = value.replace(
                                    /[^0-9.]/g,
                                    "",
                                );
                                const numericValue = parseFloat(cleanedValue);
                                if (
                                    cleanedValue === "" ||
                                    isNaN(numericValue)
                                ) {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        specificData: {
                                            ...prev.specificData,
                                            estimateSpeed: 0,
                                        },
                                    }));
                                } else {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        specificData: {
                                            ...prev.specificData,
                                            estimateSpeed: numericValue,
                                        },
                                    }));
                                }
                            }}
                        />
                        <BetterButton
                            layout="box"
                            buttonText="+"
                            buttonHint="Increases the value this button is associated to"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle(
                                    "increase",
                                    "estimateSpeed",
                                )
                            }
                        />
                    </View>
                    <GapView height={20} />
                </>
            )}

            {(objectiveToCreate.exercise === "lifting" ||
                objectiveToCreate.exercise === "push_ups") && (
                <>
                    <BetterTextSmallHeader>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.hands",
                        )}
                    </BetterTextSmallHeader>
                    <BetterTextSmallText>
                        {t(
                            objectiveToCreate.exercise === "lifting"
                                ? "pages.createActiveObjective.questions.perExercise.lifting.handsProTip"
                                : "pages.createActiveObjective.questions.perExercise.pushUps.handsProTip",
                        )}
                    </BetterTextSmallText>
                    <GapView height={10} />
                    <View style={styles.toggleView}>
                        <BetterButton
                            layout="box"
                            buttonText="-"
                            buttonHint="Reduces the value this button is associated to"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle(
                                    "decrease",
                                    "amountOfHands",
                                )
                            }
                        />
                        <TextInput
                            value={String(
                                objectiveToCreate.specificData.amountOfHands,
                            )}
                            placeholderTextColor={Colors.MAIN.DEFAULT_ITEM.TEXT}
                            style={styles.textInput}
                            autoCorrect={false}
                            multiline={false}
                            maxLength={1}
                            textAlign="center"
                            keyboardType="number-pad"
                            inputMode="numeric"
                            key={`${objectiveToCreate.specificData.amountOfHands}input`}
                            returnKeyType="done"
                            enterKeyHint="done"
                            onChangeText={(value) => {
                                const cleanedValue = value.replace(
                                    /[^1-2]/g,
                                    "",
                                );
                                const numericValue = parseInt(cleanedValue, 10);
                                if (
                                    cleanedValue === "" ||
                                    isNaN(numericValue) ||
                                    numericValue < 1 ||
                                    numericValue > 2
                                ) {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        specificData: {
                                            ...prev.specificData,
                                            amountOfHands: 1,
                                        },
                                    }));
                                } else {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        specificData: {
                                            ...prev.specificData,
                                            amountOfHands: numericValue as
                                                | 1
                                                | 2,
                                        },
                                    }));
                                }
                            }}
                        />
                        <BetterButton
                            layout="box"
                            buttonText="+"
                            buttonHint="Increases the value this button is associated to"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle(
                                    "increase",
                                    "amountOfHands",
                                )
                            }
                        />
                    </View>
                    <GapView height={20} />
                </>
            )}
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
