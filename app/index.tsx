// index.tsx
// Welcome to PersonaPlus. Give yourself a plus!

import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    DimensionValue,
    Platform,
} from "react-native";
import { router, usePathname } from "expo-router";
import {
    markObjectiveAsDone,
    fetchObjectives,
    registerBackgroundObjectivesFetchAsync,
    checkForTodaysObjectives,
} from "@/src/toolkit/objectives";
import BetterText from "@/src/BetterText";
import Section from "@/src/section/Section";
import BottomNav from "@/src/BottomNav";
import Division from "@/src/section/Division";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/src/Buttons";
import GapView from "@/src/GapView";
import Footer from "@/src/Footer";
import { termLog } from "@/app/DeveloperInterface";
import { useTranslation } from "react-i18next";
import {
    scheduleRandomNotifications,
    cancelScheduledNotifications,
} from "@/src/hooks/useNotification";
import { adjustedToday } from "@/src/toolkit/today";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

// TypeScript, supongo
import { Objective } from "@/src/types/Objective";

// Creamos los estilos
const styles = StyleSheet.create({
    containerview: {
        width: "100vw" as DimensionValue,
        height: "100vh" as DimensionValue,
    },
    mainview: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as DimensionValue,
        height: "100vh" as DimensionValue,
        overflow: "scroll",
    },
});

// Creamos la función
export default function Home() {
    const [loading, setLoading] = useState(true);
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
    const [username, setUsername] = useState<string>("Unknown");
    const [objectives, setObjectives] = useState<{
        [key: string]: Objective;
    } | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [status, setStatus] =
        useState<BackgroundFetch.BackgroundFetchStatus | null>(null);

    const { t } = useTranslation();
    const currentpage = usePathname();

    const checkStatusAsync = async () => {
        try {
            const status = await BackgroundFetch.getStatusAsync();
            const isRegistered =
                await TaskManager.isTaskRegisteredAsync("background-fetch");
            setStatus(status);
            setIsRegistered(isRegistered);
        } catch (error) {
            console.error("Error checking status:", error);
            termLog(
                "Error checking background fetch status: " + error,
                "error"
            );
        }
    };

    useEffect(() => {
        const verifyStatusAsync = async () => {
            try {
                const isRegistered =
                    await TaskManager.isTaskRegisteredAsync("background-fetch");
                if (!isRegistered) {
                    await registerBackgroundObjectivesFetchAsync();
                }
                termLog(
                    "Daily objective fetching seems to be set up!",
                    "success"
                );
            } catch (error) {
                console.error(
                    "Error verifying or registering background fetch:",
                    error
                );
                termLog(
                    "Error verifying or registering background fetch: " + error,
                    "error"
                );
            } finally {
                checkStatusAsync();
            }
        };

        verifyStatusAsync();
    }, []);

    useEffect(() => {
        const multiFetch = async () => {
            try {
                const items = await AsyncStorage.multiGet([
                    "username",
                    "objectives",
                    "hasLaunched",
                ]);
                if (items) {
                    setUsername(String(items[0][1]));
                    setObjectives(
                        items[1][1] !== null ||
                            items[1][1] !== "" ||
                            items[1][1] !== "{}" ||
                            items[1][1] !== "[]" ||
                            items[1][1]
                            ? JSON.parse(String(items[1][1]))
                            : {}
                    );
                    const isFirstLaunchValidation =
                        items[2][1] === null || !items[2][1];
                    if (isFirstLaunchValidation) {
                        await AsyncStorage.setItem("hasLaunched", "true");
                        setIsFirstLaunch(true);
                    } else {
                        setIsFirstLaunch(false);
                    }
                } else {
                    termLog(
                        "Error fetching basic user data! No items (useEffect -> multiFetch -> try-catch.try -> if items)",
                        "error"
                    );
                    setUsername("Unknown");
                    setObjectives({});
                }
                setLoading(false);
            } catch (e) {
                termLog(
                    "Error fetching basic user data! (useEffect -> multiFetch -> try-catch). Catched: " +
                        e,
                    "error"
                );
                setUsername("Unknown");
                setObjectives({});
                setLoading(false);
            }
        };

        multiFetch();
    }, []);

    useEffect(() => {
        if (isFirstLaunch) {
            router.push("/WelcomeScreen");
        }
    }, [isFirstLaunch]);

    const handleMarkingObjectiveAsDone = async (identifier: number) => {
        try {
            await markObjectiveAsDone(identifier, true, t);
            const updatedObjectives = await fetchObjectives("object");
            setObjectives(updatedObjectives);
        } catch (e) {
            termLog("Got an error updating: " + e, "error");
        }
    };

    useEffect(() => {
        termLog("isRegistered status: " + isRegistered, "log");
        termLog("status status: " + status, "log");
    }, [status, isRegistered]);

    const createNewActiveObjective = (): void => {
        router.navigate("/CreateObjective");
    };

    const startSessionFromObjective = (identifier: number): void => {
        router.navigate("/Sessions?id=" + identifier);
    };

    termLog(String(objectives), "log");

    const allDoneMessages: string[] = t("cool_messages.all_done", {
        returnObjects: true,
    });

    const randomMessageForAllDone =
        allDoneMessages[Math.floor(Math.random() * allDoneMessages.length)];

    useEffect(() => {
        if (objectives && checkForTodaysObjectives(objectives) !== null) {
            if (Platform.OS === "android") {
                if (checkForTodaysObjectives(objectives) === false) {
                    cancelScheduledNotifications();
                } else if (checkForTodaysObjectives(objectives) === true) {
                    scheduleRandomNotifications(t);
                }
            }
        }
    }, [objectives, t]);

    if (loading) {
        return (
            <View style={styles.containerview}>
                <BottomNav currentLocation={currentpage} />
                <ScrollView>
                    <View style={styles.mainview}>
                        <BetterText
                            fontWeight="Regular"
                            fontSize={15}
                            textAlign="center"
                            textColor="#C8C8C8"
                        >
                            {t("globals.loading")}
                        </BetterText>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.containerview}>
            <BottomNav currentLocation={currentpage} />
            <ScrollView style={styles.mainview}>
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={35}>
                    {t("page_home.header.label")}, {username}!
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={20}
                >
                    {t("page_home.header.sublabel")}
                </BetterText>
                <GapView height={20} />
                <Section kind="Objectives">
                    {objectives && Object.keys(objectives).length > 0 ? (
                        Object.keys(objectives).every(
                            key =>
                                objectives[key].wasDone ||
                                !objectives[key].days ||
                                !objectives[key].days[adjustedToday]
                        ) ? (
                            <View
                                style={{
                                    padding: 20,
                                    flex: 1,
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <BetterText
                                    textAlign="center"
                                    fontSize={30}
                                    textColor="#FFF"
                                    fontWeight="Bold"
                                >
                                    {t("page_home.no_objectives.all_done")}
                                </BetterText>
                                <GapView height={10} />
                                <BetterText
                                    textAlign="center"
                                    fontSize={15}
                                    textColor="#FFF"
                                    fontWeight="Regular"
                                >
                                    {randomMessageForAllDone}
                                </BetterText>
                            </View>
                        ) : (
                            Object.keys(objectives).map(key => {
                                const obj = objectives[key];
                                termLog(
                                    `OBJ ${obj.identifier}, days[${adjustedToday}]: ${obj.days[adjustedToday]}`,
                                    "log"
                                );

                                if (
                                    obj &&
                                    !obj.wasDone &&
                                    obj.days[adjustedToday]
                                ) {
                                    return (
                                        <Division
                                            key={obj.identifier}
                                            status="REGULAR"
                                            preheader={t(
                                                "sections.divisions.active_objective"
                                            )}
                                            header={t(
                                                `globals.supported_active_objectives.${obj.exercise}`
                                            )}
                                        >
                                            <Button
                                                style="ACE"
                                                action={() =>
                                                    startSessionFromObjective(
                                                        obj.identifier
                                                    )
                                                }
                                                buttonText={t(
                                                    "globals.lets_go"
                                                )}
                                            />
                                            <Button
                                                style="GOD"
                                                action={() =>
                                                    handleMarkingObjectiveAsDone(
                                                        obj.identifier
                                                    )
                                                }
                                                buttonText={t(
                                                    "globals.already_done_it"
                                                )}
                                            />
                                        </Division>
                                    );
                                }
                                return null;
                            })
                        )
                    ) : (
                        <View
                            style={{
                                padding: 20,
                                flex: 1,
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <BetterText
                                textAlign="center"
                                fontSize={30}
                                textColor="#FFF"
                                fontWeight="Bold"
                            >
                                {t("page_home.no_objectives.not_any_objective")}
                            </BetterText>
                            <GapView height={15} />
                            <Button
                                width="fill"
                                style="ACE"
                                buttonText={t("globals.lets_go")}
                                action={createNewActiveObjective}
                            />
                        </View>
                    )}
                </Section>
                {objectives && Object.keys(objectives).length > 0 && (
                    <GapView height={20} />
                )}
                {objectives && Object.keys(objectives).length > 0 && (
                    <Section kind="HowYouAreDoing">
                        <GapView height={20} />
                        <BetterText
                            fontWeight="Regular"
                            textColor="#32FF80"
                            fontSize={25}
                            textAlign="center"
                        >
                            {t("globals.coming_soon")}
                        </BetterText>
                        <View style={{ padding: 20 }}>
                            <BetterText
                                fontWeight="Regular"
                                fontSize={15}
                                textAlign="center"
                            >
                                {t("globals.workinprogress")}
                            </BetterText>
                        </View>
                    </Section>
                )}
                <Footer />
            </ScrollView>
        </View>
    );
}
