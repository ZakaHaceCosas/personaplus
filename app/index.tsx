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
} from "@/components/toolkit/objectives";
import BetterText from "@/components/BetterText";
import Section from "@/components/section/Section";
import BottomNav from "@/components/BottomNav";
import Division from "@/components/section/division/Division";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/Buttons";
import GapView from "@/components/GapView";
import Footer from "@/components/Footer";
import { termLog } from "@/app/DeveloperInterface";
import { useTranslation } from "react-i18next";
import {
    scheduleNotificationAsync,
    cancelScheduledNotificationAsync,
} from "expo-notifications";
import { adjustedToday } from "@/components/toolkit/today";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

// TypeScript, supongo
import { Objective } from "@/components/types/Objective";

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

interface NotificationIdentifier {
    identifier: string;
}

const scheduledNotifications: NotificationIdentifier[] = [];

const scheduleRandomNotifications = async () => {
    const notificationMessages = [
        "You know you got stuff to do!",
        "Daily objective means DAILY objective - go and do it!",
        "Time to give yourself a plus!",
        "You said you wanted to give yourself a plus - get up!",
        "The only difference between us and a regular task list? We're way more fun to check!",
        "I'm like your mom: I won't stop till' you make it.",
        "Give yourself a plus before, mute your phone after.",
        "The only notification that doesn't make you waste time.",
        "No, not another TikTok notification this time. Move your body!",
        "They're called 'objectives' for a reason: you have to accomplish them!",
        "No, I won't stop sending notifications until you stop ignoring your path to success",
        "Trust me, you'll feel better later.",
        "Just one more session pls, love u <3",
        "You downloaded this app for a reason. Don't give it up.",
        "It's that time again!",
    ];

    // const randomDelay = () => Math.floor(Math.random() * 30) * 1000;
    const randomDelay = () => (Math.floor(Math.random() * 1800) + 1800) * 1000;
    // for testing: uncomment 1st and comment 2nd line
    // for production: the opposite (comment 1st and uncomment 2nd line)
    // 1st one is a random interval of 0-29 seconds between random notification
    // 2nd one is also a random interval, but of 30-60 minutes, so it's not annoying for the end user

    for (let i = 0; i < 2; i++) {
        const randomMessage =
            notificationMessages[
                Math.floor(Math.random() * notificationMessages.length)
            ];
        const trigger = {
            hour: Math.floor(Math.random() * 12) + 11,
            minute: Math.floor(Math.random() * 60),
            repeats: true,
        };

        const identifier = await scheduleNotificationAsync({
            content: {
                title: "Pending PersonaPlus objectives!",
                body: randomMessage,
            },
            trigger,
        });

        // Store the notification identifier
        scheduledNotifications.push({ identifier });

        await new Promise(resolve => setTimeout(resolve, randomDelay()));
        termLog(String(scheduledNotifications), "log");
        termLog("Scheduled Notis ENABLED", "log");
    }
};

// Function to cancel scheduled notifications
const cancelScheduledNotifications = async () => {
    for (const { identifier } of scheduledNotifications) {
        await cancelScheduledNotificationAsync(identifier);
    }

    scheduledNotifications.length = 0;
    termLog(String(scheduledNotifications), "log");
    termLog("Scheduled Notis DISABLED", "log");
};

// Creamos la función
export default function Home() {
    const [loading, setLoading] = React.useState(true);
    const [isFirstLaunch, setIsFirstLaunch] = React.useState<boolean | null>(
        null
    );
    const [username, setUsername] = React.useState<string>("Unknown");
    const [objectives, setObjectives] = React.useState<{
        [key: string]: Objective;
    } | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [status, setStatus] =
        useState<BackgroundFetch.BackgroundFetchStatus | null>(null);

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
        termLog("isRegistered status at index: " + isRegistered, "log");
        termLog("status status at index: " + status, "log");
    }, [status, isRegistered]);

    const { t } = useTranslation();

    React.useEffect(() => {
        const multiFetch = async () => {
            const items = await AsyncStorage.multiGet([
                "username",
                "objectives",
                "hasLaunched",
            ]);
            if (items) {
                setUsername(String(items[0][1]));
                if (items[1][1] !== null) {
                    setObjectives(JSON.parse(String(items[1][1])));
                } else {
                    setObjectives(JSON.parse("[]"));
                }
                const hasLaunchedValue = items[2][1];
                if (hasLaunchedValue === null || !hasLaunchedValue) {
                    await AsyncStorage.setItem("hasLaunched", "true");
                    setIsFirstLaunch(true);
                } else {
                    setIsFirstLaunch(false);
                }
                setLoading(false);
            } else {
                termLog("Fetch error!", "error");
                setUsername("Unknown");
                setObjectives(JSON.parse("[]"));
                setLoading(false);
            }
        };

        multiFetch();
    }, []);

    const currentpage: string = usePathname();

    const handleMarkingObjectiveAsDone = async (identifier: number) => {
        try {
            await markObjectiveAsDone(identifier);
            const updatedObjectives = await fetchObjectives("object");
            setObjectives(updatedObjectives);
        } catch (e) {
            const log: string = "Got an error updating, " + e;
            termLog(log, "error");
        }
    };

    if (isFirstLaunch) {
        router.push("/WelcomeScreen");
    }

    const createNewActiveObjective = (): void => {
        router.navigate("/CreateObjective");
    };

    const startSessionFromObjective = (identifier: number): void => {
        router.navigate("/Sessions?id=" + identifier);
    };

    termLog(String(objectives), "log");

    // i got creative :]
    // commits / PRs that add more stuff will of course be taken into account
    const allDoneMessages: string[] = t("cool_messages.all_done", {
        returnObjects: true,
    });

    const randomMessageIndex = Math.floor(
        Math.random() * allDoneMessages.length
    );

    const randomMessageForAllDone = allDoneMessages[randomMessageIndex];

    if (objectives && Object.keys(objectives).length > 0) {
        const allObjectivesHandled = Object.keys(objectives).every(key => {
            const objective = objectives[key];
            return (
                objective.wasDone ||
                !objective.days ||
                !objective.days[adjustedToday]
            );
        });

        if (!allObjectivesHandled) {
            if (Platform.OS === "android") {
                scheduleRandomNotifications();
            }
        } else {
            if (Platform.OS === "android") {
                cancelScheduledNotifications();
            }
        }
    }

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
