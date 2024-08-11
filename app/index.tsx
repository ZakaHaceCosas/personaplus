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
import * as TaskManager from "expo-task-manager";
import colors from "@/src/toolkit/design/colors";
import Loading from "@/src/Loading";

// TypeScript, supongo
import { Objective } from "@/src/types/Objective";
import { TFunction } from "i18next";

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

function ObjectiveDivision(
    obj: Objective,
    t: TFunction,
    start: (arg0: number) => void,
    markAsDone: (arg0: number) => void
) {
    return (
        <Division
            key={obj.identifier}
            status="REGULAR"
            preheader={t("sections.divisions.active_objective")}
            header={t(`globals.supported_active_objectives.${obj.exercise}`)}
        >
            <Button
                style="ACE"
                action={() => start(obj.identifier)}
                buttonText={t("globals.lets_go")}
            />
            <Button
                style="GOD"
                action={() => markAsDone(obj.identifier)}
                buttonText={t("globals.already_done_it")}
            />
        </Division>
    );
}

function NoObjectives(t: TFunction, create: () => void) {
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
                {t("page_home.no_objectives.not_any_objective")}
            </BetterText>
            <GapView height={15} />
            <Button
                width="fill"
                style="ACE"
                buttonText={t("globals.lets_go")}
                action={create}
            />
        </View>
    );
}

// We create the function
export default function Home() {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<string>("Unknown");
    const [objectives, setObjectives] = useState<{
        [key: string]: Objective;
    } | null>(null);
    const [dueTodayObjectiveList, setDueTodayObjectiveList] = useState<
        number[]
    >([]);

    const { t } = useTranslation();
    const currentpage = usePathname();

    const [randomMessage, setRandomMessage] = useState<string>();

    // marking an objective as done
    const handleMarkingObjectiveAsDone = async (identifier: number) => {
        try {
            await markObjectiveAsDone(identifier, true, t); // actually this line itself does the entire thing, thanks to the objective toolkit, the rest is just state handling for the page to update
            // toolkification was probably the best idea i've ever had
            const updatedObjectives = await getObjectives();
            if (updatedObjectives) {
                setObjectives(objectiveArrayToObject(updatedObjectives));
            }
        } catch (e) {
            termLog("Got an error updating: " + e, "error");
        }
    };

    const createNewActiveObjective = (): void => {
        router.navigate("/CreateObjective");
    };

    // redirects to the Sessions page if the user starts a session, passing the objective's ID as a parameter
    const startSessionFromObjective = (identifier: number): void => {
        if (identifier !== undefined) {
            router.navigate("/Sessions?id=" + identifier);
        } else {
            termLog(
                "Invalid identifier provided for starting a session",
                "error"
            );
        }
    };

    useEffect(() => {
        // choose a random message for when you've done it all
        // so the app feels more friendly :D
        const allDoneMessages: string[] = t("cool_messages.all_done", {
            returnObjects: true,
        });

        const randomMessageForAllDone =
            allDoneMessages[Math.floor(Math.random() * allDoneMessages.length)];

        setRandomMessage(randomMessageForAllDone);
    }, [t]);

    useEffect(() => {
        let isMounted = true; // This is supposed to track if the component is still mounted
        // found it somewhere, hope it does something useful

        const handle = async () => {
            if (!objectives || Object.keys(objectives).length === 0) return; // to avoid running this when not needed

            const identifiers = []; // A list of the IDs of objectives that are due today
            if (objectives && Object.keys(objectives).length > 0) {
                // iterates over all the objectives using a for...of loop to handle async/await stuff
                for (const key of Object.keys(objectives)) {
                    if (!isMounted) return;
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
        };

        handle();

        return () => {
            // unmount this thing
            isMounted = false;
        };
    }, [objectives]);

    const renderObjectiveDivision = (obj: Objective) => {
        if (
            obj &&
            obj.days[adjustedToday] !== undefined &&
            obj.days[adjustedToday] !== null &&
            dueTodayObjectiveList.includes(obj.identifier)
        ) {
            return ObjectiveDivision(
                obj,
                t,
                startSessionFromObjective,
                handleMarkingObjectiveAsDone
            );
        }
        return null;
    };

    useEffect(() => {
        // function for verification of background fetching status and logging
        const verifyObjectiveBackgroundFetchingStatusAsync = async () => {
            try {
                const isRegistered = await TaskManager.isTaskRegisteredAsync(
                    "background-active-objective-fetching"
                );
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
            }
        };

        // this fetches all stuff nedeed
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
                    const username = items[0]?.[1]
                        ? String(items[0][1])
                        : "Error"; // in case of error sets to an "Error value"
                    setUsername(username); // see? username is [0][1]

                    const objectivesData = items[1]?.[1];
                    const parsedObjectives = // this checks if objectives is NOT null or "" or "{}" or "[]". if it is, objectives will be {}, otherwise, they will be the saved objectives.
                        objectivesData &&
                        objectivesData !== "{}" &&
                        objectivesData !== "[]"
                            ? JSON.parse(objectivesData)
                            : {};
                    setObjectives(parsedObjectives);

                    const isFirstLaunchValidation = !items[2]?.[1]; // if this item is null or was never created ("hasLaunched"), this is considered the 1st launch and redirects to WelcomeScreen
                    if (isFirstLaunchValidation) {
                        router.push("/WelcomeScreen"); // if isFirstLaunchValidation, pushes to WelcomeScreen
                    }
                } else {
                    termLog(
                        "Error fetching basic user data! No items (useEffect -> multiFetch -> try-catch.try -> if items)",
                        "error"
                    );
                    setUsername("Unknown");
                    setObjectives({});
                }
            } catch (e) {
                termLog(
                    "Error fetching basic user data! (useEffect -> multiFetch -> try-catch). Catched: " +
                        e,
                    "error"
                );
                setUsername("Unknown");
                setObjectives({});
            } finally {
                setLoading(false);
            }
        };

        verifyObjectiveBackgroundFetchingStatusAsync();
        multiFetch();
        // THIS SHALL ONLY RUN ONCE, NO MORE TIMES
        // i don't want more of those... memory issues
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const unsubscribe = async () => {
            if (objectives) {
                const check = await checkForTodaysObjectives(objectives);
                if (Platform.OS === "android") {
                    if (check === false) {
                        await cancelScheduledNotifications();
                    } else if (check === true) {
                        await scheduleRandomNotifications(t);
                    }
                }
            }
        };

        // if you've done it all, unsubscribe from reminder notifications
        // TODO: it doesnt work
        unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objectives]);

    if (loading) {
        return <Loading currentpage={currentpage} displayNav={true} />;
    }

    return (
        <View style={styles.containerview}>
            <ScrollView
                style={styles.mainview}
                contentContainerStyle={{ flexGrow: 1 }}
                horizontal={false}
            >
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
                    {objectives && Object.keys(objectives).length
                        ? dueTodayObjectiveList.length === 0
                            ? AllObjectivesDone(t, randomMessage ?? "Error.")
                            : Object.keys(objectives).map(key =>
                                  renderObjectiveDivision(objectives[key])
                              )
                        : NoObjectives(t, createNewActiveObjective)}
                </Section>
                {objectives && Object.keys(objectives).length > 0 && (
                    <>
                        <GapView height={20} />
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
                    </>
                )}
                <Footer />
            </ScrollView>
            <BottomNav currentLocation={currentpage} />
        </View>
    );
}
