// Results.tsx
// Results page for when a session is done.

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

// We define the styles
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
        flexGrow: 1,
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
    const multiobjective_hands: number = Number(params.hands);
    // Objective-specific params
    const objectiveRunning_Speed: number = Number(params.speed);
    const objectiveLifting_barWeight: number = Number(params.barWeight);
    const objectiveLifting_liftWeight: number = Number(params.liftWeight);
    const objectivePushups_Pushups: number = Number(params.pushups);

    const [userData, setUserData] = useState<UserHealthData | null>(null);
    const [result, setResult] = useState<{ result: number } | null>(null);

    const [randomMessage, setRandomMessage] = useState<string | null>(null);

    // Get translation function for multilingual support
    const { t } = useTranslation();

    useEffect(() => {
        // Async function to fetch user data from storage
        const fetchUserData = async () => {
            try {
                const data = await AsyncStorage.multiGet([
                    "age",
                    "height",
                    "weight",
                    "gender",
                ]);

                // Process and clean up the fetched data
                const processedData: UserHealthData = {
                    age: data[0][1] ? Number(data[0][1]) : null,
                    height: data[1][1] ? Number(data[1][1]) : null,
                    weight: data[2][1] ? Number(data[2][1]) : null,
                    gender:
                        data[3][1] === "male" || data[3][1] === "female"
                            ? (data[3][1] as "male" | "female")
                            : null,
                };

                setUserData(processedData); // Update state with user data
            } catch (e) {
                termLog("Error fetching user data: " + e, "error");
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        // Function to handle exercise performance calculations
        const handleExerciseCalculation = () => {
            try {
                // ok, I know nesting too much is a bad practice
                // but uhh it has to be a different function with different params for each scenario
                // so yeah i cant think of a better approach
                if (
                    !isNaN(sessionElapsedTime) &&
                    !isNaN(objectiveRunning_Speed) &&
                    userData?.age &&
                    userData?.gender &&
                    userData?.weight &&
                    userData?.height
                ) {
                    const exercise = objectiveExercise.toLowerCase();

                    switch (exercise) {
                        case "running":
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
                        case "lifting":
                            return OpenHealth.performance.LiftingPerformance.calculate(
                                userData.age,
                                userData.gender,
                                userData.weight,
                                userData.height,
                                sessionElapsedTime,
                                objectiveLifting_barWeight,
                                objectiveLifting_liftWeight,
                                multiobjective_hands,
                                repetitions,
                                true,
                                false
                            );
                        case "push up":
                            return OpenHealth.performance.PushingUpPerformance.calculate(
                                userData.age,
                                userData.gender,
                                userData.weight,
                                userData.height,
                                sessionElapsedTime,
                                multiobjective_hands,
                                objectivePushups_Pushups * repetitions,
                                true,
                                false
                            );
                        default:
                            throw new Error("Unknown or invalid exercise type");
                    }
                } else {
                    throw new Error("Invalid input data");
                }
            } catch (e) {
                termLog(
                    "Error handling post-session calculations (@ handleExerciseCalculation): " +
                        e,
                    "error"
                );
                return undefined;
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
        repetitions,
        multiobjective_hands,
        objectivePushups_Pushups,
    ]);

    useEffect(() => {
        // Set a random message for the "session done" scenario
        const allDoneMessages: string[] = t("cool_messages.session_done", {
            returnObjects: true,
        });

        // Pick a random message to celebrate the end of the session
        const randomMessageForAllDone =
            allDoneMessages[Math.floor(Math.random() * allDoneMessages.length)];

        setRandomMessage(randomMessageForAllDone);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Speed options for running exercises
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

    let resultsInfoText: string;

    if (objectiveExercise.toLowerCase() === "running") {
        resultsInfoText = t("page_session_results.results.body_running", {
            speed: speedOptions[objectiveRunning_Speed]?.[1] || "??",
            time: sessionElapsedTime || "??",
        });
    } else if (objectiveExercise.toLowerCase() === "push up") {
        resultsInfoText = t("page_session_results.results.body_pushups", {
            amount: objectivePushups_Pushups || "??",
            hands: multiobjective_hands || "??",
        });
    } else if (objectiveExercise.toLowerCase() === "lifting") {
        resultsInfoText = t("page_session_results.results.body_lifting", {
            amount: objectivePushups_Pushups || "??", // CONFUSING, I KNOW, BUT I THINK IT'S LIKE THIS
            weight:
                objectiveLifting_barWeight + objectiveLifting_liftWeight * 2 ||
                "??",
        });
    } else {
        resultsInfoText = "Error."; // lol
    }

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
                        {t("globals.session_done")}
                    </BetterText>
                    <BetterText fontSize={20} fontWeight="SemiBold">
                        {randomMessage !== null ? randomMessage : ""}
                    </BetterText>
                    <GapView height={10} />
                    {result?.result && (
                        <Section kind="HowYouAreDoing">
                            <Division
                                preheader={t(
                                    "page_session_results.results.burnt_calories"
                                )}
                                header={parseFloat(
                                    result?.result.toFixed(2)
                                ).toString()}
                            />
                            <Division
                                preheader={t(
                                    "page_session_results.results.header_more"
                                )}
                                header={resultsInfoText}
                            />
                        </Section>
                    )}
                    <GapView height={10} />
                    <BetterText fontSize={20} fontWeight="Regular">
                        {t("page_session_results.well_done_bud")}
                    </BetterText>
                </View>
                <GapView height={10} />
                <Button
                    action={() => {
                        router.replace("/");
                    }}
                    style="ACE"
                    buttonText={t("globals.success")}
                />
            </ScrollView>
        </View>
    );
}
