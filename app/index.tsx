// index.tsx
// Welcome to PersonaPlus. Give yourself a plus!

import React, { useState, useEffect, ReactElement, useCallback } from "react";
import { View, ScrollView, StyleSheet, Platform } from "react-native";
import { router, usePathname } from "expo-router";
import {
    markObjectiveAsDone,
    getObjectives,
    registerBackgroundObjectivesFetchAsync,
    checkForTodaysObjectives,
    objectiveArrayToObject,
    checkForAnObjectiveDailyStatus,
} from "@/src/toolkit/objectives";
import BetterText, {
    BetterTextHeader,
    BetterTextSubHeader,
} from "@/src/BetterText";
import Section from "@/src/section/Section";
import BottomNav from "@/src/BottomNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GapView from "@/src/GapView";
import Footer from "@/src/Footer";
import { termLog } from "@/src/toolkit/debug/console";
import { useTranslation } from "react-i18next";
import {
    scheduleRandomNotifications,
    cancelScheduledNotifications,
    areNotificationsScheduledForToday,
} from "@/src/hooks/useNotification";
import { adjustedToday } from "@/src/toolkit/today";
import * as TaskManager from "expo-task-manager";
import colors from "@/src/toolkit/design/colors";
import Loading from "@/src/Loading";

// TypeScript, supongo
import { Objective } from "@/src/types/Objective";
import {
    RenderAllObjectivesDoneDivision,
    RenderNoObjectivesDivision,
    RenderObjectiveDivision,
} from "@/src/toolkit/ui/home";

// We define the styles
const styles = StyleSheet.create({
    mainview: {
        backgroundColor: colors.MAIN.APP,
        padding: 20,
        paddingTop: 40,
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
    },
});

// We create the function
export default function Home() {
    const [loading, setLoading] = useState(true);
    const [loadingObjectives, setLoadingObjectives] = useState(true);
    const [username, setUsername] = useState<string | null>(null);
    const [objectives, setObjectives] = useState<{
        [key: string]: Objective;
    } | null>(null);
    const [dueTodayObjectiveList, setDueTodayObjectiveList] = useState<
        number[]
    >([]);

    const { t } = useTranslation();
    const currentpage = usePathname();

    // marking an objective as done
    const handleMarkingObjectiveAsDone = useCallback(
        async (identifier: number) => {
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
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    function renderObjectiveDivision(obj: Objective): ReactElement | null {
        try {
            if (!dueTodayObjectiveList.includes(obj.identifier)) return null;

            termLog("Rendering Objective Division:" + obj, "log");
            return RenderObjectiveDivision(
                obj,
                t,
                handleMarkingObjectiveAsDone
            );
        } catch (e) {
            termLog("Error rendering objective division:" + e, "error");
            return null;
        }
    }

    useEffect(() => {
        // Verifies background fetching status and logs it
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

        // Fetches all required data
        const multiFetch = async () => {
            try {
                const items = await AsyncStorage.multiGet([
                    "username",
                    "hasLaunched",
                ]);
                if (items) {
                    const username = items[0]?.[1]
                        ? String(items[0][1])
                        : "Error"; // in case of error sets to an "Error value"
                    setUsername(username);

                    const parsedObjectives = await getObjectives();
                    if (parsedObjectives) {
                        setObjectives(objectiveArrayToObject(parsedObjectives));
                        termLog("Parsed Objectives:" + parsedObjectives, "log");
                        await fetchDueTodayObjectives();
                    } else {
                        setObjectives({});
                    }

                    const isFirstLaunchValidation = !items[1]?.[1];
                    if (isFirstLaunchValidation) {
                        router.push("/WelcomeScreen"); // Redirects if it's the first launch
                        return;
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
            }
        };

        // Fetches objectives and determines which ones are due today
        const fetchDueTodayObjectives = async () => {
            try {
                if (!objectives || Object.keys(objectives).length === 0) {
                    setLoadingObjectives(false);
                    return;
                } // Avoid running if not needed

                if (objectives) {
                    const identifiers = await Promise.all(
                        Object.keys(objectives).map(async (key) => {
                            const objective = objectives[key];
                            const isDailyStatusChecked =
                                await checkForAnObjectiveDailyStatus(
                                    objective.identifier
                                );
                            if (
                                !isDailyStatusChecked &&
                                objective.days[adjustedToday]
                            ) {
                                return objective.identifier;
                            }
                            return undefined;
                        })
                    );

                    termLog("Identifiers:" + identifiers, "log");
                    const filteredIdentifiers = identifiers.filter(
                        (id): id is number => id !== undefined
                    );
                    setDueTodayObjectiveList(filteredIdentifiers);
                    termLog(
                        "Due Today Objective List:" + filteredIdentifiers,
                        "log"
                    );
                    return filteredIdentifiers;
                } else {
                    return [];
                }
            } catch (e) {
                termLog("Error fetching due today objectives: " + e, "error");
            } finally {
                setLoadingObjectives(false);
            }
        };

        // Main async function to handle the sequence
        const handle = async () => {
            try {
                await verifyObjectiveBackgroundFetchingStatusAsync(); // Verifies background fetching
                await multiFetch(); // Fetches user data and objectives
                await fetchDueTodayObjectives(); // Processes the objectives
                setLoading(false); // Finally, set loading to false
            } catch (e) {
                termLog("Error: " + e, "log");
            }
        };

        if (loadingObjectives) {
            handle();
        }
    }, [loadingObjectives, objectives]);

    useEffect(() => {
        const manageNotifications = async () => {
            if (objectives) {
                const check = await checkForTodaysObjectives(objectives);
                if (Platform.OS === "android") {
                    if (!check) {
                        await cancelScheduledNotifications();
                    } else {
                        const check2 =
                            await areNotificationsScheduledForToday();
                        if (!check2) {
                            await scheduleRandomNotifications(t);
                        } else {
                            termLog(
                                "Notifications seem to be up and running",
                                "log"
                            );
                        }
                    }
                }
            }
        };

        // if you've done it all, unsubscribe from reminder notifications
        // WATCHOUT: didnt work, now its changed. notifications arent immediate so testing is required
        manageNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objectives]);

    useEffect(() => {
        if (!loading && !loadingObjectives) {
            // checks for changes to state
            termLog(
                "Due Today Objective List Updated:" + dueTodayObjectiveList,
                "log"
            );
        }
    }, [loading, loadingObjectives, dueTodayObjectiveList]);

    function renderObjectivesSection() {
        try {
            if (loadingObjectives) return null;

            if (!objectives || Object.keys(objectives).length === 0) {
                return RenderNoObjectivesDivision(t, () =>
                    router.navigate("/CreateObjective")
                );
            }

            if (!dueTodayObjectiveList || dueTodayObjectiveList.length === 0) {
                return RenderAllObjectivesDoneDivision(t);
            }

            return (
                // FIXME: doesnt work, due today objectives aren't shown even tho there are.
                // NOTE: somehow reactnative's fast-refresh (like edit & save your code) actually makes them appear when testing with expo dev build / expo go, so...
                <>
                    {Object.values(objectives)
                        .filter((obj) =>
                            dueTodayObjectiveList.includes(obj.identifier)
                        )
                        .map((obj) => renderObjectiveDivision(obj))}
                </>
            );
        } catch (e) {
            termLog("Error rendering objectives section: " + e, "error");
            return null;
        }
    }

    if (loading || loadingObjectives) {
        return <Loading currentpage={currentpage} displayNav={true} />;
    }

    return (
        <>
            <ScrollView
                style={styles.mainview}
                contentContainerStyle={{ flexGrow: 1 }}
                horizontal={false}
            >
                <BetterTextHeader>
                    {t("page_home.header.label")}, {username}!
                </BetterTextHeader>
                <BetterTextSubHeader>
                    {t("page_home.header.sublabel")}
                </BetterTextSubHeader>
                <GapView height={20} />
                <Section kind="Objectives">{renderObjectivesSection()}</Section>
                <GapView height={20} />
                <Section kind="HowYouAreDoing">
                    <GapView height={20} />
                    <BetterText
                        fontWeight="Medium"
                        fontSize={25}
                        textColor={colors.PRIMARIES.GOD.GOD}
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
                <Footer />
            </ScrollView>
            <BottomNav currentLocation={currentpage} />
        </>
    );
}
