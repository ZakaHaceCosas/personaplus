// index.tsx
// Welcome to PersonaPlus. Give yourself a plus!

import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    Platform,
    Dimensions,
} from "react-native";
import { router, usePathname } from "expo-router";
import {
    markObjectiveAsDone,
    getObjectives,
    registerBackgroundObjectivesFetchAsync,
    checkForTodaysObjectives,
    objectiveArrayToObject,
    checkForAnObjectiveDailyStatus,
} from "@/src/toolkit/objectives";
import BetterText from "@/src/BetterText";
import Section from "@/src/section/Section";
import BottomNav from "@/src/BottomNav";
import Division from "@/src/section/Division";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/src/Buttons";
import GapView from "@/src/GapView";
import Footer from "@/src/Footer";
import { termLog } from "@/src/toolkit/debug/console";
import { useTranslation } from "react-i18next";
import {
    scheduleRandomNotifications,
    cancelScheduledNotifications,
} from "@/src/hooks/useNotification";
import { adjustedToday } from "@/src/toolkit/today";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import colors from "@/src/toolkit/design/colors";

// TypeScript, supongo
import { Objective } from "@/src/types/Objective";
import Loading from "@/src/Loading";
import { TFunction } from "i18next";

// We define the styles
const styles = StyleSheet.create({
    containerview: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    mainview: {
        padding: 20,
        paddingTop: 40,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
});

// To prevent code from being super nested / unreadable, I've moved some things here, so they act as separate components
function AllObjectivesDone(t: TFunction, randomMessageForAllDone: string) {
    return (
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
                textColor={colors.BASIC.WHITE}
                fontWeight="Bold"
            >
                {t("page_home.no_objectives.all_done")}
            </BetterText>
            <GapView height={10} />
            <BetterText
                textAlign="center"
                fontSize={15}
                textColor={colors.BASIC.WHITE}
                fontWeight="Regular"
            >
                {randomMessageForAllDone}
            </BetterText>
        </View>
    );
}

// We create the function
export default function Home() {
    const [loading, setLoading] = useState(true);
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
    const [username, setUsername] = useState<string>("Unknown");
    const [objectives, setObjectives] = useState<{
        [key: string]: Objective;
    } | null>(null);
    const [dueTodayObjectiveList, setDueTodayObjectiveList] = useState<
        number[]
    >([]);
    // isRegistered and status are used by the background task handler, nothing else
    const [isRegistered, setIsRegistered] = useState(false);
    const [status, setStatus] =
        useState<BackgroundFetch.BackgroundFetchStatus | null>(null);

    const { t } = useTranslation();
    const currentpage = usePathname();

    // this checks for the status of objective background fetching
    // sets the status and later logs it
    const checkStatusAsync = async () => {
        try {
            const status = await BackgroundFetch.getStatusAsync();
            const isRegistered =
                await TaskManager.isTaskRegisteredAsync("background-fetch");
            setStatus(status);
            setIsRegistered(isRegistered);
        } catch (e) {
            termLog(
                "Error checking for background fetch status: " + e,
                "error"
            );
        }
    };

    // verification of background fetching status and logging
    useEffect(() => {
        const verifyStatusAsync = async () => {
            try {
                const isRegistered =
                    await TaskManager.isTaskRegisteredAsync("background-fetch");
                if (!isRegistered) {
                    await registerBackgroundObjectivesFetchAsync(); // if not registered already
                }
                termLog(
                    "Daily objective fetching seems to be set up!",
                    "success"
                );
            } catch (e) {
                termLog(
                    "Error verifying or registering background fetch: " + e,
                    "error"
                );
            } finally {
                checkStatusAsync();
            }
        };

        verifyStatusAsync();
    }, []);

    // this fetches all stuff nedeed
    useEffect(() => {
        const multiFetch = async () => {
            try {
                // this returns stuff in an [x][1] basis
                // the username is [0] (because it's the first) and then always [1]
                const items = await AsyncStorage.multiGet([
                    "username",
                    "objectives",
                    "hasLaunched",
                ]);
                if (items) {
                    setUsername(String(items[0][1])); // see? username is [0][1]
                    setObjectives(
                        // this checks if objectives is NOT null or "" or "{}" or "[]". if it is, objectives will be {}, otherwise, they will be the saved objectives.
                        items[1][1] !== null ||
                            items[1][1] !== "" ||
                            items[1][1] !== "{}" ||
                            items[1][1] !== "[]" ||
                            items[1][1]
                            ? JSON.parse(String(items[1][1]))
                            : {}
                    );
                    const isFirstLaunchValidation =
                        items[2][1] === null || !items[2][1]; // if this item is null or was never created ("hasLaunched"), this is considered the 1st launch and redirects to WelcomeScreen
                    if (isFirstLaunchValidation) {
                        await AsyncStorage.setItem("hasLaunched", "true"); // TODO: move this to the submit handler at the end of the WelcomeScreen, otherwise, if you exit the app without finishing the form, it thinks you already did it. no one is "Unknown years old"! so this needs to be moved
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
                setLoading(false); // if everything works, sets loading to false
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
            router.push("/WelcomeScreen"); // if isFirstLaunch, pushes to WelcomeScreen
        }
    }, [isFirstLaunch]);

    // marking an objective as done
    const handleMarkingObjectiveAsDone = async (identifier: number) => {
        try {
            await markObjectiveAsDone(identifier, true, t); // actually this line itself does the entire thing, thanks to the objective toolkit, the rest is just state handling for the page to update
            // toolkification was probably the best idea i've ever had
            const updatedObjectives = await getObjectives("object");
            if (Array.isArray(updatedObjectives)) {
                setObjectives(objectiveArrayToObject(updatedObjectives));
            } else {
                termLog("Expected an array and got a string instead", "error");
            }
        } catch (e) {
            termLog("Got an error updating: " + e, "error");
        }
    };

    // logs background fetch status
    useEffect(() => {
        termLog(
            "(BACKGROUND OBJECTIVE FETCH) isRegistered status: " + isRegistered,
            "log"
        );
        termLog("(BACKGROUND OBJECTIVE FETCH) status: " + status, "log");
    }, [status, isRegistered]);

    const createNewActiveObjective = (): void => {
        router.navigate("/CreateObjective");
    };

    // redirects to the Sessions page if the user starts a session, passing the objective's ID as a parameter
    const startSessionFromObjective = (identifier: number): void => {
        router.navigate("/Sessions?id=" + identifier);
    };

    // logs all objectives
    // some logs like this one of the backgorund fetch status should be removed if everything works, tho
    // for performance
    // counts as a TODO
    useEffect(() => {
        termLog("Objectives: " + JSON.stringify(objectives), "log");
    }, [objectives]);

    // choose a random message for when you've done it all
    // so the app feels more friendly :D
    const allDoneMessages: string[] = t("cool_messages.all_done", {
        returnObjects: true,
    });

    const randomMessageForAllDone =
        allDoneMessages[Math.floor(Math.random() * allDoneMessages.length)];

    // if you've done it all, unsubscribe from reminder notifications
    useEffect(() => {
        const unsubscribe = async () => {
            if (objectives && checkForTodaysObjectives(objectives) !== null) {
                const check = await checkForTodaysObjectives(objectives);
                if (Platform.OS === "android") {
                    if (check === false) {
                        cancelScheduledNotifications();
                    } else if (check === true) {
                        scheduleRandomNotifications(t);
                    }
                }
            }
        };

        unsubscribe();
    }, [objectives, t]);

    useEffect(() => {
        let isMounted = true; // This is supposed to track if the component is still mounted
        // found it somewhere, hope it does something useful

        const handle = async () => {
            const identifiers = []; // A list of the IDs of objectives that are due today
            if (objectives && Object.keys(objectives).length > 0) {
                // iterates over all the objectives using a for...of loop to handle async/await stuff
                for (const key of Object.keys(objectives)) {
                    const objective = objectives[key];
                    const isDailyStatusChecked =
                        await checkForAnObjectiveDailyStatus(
                            objective.identifier
                        );
                    if (
                        !isDailyStatusChecked &&
                        objective.days[adjustedToday]
                    ) {
                        // if not done today AND has to be done today, push it
                        identifiers.push(objective.identifier);
                    }
                }

                if (isMounted) {
                    // update IDs list only if the component is still mounted
                    setDueTodayObjectiveList(identifiers);
                }
            }
            termLog("Due today IDs: " + identifiers, "log");
        };

        handle();

        return () => {
            // unmount this thing
            isMounted = false;
        };
    }, [objectives]);

    if (loading) {
        return <Loading currentpage={currentpage} displayNav={true} />;
    }

    return (
        <View style={styles.containerview}>
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
                            key => !objectives[key].days[adjustedToday]
                        ) ? (
                            AllObjectivesDone(t, randomMessageForAllDone)
                        ) : (
                            Object.keys(objectives).map(key => {
                                const obj = objectives[key];
                                /* termLog(
                                    `OBJECTIVE: ${obj.identifier}, days[${adjustedToday}]: ${obj.days[adjustedToday]}`,
                                    "log"
                                ); */
                                if (
                                    obj &&
                                    obj.days[adjustedToday] &&
                                    dueTodayObjectiveList.includes(
                                        obj.identifier
                                    )
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
                                textColor={colors.BASIC.WHITE}
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
                            textColor={colors.PRIMARIES.GOD.GOD}
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
            <BottomNav currentLocation={currentpage} />
        </View>
    );
}
