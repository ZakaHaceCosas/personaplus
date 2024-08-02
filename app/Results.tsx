// Results.tsx
// Página de resultados, para después de una sesión

/* TODO:
- Make it so that for each exercise it has a different behavior / texts
- Translate
*/

import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import OpenHealth from "@/core/openhealth";
import { termLog } from "@/src/toolkit/debug/console";
import BetterText from "@/src/BetterText";
import { router, useGlobalSearchParams } from "expo-router";
import { UserHealthData } from "@/src/toolkit/userData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import Section from "@/src/section/Section";
import Division from "@/src/section/Division";
import GapView from "@/src/GapView";
import { saveDailyObjectivePerformance } from "@/src/toolkit/objectives";
import { getCurrentDate } from "@/src/toolkit/today";
import Button from "@/src/Buttons";

// Creamos los estilos
const styles = StyleSheet.create({
    containerview: {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
    },
    mainview: {
        padding: 20,
        paddingTop: 40,
        display: "flex",
        flexDirection: "column",
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        overflow: "scroll",
    },
    thirdview: {
        display: "flex",
        flexDirection: "column",
    },
});

export default function Results() {
    // Params
    const params = useGlobalSearchParams();
    // termLog(params, "log");
    // Global params
    const sessionElapsedTime: number = Number(params.time);
    const objectiveExercise: string = params.exercise as string;
    const objectiveIdentifier: number = Number(params.id);
    const repetitions: number = Number(params.repetitions);
    // Objective-specific params
    const objectiveRunning_Speed: number = Number(params.speed);
    const objectiveLifting_barWeight: number = Number(params.barWeight);
    const objectiveLifting_liftWeight: number = Number(params.liftWeight);
    const objectiveLifting_scales: number = Number(params.scales);

    const [userData, setUserData] = useState<UserHealthData | null>(null);
    const [result, setResult] = useState<{ result: number } | null>(null);

    const [randomMessage, setRandomMessage] = useState<string | null>(null);

    const { t } = useTranslation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await AsyncStorage.multiGet([
                    "age",
                    "height",
                    "weight",
                    "gender",
                ]);

                const processedData: UserHealthData = {
                    age: data[0][1] ? Number(data[0][1]) : null,
                    height: data[1][1] ? Number(data[1][1]) : null,
                    weight: data[2][1] ? Number(data[2][1]) : null,
                    gender:
                        data[3][1] === "male" || data[3][1] === "female"
                            ? data[3][1]
                            : null,
                };

                setUserData(processedData);
            } catch (e) {
                termLog("Error fetching user data: " + e, "error");
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const handleExerciseCalculation = () => {
            try {
                if (
                    !isNaN(sessionElapsedTime) &&
                    !isNaN(objectiveRunning_Speed) &&
                    userData &&
                    userData.age &&
                    !isNaN(userData.age) &&
                    userData.gender &&
                    userData.weight &&
                    userData.height
                ) {
                    if (objectiveExercise.toLowerCase() === "running") {
                        return OpenHealth.performance.RunningOrWalkingPerformance.calculate(
                            userData.age,
                            userData.gender,
                            userData.weight,
                            userData.height,
                            objectiveRunning_Speed,
                            sessionElapsedTime,
                            true,
                            false
                        );
                    } else if (objectiveExercise.toLowerCase() === "walking") {
                        // this acts as a placeholder to remember the wanted logic.
                        // the OpenHealth thing needs all other exercises to get implemented
                        // this counts as a TODO
                        return OpenHealth.performance.RunningOrWalkingPerformance.calculate(
                            userData.age,
                            userData.gender,
                            userData.weight,
                            userData.height,
                            objectiveRunning_Speed,
                            sessionElapsedTime,
                            true,
                            false
                        );
                    } else if (objectiveExercise.toLowerCase() === "lifting") {
                        return OpenHealth.performance.LiftingPerformance.calculate(
                            userData.age,
                            userData.gender,
                            userData.weight,
                            userData.height,
                            sessionElapsedTime,
                            objectiveLifting_barWeight,
                            objectiveLifting_liftWeight,
                            objectiveLifting_scales,
                            repetitions,
                            true,
                            false
                        );
                    }
                }
            } catch (e) {
                termLog(
                    "Error handling post-session calculations" + e,
                    "error"
                );
            }
        };

        try {
            const response = handleExerciseCalculation();
            // termLog(response, "log");
            if (response !== undefined) {
                setResult(response);
                termLog(
                    "(RESULTS.TSX) Result of session passed to state value",
                    "log"
                );
                saveDailyObjectivePerformance(
                    objectiveIdentifier,
                    getCurrentDate(),
                    true,
                    JSON.stringify(response)
                );
                termLog(
                    "(RESULTS.TSX) Success! Session's results set & saved",
                    "success"
                );
            } else {
                throw new Error("Response is null or undefined");
            }
        } catch (e) {
            termLog("Error getting your results! " + e, "error");
        }
    }, [
        objectiveExercise,
        objectiveRunning_Speed,
        sessionElapsedTime,
        userData,
        objectiveIdentifier,
        objectiveLifting_barWeight,
        objectiveLifting_liftWeight,
        objectiveLifting_scales,
        repetitions,
    ]);

    useEffect(() => {
        const allDoneMessages: string[] = t("cool_messages.session_done", {
            returnObjects: true,
        });

        const randomMessageForAllDone =
            allDoneMessages[Math.floor(Math.random() * allDoneMessages.length)];

        setRandomMessage(randomMessageForAllDone);
    }, [t]);

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

    return (
        <View style={styles.containerview}>
            <ScrollView
                style={styles.mainview}
                contentContainerStyle={{
                    justifyContent: "space-between",
                }}
            >
                <View style={styles.thirdview}>
                    <BetterText fontSize={40} fontWeight="SemiBold">
                        ¡Sesión completada!
                    </BetterText>
                    <BetterText fontSize={20} fontWeight="SemiBold">
                        {randomMessage !== null ? randomMessage : ""}
                    </BetterText>
                    <GapView height={10} />
                    {result?.result && (
                        <Section kind="HowYouAreDoing">
                            <Division
                                preheader="CALORÍAS QUEMADAS"
                                header={parseFloat(
                                    result?.result.toFixed(2)
                                ).toString()}
                            />
                            <Division
                                preheader="MÁS SOBRE TU RENDIMIENTO"
                                header={`Corriste a unos ${speedOptions[objectiveRunning_Speed]?.[1] || "desconocido"} por ${sessionElapsedTime} minutos`}
                            />
                        </Section>
                    )}
                    <GapView height={10} />
                    <BetterText fontSize={20} fontWeight="Regular">
                        Bien hecho, colega. Los resultados de esta sesión se
                        guardarán, y junto a tus resultados en demás sesiones.
                    </BetterText>
                </View>
                <Button
                    action={() => {
                        router.replace("/");
                    }}
                    style="ACE"
                    buttonText="Great!"
                />
            </ScrollView>
        </View>
    );
}
