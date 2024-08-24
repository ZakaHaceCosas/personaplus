// Sessions.tsx
// Page for live exercising sessions

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ToastAndroid, Platform } from "react-native";
import {
    getObjectives,
    markObjectiveAsDone,
    getObjectiveByIdentifier,
    calculateSessionFragmentsDuration,
} from "@/src/toolkit/objectives";
import { router, useGlobalSearchParams } from "expo-router";
import BetterText from "@/src/BetterText";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/src/GapView";
import { termLog } from "@/src/toolkit/debug/console";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import Button from "@/src/Buttons";
import { useTranslation } from "react-i18next";
import InfoIcons from "@/src/sessions/InfoIcons";
import colors from "@/src/toolkit/design/colors";
import Loading from "@/src/Loading";

// TypeScript, supongo.
import { Objective } from "@/src/types/Objective";
import HelpView from "@/src/sessions/HelpView";

// We define the styles
const styles = StyleSheet.create({
    mainview: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 20,
        flex: 1,
        backgroundColor: colors.MAIN.APP,
        overflow: "visible",
    },
    subview: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "37.5%",
    },
    topbarview: {
        display: "flex",
        flexDirection: "row",
        padding: 20,
        backgroundColor: colors.MAIN.SECTION,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },
    buttonsview: {
        display: "flex",
        flexDirection: "row",
        padding: 20,
        backgroundColor: colors.MAIN.SECTION,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    infoview: {
        display: "flex",
        flexDirection: "column",
        padding: 20,
        backgroundColor: colors.MAIN.SECTION,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
});

// Instead of a lot of useStates, maybe it's smarter to move some stuff to outside functions
// That's what I've done here
function useObjectivesFetching() {
    // fetches the objectives - simple
    const { t } = useTranslation();
    const [objectives, setObjectives] = useState<Objective[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getObjectives();
                setObjectives(result);
            } catch (e) {
                termLog(
                    t("globals.react_error") +
                        "SESSIONTS.TSX - Objective fetch error! " +
                        e,
                    "error"
                );
            } finally {
                setLoading(false); // setLoading() in the finally block and not the try one, so in the case of an error the user doesnt get stuck on a "Loading..." screen
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { objectives, loading };
}

function useCurrentObjective(objectiveIdentifier: number | null) {
    // gathers the fetched objectives, and finds the current objective (the one belonging to this session)
    const [currentObjective, setCurrentObjective] = useState<Objective | null>(
        null
    );
    const [laps, setLaps] = useState<number>(0);

    useEffect(() => {
        if (objectiveIdentifier !== null) {
            const fetchCurrentObjective = async () => {
                try {
                    const objective = await getObjectiveByIdentifier(
                        objectiveIdentifier
                    ); // this line handles everything, actually
                    setCurrentObjective(objective ?? null); // this sets the gathered objective as the current objective, or null if something happened
                    setLaps(objective?.repetitions || 0); // this ensures "laps" is set correctly
                } catch (e) {
                    termLog("Error fetching current objective: " + e, "error");
                }
            };

            fetchCurrentObjective();
        }
    }, [objectiveIdentifier]);

    return { currentObjective, laps, setLaps };
}

// We define the main function
export default function Sessions() {
    // Stateful values and stuff
    const { t } = useTranslation();
    const params = useGlobalSearchParams();
    const objectiveIdentifier = params.id ? Number(params.id) : null;

    const { objectives, loading } = useObjectivesFetching();
    const { currentObjective, laps, setLaps } =
        useCurrentObjective(objectiveIdentifier);

    const [isTimerRunning, setTimerStatus] = useState(true);
    const [isUserCheckingHelp, setIsUserCheckingHelp] = useState(false);
    const [isUserResting, setIsUserResting] = useState(false);
    /*
    If you wonder why there are two variables for the timer's loops, one of them is to keep account of many times repeat (laps) and other one is to set the "key" attribute of the circle timer (timerKey), which is required for the timer to loop itself.
    */
    // const [laps, setLaps] = useState<number>(0);
    const [timerKey, setTimerKey] = useState<number>(0);

    // some logs i added cause' this shi was broken in past and i didnt know howto fix it
    useEffect(() => {
        termLog("SESSIONS.TSX - Objectives: " + objectives, "log");
        termLog(
            "SESSIONTS.TSX - Objectives state: " + JSON.stringify(objectives),
            "log"
        );
        termLog("SESSIONS.TSX - Current ID: " + objectiveIdentifier, "log");
    }, [objectives, objectiveIdentifier]);

    // more logs cause of this shi being broken
    useEffect(() => {
        termLog(
            "SESSIONS.TSX - Current Objective: " +
                JSON.stringify(currentObjective),
            "log"
        );
    }, [currentObjective]);

    // the sustantivized version of the objective name (i dont know how to call it)
    // like if the exercise is "Push ups" this variable is "Pushing up" (or "Doing pushups"? i dont remember)
    const currentObjectiveSustantivizedName: string = currentObjective?.exercise
        ? t(
              `globals.supported_active_objectives_sustantivized.${currentObjective.exercise}`
          )
        : "Doing something";

    // pauses/plays the timer
    // you can pass a specific boolean value (true = play, false = pause), or dont pass anything for it to revert (true to false / false to true)
    const toggleTimerStatus = (manualTarget?: boolean): void => {
        setTimerStatus(
            manualTarget !== undefined ? manualTarget : !isTimerRunning
        );
    };

    // the color of the timer
    const timerColor = isTimerRunning
        ? colors.PRIMARIES.GOD.GOD
        : colors.PRIMARIES.HMM.HMM;

    // cancel() function (basically to give up)
    const cancel = () => {
        Alert.alert(
            t("globals.are_you_sure"),
            t("page_sessions.give_up_description"),
            [
                {
                    text: t("globals.nevermind"),
                    style: "cancel",
                },
                {
                    text: t("page_sessions.give_up_yes"),
                    style: "destructive",
                    onPress: () => {
                        router.navigate("/"); // basically goes home without saving, easy.
                    },
                },
            ],
            { cancelable: false }
        );
    };

    // this is to show a random motivational message if the session is completed
    const sessionCompletedMessages: string[] = t("cool_messages.session_done", {
        returnObjects: true,
    });

    const sessionCompletedMessagesIndex = Math.floor(
        Math.random() * sessionCompletedMessages.length
    );

    const messageForSessionCompleted =
        sessionCompletedMessages[sessionCompletedMessagesIndex];

    // total duration of the session, including rests
    let totalTime: number;

    if (currentObjective) {
        totalTime =
            currentObjective?.duration +
            currentObjective?.rests * currentObjective?.restDuration;
    } else {
        totalTime = 0;
    }

    // this function is basically to finish the session
    // will mark the obj as done, save it, and head to the results page
    // UNLESS you specify it to skip that step, heading to home page in that case
    const finishSession = async (skipResults: boolean) => {
        if (currentObjective) {
            try {
                await markObjectiveAsDone(
                    currentObjective.identifier,
                    false,
                    t
                );
                if (Platform.OS === "android") {
                    ToastAndroid.show(
                        messageForSessionCompleted,
                        ToastAndroid.LONG
                    );
                }
                const targetRoute = skipResults
                    ? "/"
                    : `/Results?speed=${currentObjective.extra.speed}&time=${totalTime}&id=${currentObjective.identifier}&exercise=${currentObjective.exercise}&repetitions=${currentObjective.repetitions}&lifts=${currentObjective.extra.lifts}&barWeight=${currentObjective.extra.barWeight}&liftWeight=${currentObjective.extra.liftWeight}&pushups=${currentObjective.extra.amount}&hands=${currentObjective.extra.hands}`;
                router.replace(targetRoute);
                // URL is long af because the system is designed to store everything onto an objective, even it its not needed (being 0, null, or others... in those cases)
                // should I refactor the system? probably. but huh, if it works, i aint complain about it for now.
            } catch (e) {
                termLog(
                    "SESSIONS.TSX - Error parsing objectives (OBJS) for update: " +
                        e,
                    "error"
                );
            }
        }
    };

    // handles finishing. this is called whenever the timer runs out of time
    // however repetititons exist, so a handler is required
    const handleFinish = () => {
        if (laps !== 0) {
            setLaps((prev) => (prev > 0 ? prev - 1 : 0));
            setTimerKey((prevKey) => prevKey + 1);
        } else {
            finishSession(false);
        }
    };

    const handleRestState = (action: "pause" | "play") => {
        toggleTimerStatus(action === "play");
        setIsUserResting(action === "pause");
    };

    // this handles pausing the timer for resting
    const handleResting = (
        totalDuration: number,
        timeLeft: number,
        rests: number,
        restDuration: number,
        fragmentDuration: number
    ): void => {
        const elapsedTime = totalDuration - timeLeft; // Elapsed time
        // the circle timer is supposed to call this thing each second, so it should work
        // termLog("Fragment Duration: " + fragmentDuration, "log"); // for debugging, commented for performance
        const currentFragment = Math.floor(elapsedTime / fragmentDuration);
        // termLog("Current Fragment: " + currentFragment, "log"); // also for debug, also commented for performance

        /*
        i'll try to explain what's up
        sessions get divided in equally lasting "fragments", one division per rest
        1 session (60 seconds) + 1 rest = 1 division = 2 fragments (30 seconds)
        alright?
        */

        if (
            elapsedTime % fragmentDuration === 0 &&
            elapsedTime !== 0 &&
            currentFragment <= rests
        ) {
            termLog("Resting...", "success");
            handleRestState("pause"); // Pauses
            setTimeout(
                () => {
                    handleRestState("play"); // Plays, after the time has passed
                },
                restDuration * 60 * 1000 // Convert seconds to milliseconds
            );
        } else {
            // termLog("Session working... Elapsed: " + elapsedTime, "log"); // Just do a console log if it's not time to rest
            // Comented (aka removed) for performance. Even the terminal lags a bit.
        }
    };

    const toggleHelpMenu = (): void => {
        setIsUserCheckingHelp((prev) => !prev);
        toggleTimerStatus(isUserCheckingHelp); // ok, I dont know...
    };

    if (loading) {
        return (
            <Loading currentpage={null} displayNav={false} useSpecial={true} />
        );
    }

    if (!currentObjective) {
        return (
            <View>
                <BetterText fontSize={20} fontWeight="Regular">
                    Error
                </BetterText>
                <BetterText fontSize={10} fontWeight="Regular">
                    {t("globals.react_error_check")}
                </BetterText>
            </View>
        );
    }

    return (
        <View style={styles.mainview}>
            <View style={styles.subview}>
                <View style={styles.topbarview}>
                    <Ionicons
                        name="play-arrow"
                        size={20}
                        color={colors.LBLS.SHL}
                    />
                    <GapView width={10} />
                    <BetterText
                        fontSize={15}
                        fontWeight="Bold"
                        textColor={colors.LBLS.SHL}
                    >
                        {t("page_sessions.in_a_session")}
                    </BetterText>
                </View>
                <GapView height={20} />
                <View style={styles.infoview}>
                    <BetterText
                        fontWeight="Regular"
                        fontSize={12}
                        textAlign="center"
                    >
                        {t("page_sessions.current")}
                    </BetterText>
                    <GapView height={10} />
                    <BetterText
                        fontWeight="Bold"
                        fontSize={25}
                        textAlign="center"
                    >
                        {!isUserResting
                            ? currentObjective.duration > 1
                                ? currentObjectiveSustantivizedName +
                                  " " +
                                  currentObjective.duration +
                                  " " +
                                  t("globals.minute") +
                                  "s"
                                : currentObjectiveSustantivizedName +
                                  " " +
                                  currentObjective.duration
                            : t("page_sessions.resting")}
                    </BetterText>
                    <GapView height={10} />
                    <InfoIcons
                        row={1}
                        objective={currentObjective}
                        t={t}
                        laps={laps}
                    />
                    <InfoIcons
                        row={2}
                        objective={currentObjective}
                        t={t}
                        laps={laps}
                    />
                </View>
                <GapView height={20} />
                <CountdownCircleTimer
                    key={timerKey}
                    duration={currentObjective.duration * 60}
                    size={160}
                    isPlaying={isTimerRunning}
                    colors={[
                        timerColor === colors.PRIMARIES.GOD.GOD
                            ? colors.PRIMARIES.GOD.GOD
                            : colors.PRIMARIES.HMM.HMM,
                        timerColor === colors.PRIMARIES.GOD.GOD
                            ? colors.PRIMARIES.GOD.GOD
                            : colors.PRIMARIES.HMM.HMM,
                    ]}
                    colorsTime={[15, 5]}
                    isSmoothColorTransition={true}
                    onComplete={handleFinish}
                    onUpdate={(remainingTime) =>
                        handleResting(
                            currentObjective.duration * 60,
                            remainingTime,
                            currentObjective.rests,
                            currentObjective.restDuration,
                            calculateSessionFragmentsDuration(
                                currentObjective.duration * 60,
                                currentObjective.rests
                            )
                        )
                    }
                    isGrowing={true}
                    trailColor={colors.MAIN.DIVISION}
                    strokeLinecap="round"
                    trailStrokeWidth={10}
                    strokeWidth={15}
                >
                    {({ remainingTime }) => {
                        const minutes = Math.floor(remainingTime / 60);
                        const seconds = remainingTime % 60;

                        return (
                            <BetterText
                                fontSize={30}
                                fontWeight="Bold"
                                textAlign="center"
                                textColor={timerColor}
                            >
                                {`${minutes}:${seconds}`}
                            </BetterText>
                        );
                    }}
                </CountdownCircleTimer>
                <GapView height={20} />
                <View style={styles.buttonsview}>
                    <Button
                        style={isTimerRunning ? "ACE" : "HMM"}
                        action={() => setTimerStatus((prev) => !prev)}
                        layout="box"
                    >
                        <Ionicons
                            name={isTimerRunning ? "pause" : "play-arrow"}
                            size={16}
                            color={
                                isTimerRunning
                                    ? colors.BASIC.WHITE
                                    : colors.BASIC.BLACK
                            }
                        />
                    </Button>
                    <GapView width={10} />
                    <Button
                        style="GOD"
                        action={() => finishSession(true)}
                        layout="box"
                    >
                        <Ionicons
                            name="check"
                            size={16}
                            color={colors.BASIC.BLACK}
                        />
                    </Button>
                    <GapView width={10} />
                    <Button
                        style="HMM"
                        buttonText={t("globals.help")}
                        action={() => toggleHelpMenu()}
                        layout="normal"
                        height="default"
                        width="fill"
                    />
                    <GapView width={10} />
                    <Button
                        style="WOR"
                        buttonText={t("page_sessions.give_up")}
                        action={cancel}
                        layout="normal"
                        height="default"
                        width="fill"
                    />
                </View>
            </View>
            {isUserCheckingHelp &&
                HelpView(t, currentObjective, toggleHelpMenu)}
        </View>
    );
}
