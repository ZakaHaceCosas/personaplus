// components/Form.tsx
// Formulario con select, array de toggles, increment/decrement para duration, repetitions, rests y rest duration
// import "react-native-get-random-values";
import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";
import GapView from "@/components/GapView";
import { Picker as Select } from "@react-native-picker/picker";
import Button from "@/components/Buttons";
import * as Router from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { termLog } from "./DeveloperInterface";
import Notification from "@/components/Notification";
import { Objective, ObjectiveWithoutId } from "@/components/types/Objective";
import { useTranslation } from "react-i18next";
// import { v4 as uuid } from "uuid";
// if you wonder what is UUID doing here, well - after a problem with duplicate IDs i wanted to try this as a solution, but I simply don't like to have such a big ID with letters and dashes, would have to redo some types and stuff.

// Creamos los estilos
const styles = Native.StyleSheet.create({
    containerview: {
        paddingTop: 20,
        width: "100%",
        height: "100%",
    },
    mainview: {
        padding: 20,
        flex: 1,
        flexDirection: "column",
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

export default function Form() {
    const { t } = useTranslation();
    const [exercise, setExercise] = React.useState<string>("");
    const exercises = [
        "Push Up",
        "Lifting",
        "Running",
        "Walking",
        "Meditation",
    ];
    const [days, setDays] = React.useState<boolean[]>([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ]);
    const [duration, setDuration] = React.useState<number>(0);
    const [repetitions, setRepetitions] = React.useState<number>(0);
    const [rests, setRests] = React.useState<number>(0);
    const [restDuration, setRestDuration] = React.useState<number>(0);
    const [amount, setAmount] = React.useState<number>(0);
    const [barWeight, setBarWeight] = React.useState<number>(0);
    const [liftWeight, setLiftWeight] = React.useState<number>(0);
    const [hands, setHands] = React.useState<number>(2);
    const [lifts, setLifts] = React.useState<number>(0);
    const [timeToPushUp, setTimeToPushup] = React.useState<number>(0);
    const [speed, setSpeed] = React.useState<number>(2);
    const speedOptions = [
        ["Brisk Walk", "1.6 - 3.2 km/h"],
        ["Light Jog", "3.2 - 4.0 km/h"],
        ["Moderate Run", "4.0 - 4.8 km/h"],
        ["Fast Run", "4.8 - 5.5 km/h"],
        ["Sprint", "5.5 - 6.4 km/h"],
        ["Fast Sprint", "6.4 - 8.0 km/h"],
        ["Running Fast", "8.0 - 9.6 km/h"],
        ["Very Fast Run", "9.6 - 11.3 km/h"],
        ["Sprinting", "11.3 - 12.9 km/h"],
        ["Fast Sprinting", "12.9 - 14.5 km/h"],
        ["Full Speed Sprinting", "14.5 - 16.1 km/h"],
        ["Maximum Speed", "more than 16.1 km/h"],
    ];

    const speedString = speedOptions[speed][0];
    const exactSpeedString = speedOptions[speed][1];

    const handleChangeDay = (index: number) => {
        const newDays = [...days];
        newDays[index] = !newDays[index];
        setDays(newDays);
    };

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
                setHands(prev => (prev === 1 ? prev + 1 : prev));
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

    const handleDecrement = (value: string) => {
        switch (value) {
            case "duration":
                setDuration(prev => (prev > 1 ? prev - 1 : prev));
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
                setHands(prev => (prev === 2 ? prev - 1 : prev));
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

    const handleSubmit = async () => {
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
            wasDone: false,
        };

        try {
            const storedObjectives: string | null =
                await AsyncStorage.getItem("objectives");
            let objs: Objective[] = [];

            if (storedObjectives !== null) {
                objs = JSON.parse(storedObjectives);
            }

            const generateObjectiveId = (): number => {
                return Math.floor(Math.random() * 9000000000) + 1000000000;
            };

            let newIdentifier: number;
            do {
                newIdentifier = generateObjectiveId();
            } while (objs.some(obj => obj.identifier === newIdentifier));

            const finalObjective: Objective = {
                ...formData,
                identifier: newIdentifier,
            };

            const finalObjectives = [...objs, finalObjective];

            await AsyncStorage.setItem(
                "objectives",
                JSON.stringify(finalObjectives)
            );

            if (Native.Platform.OS === "android") {
                Native.ToastAndroid.show(
                    "Created your objective successfully!",
                    Native.ToastAndroid.SHORT
                );
            }

            Router.router.push("/Dashboard");
        } catch (e) {
            const log = "Could not create an objective, got error: " + e;
            termLog(log, "error");
        }
    };

    const getOut = () => {
        Router.router.push("/");
    };

    let allConditionsAreMet: boolean = false;

    if (
        exercise.toLowerCase() !== "push up" &&
        exercise.toLowerCase() !== "running" &&
        exercise.toLowerCase() !== "lifting"
    ) {
        if (
            duration > 0 &&
            exercise !== "" &&
            days &&
            days.length > 0 &&
            !days.every(day => day === false)
        ) {
            allConditionsAreMet = true;
        } else {
            allConditionsAreMet = false;
        }
    } else if (exercise.toLowerCase() === "push up") {
        if (
            duration > 0 &&
            exercise !== "" &&
            days &&
            days.length > 0 &&
            !days.every(day => day === false) &&
            amount > 0 &&
            // timeToPushUp > 0 &&
            (hands === 1 || hands === 2)
        ) {
            allConditionsAreMet = true;
        } else {
            allConditionsAreMet = false;
        }
    } else if (exercise.toLowerCase() === "lifting") {
        if (
            (duration > 0 &&
                exercise !== "" &&
                days &&
                days.length > 0 &&
                !days.every(day => day === false) &&
                hands === 1 &&
                liftWeight > 0 &&
                barWeight > 0 &&
                lifts > 0) ||
            (duration > 0 &&
                exercise !== "" &&
                days &&
                days.length > 0 &&
                !days.every(day => day === false) &&
                hands === 2 &&
                liftWeight > 0 &&
                barWeight > 0 &&
                lifts > 0)
        ) {
            allConditionsAreMet = true;
        } else {
            allConditionsAreMet = false;
        }
    } else if (exercise.toLowerCase() === "running") {
        if (
            duration > 0 &&
            exercise !== "" &&
            days &&
            days.length > 0 &&
            !days.every(day => day === false) &&
            speed >= 0 &&
            speed <= 11
        ) {
            allConditionsAreMet = true;
        } else {
            allConditionsAreMet = false;
        }
    }

    return (
        <Native.View style={styles.containerview}>
            <Native.ScrollView style={styles.mainview}>
                <BetterText
                    fontSize={20}
                    fontWeight="Light"
                    onTap={() => Router.router.navigate("/About")}
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
                <Native.View>
                    <BetterText
                        fontSize={20}
                        textColor="#FFF"
                        fontWeight="Regular"
                    >
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
                            backgroundColor: "#2A2D32",
                            borderColor: "#3E4146",
                            borderWidth: 2,
                            borderRadius: 10,
                            color: exercise ? "#FFF" : "#999",
                        }}
                        mode="dropdown"
                    >
                        <Select.Item
                            label={t("globals.select_placeholder")}
                            value=""
                            color="#999"
                        />
                        {exercises.map(ex => (
                            <Select.Item
                                key={ex}
                                label={t(
                                    `subpage_create_active_objective.questions.what_to_do_answers.${ex}`
                                )}
                                value={ex}
                            />
                        ))}
                    </Select>
                    <GapView height={20} />
                    <BetterText
                        fontSize={20}
                        textColor="#FFF"
                        fontWeight="Regular"
                    >
                        {t(
                            "subpage_create_active_objective.questions.when_to_do"
                        )}
                    </BetterText>
                    <BetterText
                        fontSize={10}
                        textColor="#C8C8C8"
                        fontWeight="Italic"
                    >
                        {t(
                            "subpage_create_active_objective.questions.when_to_do_protip"
                        )}
                    </BetterText>
                    <GapView height={15} />
                    <Native.View style={styles.flexydays}>
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
                                <Native.View
                                    key={index}
                                    style={{
                                        ...styles.dayContainer,
                                        borderColor: day
                                            ? "#194080"
                                            : "#3E4146",
                                        backgroundColor: day
                                            ? "#3280FF"
                                            : "#2A2D32",
                                    }}
                                >
                                    <Native.Pressable
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
                                            textColor="#FFF"
                                            fontSize={15}
                                            fontWeight="Medium"
                                        >
                                            {thisday.toUpperCase()}
                                        </BetterText>
                                    </Native.Pressable>
                                </Native.View>
                            );
                        })}
                    </Native.View>
                    <GapView height={20} />
                    {["duration", "repetitions", "rests"].map(item => (
                        <Native.View key={item} style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor="#FFF"
                                fontWeight="Regular"
                            >
                                {t(
                                    `subpage_create_active_objective.questions.toggles_labels.${item}`
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <Native.View
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
                                    textColor="#FFF"
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
                            </Native.View>
                        </Native.View>
                    ))}
                    {rests !== 0 && (
                        <Native.View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor="#FFF"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.rest_duration"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <Native.View
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
                                    textColor="#FFF"
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
                            </Native.View>
                        </Native.View>
                    )}
                    {exercise.toLowerCase() === "push up" && (
                        <Native.View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor="#FFF"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.how_many_pushups"
                                )}
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor="#C8C8C8"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.how_many_pushups_protip"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <Native.View
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
                                    textColor="#FFF"
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
                            </Native.View>
                        </Native.View>
                    )}
                    {exercise.toLowerCase() === "lifting" && (
                        <Native.View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor="#FFF"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.how_many_lifts"
                                )}
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor="#C8C8C8"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.how_many_lifts_protip"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <Native.View
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
                                    textColor="#FFF"
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
                            </Native.View>
                        </Native.View>
                    )}
                    {exercise.toLowerCase() === "lifting" && (
                        <Native.View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor="#FFF"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.how_much_does_the_lift_weight"
                                )}
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor="#C8C8C8"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.how_much_does_the_lift_weight_protip"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <Native.View
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
                                    textColor="#FFF"
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
                            </Native.View>
                        </Native.View>
                    )}
                    {exercise.toLowerCase() === "lifting" && (
                        <Native.View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor="#FFF"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.how_much_does_the_bar_weight"
                                )}
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor="#C8C8C8"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.how_much_does_the_bar_weight_protip"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <Native.View
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
                                    textColor="#FFF"
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
                            </Native.View>
                        </Native.View>
                    )}
                    {exercise.toLowerCase() === "lifting" && (
                        <Native.View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor="#FFF"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.amount_of_hands"
                                )}
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor="#C8C8C8"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.amount_of_hands_protip_scales"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <Native.View
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
                                    textColor="#FFF"
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
                            </Native.View>
                        </Native.View>
                    )}
                    {exercise.toLowerCase() === "push up" && (
                        <Native.View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor="#FFF"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.amount_of_hands"
                                )}
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor="#C8C8C8"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.amount_of_hands_protip_pushup"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <Native.View
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
                                    textColor="#FFF"
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
                            </Native.View>
                        </Native.View>
                    )}
                    {exercise.toLowerCase() === "running" && (
                        <Native.View style={{ marginBottom: 20 }}>
                            <BetterText
                                fontSize={20}
                                textColor="#FFF"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.what_speed_youll_run"
                                )}
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor="#C8C8C8"
                                fontWeight="Regular"
                            >
                                {t(
                                    "subpage_create_active_objective.questions.toggles_labels.what_speed_youll_run_protip"
                                )}
                            </BetterText>
                            <GapView height={15} />
                            <Native.View
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
                                <Native.View>
                                    <BetterText
                                        textColor="#FFF"
                                        fontSize={20}
                                        fontWeight="Medium"
                                        textAlign="center"
                                    >
                                        {speedString}
                                    </BetterText>
                                    <BetterText
                                        textColor="#C8C8C8"
                                        fontSize={10}
                                        fontWeight="Regular"
                                        textAlign="center"
                                    >
                                        {exactSpeedString}
                                    </BetterText>
                                </Native.View>
                                <Button
                                    layout="box"
                                    style="ACE"
                                    buttonText="+"
                                    action={() => handleIncrement("speed")}
                                />
                            </Native.View>
                        </Native.View>
                    )}
                    {repetitions * duration > 300 && (
                        // Lo máximo que me parece coherente son 5 horas seguidas haciendo UN ejercicio - recordemos que puedes tener varios al día
                        // The maximum that makes sense to me it's 5 hours in a row making ONE exercise - remember you can make many each day
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
                    )}
                    {repetitions * duration > 300 && <GapView height={20} />}
                    <Native.View
                        style={{ display: "flex", flexDirection: "row" }}
                    >
                        {allConditionsAreMet ? (
                            <Button
                                style="GOD"
                                buttonText={t(
                                    "subpage_create_active_objective.buttons.create"
                                )}
                                action={handleSubmit}
                            />
                        ) : (
                            <Button
                                style="HMM"
                                buttonText={t(
                                    "subpage_create_active_objective.buttons.fill_all_items"
                                )}
                                action={() => {}}
                            />
                        )}
                        <GapView width={20} />
                        <Button
                            style="DEFAULT"
                            buttonText={t("globals.nevermind")}
                            action={getOut}
                        />
                    </Native.View>
                    <GapView height={10} />
                    <BetterText
                        textAlign="center"
                        fontSize={9}
                        fontWeight="Italic"
                        textColor="#C8C8C8"
                    >
                        {t("subpage_create_active_objective.required")}
                    </BetterText>
                </Native.View>
            </Native.ScrollView>
        </Native.View>
    );
}
