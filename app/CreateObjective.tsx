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
// import { v4 as uuid } from "uuid";
// if you wonder what is UUID doing here, well - after a problem with duplicate IDs i wanted to try this as a solution, but I simply don't like to have such a big ID with letters and dashes, would have to redo some types and stuff.

// TypeScript, supongo
interface ObjectiveProps {
    onSubmit: (objectiveData: Objective) => void;
}

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

export default function Form({ onSubmit }: ObjectiveProps) {
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
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={40}>
                    Let&apos;s do it!
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={20}
                >
                    Create a new objective now!
                </BetterText>
                <GapView height={20} />
                <Native.View>
                    <BetterText
                        fontSize={20}
                        textColor="#FFF"
                        fontWeight="Regular"
                    >
                        What do you want to do?
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
                            label="Choose an option"
                            value=""
                            color="#999"
                        />
                        {exercises.map(ex => (
                            <Select.Item key={ex} label={ex} value={ex} />
                        ))}
                    </Select>
                    <GapView height={20} />
                    <BetterText
                        fontSize={20}
                        textColor="#FFF"
                        fontWeight="Regular"
                    >
                        What days do you want to exercise?
                    </BetterText>
                    <BetterText
                        fontSize={10}
                        textColor="#C8C8C8"
                        fontWeight="Italic"
                    >
                        Tap each day to enable/disable it.{"\n"}Colored days are
                        enabled, gray ones are disabled.
                    </BetterText>
                    <GapView height={15} />
                    <Native.View style={styles.flexydays}>
                        {days.map((day, index) => {
                            const thisday: string =
                                index === 0
                                    ? "monday"
                                    : index === 1
                                      ? "tuesday"
                                      : index === 2
                                        ? "wednesday"
                                        : index === 3
                                          ? "thursday"
                                          : index === 4
                                            ? "friday"
                                            : index === 5
                                              ? "saturday"
                                              : "sunday";
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
                                {item === "duration"
                                    ? "Duration (minutes)"
                                    : item === "repetitions"
                                      ? "Repetitions"
                                      : "Rests"}
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
                                Rest Duration (minutes)
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
                                How many push-ups?
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor="#C8C8C8"
                                fontWeight="Regular"
                            >
                                Tip: Balance the duration and number of
                                push-ups. More push-ups in less time will be
                                harder but have a greater effect on your body.
                                Fewer push-ups over more time will provide a
                                more relaxed and beginner-friendly session.
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
                                How many lifts will you make?
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor="#C8C8C8"
                                fontWeight="Regular"
                            >
                                Tip: Balance the duration and number of lifts.
                                More lifts in less time will be harder but have
                                a greater effect on your body. Fewer lifts over
                                more time will provide a more relaxed and
                                beginner-friendly session.
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
                                How much does the{" "}
                                <BetterText
                                    fontSize={20}
                                    textColor="#FFF"
                                    fontWeight="Bold"
                                >
                                    lift
                                </BetterText>{" "}
                                weight?
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor="#C8C8C8"
                                fontWeight="Regular"
                            >
                                In kilograms. If you&apos;re not sure: you know
                                there are two weights or &quot;things that
                                weigh&quot; on each side of your scale, right?
                                Enter how much does each one of them weigh
                                (assuming you know both should weigh the same)
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
                                How much does the{" "}
                                <BetterText
                                    fontSize={20}
                                    textColor="#FFF"
                                    fontWeight="Bold"
                                >
                                    bar
                                </BetterText>{" "}
                                weight?
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor="#C8C8C8"
                                fontWeight="Regular"
                            >
                                In kilograms.
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
                                One hand or two?
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor="#C8C8C8"
                                fontWeight="Regular"
                            >
                                Basically: are you going to workout with 1 scale
                                or with 2 scales, one on each hand? Deaults to
                                two.
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
                                One hand or two?
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor="#C8C8C8"
                                fontWeight="Regular"
                            >
                                Basically: are you going to push-up yourself
                                using both hands (normal) or just one of them
                                (advanced)? Defaults to two.
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
                                What speed will you run to?
                            </BetterText>
                            <BetterText
                                fontSize={10}
                                textColor="#C8C8C8"
                                fontWeight="Regular"
                            >
                                Of course you don&apos;t need to be exact, just
                                try to estimate it.
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
                            title="Are you sure?"
                            text={`Your current choice would equal ${
                                repetitions * duration
                            } minutes of exercise. Isn't that too much?`}
                            subtext="You can still create your objective, don't worry. We're just warning you, for your own health!"
                        />
                    )}
                    {repetitions * duration > 300 && <GapView height={20} />}
                    <Native.View
                        style={{ display: "flex", flexDirection: "row" }}
                    >
                        {allConditionsAreMet ? (
                            <Button
                                style="GOD"
                                buttonText="Create objective"
                                action={handleSubmit}
                            />
                        ) : (
                            <Button
                                style="HMM"
                                buttonText="Fill all the required items"
                                action={() => {}}
                            />
                        )}
                        <GapView width={20} />
                        <Button
                            style="DEFAULT"
                            buttonText="Nevermind"
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
                        Required: Duration, Exercise, and at least one day of
                        the week. Specific exercises may have their own extra
                        required fields: for example &quot;Lifting&quot;
                        requires you to specify how much weight you&apos;ll be
                        lifting.
                    </BetterText>
                </Native.View>
            </Native.ScrollView>
        </Native.View>
    );
}
