// index.tsx
// Welcome to PersonaPlus. Give yourself a plus!

import React, { useState, useEffect, ReactElement } from "react";
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
    startSessionFromObjective,
} from "@/src/toolkit/objectives";
import BetterText, {
    BetterTextHeader,
    BetterTextSubheader,
} from "@/src/BetterText";
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
import generateRandomMessage from "@/src/toolkit/design/randomMessages";

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

    // To prevent code from being super nested / unreadable, I've moved some things here, so they act as separate components
    /**
     * Generates an "All objectives done!" view. Use it inside of the `<Section kind="objectives">`, for when there are objectives for today but are all done.
     *
     * @param {TFunction} t Pass the translate function, please.
     * @returns {*}
     */
    function AllObjectivesDone(t: TFunction) {
        const message: string = generateRandomMessage("all_done", t);

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
                    {message}
                </BetterText>
            </View>
        );
    }

    /**
     * Renders a `<Division>` for a given objective that's due today.
     *
     * @param {Objective} obj The `Objective`
     * @param {TFunction} t Pass here the translate function, please.
     * @returns {ReactElement} A JSX element (a `<Division>`).
     */
    function ObjectiveDivision(obj: Objective, t: TFunction): ReactElement {
        return (
            <Division
                key={obj.identifier}
                status="REGULAR"
                preheader={t("sections.divisions.active_objective")}
                header={t(
                    `globals.supported_active_objectives.${obj.exercise}`
                )}
            >
                <Button
                    style="ACE"
                    action={() => startSessionFromObjective(obj.identifier)}
                    buttonText={t("globals.lets_go")}
                />
                <Button
                    style="GOD"
                    action={() => handleMarkingObjectiveAsDone(obj.identifier)}
                    buttonText={t("globals.already_done_it")}
                />
            </Division>
        );
    }

    /**
     * Shows a header and a button, stating that there are no objectives. Use it when there are no created objectives at all.
     *
     * @param {TFunction} t Pass here the translate function, please.
     * @param {() => void} create A void function to create an objective.
     * @returns {ReactElement} A JSX element.
     */
    function NoObjectives(t: TFunction, create: () => void): ReactElement {
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

    function renderObjectiveDivision(obj: Objective): ReactElement | null {
        try {
            const isObjectiveDueToday =
                obj &&
                obj.days[adjustedToday] !== null &&
                obj.days[adjustedToday] !== undefined &&
                dueTodayObjectiveList.includes(obj.identifier);
            if (!isObjectiveDueToday) return null;

            termLog("Rendering Objective Division:" + obj, "log");
            return ObjectiveDivision(obj, t);
        } catch (e) {
            termLog("Error rendering objective division:" + e, "error");
            throw new Error("Error rendering objective division:" + e);
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
                /* if (!objectives || Object.keys(objectives).length === 0) {
                    setLoadingObjectives(false);
                    return;
                } */ // Avoid running if not needed

                /* const identifiers = await Promise.all(
                    Object.keys(objectives).map(async key => {
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
                ); */
                if (objectives) {
                    const identifiers = await Promise.all(
                        Object.keys(objectives).map(async key => {
                            const objective = objectives[key];
                            const isDueToday =
                                !(await checkForAnObjectiveDailyStatus(
                                    objective.identifier
                                )) && objective.days[adjustedToday];
                            return isDueToday
                                ? objective.identifier
                                : undefined;
                        })
                    );

                    /* const filteredIdentifiers = identifiers.filter(
                (id): id is number => id !== undefined
            ); */

                    termLog("Identifiers:" + identifiers, "log");
                    /* termLog("Filtered Identifiers:" + filteredIdentifiers, "log"); */

                    /* const validIdentifiers: number[] = identifiers.filter(
                    (id): id is number => id !== undefined
                );

                setDueTodayObjectiveList(validIdentifiers); */
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

        let isMounted = true; // thing that supposedly fixes issues :V

        // Main async function to handle the sequence
        const handle = async () => {
            try {
                if (isMounted)
                    await verifyObjectiveBackgroundFetchingStatusAsync(); // Verifies background fetching
                if (isMounted) await multiFetch(); // Fetches user data and objectives
                if (isMounted) await fetchDueTodayObjectives(); // Processes the objectives

                if (isMounted) setLoading(false); // Finally, set loading to false
            } catch (e) {
                termLog("Error: " + e, "log");
            }
        };

        handle(); // Execute the main sequence
        // THIS SHALL ONLY RUN ONCE, NO MORE TIMES
        // i don't want more of those... memory issues

        return () => {
            isMounted = false;
        };

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
    }, [objectives, dueTodayObjectiveList]);

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
                return NoObjectives(t, () =>
                    router.navigate("/CreateObjective")
                );
            }

            return dueTodayObjectiveList.length > 0
                ? Object.keys(objectives).map(key =>
                      renderObjectiveDivision(objectives[key])
                  )
                : AllObjectivesDone(t);
        } catch (e) {
            termLog("Error rendering objectives section: " + e, "error");
            return null;
        }
    }

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
                <BetterTextHeader>
                    {t("page_home.header.label")}, {username}!
                </BetterTextHeader>
                <BetterTextSubheader>
                    {t("page_home.header.sublabel")}
                </BetterTextSubheader>
                <GapView height={20} />
                <Section kind="Objectives">{renderObjectivesSection()}</Section>
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
                <Footer />
            </ScrollView>
            <BottomNav currentLocation={currentpage} />
        </View>
    );
}
