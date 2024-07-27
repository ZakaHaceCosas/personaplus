// Sessions.tsx
// Página para sesiones

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

// TypeScript, supongo.
import { Objective } from "@/src/types/Objective";
import Loading from "@/src/Loading";

// Estilos
const styles = StyleSheet.create({
    helpcontainer: {
        backgroundColor: colors.MAIN.SECTION,
        position: "absolute",
        top: "20%",
        left: 10,
        right: 10,
        bottom: 20,
        overflow: "visible",
        padding: 20,
        borderRadius: 20,
        elevation: 16,
        borderColor: colors.MAIN.DIVISIONBORDER,
        borderWidth: 4,
        zIndex: 999,
    },
});

export default function Sessions() {
    // Stateful values and stuff
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(true);
    const params = useGlobalSearchParams();
    const objectiveIdentifier = params.id ? Number(params.id) : null;
    const [objectives, setObjectives] = useState<Objective[] | null>(null);
    const [currentObjective, setCurrentObjective] = useState<Objective | null>(
        null
    );
    const [isTimerRunning, setTimerStatus] = useState(true);
    const [isUserCheckingHelp, setIsUserCheckingHelp] = useState(false);
    const [isUserResting, setIsUserResting] = useState(false);
    /*
    If you wonder why there are two variables for the timer's loops, one of them is to keep account of many times repeat (laps) and other one is to set the "key" attribute of the circle timer, which is required for it to loop.
    */
    const [laps, setLaps] = useState<number>(0);
    const [timerKey, setTimerKey] = useState<number>(0);

    useEffect(() => {
        const handle = async () => {
            try {
                const objectives = await getObjectives("object");
                if (Array.isArray(objectives)) {
                    setObjectives(objectives);
                } else {
                    termLog(
                        t("globals.react_error") +
                            "Expected an array, got a string instead",
                        "error"
                    );
                }
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

        handle();
    }, [t]);

    useEffect(() => {
        termLog("SESSIONS.TSX - Objectives: " + objectives, "log");
        termLog(
            "SESSIONTS.TSX - Objectives state: " + JSON.stringify(objectives),
            "log"
        );
        termLog("SESSIONS.TSX - Current ID: " + objectiveIdentifier, "log");
    }, [objectives, objectiveIdentifier]);

    useEffect(() => {
        if (objectiveIdentifier !== null) {
            const fetchCurrentObjective = async () => {
                try {
                    const objective =
                        await getObjectiveByIdentifier(objectiveIdentifier);
                    setCurrentObjective(objective ?? null);
                    setLaps(objective?.repetitions || 0); // Ensure laps is set correctly
                } catch (e) {
                    termLog("Error fetching current objective: " + e, "error");
                }
            };

            fetchCurrentObjective();
        }
    }, [objectiveIdentifier]);

    useEffect(() => {
        termLog(
            "SESSIONS.TSX - Current Objective: " +
                JSON.stringify(currentObjective),
            "log"
        );
    }, [currentObjective]);

    const currentObjectiveSustantivizedName: string = currentObjective?.exercise
        ? t(
              `globals.supported_active_objectives_sustantivized.${currentObjective.exercise}`
          )
        : "Doing something";

    const toggleTimerStatus = (manualTarget?: boolean): void => {
        setTimerStatus(
            manualTarget !== undefined ? manualTarget : !isTimerRunning
        );
    };

    const timerColor = isTimerRunning
        ? colors.PRIMARIES.GOD.GOD
        : colors.PRIMARIES.HMM.HMM;

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

    const sessionCompletedMessages: string[] = t("cool_messages.session_done", {
        returnObjects: true,
    });

    const sessionCompletedMessagesIndex = Math.floor(
        Math.random() * sessionCompletedMessages.length
    );

    const messageForSessionCompleted =
        sessionCompletedMessages[sessionCompletedMessagesIndex];

    const finish = async () => {
        if (currentObjective !== undefined && currentObjective !== null) {
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
                router.replace("/");
            } catch (e) {
                termLog(
                    "SESSIONS.TSX - Error parsing objectives (OBJS) for update: " +
                        e,
                    "error"
                );
            }
        }
    };

    const handleFinish = () => {
        if (laps !== 0) {
            setLaps(prev => (prev > 0 ? prev - 1 : 0));
            setTimerKey(prevKey => prevKey + 1);
        } else {
            finish();
        }
    };

    const handleRestState = (action: "pause" | "play") => {
        if (action === "pause") {
            toggleTimerStatus(false);
            setIsUserResting(true);
        } else if (action === "play") {
            toggleTimerStatus(true);
            setIsUserResting(false);
        }
    };

    const handleResting = (
        totalDuration: number,
        timeLeft: number,
        rests: number,
        restDuration: number,
        fragmentDuration: number
    ): void => {
        const elapsedTime = totalDuration - timeLeft; // Elapsed time
        // the circle timer is supposed to call this thing each second, so it should work
        termLog("Fragment Duration: " + fragmentDuration, "log"); // for debugging :]
        const currentFragment = Math.floor(elapsedTime / fragmentDuration);
        termLog("Current Fragment: " + currentFragment, "log");

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
            termLog("Session working... Elapsed: " + elapsedTime, "log"); // Just do a console log if it's not time to rest
        }
    };

    const toggleHelpMenu = (): void => {
        setIsUserCheckingHelp(prev => !prev);
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
        <View
            style={{
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
            }}
        >
            <View
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "37.5%",
                }}
            >
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        padding: 20,
                        backgroundColor: colors.MAIN.SECTION,
                        borderRadius: 15,
                        alignItems: "center",
                        justifyContent: "flex-start",
                        width: "100%",
                    }}
                >
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
                <View
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 20,
                        backgroundColor: colors.MAIN.SECTION,
                        borderRadius: 15,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
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
                            ? currentObjectiveSustantivizedName +
                                  " " +
                                  currentObjective.duration +
                                  t("globals.minute") +
                                  (currentObjective.duration > 1) && "s"
                            : t("page_sessions.resting")}
                    </BetterText>
                    <GapView height={10} />
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Ionicons
                            name="loop"
                            size={15}
                            color={colors.BASIC.WHITE}
                        />
                        <GapView width={5} />
                        <BetterText fontWeight="Regular" fontSize={15}>
                            {laps === 0
                                ? t("globals.none")
                                : laps === 1
                                  ? `${laps} repetition`
                                  : `${laps} repetitions`}
                        </BetterText>
                        <GapView width={15} />
                        <Ionicons
                            name="snooze"
                            size={15}
                            color={colors.BASIC.WHITE}
                        />
                        <GapView width={5} />
                        <BetterText fontWeight="Regular" fontSize={15}>
                            {currentObjective.rests === 0
                                ? t("globals.none")
                                : currentObjective.rests === 1
                                  ? `${currentObjective.rests} rest of ${currentObjective.restDuration} mins`
                                  : `${currentObjective.rests} rests (${currentObjective.restDuration} mins)`}
                        </BetterText>
                    </View>
                    <InfoIcons objective={currentObjective} />
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
                    onUpdate={remainingTime =>
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
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        padding: 20,
                        backgroundColor: colors.MAIN.SECTION,
                        borderRadius: 15,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <Button
                        style={isTimerRunning ? "ACE" : "HMM"}
                        action={() => setTimerStatus(prev => !prev)}
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
                    <Button style="GOD" action={finish} layout="box">
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
            {isUserCheckingHelp && (
                <View style={styles.helpcontainer}>
                    <BetterText fontSize={18} fontWeight="Regular">
                        {t("globals.help_with_item", {
                            item: t(
                                `globals.supported_active_objectives.${currentObjective.exercise}`
                            ).toLowerCase(),
                        })}
                    </BetterText>
                    <BetterText fontSize={14} fontWeight="Light">
                        {currentObjective?.exercise
                            ? t(
                                  `page_sessions.help_section.${currentObjective.exercise}`
                              )
                            : t("globals.error_loading_content")}
                    </BetterText>
                    <GapView height={10} />
                    <Button
                        layout="fixed"
                        height="default"
                        style="ACE"
                        buttonText={t("globals.got_it")}
                        action={toggleHelpMenu}
                    />
                    <GapView height={10} />
                    <BetterText
                        fontSize={10}
                        fontWeight="Light"
                        textColor={colors.LBLS.SDD}
                        textAlign="center"
                    >
                        {t("page_sessions.timer_paused_help")}
                    </BetterText>
                </View>
            )}
        </View>
    );
}
