// TODO
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
import { PressableStyle } from "@/constants/ui/Pressables";
import Select from "@/components/interaction/Select";
import { logToConsole } from "@/toolkit/debug/Console";
import BetterButton from "@/components/interaction/BetterButton";
import getCommonScreenSize from "@/constants/Screen";

const styles = StyleSheet.create({
    dayContainer: {
        display: "flex",
        flexDirection: "row",
    },
    day: {
        borderRadius: PressableStyle.borderRadius,
        borderWidth: PressableStyle.borderWidth,
        height: PressableStyle.height,
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
                rests: null,
                repetitions: 0,
            },
        });

    // random message
    const [randomMessage, setRandomMessage] = useState<string>("");
    useEffect(() => {
        setRandomMessage(generateRandomMessage("createActiveObjective", t));
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
                    // Asegúrate de que restDuration se maneja correctamente
                    if (updatedInfo.rests === 0) {
                        updatedInfo.rests = 0;
                        updatedInfo.restDuration = 0;
                    } else {
                        updatedInfo.restDuration = prev.info.restDuration || 1; // o algún valor por defecto
                    }
                } else {
                    updatedInfo.rests = operation === "increase" ? 1 : 0;
                    if (updatedInfo.rests === 0) {
                        updatedInfo.restDuration = 0;
                    } else {
                        updatedInfo.restDuration = 1; // establece un valor por defecto
                    }
                }
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

    function spawnToggle(associatedValue: Value) {
        return (
            <>
                <BetterTextSmallHeader>
                    {t(
                        `pages.createActiveObjective.questions.toggles.${associatedValue}`
                    )}
                </BetterTextSmallHeader>
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
                        key={`${associatedValue}input`}
                        returnKeyType="done"
                        // FIXME: i have to write the entire app and i am not wasting my time fixing decimal support
                        // adding the ability to write custom numbers was Alvaro's idea, i'll tell him to fix it
                        onChangeText={(value) => {
                            // i didnt write this regex, but hopefully it works
                            // (it does not)
                            const cleanedValue = value.replace(/[^0-9.]/g, "");
                            const numericValue = parseFloat(cleanedValue);

                            // this thing is to avoid it placing a huge ass "0" if you remove everything to write it yourself
                            if (cleanedValue === "" || isNaN(numericValue)) {
                                updateObjectiveToCreate((prev) => ({
                                    ...prev,
                                    info: {
                                        ...prev.info,
                                        duration: 0,
                                    },
                                }));
                            } else {
                                updateObjectiveToCreate((prev) => ({
                                    ...prev,
                                    info: {
                                        ...prev.info,
                                        duration: numericValue,
                                    },
                                }));
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
        </>
    );
}
