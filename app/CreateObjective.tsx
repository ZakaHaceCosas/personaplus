// app/CreateObjective.tsx
// Objective creation

import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import BetterText from "@/src/BetterText";
import GapView from "@/src/GapView";
import { Picker as Select } from "@react-native-picker/picker";
import Button from "@/src/Buttons";
import { termLog } from "@/src/toolkit/debug/console";
import Notification from "@/src/Notification";
import {
    ActiveObjectiveSupportedExercises,
    ObjectiveWithoutId,
} from "@/src/types/Objective";
import { useTranslation } from "react-i18next";
import colors from "@/src/toolkit/design/colors";
import { createNewActiveObjective } from "@/src/toolkit/objectives";

// We define the styles
const styles = StyleSheet.create({
    containerview: {
        paddingTop: 20,
        width: "100%",
        height: "100%",
    },
    mainview: {
        padding: 20,
        paddingTop: 40,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
    flexydays: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        flexWrap: "wrap",
    },
    dayContainer: {
        borderRadius: 10,
        borderWidth: 4,
        height: 50,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        width: "100%",
    },
});

// We create the function
export default function CreateObjective() {
    const { t } = useTranslation(); // translate function
    const [exercise, setExercise] =
        useState<ActiveObjectiveSupportedExercises | null>(null); // what exercise is selected
    const exercises = [
        "Push Up",
        "Lifting",
        "Running",
        // "Walking", walking is literally running without the speed option, it's useless XD. so i comment it for now.
        "Meditation", // you... you are also useless...
    ];

    // monday, tuesday, wednesday... etc...
    // each bool value is a day of the week
    const [days, setDays] = useState<
        [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
    >([false, false, false, false, false, false, false]);
    const [duration, setDuration] = useState<number>(0);
    const [repetitions, setRepetitions] = useState<number>(0);
    const [rests, setRests] = useState<number>(0);
    const [restDuration, setRestDuration] = useState<number>(0);
    const [amount, setAmount] = useState<number>(0);
    const [barWeight, setBarWeight] = useState<number>(0);
    const [liftWeight, setLiftWeight] = useState<number>(0);
    const [hands, setHands] = useState<1 | 2>(2);
    const [lifts, setLifts] = useState<number>(0);
    const [timeToPushUp, setTimeToPushup] = useState<number>(0); // i forgot what purpose does this serve, to be honest
    const [speed, setSpeed] = useState<number>(2); // defaults to the 3rd value instead of the 1st one. how is the user going to know if he decrements there are more options? no fucking clue.
    const speedOptions = [
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
    const speedString = speedOptions[speed][0];
    const exactSpeedString = speedOptions[speed][1];

    // you give the index of a day, since its a boolean it just sets it to its opposite to toggle that day on/off
    const handleChangeDay = (index: number) => {
        // "clone" the tuple of current booleans
        const newDays = [...days] as [
            boolean,
            boolean,
            boolean,
            boolean,
            boolean,
            boolean,
            boolean,
        ];
        // change the value of the specified index
        newDays[index] = !newDays[index];
        // update state with updated tuple
        setDays(newDays);
    };

    // handles incrementing each option
    const handleIncrement = (value: string) => {
        switch (value) {
            case "duration":
                setDuration(prev => (prev < 15 ? prev + 1 : prev + 5));
                break;
            case "repetitions":
                setRepetitions(prev => prev + 1);
                break;
            case "rests":
                setRests(prev => prev + 1);
                break;
            case "restDuration":
                setRestDuration(prev => (prev < 5 ? prev + 0.25 : prev));
                break;
            case "amount":
                setAmount(prev => prev + 1);
                break;
            case "barWeight":
                setBarWeight(prev => prev + 0.25);
                break;
            case "liftWeight":
                setLiftWeight(prev => prev + 0.25);
                break;
            case "timeToPushup":
                setTimeToPushup(prev => prev + 0.5);
                break;
            case "lifts":
                setLifts(prev => prev + 1);
                break;
            case "hands":
                setHands(prev => (prev === 1 ? 2 : 1));
                break;
            case "speed":
                setSpeed(prev => {
                    if (prev >= 0 && prev < 11) {
                        return prev + 1;
                    } else {
                        return prev;
                    }
                });
                break;
        }
    };

    // handles decrementing each option
    const handleDecrement = (value: string) => {
        switch (value) {
            case "duration":
                // i hate javascript.
                setDuration(prev => {
                    let newValue; // we create a variable for the value we'll set the duration to

                    // different operation depending on the prev amount
                    if (prev > 5) {
                        newValue = prev - 1;
                    } else if (prev > 1) {
                        newValue = prev - 0.25;
                    } else if (prev > 0.1) {
                        newValue = prev - 0.1;
                    } else {
                        return prev; // just as always, keep a minimun
                    }

                    return parseFloat(newValue.toFixed(2));
                    // round to the 2nd decimal, because javascript doesnt know how to count (im freaking out) (yo flipo)

                    // prev (0.4) - 0.1 = 0.300000000000001
                    // 0.300000000000001 - 0.1 = 0.23298103721873781
                    // - JavaScript
                });
                break;
            case "repetitions":
                setRepetitions(prev => (prev > 0 ? prev - 1 : prev));
                break;
            case "rests":
                setRests(prev => (prev > 0 ? prev - 1 : prev));
                break;
            case "restDuration":
                setRestDuration(prev => (prev > 0 ? prev - 0.25 : prev));
                break;
            case "amount":
                setAmount(prev => prev - 1);
                break;
            case "barWeight":
                setBarWeight(prev => prev - 0.25);
                break;
            case "liftWeight":
                setLiftWeight(prev => prev - 0.25);
                break;
            case "timeToPushup":
                setTimeToPushup(prev => prev - 0.5);
                break;
            case "lifts":
                setLifts(prev => prev - 1);
                break;
            case "hands":
                setHands(prev => (prev === 2 ? 1 : 2));
                break;
            case "speed":
                setSpeed(prev => {
                    if (prev > 0 && prev <= 11) {
                        return prev - 1;
                    } else {
                        return prev;
                    }
                });
                break;
        }
    };

    // handles saving the objective
    const handleCreation = async () => {
        termLog(
            "function handleCreation() was called within CreateObjective.tsx",
            "log"
        );
        if (exercise === null) {
            throw new Error("Exercise cannot be null");
        }

        const formData: ObjectiveWithoutId = {
            exercise,
            days,
            duration,
            repetitions,
            rests,
            restDuration,
            extra: {
                amount,
                lifts,
                liftWeight,
                hands,
                time: timeToPushUp,
                speed,
                barWeight,
            },
        };

        try {
            await createNewActiveObjective(formData, t);
        } catch (e) {
            termLog("Could not create an objective, got error: " + e, "error");
        }
    };

    const areAllConditionsMet = (exercise: string) => {
        if (exercise.toLowerCase() === "push up") {
            return duration > 0 && amount > 0 && (hands === 1 || hands === 2);
        }
        if (exercise.toLowerCase() === "lifting") {
            return (
                (hands === 1 || hands === 2) &&
                liftWeight > 0 &&
                barWeight > 0 &&
                lifts > 0
            );
        }
        if (exercise.toLowerCase() === "running") {
            return speed >= 0 && speed <= 11;
        }
        return true;
    };

    const allConditionsAreMet =
        exercise &&
        duration > 0 &&
        !days.every(day => !day) &&
        areAllConditionsMet(exercise);

    return (
        <View style={styles.containerview}>
            <ScrollView
                style={styles.mainview}
                contentContainerStyle={{ flexGrow: 1 }}
                horizontal={false}
            >
                <BetterText
                    fontSize={20}
                    fontWeight="Light"
                    onTap={router.back}
                >
                    {"<"} {t("globals.go_back")}
                </BetterText>
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={35}>
                    {t("subpage_create_active_objective.header.label")}
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={20}
                >
                    {t("subpage_create_active_objective.header.sublabel")}
                </BetterText>
                <GapView height={20} />
                <View>
                    <BetterText fontSize={20} fontWeight="Regular">
                        {t(
                            "subpage_create_active_objective.questions.what_to_do"
                        )}
                    </BetterText>
                    <GapView height={5} />
                    <Select
                        selectedValue={exercise}
                        onValueChange={itemValue => setExercise(itemValue)}
                        style={{
                            padding: 12,
                            width: "100%",
                            backgroundColor: colors.MAIN.BLANDITEM.BACKGROUND,
                            borderColor: colors.MAIN.BLANDITEM.STRK,
                            borderWidth: 2,
                            borderRadius: 10,
                            color: exercise
                                ? colors.BASIC.WHITE
                                : colors.LBLS.SDD,
                        }}
                        mode="dropdown"
                    >
                        <Select.Item
                            label={t("globals.select_placeholder")}
                            value={null}
                            color={colors.LBLS.SDD}
                        />
                        {exercises.map(ex => (
                            <Select.Item
                                key={ex}
                                label={t(
                                    `globals.supported_active_objectives.${ex}`
                                )}
                                value={ex}
                            />
                        ))}
                    </Select>
                    <GapView height={20} />
                    <BetterText fontSize={20} fontWeight="Regular">
                        {t(
                            "subpage_create_active_objective.questions.when_to_do"
                        )}
                    </BetterText>
                    <BetterText
                        fontSize={10}
                        textColor={colors.LBLS.SDD}
                        fontWeight="Italic"
                    >
                        {t(
                            "subpage_create_active_objective.questions.when_to_do_protip"
                        )}
                    </BetterText>
                    <GapView height={15} />
                    <View style={styles.flexydays}>
                        {days.map((day, index) => {
                            const thisday: string =
                                index === 0
                                    ? t("globals.days_of_the_week.monday")
                                    : index === 1
                                      ? t("globals.days_of_the_week.tuesday")
                                      : index === 2
                                        ? t(
                                              "globals.days_of_the_week.wednesday"
                                          )
                                        : index === 3
                                          ? t(
                                                "globals.days_of_the_week.thursday"
                                            )
                                          : index === 4
                                            ? t(
                                                  "globals.days_of_the_week.friday"
                                              )
                                            : index === 5
                                              ? t(
                                                    "globals.days_of_the_week.saturday"
                                                )
                                              : t(
                                                    "globals.days_of_the_week.sunday"
                                                );
                            return (
                                <View
                                    key={index}
                                    style={{
                                        ...styles.dayContainer,
                                        borderColor: day
                                            ? colors.PRIMARIES.ACE.ACESTRK
                                            : colors.MAIN.BLANDITEM.STRK,
                                        backgroundColor: day
                                            ? colors.PRIMARIES.ACE.ACE
                                            : colors.MAIN.BLANDITEM.BACKGROUND,
                                    }}
                                >
                                    <Pressable
                                        onPress={() => handleChangeDay(index)}
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
                                            textColor={colors.BASIC.WHITE}
                                            fontSize={15}
                                            fontWeight="Medium"
                                        >
                                            {thisday.toUpperCase()}
                                        </BetterText>
                                    </Pressable>
                                </View>
                            );
                        })}
                    </View>
                    <GapView height={20} />
                    {["duration", "repetitions", "rests"].map(item => (
                        <View key={item} style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor={colors.BASIC.WHITE}
                                fontWeight="Regular"
                            >
                                {t(
                                    `subpage_create_active_objective.questions.toggles_labels.${item}`
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="-"
                                    action={() => handleDecrement(item)}
                                />
                                <BetterText
                                    textColor={colors.BASIC.WHITE}
                                    fontSize={20}
                                    fontWeight="Medium"
                                >
                                    {item === "duration"
                                        ? duration
                                        : item === "repetitions"
                                          ? repetitions
                                          : rests}
                                </BetterText>
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="+"
                                    action={() => handleIncrement(item)}
                                />
                            </View>
                        </View>
                    ))}
                    {rests !== 0 && (
                        <View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor={colors.BASIC.WHITE}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.rest_duration"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="-"
                                    action={() =>
                                        handleDecrement("restDuration")
                                    }
                                />
                                <BetterText
                                    textColor={colors.BASIC.WHITE}
                                    fontSize={20}
                                    fontWeight="Medium"
                                >
                                    {restDuration}
                                </BetterText>
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="+"
                                    action={() =>
                                        handleIncrement("restDuration")
                                    }
                                />
                            </View>
                        </View>
                    )}
                    {exercise?.toLowerCase() === "push up" && (
                        <View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor={colors.BASIC.WHITE}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.how_many_pushups"
                                )}
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor={colors.LBLS.SDD}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.how_many_pushups_protip"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="-"
                                    action={() => handleDecrement("amount")}
                                />
                                <BetterText
                                    textColor={colors.BASIC.WHITE}
                                    fontSize={20}
                                    fontWeight="Medium"
                                >
                                    {amount}
                                </BetterText>
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="+"
                                    action={() => handleIncrement("amount")}
                                />
                            </View>
                        </View>
                    )}
                    {exercise?.toLowerCase() === "lifting" && (
                        <View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor={colors.BASIC.WHITE}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.how_many_lifts"
                                )}
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor={colors.LBLS.SDD}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.how_many_lifts_protip"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="-"
                                    action={() => handleDecrement("lifts")}
                                />
                                <BetterText
                                    textColor={colors.BASIC.WHITE}
                                    fontSize={20}
                                    fontWeight="Medium"
                                >
                                    {lifts}
                                </BetterText>
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="+"
                                    action={() => handleIncrement("lifts")}
                                />
                            </View>
                        </View>
                    )}
                    {exercise?.toLowerCase() === "lifting" && (
                        <View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor={colors.BASIC.WHITE}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.how_much_does_the_lift_weight"
                                )}
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor={colors.LBLS.SDD}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.how_much_does_the_lift_weight_protip"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="-"
                                    action={() => handleDecrement("liftWeight")}
                                />
                                <BetterText
                                    textColor={colors.BASIC.WHITE}
                                    fontSize={20}
                                    fontWeight="Medium"
                                >
                                    {liftWeight}
                                </BetterText>
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="+"
                                    action={() => handleIncrement("liftWeight")}
                                />
                            </View>
                        </View>
                    )}
                    {exercise?.toLowerCase() === "lifting" && (
                        <View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor={colors.BASIC.WHITE}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.how_much_does_the_bar_weight"
                                )}
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor={colors.LBLS.SDD}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.how_much_does_the_bar_weight_protip"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="-"
                                    action={() => handleDecrement("barWeight")}
                                />
                                <BetterText
                                    textColor={colors.BASIC.WHITE}
                                    fontSize={20}
                                    fontWeight="Medium"
                                >
                                    {barWeight}
                                </BetterText>
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="+"
                                    action={() => handleIncrement("barWeight")}
                                />
                            </View>
                        </View>
                    )}
                    {exercise?.toLowerCase() === "lifting" && (
                        <View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor={colors.BASIC.WHITE}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.amount_of_hands"
                                )}
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor={colors.LBLS.SDD}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.amount_of_hands_protip_scales"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="-"
                                    action={() => handleDecrement("hands")}
                                />
                                <BetterText
                                    textColor={colors.BASIC.WHITE}
                                    fontSize={20}
                                    fontWeight="Medium"
                                >
                                    {hands}
                                </BetterText>
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="+"
                                    action={() => handleIncrement("hands")}
                                />
                            </View>
                        </View>
                    )}
                    {exercise?.toLowerCase() === "push up" && (
                        <View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor={colors.BASIC.WHITE}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.amount_of_hands"
                                )}
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor={colors.LBLS.SDD}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.amount_of_hands_protip_pushup"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="-"
                                    action={() => handleDecrement("hands")}
                                />
                                <BetterText
                                    textColor={colors.BASIC.WHITE}
                                    fontSize={20}
                                    fontWeight="Medium"
                                >
                                    {hands}
                                </BetterText>
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="+"
                                    action={() => handleIncrement("hands")}
                                />
                            </View>
                        </View>
                    )}
                    {exercise?.toLowerCase() === "running" && (
                        <View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor={colors.BASIC.WHITE}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.what_speed_youll_run"
                                )}
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor={colors.LBLS.SDD}
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.what_speed_youll_run_protip"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="-"
                                    action={() => handleDecrement("speed")}
                                />
                                <View>
                                    <BetterText
                                        textColor={colors.BASIC.WHITE}
                                        fontSize={20}
                                        fontWeight="Medium"
                                        textAlign="center"
                                    >
                                        {speedString}
                                    </BetterText>
                                    <BetterText
                                        textColor={colors.LBLS.SDD}
                                        fontSize={10}
                                        fontWeight="Regular"
                                        textAlign="center"
                                    >
                                        {exactSpeedString}
                                    </BetterText>
                                </View>
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="+"
                                    action={() => handleIncrement("speed")}
                                />
                            </View>
                        </View>
                    )}
                    {repetitions * duration > 300 && (
                        // Lo máximo que me parece coherente son 5 horas seguidas haciendo UN ejercicio - recordemos que puedes tener varios al día
                        // The maximum that makes sense to me it's 5 hours in a row making ONE exercise - remember you can make many each day
                        <>
                            <Notification
                                style="HMM"
                                title={t("globals.are_you_sure")}
                                text={t(
                                    "subpage_create_active_objective.warnings.too_much.text",
                                    { equal: repetitions * duration }
                                )}
                                subtext={t(
                                    "subpage_create_active_objective.warnings.too_much.subtext"
                                )}
                            />
                            <GapView height={20} />
                        </>
                    )}
                    {allConditionsAreMet ? (
                        <Button
                            style="ACE"
                            buttonText={t(
                                "subpage_create_active_objective.buttons.create"
                            )}
                            action={handleCreation}
                        />
                    ) : (
                        <Button
                            style="HMM"
                            buttonText={t("globals.fill_all_items")}
                            action={() => {}}
                        />
                    )}
                    <GapView height={10} />
                    <BetterText
                        textAlign="center"
                        fontSize={9}
                        fontWeight="Italic"
                        textColor={colors.LBLS.SDD}
                    >
                        {t("subpage_create_active_objective.required")}
                    </BetterText>
                </View>
            </ScrollView>
        </View>
    );
}
