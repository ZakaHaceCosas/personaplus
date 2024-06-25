// components/Form.tsx
// Formulario con select, array de toggles, increment/decrement para duration, repetitions, rests y rest duration

import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";
import GapView from "@/components/GapView";
import { Picker as Select } from "@react-native-picker/picker";
import Button from "@/components/Buttons";
import * as Router from "expo-router";
import Notification from "@/components/Notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TypeScript, supongo
interface FormProps {
    onSubmit: (formData: FormData) => void;
}

interface FormData {
    exercise: string;
    days: boolean[];
    duration: number;
    repetitions: number;
    rests: number;
    restDuration: number;
}

interface Objective {
    exercise: string;
    days: boolean[];
    duration: number;
    repetitions: number;
    rests: number;
    restDuration: number;
    id: number;
    wasDone: boolean;
}

// Creamos los estilos
const styles = Native.StyleSheet.create({
    containerview: {
        paddingTop: 20,
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
    },
    mainview: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
    },
    flexydays: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
});

export default function Form({ onSubmit }: FormProps) {
    const biglblsz: number = 25;
    const [exercise, setExercise] = React.useState("");
    const exercises = [
        "Push Up",
        "Lifting",
        "Running",
        "Walking",
        "Meditation", // does this count as an exercise? idk. pero ahí está.
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
    const [duration, setDuration] = React.useState(0);
    const [repetitions, setRepetitions] = React.useState(0);
    const [rests, setRests] = React.useState(0);
    const [restDuration, setRestDuration] = React.useState(0);

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
                setRestDuration(prev => (prev > 0.25 ? prev - 0.25 : prev));
                break;
        }
    };

    const handleSubmit = async () => {
        const formData: FormData = {
            exercise,
            days,
            duration,
            repetitions,
            rests,
            restDuration,
        };

        try {
            await processData(formData); // procesa
            Router.router.push("/"); // vuelve a casa DESPUES de procesar
        } catch (e) {
            console.error("error creating obj:", e);
        }
    };

    const processData = async (formData: FormData) => {
        try {
            const newObj: object = formData;
            const storedObjs: string | null =
                await AsyncStorage.getItem("objs");
            let objs: Objective[] = [];

            if (storedObjs !== null) {
                const parsedObjs = JSON.parse(storedObjs);
                if (Array.isArray(parsedObjs)) {
                    objs = parsedObjs as Objective[];
                }
            }

            const ids = objs
                .filter((item: Objective) => !("id" in item))
                .map((item: Objective) => item.id);

            const generateNewId = (): number => {
                let newId = Math.floor(Math.random() * 1000) + 1;
                while (ids.includes(newId)) {
                    newId = Math.floor(Math.random() * 1000) + 1;
                }
                return newId;
            };

            const newId = generateNewId();
            const finalObj = { ...newObj, id: newId, wasDone: false };
            const finalObjs: object[] = [...objs, finalObj];

            await AsyncStorage.setItem("objs", JSON.stringify(finalObjs));
        } catch (e) {
            console.error("Error storing data:", e);
        }
    };

    const getOut = () => {
        Router.router.push("/");
    };

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
                        {exercises.map(exercise => (
                            <Select.Item
                                key={exercise}
                                label={exercise}
                                value={exercise}
                            />
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
                    <GapView height={15} />
                    <Native.View style={styles.flexydays}>
                        {days.map((day, index) => {
                            const thisday: string | boolean =
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
                                              : index === 6
                                                ? "sunday"
                                                : day;
                            return (
                                <Native.View
                                    key={index}
                                    style={{
                                        borderRadius: 10,
                                        borderColor: day
                                            ? "#194080"
                                            : "#3E4146",
                                        backgroundColor: day
                                            ? "#3280FF"
                                            : "#2A2D32",
                                        borderWidth: 4,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 5,
                                        marginRight: 5,
                                        marginBottom: 5,
                                        /* OK, se ve feo, PERO FUNCIONA Y ES LO QUE IMPORTA */
                                        /* ALR, looks ugly, BUT IT WORKS AND THATS WHAT MATTERS */
                                    }}
                                >
                                    <Native.Pressable
                                        style={{ padding: 5 }}
                                        onPress={() => handleChangeDay(index)}
                                    >
                                        <BetterText
                                            fontSize={15}
                                            textAlign="center"
                                            textColor={day ? "#FFF" : "#949698"}
                                            fontWeight="Regular"
                                        >
                                            {thisday}
                                        </BetterText>
                                    </Native.Pressable>
                                </Native.View>
                            );
                        })}
                    </Native.View>
                </Native.View>
                <GapView height={15} />
                <Native.View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        layout="box"
                        style="ACE"
                        action={() => handleIncrement("duration")}
                        buttonText="+"
                    />
                    <Native.View style={{ flex: 12 }}>
                        <BetterText
                            fontSize={15}
                            textColor="#FFF"
                            fontWeight="Regular"
                            textAlign="center"
                        >
                            Duration:
                        </BetterText>
                        <BetterText
                            fontSize={biglblsz}
                            textColor="#FFF"
                            fontWeight="Bold"
                            textAlign="center"
                        >
                            {duration} {duration === 1 ? "MINUTE" : "MINUTES"}
                        </BetterText>
                    </Native.View>

                    <Button
                        layout="box"
                        style="ACE"
                        action={() => handleDecrement("duration")}
                        buttonText="-"
                    />
                </Native.View>
                <GapView height={15} />
                <Native.View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        layout="box"
                        style="ACE"
                        action={() => handleIncrement("repetitions")}
                        buttonText="+"
                    />
                    <Native.View style={{ flex: 12 }}>
                        <BetterText
                            fontSize={15}
                            textColor="#FFF"
                            fontWeight="Regular"
                            textAlign="center"
                        >
                            Repetitions:
                        </BetterText>
                        <BetterText
                            fontSize={biglblsz}
                            textColor="#FFF"
                            fontWeight="Bold"
                            textAlign="center"
                        >
                            {repetitions}{" "}
                            {repetitions === 1 ? "REPETITION" : "REPETITIONS"}
                        </BetterText>
                    </Native.View>
                    <Button
                        layout="box"
                        style="ACE"
                        action={() => handleDecrement("repetitions")}
                        buttonText="-"
                    />
                </Native.View>
                <GapView height={15} />
                <Native.View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        layout="box"
                        style="ACE"
                        action={() => handleIncrement("rests")}
                        buttonText="+"
                    />
                    <Native.View style={{ flex: 12 }}>
                        <BetterText
                            fontSize={15}
                            textColor="#FFF"
                            fontWeight="Regular"
                            textAlign="center"
                        >
                            Rests:
                        </BetterText>

                        <BetterText
                            fontSize={biglblsz}
                            textAlign="center"
                            textColor="#FFF"
                            fontWeight="Bold"
                        >
                            {rests} {rests !== 1 ? "RESTS" : "REST"}
                        </BetterText>
                    </Native.View>
                    <Button
                        layout="box"
                        style="ACE"
                        action={() => handleDecrement("rests")}
                        buttonText="-"
                    />
                </Native.View>
                <GapView height={15} />
                {rests > 0 && (
                    <Native.View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button
                            layout="box"
                            style="ACE"
                            action={() => handleIncrement("restDuration")}
                            buttonText="+"
                        />
                        <Native.View style={{ flex: 12 }}>
                            <BetterText
                                fontSize={15}
                                textColor="#FFF"
                                fontWeight="Bold"
                                textAlign="center"
                            >
                                Duration:
                            </BetterText>
                            <BetterText
                                fontSize={biglblsz}
                                textColor="#FFF"
                                fontWeight="Bold"
                                textAlign="center"
                            >
                                {restDuration}{" "}
                                {restDuration === 1 ? "MINUTE" : "MINUTES"}
                            </BetterText>
                        </Native.View>
                        <Button
                            layout="box"
                            style="ACE"
                            action={() => handleDecrement("restDuration")}
                            buttonText="-"
                        />
                    </Native.View>
                )}
                <Native.View
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        marginTop: repetitions * duration > 300 ? 20 : 0, // lo he cambiado para que sea lógico
                    }}
                >
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
                    <Native.View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 20,
                        }}
                    >
                        {!(
                            !exercise ||
                            exercise.trim() === "" ||
                            duration === 0
                        ) && (
                            <Button
                                style="ACE"
                                action={handleSubmit}
                                buttonText="Save it!"
                            />
                        )}
                        {(!exercise ||
                            exercise.trim() === "" ||
                            duration === 0) && (
                            <Button
                                style="HMM"
                                action={() => {}}
                                buttonText="..."
                            />
                        )}
                        <GapView width={20} />
                        <Button
                            style="DEFAULT"
                            action={getOut}
                            buttonText="Nevermind"
                        />
                    </Native.View>
                </Native.View>
            </Native.ScrollView>
        </Native.View>
    );
}
