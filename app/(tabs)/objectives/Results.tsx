// Results.tsx
// Results page for when a session is done.

import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import CoreLibrary from "@/core/CoreLibrary";
import { router, useGlobalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import { logToConsole } from "@/toolkit/debug/Console";
import { BasicUserHealthData } from "@/types/User";
import { SaveActiveObjectiveToDailyLog } from "@/toolkit/objectives/ActiveObjectives";
import GenerateRandomMessage from "@/toolkit/RandomMessage";
import {
    BetterTextHeader,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import GapView from "@/components/ui/GapView";
import Section from "@/components/ui/sections/Section";
import Division from "@/components/ui/sections/Division";
import BetterText from "@/components/text/BetterText";
import BetterButton from "@/components/interaction/BetterButton";
import ROUTES from "@/constants/Routes";
import { SessionParams } from "./Sessions";
import { OrchestrateUserData } from "@/toolkit/User";

// We define the styles
const styles = StyleSheet.create({
    mainView: {
        backgroundColor: Colors.MAIN.APP,
        padding: 20,
        paddingTop: 40,
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
    },
    thirdView: {
        display: "flex",
        flexDirection: "column",
    },
});

export default function Results() {
    // Params
    const originalParams = useGlobalSearchParams();
    const parseNumber = (value: any) => Number(value) || 0;

    const params: SessionParams = {
        speed: parseNumber(originalParams.speed),
        time: parseNumber(originalParams.time),
        id: parseNumber(originalParams.id),
        repetitions: parseNumber(originalParams.repetitions),
        lifts: parseNumber(originalParams.lifts),
        dumbbellWeight: parseNumber(originalParams.dumbbellWeight),
        pushups: parseNumber(originalParams.pushups),
        hands: parseNumber(originalParams.hands),
        exercise: (originalParams.exercise as string) || "",
    };

    const [userData, setUserData] = useState<BasicUserHealthData | null>(null);
    const [result, setResult] = useState<{ result: number } | null>(null);

    // Get translation function for multilingual support
    const { t } = useTranslation();

    useEffect(() => {
        // Async function to fetch user data from storage
        const fetchUserData = async () => {
            try {
                const data = await OrchestrateUserData();
                if (!data) throw new Error("No user data.");

                // Process and clean up the fetched data
                const processedData: BasicUserHealthData = {
                    age: data.age,
                    height: data.height,
                    weight: data.weight,
                    gender: data.gender,
                };

                setUserData(processedData); // Update state with user data
            } catch (e) {
                logToConsole("Error fetching user data: " + e, "error");
            }
        };

        fetchUserData();
    }, []);

    // Function to handle exercise performance calculations
    const handleExerciseCalculation = () => {
        try {
            // ok, I know nesting too much is a bad practice
            // but uhh it has to be a different function with different params for each scenario
            // so yeah i cant think of a better approach
            if (
                !isNaN(params.time) &&
                !isNaN(params.speed) &&
                userData &&
                userData.age !== "" &&
                userData.gender &&
                userData.weight !== "" &&
                userData.height !== ""
            ) {
                const exercise = params.exercise.toLowerCase();

                switch (exercise) {
                    case "running":
                        return CoreLibrary.performance.RunningPerformance.calculate(
                            userData.age,
                            userData.gender,
                            userData.weight,
                            userData.height,
                            params.speed,
                            params.time,
                            true,
                            true,
                        );
                    case "lifting":
                        return CoreLibrary.performance.LiftingPerformance.calculate(
                            userData.age,
                            userData.gender,
                            userData.weight,
                            userData.height,
                            params.time,
                            params.dumbbellWeight,
                            params.hands,
                            params.repetitions,
                            true,
                            true,
                        );
                    case "push ups":
                        return CoreLibrary.performance.PushingUpPerformance.calculate(
                            userData.age,
                            userData.gender,
                            userData.weight,
                            userData.height,
                            params.time,
                            params.repetitions > 0
                                ? params.repetitions * params.pushups
                                : params.pushups,
                            params.hands,
                            true,
                            true,
                        );
                    default:
                        throw new Error("Unknown or invalid exercise type");
                }
            } else {
                throw new Error("Invalid input data");
            }
        } catch (e) {
            logToConsole(
                "Error handling post-session calculations (@ handleExerciseCalculation): " +
                    e,
                "error",
            );
            return undefined;
        }
    };

    useEffect(() => {
        try {
            const response = handleExerciseCalculation();
            if (response) {
                setResult(response);
                logToConsole(
                    "(RESULTS.TSX) Result of session passed to state value",
                    "log",
                );
                SaveActiveObjectiveToDailyLog(params.id, true, response);
                logToConsole(
                    "(RESULTS.TSX) Success! Session's results set & saved",
                    "success",
                );
            } else {
                throw new Error("Response is null or undefined");
            }
        } catch (e) {
            logToConsole("Error getting your results! " + e, "error");
        }
        // eslint-disable-next-line
    }, [params.id]);

    // Speed options for running exercises
    const speedOptions: string[][] = [
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

    if (params.exercise.toLowerCase() === "running") {
        resultsInfoText = t("page_session_results.results.body_running", {
            speed: speedOptions[params.speed]?.[1] || "??",
            time: params.time || "??",
        });
    } else if (params.exercise.toLowerCase() === "push up") {
        resultsInfoText = t("page_session_results.results.body_pushups", {
            amount: params.pushups || "??",
            hands: params.hands || "??",
        });
    } else if (params.exercise.toLowerCase() === "lifting") {
        resultsInfoText = t("page_session_results.results.body_lifting", {
            amount: params.pushups || "??",
            weight:
                params.dumbbellWeight && params.hands
                    ? params.dumbbellWeight * params.hands
                    : "??",
        });
    } else {
        resultsInfoText = "Error."; // lol
    }

    return (
        <>
            <View style={styles.thirdView}>
                <BetterTextHeader>{t("globals.session_done")}</BetterTextHeader>
                <BetterTextSubHeader>
                    {GenerateRandomMessage("sessionCompleted", t)}
                </BetterTextSubHeader>
                <GapView height={10} />
                {result?.result && (
                    <Section kind="HowYouAreDoing">
                        <Division
                            preHeader={t(
                                "page_session_results.results.burnt_calories",
                            )}
                            header={parseFloat(
                                result?.result.toFixed(2),
                            ).toString()}
                        />
                        <Division
                            preHeader={t(
                                "page_session_results.results.header_more",
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
            <BetterButton
                action={() => {
                    router.replace(ROUTES.MAIN.HOME);
                }}
                style="ACE"
                buttonText={t("globals.success")}
                buttonHint="TODO"
            />
        </>
    );
}
