// FIXME - THERE'S A LOT OF WRONG STUFF IN HERE
// TODO - HANDLE ALL TODOs FROM THIS PAGE

// Sessions.tsx
// Page for live exercising sessions

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ToastAndroid, Platform } from "react-native";
import {
    GetAllObjectives,
    GetActiveObjective,
    CalculateSessionFragmentsDuration,
} from "@/toolkit/objectives/ActiveObjectives";
import { router, useGlobalSearchParams } from "expo-router";
import BetterText from "@/components/text/BetterText";
import GapView from "@/components/ui/GapView";
import { logToConsole } from "@/toolkit/debug/Console";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useTranslation } from "react-i18next";
import BetterButton from "@/components/interaction/BetterButton";
import SessionsPageInfoIcons from "@/components/ui/pages/Sessions-InfoIcons";
import Colors from "@/constants/Colors";
import Loading from "@/components/static/Loading";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import SessionsPageHelpView from "@/components/ui/pages/Sessions-HelpView";

// TypeScript, supongo.
import { ActiveObjective } from "@/types/ActiveObjectives";

// We define the styles
const styles = StyleSheet.create({
    mainView: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 20,
        flex: 1,
        backgroundColor: Colors.MAIN.APP,
        overflow: "visible",
    },
    subView: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "37.5%",
    },
    topBarView: {
        display: "flex",
        flexDirection: "row",
        padding: 20,
        backgroundColor: Colors.MAIN.SECTION,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },
    buttonsView: {
        display: "flex",
        flexDirection: "row",
        padding: 20,
        backgroundColor: Colors.MAIN.SECTION,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    infoView: {
        display: "flex",
        flexDirection: "column",
        padding: 20,
        backgroundColor: Colors.MAIN.SECTION,
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
    const [objectives, setObjectives] = useState<ActiveObjective[] | null>(
        null,
    );
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await GetAllObjectives();
                setObjectives(result);
            } catch (e) {
                logToConsole(
                    t("globals.react_error") +
                        "SESSIONS.TSX - Objective fetch error! " +
                        e,
                    "error",
                );
            } finally {
                setLoading(false); // setLoading() in the finally block and not the try one, so in the case of an error the user doesn't get stuck on a "Loading..." screen
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { objectives, loading };
}

function useCurrentObjective(objectiveIdentifier: number | null) {
    // gathers the fetched objectives, and finds the current objective (the one belonging to this session)
    const [currentObjective, setCurrentObjective] =
        useState<ActiveObjective | null>(null);
    const [laps, setLaps] = useState<number>(0);

    useEffect(() => {
        if (objectiveIdentifier !== null) {
            const fetchCurrentObjective = async () => {
                try {
                    const objective =
                        await GetActiveObjective(objectiveIdentifier); // this line handles everything, actually
                    setCurrentObjective(objective ?? null); // this sets the gathered objective as the current objective, or null if something happened
                    setLaps(objective?.info.repetitions || 0); // this ensures "laps" is set correctly
                } catch (e) {
                    logToConsole(
                        "Error fetching current objective: " + e,
                        "error",
                    );
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

    // some logs i added cause' this shi was broken in past and i didn't know how to fix it
    useEffect(() => {
        logToConsole("SESSIONS.TSX - Objectives: " + objectives, "log");
        logToConsole(
            "SESSIONS.TSX - Objectives state: " + JSON.stringify(objectives),
            "log",
        );
        logToConsole(
            "SESSIONS.TSX - Current ID: " + objectiveIdentifier,
            "log",
        );
    }, [objectives, objectiveIdentifier]);

    // more logs cause of this shi being broken
    useEffect(() => {
        logToConsole(
            "SESSIONS.TSX - Current Objective: " +
                JSON.stringify(currentObjective),
            "log",
        );
    }, [currentObjective]);

    // the verbal version of the objective name (i don't know how to call it)
    // like if the exercise is "Push ups" this variable is "Pushing up" (or "Doing pushups"? i don't remember)
    const currentObjectiveVerbalName: string = currentObjective?.exercise
        ? t(
              `globals.supported_active_objectives_verbal.${currentObjective.exercise}`,
          ) // TODO - rename vars accordingly
        : "Doing something";

    // pauses/plays the timer
    // you can pass a specific boolean value (true = play, false = pause), or don't pass anything for it to revert (true to false / false to true)
    const toggleTimerStatus = (manualTarget?: boolean): void => {
        setTimerStatus(
            manualTarget !== undefined ? manualTarget : !isTimerRunning,
        );
    };

    // the color of the timer
    const timerColor = isTimerRunning
        ? Colors.PRIMARIES.GOD.GOD
        : Colors.PRIMARIES.HMM.HMM;

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
            { cancelable: false },
        );
    };

    // this is to show a random motivational message if the session is completed
    const sessionCompletedMessages: string[] = t("cool_messages.session_done", {
        returnObjects: true,
    });

    const sessionCompletedMessagesIndex = Math.floor(
        Math.random() * sessionCompletedMessages.length,
    );

    const messageForSessionCompleted =
        sessionCompletedMessages[sessionCompletedMessagesIndex];

    // total duration of the session, including rests
    let totalTime: number;

    if (currentObjective) {
        totalTime =
            currentObjective?.info.durationMinutes +
            (currentObjective?.info.rests ?? 0) *
                currentObjective?.info.restDurationMinutes;
    } else {
        totalTime = 0;
    }

    // this function is basically to finish the session
    // will mark the obj as done, save it, and head to the results page
    // UNLESS you specify it to skip that step, heading to home page in that case
    const finishSession = async () => {
        if (currentObjective) {
            try {
                /* await markObjectiveAsDone(
                    currentObjective.identifier,
                    false,
                    t,
                ); */ // TODO - HANDLE THIS USING SAVE TO DAILY LOG, WITH RESULTS
                // WATCHOUT - THIS MIGHT IMPLY HANDLING THIS FROM THE NEXT PAGE USING CL, SO DATA WOULD NEED TO BE PASSED SAFELY
                if (Platform.OS === "android") {
                    ToastAndroid.show(
                        messageForSessionCompleted,
                        ToastAndroid.LONG,
                    );
                }
                const targetRoute = `/Results?speed=${currentObjective.specificData.estimateSpeed}&time=${totalTime}&id=${currentObjective.identifier}&exercise=${currentObjective.exercise}&repetitions=${currentObjective.info.repetitions}&lifts=${currentObjective.specificData.reps}&dumbbellWeight=${currentObjective.specificData.dumbbellWeight}&pushups=${currentObjective.specificData.amountOfPushUps}&hands=${currentObjective.specificData.amountOfHands}`;
                router.replace(targetRoute);
                // TODO - refactor
                // URL is long af because the system is designed to store everything onto an objective, even it its not needed (being 0, null, or others... in those cases)
                // should I refactor the system? probably. but huh, if it works, i ain't complain about it for now.
            } catch (e) {
                logToConsole(
                    "SESSIONS.TSX - Error parsing active objectives for update: " +
                        e,
                    "error",
                );
            }
        }
    };

    // handles finishing. this is called whenever the timer runs out of time
    // however repetitions exist, so a handler is required
    const handleFinish = () => {
        if (laps !== 0) {
            setLaps((prev) => (prev > 0 ? prev - 1 : 0));
            setTimerKey((prevKey) => prevKey + 1);
        } else {
            finishSession();
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
        fragmentDuration: number,
    ): void => {
        const elapsedTime = totalDuration - timeLeft; // Elapsed time
        // the circle timer is supposed to call this thing each second, so it should work
        // logToConsole("Fragment Duration: " + fragmentDuration, "log"); // for debugging, commented for performance
        const currentFragment = Math.floor(elapsedTime / fragmentDuration);
        // logToConsole("Current Fragment: " + currentFragment, "log"); // also for debug, also commented for performance

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
            logToConsole("Resting...", "success");
            handleRestState("pause"); // Pauses
            setTimeout(
                () => {
                    handleRestState("play"); // Plays, after the time has passed
                },
                restDuration * 60 * 1000, // Convert seconds to milliseconds
            );
        } else {
            // logToConsole("Session working... Elapsed: " + elapsedTime, "log"); // Just do a console log if it's not time to rest
            // Commented (aka removed) for performance. Even the terminal lags a bit.
        }
    };

    const toggleHelpMenu = (): void => {
        setIsUserCheckingHelp((prev) => !prev);
        toggleTimerStatus(isUserCheckingHelp); // ok, I don't know...
    };

    if (loading) {
        return <Loading />;
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
        <View style={styles.mainView}>
            <View style={styles.subView}>
                <View style={styles.topBarView}>
                    <Ionicons
                        name="play-arrow"
                        size={20}
                        color={Colors.LABELS.SHL}
                    />
                    <GapView width={10} />
                    <BetterText
                        fontSize={15}
                        fontWeight="Bold"
                        textColor={Colors.LABELS.SHL}
                    >
                        {t("page_sessions.in_a_session")}
                    </BetterText>
                </View>
                <GapView height={20} />
                <View style={styles.infoView}>
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
                            ? currentObjective.info.durationMinutes > 1
                                ? currentObjectiveVerbalName +
                                  " " +
                                  currentObjective.info.durationMinutes +
                                  " " +
                                  t("globals.minute") +
                                  "s"
                                : currentObjectiveVerbalName +
                                  " " +
                                  currentObjective.info.durationMinutes
                            : t("page_sessions.resting")}
                    </BetterText>
                    <GapView height={10} />
                    <SessionsPageInfoIcons
                        row={1}
                        objective={currentObjective}
                        t={t}
                        laps={laps}
                    />
                    <SessionsPageInfoIcons
                        row={2}
                        objective={currentObjective}
                        t={t}
                        laps={laps}
                    />
                </View>
                <GapView height={20} />
                <CountdownCircleTimer
                    key={timerKey}
                    duration={currentObjective.info.durationMinutes * 60}
                    size={160}
                    isPlaying={isTimerRunning}
                    colors={[
                        timerColor === Colors.PRIMARIES.GOD.GOD
                            ? Colors.PRIMARIES.GOD.GOD
                            : Colors.PRIMARIES.HMM.HMM,
                        timerColor === Colors.PRIMARIES.GOD.GOD
                            ? Colors.PRIMARIES.GOD.GOD
                            : Colors.PRIMARIES.HMM.HMM,
                    ]}
                    colorsTime={[15, 5]}
                    isSmoothColorTransition={true}
                    onComplete={handleFinish}
                    onUpdate={(remainingTime) =>
                        handleResting(
                            currentObjective.info.durationMinutes * 60,
                            remainingTime,
                            currentObjective.info.rests ?? 0,
                            currentObjective.info.restDurationMinutes,
                            CalculateSessionFragmentsDuration(
                                currentObjective.info.durationMinutes * 60,
                                currentObjective.info.rests,
                            ),
                        )
                    }
                    isGrowing={true}
                    trailColor={Colors.MAIN.DIVISION}
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
                <View style={styles.buttonsView}>
                    <BetterButton
                        buttonHint="TODO"
                        buttonText={null}
                        style={isTimerRunning ? "ACE" : "HMM"}
                        action={() => setTimerStatus((prev) => !prev)}
                        layout="box"
                        icon={{
                            name: isTimerRunning ? "pause" : "play-arrow",
                            size: 16,
                            color: isTimerRunning
                                ? Colors.BASIC.WHITE
                                : Colors.BASIC.BLACK,
                        }}
                    />
                    <GapView width={10} />
                    <BetterButton
                        buttonHint="TODO"
                        style="HMM"
                        buttonText={t("globals.help")}
                        action={() => toggleHelpMenu()}
                        layout="normal"
                    />
                    <GapView width={10} />
                    <BetterButton
                        buttonHint="TODO"
                        style="WOR"
                        buttonText={t("page_sessions.give_up")}
                        action={cancel}
                        layout="normal"
                    />
                </View>
            </View>
            {isUserCheckingHelp &&
                SessionsPageHelpView(t, currentObjective, toggleHelpMenu)}
        </View>
    );
}
