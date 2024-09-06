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
import generateRandomMessage from "@/toolkit/RandomSenteces";
import BetterText from "@/components/text/BetterText";
import Colors from "@/constants/Colors";
import FontSizes from "@/constants/FontSizes";
import { UniversalPressableStyle } from "@/constants/ui/Pressables";
import Select from "@/components/interaction/Select";
import { logToConsole } from "@/toolkit/debug/Console";
import BetterButton from "@/components/interaction/BetterButton";
import getCommonScreenSize from "@/constants/Screen";
import PageEnd from "@/components/static/PageEnd";
import { CreateActiveObjective } from "@/toolkit/objectives/ActiveObjectives";
import { router } from "expo-router";

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
});

// We create the function
export default function CreateActiveObjectivePage() {
    const { t } = useTranslation(); // translate function

    // objective and stuff
    const exercises = SupportedActiveObjectivesList;
    const exerciseOptions = exercises.map((option) => ({
        label: option,
        value: option,
        enabled: true,
    }));
    const [objectiveToCreate, updateObjectiveToCreate] =
        useState<ActiveObjectiveWithoutId>({
            exercise: "",
            info: {
                days: [false, false, false, false, false, false, false],
                duration: 0,
                rests: 0,
                repetitions: 0,
                restDuration: 0,
            },
            specificData: {
                scaleWeight: 0,
                barWeight: 0,
                reps: 0,
                dumbbells: 0,
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
    useEffect(() => {
        setRandomMessage(generateRandomMessage("createActiveObjective", t));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // some types to avoid duplication
    type Operation = "increase" | "decrease";
    type Value = "duration" | "rests" | "restDuration" | "repetitions";

    function handleToggle(operation: Operation, value: Value) {
        updateObjectiveToCreate((prev) => {
            let updatedInfo = { ...prev.info };

            if (value === "duration") {
                const currentDuration = prev.info.duration;
                updatedInfo.duration =
                    operation === "increase"
                        ? currentDuration + 1
                        : Math.max(currentDuration - 1, 0);
            } else if (value === "rests") {
                const currentRests = prev.info.rests;

                if (currentRests !== null) {
                    updatedInfo.rests =
                        operation === "increase"
                            ? currentRests + 1
                            : Math.max(currentRests - 1, 0);
                    if (updatedInfo.rests === 0) {
                        updatedInfo.rests = 0;
                        updatedInfo.restDuration = 0;
                    } else {
                        updatedInfo.restDuration = prev.info.restDuration || 1;
                    }
                } else {
                    updatedInfo.rests = operation === "increase" ? 1 : 0;
                    if (updatedInfo.rests === 0) {
                        updatedInfo.restDuration = 0;
                    } else {
                        updatedInfo.restDuration = 1;
                    }
                }
            } else if (value === "restDuration") {
                const currentRestDuration = prev.info.restDuration ?? 0;
                updatedInfo.restDuration =
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
            | "scaleWeight"
            | "barWeight"
            | "reps"
            | "dumbbells"
            | "amountOfHands"
            | "estimateSpeed"
            | "amountOfPushUps"
    ): void {
        if (value !== "amountOfHands") {
            if (action === "increase") {
                if (value === "amountOfPushUps") {
                    updateObjectiveToCreate((prev) => ({
                        ...prev,
                        specificData: {
                            ...prev.specificData,
                            amountOfPushUps:
                                prev.specificData.amountOfPushUps + 1,
                        },
                    }));
                } else if (value === "barWeight") {
                    updateObjectiveToCreate((prev) => ({
                        ...prev,
                        specificData: {
                            ...prev.specificData,
                            barWeight: prev.specificData.barWeight + 1,
                        },
                    }));
                } else if (value === "dumbbells") {
                    updateObjectiveToCreate((prev) => ({
                        ...prev,
                        specificData: {
                            ...prev.specificData,
                            dumbbells: prev.specificData.dumbbells + 1,
                        },
                    }));
                } else if (value === "estimateSpeed") {
                    updateObjectiveToCreate((prev) => ({
                        ...prev,
                        specificData: {
                            ...prev.specificData,
                            estimateSpeed: prev.specificData.estimateSpeed + 1,
                        },
                    }));
                } else if (value === "reps") {
                    updateObjectiveToCreate((prev) => ({
                        ...prev,
                        specificData: {
                            ...prev.specificData,
                            reps: prev.specificData.reps + 1,
                        },
                    }));
                } else if (value === "scaleWeight") {
                    updateObjectiveToCreate((prev) => ({
                        ...prev,
                        specificData: {
                            ...prev.specificData,
                            scaleWeight: prev.specificData.scaleWeight + 1,
                        },
                    }));
                }
            } else if (action === "decrease") {
                if (value === "amountOfPushUps") {
                    updateObjectiveToCreate((prev) => ({
                        ...prev,
                        specificData: {
                            ...prev.specificData,
                            amountOfPushUps:
                                prev.specificData.amountOfPushUps - 1,
                        },
                    }));
                } else if (value === "barWeight") {
                    updateObjectiveToCreate((prev) => ({
                        ...prev,
                        specificData: {
                            ...prev.specificData,
                            barWeight: prev.specificData.barWeight - 1,
                        },
                    }));
                } else if (value === "dumbbells") {
                    updateObjectiveToCreate((prev) => ({
                        ...prev,
                        specificData: {
                            ...prev.specificData,
                            dumbbells: prev.specificData.dumbbells - 1,
                        },
                    }));
                } else if (value === "estimateSpeed") {
                    updateObjectiveToCreate((prev) => ({
                        ...prev,
                        specificData: {
                            ...prev.specificData,
                            estimateSpeed: prev.specificData.estimateSpeed - 1,
                        },
                    }));
                } else if (value === "reps") {
                    updateObjectiveToCreate((prev) => ({
                        ...prev,
                        specificData: {
                            ...prev.specificData,
                            reps: prev.specificData.reps - 1,
                        },
                    }));
                } else if (value === "scaleWeight") {
                    updateObjectiveToCreate((prev) => ({
                        ...prev,
                        specificData: {
                            ...prev.specificData,
                            scaleWeight: prev.specificData.scaleWeight - 1,
                        },
                    }));
                }
            }
        } else if (value === "amountOfHands") {
            if (
                action === "increase" &&
                objectiveToCreate.specificData.amountOfHands < 2
            ) {
                updateObjectiveToCreate((prev) => ({
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
                updateObjectiveToCreate((prev) => ({
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
                        `pages.createActiveObjective.questions.toggles.${associatedValue}`
                    )}
                </BetterTextSmallHeader>
                <BetterTextSmallText>
                    {t(
                        `pages.createActiveObjective.questions.toggles.${associatedValue}Hint`
                    )}
                </BetterTextSmallText>
                <GapView height={10} />
                <View style={styles.toggleView}>
                    <BetterButton
                        layout="box"
                        buttonText="-"
                        style="ACE"
                        action={() => handleToggle("decrease", associatedValue)}
                    />
                    <TextInput
                        placeholder={t(
                            `pages.createActiveObjective.questions.toggles.${associatedValue}Hint`
                        )}
                        value={String(objectiveToCreate.info[associatedValue])}
                        placeholderTextColor={Colors.MAIN.BLANDITEM.PLACEHOLDER}
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
                            // i didnt write this regex, but hopefully it works
                            // (it does not)
                            const cleanedValue = value.replace(/[^0-9.]/g, "");
                            const numericValue = parseFloat(cleanedValue);

                            // this thing is to avoid it placing a huge ass "0" if you remove everything to write it yourself
                            if (cleanedValue === "" || isNaN(numericValue)) {
                                if (associatedValue === "duration") {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        info: {
                                            ...prev.info,
                                            duration: 0,
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
                                } else if (associatedValue === "restDuration") {
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
                                if (associatedValue === "duration") {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        info: {
                                            ...prev.info,
                                            duration: numericValue,
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
                                } else if (associatedValue === "restDuration") {
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
            const isInfovalid =
                !objectiveToCreate.info.days.every((day) => day === false) && // not all 7 days are false
                objectiveToCreate.info.duration > 0; // no 0 minutes of exercise

            let isSpecificDataValid = false;

            if (objectiveToCreate.exercise === "Lifting") {
                isSpecificDataValid =
                    (objectiveToCreate.specificData?.barWeight || 0) > 0 &&
                    (objectiveToCreate.specificData?.scaleWeight || 0) > 0 &&
                    (objectiveToCreate.specificData?.dumbbells || 0) > 0 &&
                    (objectiveToCreate.specificData?.reps || 0) > 0;
            } else if (objectiveToCreate.exercise === "Push Ups") {
                isSpecificDataValid =
                    objectiveToCreate.specificData.amountOfPushUps > 0;
            } else if (objectiveToCreate.exercise === "Running") {
                isSpecificDataValid =
                    !!objectiveToCreate.specificData.estimateSpeed; // ensure it's boolean
            } else if (objectiveToCreate.exercise === "Walking") {
                isSpecificDataValid = true; // validate directly, as there's nothing to validate...
            }

            return isInfovalid && isSpecificDataValid;
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
                        "error"
                    );
                }
                router.navigate("/");
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
                    "pages.createActiveObjective.questions.whatToDo.options.title"
                )}
                selectOptions={exerciseOptions}
                changeAction={(value: string | number) => {
                    if (
                        SupportedActiveObjectivesList.includes(
                            value as SupportedActiveObjectives
                        )
                    ) {
                        updateObjectiveToCreate((prev) => {
                            logToConsole(
                                "prev" +
                                    JSON.stringify(prev) +
                                    "value:" +
                                    value,
                                "log"
                            );

                            return {
                                ...prev,
                                exercise: value as SupportedActiveObjectives,
                            };
                        });
                    } else if (value === "") {
                        logToConsole(
                            t(
                                "errors.pages.createActiveObjective.chooseAnOptionIsNotValid"
                            ),
                            "warn",
                            true
                        );
                    } else {
                        logToConsole(
                            "Invalid exercise value: " + value,
                            "error",
                            false
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
                    const thisday: string =
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
                                        ? Colors.PRIMARIES.ACE.ACESTRK
                                        : Colors.MAIN.BLANDITEM.STRK,
                                    backgroundColor: day
                                        ? Colors.PRIMARIES.ACE.ACE
                                        : Colors.MAIN.BLANDITEM.BACKGROUND,
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
                                                boolean
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
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flex: 1,
                                    }}
                                >
                                    <BetterText
                                        textColor={Colors.BASIC.WHITE}
                                        fontSize={FontSizes.REGULAR}
                                        fontWeight="Medium"
                                    >
                                        {thisday.toUpperCase()}
                                    </BetterText>
                                </Pressable>
                            </View>
                            {index !== 6 && <GapView width={10} />}
                        </React.Fragment>
                    );
                })}
            </View>
            <GapView height={20} />
            {spawnToggle("duration")}
            {spawnToggle("rests")}
            {objectiveToCreate.info.restDuration! > 0 &&
                spawnToggle("restDuration")}
            {spawnToggle("repetitions")}
            {
                // forgive me for promising that R6 would adress all code duplication and yet making this
                // i got no fkng spare time to deal with this
                // this is still my first react / typescript actual project, hope you dont expect more than this :[
                // (im writing this like weeks before making this public, who am i asking forgivness too)
                // (javascript made me go weird :skull:)
            }
            {objectiveToCreate.exercise === "Push Ups" && (
                <>
                    <BetterTextSmallHeader>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.pushUps.howManyPushUps.question"
                        )}
                    </BetterTextSmallHeader>
                    <BetterTextSmallText>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.pushUps.howManyPushUps.proTip"
                        )}
                    </BetterTextSmallText>
                    <GapView height={10} />
                    <View style={styles.toggleView}>
                        <BetterButton
                            layout="box"
                            buttonText="-"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle(
                                    "decrease",
                                    "amountOfPushUps"
                                )
                            }
                        />
                        <TextInput
                            value={String(
                                objectiveToCreate.specificData.amountOfPushUps
                            )}
                            placeholderTextColor={
                                Colors.MAIN.BLANDITEM.PLACEHOLDER
                            }
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
                            style="ACE"
                            action={() =>
                                handleSpecificToggle(
                                    "increase",
                                    "amountOfPushUps"
                                )
                            }
                        />
                    </View>
                    <GapView height={20} />
                </>
            )}
            {objectiveToCreate.exercise === "Lifting" && (
                <>
                    <BetterTextSmallHeader>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.lifting.howManyReps.question"
                        )}
                    </BetterTextSmallHeader>
                    <BetterTextSmallText>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.lifting.howManyReps.proTip"
                        )}
                    </BetterTextSmallText>
                    <GapView height={10} />
                    <View style={styles.toggleView}>
                        <BetterButton
                            layout="box"
                            buttonText="-"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle("decrease", "reps")
                            }
                        />
                        <TextInput
                            value={String(objectiveToCreate.specificData.reps)}
                            placeholderTextColor={
                                Colors.MAIN.BLANDITEM.PLACEHOLDER
                            }
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
                                    ""
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
                            style="ACE"
                            action={() =>
                                handleSpecificToggle("increase", "reps")
                            }
                        />
                    </View>
                    <GapView height={20} />
                    <BetterTextSmallHeader>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.lifting.Dumbbells.question"
                        )}
                    </BetterTextSmallHeader>
                    <BetterTextSmallText>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.lifting.howManyDumbbells.proTip"
                        )}
                    </BetterTextSmallText>
                    <GapView height={10} />
                    <View style={styles.toggleView}>
                        <BetterButton
                            layout="box"
                            buttonText="-"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle("decrease", "dumbbells")
                            }
                        />
                        <TextInput
                            value={String(
                                objectiveToCreate.specificData.dumbbells
                            )}
                            placeholderTextColor={
                                Colors.MAIN.BLANDITEM.PLACEHOLDER
                            }
                            style={styles.textInput}
                            autoCorrect={false}
                            multiline={false}
                            maxLength={3}
                            textAlign="center"
                            keyboardType="decimal-pad"
                            inputMode="decimal"
                            key={`${objectiveToCreate.specificData.dumbbells}input`}
                            returnKeyType="done"
                            enterKeyHint="done"
                            onChangeText={(value) => {
                                const cleanedValue = value.replace(
                                    /[^0-9.]/g,
                                    ""
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
                                            dumbbells: 0,
                                        },
                                    }));
                                } else {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        specificData: {
                                            ...prev.specificData,
                                            dumbbells: numericValue,
                                        },
                                    }));
                                }
                            }}
                        />
                        <BetterButton
                            layout="box"
                            buttonText="+"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle("increase", "dumbbells")
                            }
                        />
                    </View>
                    <GapView height={20} />
                    <BetterTextSmallHeader>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.lifting.howMuchDoesThePlateWeight.question"
                        )}
                    </BetterTextSmallHeader>
                    <BetterTextSmallText>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.lifting.howMuchDoesThePlateWeight.proTip"
                        )}
                    </BetterTextSmallText>
                    <GapView height={10} />
                    <View style={styles.toggleView}>
                        <BetterButton
                            layout="box"
                            buttonText="-"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle("decrease", "scaleWeight")
                            }
                        />
                        <TextInput
                            value={String(
                                objectiveToCreate.specificData.scaleWeight
                            )}
                            placeholderTextColor={
                                Colors.MAIN.BLANDITEM.PLACEHOLDER
                            }
                            style={styles.textInput}
                            autoCorrect={false}
                            multiline={false}
                            maxLength={5}
                            textAlign="center"
                            keyboardType="decimal-pad"
                            inputMode="decimal"
                            key={`${objectiveToCreate.specificData.scaleWeight}input`}
                            returnKeyType="done"
                            enterKeyHint="done"
                            onChangeText={(value) => {
                                const cleanedValue = value.replace(
                                    /[^0-9.]/g,
                                    ""
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
                                            scaleWeight: 0,
                                        },
                                    }));
                                } else {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        specificData: {
                                            ...prev.specificData,
                                            scaleWeight: numericValue,
                                        },
                                    }));
                                }
                            }}
                        />
                        <BetterButton
                            layout="box"
                            buttonText="+"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle("increase", "scaleWeight")
                            }
                        />
                    </View>
                    <GapView height={20} />

                    <BetterTextSmallHeader>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.lifting.howMuchDoesTheBarWeight.question"
                        )}
                    </BetterTextSmallHeader>
                    <BetterTextSmallText>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.lifting.howMuchDoesTheBarWeight.proTip"
                        )}
                    </BetterTextSmallText>
                    <GapView height={10} />
                    <View style={styles.toggleView}>
                        <BetterButton
                            layout="box"
                            buttonText="-"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle("decrease", "barWeight")
                            }
                        />
                        <TextInput
                            value={String(
                                objectiveToCreate.specificData.barWeight
                            )}
                            placeholderTextColor={
                                Colors.MAIN.BLANDITEM.PLACEHOLDER
                            }
                            style={styles.textInput}
                            autoCorrect={false}
                            multiline={false}
                            maxLength={5}
                            textAlign="center"
                            keyboardType="decimal-pad"
                            inputMode="decimal"
                            key={`${objectiveToCreate.specificData.barWeight}input`}
                            returnKeyType="done"
                            enterKeyHint="done"
                            onChangeText={(value) => {
                                const cleanedValue = value.replace(
                                    /[^0-9.]/g,
                                    ""
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
                                            barWeight: 0,
                                        },
                                    }));
                                } else {
                                    updateObjectiveToCreate((prev) => ({
                                        ...prev,
                                        specificData: {
                                            ...prev.specificData,
                                            barWeight: numericValue,
                                        },
                                    }));
                                }
                            }}
                        />
                        <BetterButton
                            layout="box"
                            buttonText="+"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle("increase", "barWeight")
                            }
                        />
                    </View>
                    <GapView height={20} />
                </>
            )}

            {objectiveToCreate.exercise === "Running" && (
                <>
                    <BetterTextSmallHeader>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.running.howFastToRun.question"
                        )}
                    </BetterTextSmallHeader>
                    <BetterTextSmallText>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.running.howFastToRun.proTip"
                        )}
                    </BetterTextSmallText>
                    <GapView height={10} />
                    <View style={styles.toggleView}>
                        <BetterButton
                            layout="box"
                            buttonText="-"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle(
                                    "decrease",
                                    "estimateSpeed"
                                )
                            }
                        />
                        <TextInput
                            value={String(
                                objectiveToCreate.specificData.estimateSpeed
                            )}
                            placeholderTextColor={
                                Colors.MAIN.BLANDITEM.PLACEHOLDER
                            }
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
                                    ""
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
                            style="ACE"
                            action={() =>
                                handleSpecificToggle(
                                    "increase",
                                    "estimateSpeed"
                                )
                            }
                        />
                    </View>
                    <GapView height={20} />
                </>
            )}

            {(objectiveToCreate.exercise === "Lifting" ||
                objectiveToCreate.exercise === "Push Ups") && (
                <>
                    <BetterTextSmallHeader>
                        {t(
                            "pages.createActiveObjective.questions.perExercise.hands"
                        )}
                    </BetterTextSmallHeader>
                    <BetterTextSmallText>
                        {t(
                            objectiveToCreate.exercise === "Lifting"
                                ? "pages.createActiveObjective.questions.perExercise.lifting.handsProTip"
                                : "pages.createActiveObjective.questions.perExercise.pushUps.handsProTip"
                        )}
                    </BetterTextSmallText>
                    <GapView height={10} />
                    <View style={styles.toggleView}>
                        <BetterButton
                            layout="box"
                            buttonText="-"
                            style="ACE"
                            action={() =>
                                handleSpecificToggle(
                                    "decrease",
                                    "amountOfHands"
                                )
                            }
                        />
                        <TextInput
                            value={String(
                                objectiveToCreate.specificData.amountOfHands
                            )}
                            placeholderTextColor={
                                Colors.MAIN.BLANDITEM.PLACEHOLDER
                            }
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
                                    ""
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
                            style="ACE"
                            action={() =>
                                handleSpecificToggle(
                                    "increase",
                                    "amountOfHands"
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
                action={canCreateObjective ? () => handleCreation() : () => {}}
            />
            <PageEnd includeText={false} />
        </>
    );
}
