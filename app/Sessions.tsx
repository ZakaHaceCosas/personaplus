// Sessions.tsx
// Página para sesiones

import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Alert,
    ToastAndroid,
    DimensionValue,
    Platform,
    Dimensions,
} from "react-native";
import {
    getObjectives,
    markObjectiveAsDone,
    getObjectiveByIdentifier,
} from "@/src/toolkit/objectives";
import { router, useGlobalSearchParams } from "expo-router";
import BetterText from "@/src/BetterText";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/src/GapView";
import { termLog } from "@/src/toolkit/debug/console";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import Button from "@/src/Buttons";
import { useTranslation } from "react-i18next";

// TypeScript, supongo.
import { Objective } from "@/src/types/Objective";
import InfoIcons from "@/src/sessions/InfoIcons";

// Estilos
const styles = StyleSheet.create({
    helpcontainer: {
        backgroundColor: "#14171C",
        position: "absolute",
        top: "20%",
        left: 10,
        right: 10,
        bottom: 20,
        overflow: "visible",
        padding: 20,
        borderRadius: 20,
        elevation: 16,
        borderColor: "#26282b",
        borderWidth: 4,
        zIndex: 999,
    },
});

export default function Sessions() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(true);
    const params = useGlobalSearchParams();
    const objectiveIdentifier = params.id ? Number(params.id) : null;
    const [objectives, setObjectives] = useState<Objective[] | null>(null);
    const [currentObjective, setCurrentObjective] = useState<Objective | null>(
        null
    );
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
                    termLog("Expected an array, got a string instead", "error");
                }
            } catch (e) {
                termLog("SESSIONTS.TSX - Objective fetch error! " + e, "error");
                if (Platform.OS === "android") {
                    ToastAndroid.show("Fetch error! " + e, ToastAndroid.LONG); // so the user knows whats up
                }
            } finally {
                setLoading(false); // setLoading() in the finally block and not the try one, so in the case of an error the user doesnt get stuck on a "Loading..." screen
            }
        };

        handle();
    }, []);

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
                    if (Platform.OS === "android") {
                        ToastAndroid.show(
                            "Current Fetch error! " + e,
                            ToastAndroid.LONG
                        ); // so the user knows whats up
                    }
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

    const [isTimerRunning, setTimerStatus] = useState(true);

    const toggleTimerStatus = (manualTarget?: boolean): void => {
        setTimerStatus(
            manualTarget !== undefined ? manualTarget : !isTimerRunning
        );
    };

    const timerColor = isTimerRunning ? "#32FF80" : "#FFC832";

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
                router.navigate("/");
            } catch (e) {
                termLog(
                    "SESSIONS.TSX - Error parsing objectives (OBJS) for update: " +
                        e,
                    "error"
                );
                if (Platform.OS === "android") {
                    ToastAndroid.show("Parse error! " + e, ToastAndroid.LONG); // so the user knows whats up
                }
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

    const [isUserCheckingHelp, setIsUserCheckingHelp] = useState(false);

    const toggleHelpMenu = (): void => {
        setIsUserCheckingHelp(prev => !prev);
        toggleTimerStatus(!isUserCheckingHelp);
    };

    const helpText: string = currentObjective?.exercise
        ? t(`page_sessions.help_section.${currentObjective.exercise}`)
        : t("globals.error_loading_content");

    if (loading) {
        return (
            <View
                style={{
                    width: "100vw" as DimensionValue,
                    height: "100vh" as DimensionValue,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <GapView height={Dimensions.get("screen").height / 2} />
                <BetterText
                    textAlign="center"
                    fontSize={25}
                    textColor="#32FF80"
                    fontWeight="Medium"
                >
                    {t("globals.loading")}
                </BetterText>
            </View>
        );
    }

    if (!currentObjective) {
        return (
            <View>
                <BetterText fontSize={20} fontWeight="Regular">
                    Error
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
                backgroundColor: "#0E1013",
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
                        backgroundColor: "#14171C",
                        borderRadius: 15,
                        alignItems: "center",
                        justifyContent: "flex-start",
                        width: "100%",
                    }}
                >
                    <Ionicons name="play-arrow" size={20} color="#DDDDDD" />
                    <GapView width={10} />
                    <BetterText
                        fontSize={15}
                        fontWeight="Bold"
                        textColor="#DDDDDD"
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
                        backgroundColor: "#14171C",
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
                        {currentObjectiveSustantivizedName}{" "}
                        {currentObjective.duration} {t("globals.minute")}
                        {currentObjective.duration > 1 && "s"}
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
                        <Ionicons name="loop" size={15} color="#FFF" />
                        <GapView width={5} />
                        <BetterText fontWeight="Regular" fontSize={15}>
                            {laps === 0
                                ? t("globals.none")
                                : laps === 1
                                  ? `${laps} repetition`
                                  : `${laps} repetitions`}
                        </BetterText>
                        <GapView width={15} />
                        <Ionicons name="snooze" size={15} color="#FFF" />
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
                        timerColor === "#32FF80" ? "#32FF80" : "#FFC832",
                        timerColor === "#32FF80" ? "#32FF80" : "#FFC832",
                    ]}
                    colorsTime={[15, 5]}
                    isSmoothColorTransition={false}
                    onComplete={handleFinish}
                    isGrowing={true}
                    trailColor="#202328"
                    strokeLinecap="round"
                    trailStrokeWidth={10}
                    strokeWidth={15}
                >
                    {({ remainingTime }) => (
                        <BetterText
                            fontSize={30}
                            fontWeight="Bold"
                            textAlign="center"
                            textColor={timerColor}
                        >
                            {remainingTime}
                        </BetterText>
                    )}
                </CountdownCircleTimer>
                <GapView height={20} />
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        padding: 20,
                        backgroundColor: "#14171C",
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
                            color={isTimerRunning ? "#FFF" : "#000"}
                        />
                    </Button>
                    <GapView width={10} />
                    <Button style="GOD" action={finish} layout="box">
                        <Ionicons name="check" size={16} color="#000" />
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
                        {helpText}
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
                        textColor="#C8C8C8"
                        textAlign="center"
                    >
                        {t("page_sessions.timer_paused_help")}
                    </BetterText>
                </View>
            )}
        </View>
    );
}
