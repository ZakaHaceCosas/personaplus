// Sessions.tsx
// Página para sesiones

import React from "react";
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
    fetchObjectives,
    markObjectiveAsDone,
    getObjectiveByIdentifier,
} from "@/components/toolkit/objectives";
import { router, useGlobalSearchParams } from "expo-router";
import BetterText from "@/components/BetterText";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/components/GapView";
import { termLog } from "./DeveloperInterface";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import Button from "@/components/Buttons";
import { useTranslation } from "react-i18next";

// TypeScript, supongo.
import { Objective } from "@/components/types/Objective";

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
    const [loading, setLoading] = React.useState<boolean>(true);
    const params = useGlobalSearchParams();
    const objectiveIdentifier = params.id ? Number(params.id) : null;
    const [objectives, setObjectives] = React.useState<Objective[] | null>(
        null
    );
    const [currentObjective, setCurrentObjective] =
        React.useState<Objective | null>(null);
    /*
    If you wonder why there are two variables for the timer's loops, one of them is to keep account of many times repeat (laps) and other one is to set the "key" attribute of the circle timer, which is required for it to loop.
    */
    const [laps, setLaps] = React.useState<number>(0);
    const [timerKey, setTimerKey] = React.useState<number>(0);

    React.useEffect(() => {
        const handleFetchObjectives = async () => {
            try {
                const objectives = await fetchObjectives("object");
                setObjectives(objectives);
            } catch (e) {
                termLog("LOG 1 (:53) - Fetch error! " + e, "error");
            } finally {
                setLoading(false); // setLoading() in the finally block and not the try one, so in the case of an error the user doesnt get stuck on a "Loading..." screen
            }
        };

        handleFetchObjectives();
    }, []);

    React.useEffect(() => {
        termLog("LOG 2 (:63) - Objectives: " + objectives, "log");
        termLog(
            "LOG 3 (:64) - Objectives state: " + JSON.stringify(objectives),
            "log"
        );
        termLog("LOG 4 (:68) - Current ID: " + objectiveIdentifier, "log");
    }, [objectives, objectiveIdentifier]);

    React.useEffect(() => {
        if (objectiveIdentifier !== null) {
            const fetchCurrentObjective = async () => {
                try {
                    const objective =
                        await getObjectiveByIdentifier(objectiveIdentifier);
                    setCurrentObjective(objective);
                    setLaps(objective?.repetitions || 0); // Ensure laps is set correctly
                } catch (e) {
                    termLog("Error fetching current objective: " + e, "error");
                }
            };

            fetchCurrentObjective();
        }
    }, [objectiveIdentifier]);

    React.useEffect(() => {
        termLog(
            "LOG 6 (:106) - Current Objective: " +
                JSON.stringify(currentObjective),
            "log"
        );
    }, [currentObjective]);

    const currentObjectiveSustantivizedName: string = currentObjective?.exercise
        ? t(
              `globals.supported_active_objectives_sustantivized.${currentObjective.exercise}`
          )
        : "Doing something";

    const [isTimerRunning, setTimerStatus] = React.useState(true);

    const toggleTimerStatus = (manualTarget?: boolean): void => {
        setTimerStatus(
            manualTarget !== undefined ? manualTarget : !isTimerRunning
        );
    };

    const timerColor = isTimerRunning ? "#32FF80" : "#FFC832";

    const cancel = () => {
        Alert.alert(
            t("globals.are_you_sure"),
            "You are doing GREAT! Are you sure you want to give up? Your progress will be lost! (You can always start over if you change your mind)",
            [
                {
                    text: t("globals.nevermind"),
                    style: "cancel",
                },
                {
                    text: "Yes, I give up",
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
        if (currentObjective) {
            try {
                await markObjectiveAsDone(currentObjective.identifier);
                if (Platform.OS === "android") {
                    ToastAndroid.show(
                        messageForSessionCompleted,
                        ToastAndroid.LONG
                    );
                }
                router.navigate("/");
            } catch (e) {
                termLog(
                    "LOG 8 (:176) - Error parsing objectives (OBJS) for update: " +
                        e,
                    "error"
                );
            }
        }
    };

    const doFinish = () => {
        if (laps !== 0) {
            setLaps(prev => (prev > 0 ? prev - 1 : 0));
            setTimerKey(prevKey => prevKey + 1);
        } else {
            finish();
        }
    };

    const [isUserCheckingHelp, setIsUserCheckingHelp] = React.useState(false);

    const toggleHelpMenu = (): void => {
        setIsUserCheckingHelp(prev => !prev);
        toggleTimerStatus(!isUserCheckingHelp);
    };

    const helpText: string = currentObjective?.exercise
        ? t(`page_sessions.help_section.${currentObjective.exercise}`)
        : t("globals.error_loading_content");

    const speedOptions: [string, string][] = [
        ["Brisk Walk", "1.6 - 3.2 km/h"],
        ["Light Jog", "3.2 - 4.0 km/h"],
        ["Moderate Run", "4.0 - 4.8 km/h"],
        ["Fast Run", "4.8 - 5.5 km/h"],
        ["Sprint", "5.5 - 6.4 km/h"],
        ["Fast Sprint", "6.4 - 8.0 km/h"],
        ["Running Fast", "8.0 - 9.6 km/h"],
        ["Very Fast Run", "9.6 - 11.3 km/h"],
        ["Sprinting", "11.3 - 12.9 km/h"],
        ["Fast Sprinting", "12.9 - 14.5 km/h"],
        ["Full Speed Sprinting", "14.5 - 16.1 km/h"],
        ["Maximum Speed", "more than 16.1 km/h"],
    ];

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
                        CURRENT OBJECTIVE
                    </BetterText>
                    <GapView height={10} />
                    <BetterText
                        fontWeight="Bold"
                        fontSize={25}
                        textAlign="center"
                    >
                        {currentObjectiveSustantivizedName} for{" "}
                        {currentObjective.duration} minute
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
                                ? "None"
                                : laps === 1
                                  ? `${laps} repetition`
                                  : `${laps} repetitions`}
                        </BetterText>
                        <GapView width={15} />
                        <Ionicons name="snooze" size={15} color="#FFF" />
                        <GapView width={5} />
                        <BetterText fontWeight="Regular" fontSize={15}>
                            {currentObjective.rests === 0
                                ? "None"
                                : currentObjective.rests === 1
                                  ? `${currentObjective.rests} rest of ${currentObjective.restDuration} mins`
                                  : `${currentObjective.rests} rests (${currentObjective.restDuration} mins)`}
                        </BetterText>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {currentObjective.exercise.toLowerCase() ===
                            "lifting" && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: 10,
                                }}
                            >
                                <Ionicons
                                    name="keyboard-double-arrow-down"
                                    size={15}
                                    color="#FFF"
                                />
                                <GapView width={5} />
                                <BetterText
                                    fontWeight="Regular"
                                    textColor="#FFF"
                                    fontSize={15}
                                >
                                    {currentObjective?.extra?.barWeight !==
                                        undefined &&
                                    currentObjective?.extra?.liftWeight !==
                                        undefined &&
                                    currentObjective.extra.hands !== undefined
                                        ? String(
                                              currentObjective.extra.barWeight +
                                                  currentObjective.extra
                                                      .liftWeight *
                                                      currentObjective.extra
                                                          .hands
                                          )
                                        : "N/A"}{" "}
                                    kg
                                </BetterText>
                                <GapView width={10} />
                                <Ionicons
                                    name="change-circle"
                                    size={15}
                                    color="#FFF"
                                />
                                <GapView width={5} />
                                <BetterText
                                    fontWeight="Regular"
                                    textColor="#FFF"
                                    fontSize={15}
                                >
                                    {currentObjective?.extra?.lifts !==
                                    undefined
                                        ? String(currentObjective.extra.lifts)
                                        : "N/A"}{" "}
                                    lifts
                                </BetterText>
                                <GapView width={10} />
                                <Ionicons
                                    name="front-hand"
                                    size={15}
                                    color="#FFF"
                                />
                                <GapView width={5} />
                                <BetterText
                                    fontWeight="Regular"
                                    textColor="#FFF"
                                    fontSize={15}
                                >
                                    {currentObjective?.extra?.hands !==
                                    undefined
                                        ? String(currentObjective.extra.hands)
                                        : "N/A"}{" "}
                                    hand
                                </BetterText>
                            </View>
                        )}
                        {currentObjective.exercise.toLowerCase() ===
                            "running" && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: 10,
                                }}
                            >
                                <Ionicons name="speed" size={15} color="#FFF" />
                                <GapView width={5} />
                                <BetterText
                                    fontWeight="Regular"
                                    textColor="#FFF"
                                    fontSize={15}
                                >
                                    {currentObjective.extra.speed !==
                                        undefined &&
                                    currentObjective.extra.speed >= 0 &&
                                    currentObjective.extra.speed <
                                        speedOptions.length
                                        ? String(
                                              speedOptions[
                                                  currentObjective.extra.speed
                                              ][1]
                                          )
                                        : "N/A"}
                                </BetterText>
                            </View>
                        )}
                        {currentObjective.exercise.toLowerCase() ===
                            "push up" && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: 10,
                                }}
                            >
                                <Ionicons
                                    name="repeat"
                                    size={15}
                                    color="#FFF"
                                />
                                <GapView width={5} />
                                <BetterText
                                    fontWeight="Regular"
                                    textColor="#FFF"
                                    fontSize={15}
                                >
                                    {currentObjective?.extra?.amount !==
                                    undefined
                                        ? String(currentObjective.extra.amount)
                                        : "N/A"}{" "}
                                    push-ups
                                </BetterText>
                                <GapView width={10} />
                                <Ionicons
                                    name="front-hand"
                                    size={15}
                                    color="#FFF"
                                />
                                <GapView width={5} />
                                <BetterText
                                    fontWeight="Regular"
                                    textColor="#FFF"
                                    fontSize={15}
                                >
                                    {currentObjective?.extra?.hands !==
                                    undefined
                                        ? String(currentObjective.extra.hands)
                                        : "N/A"}{" "}
                                    hand
                                </BetterText>
                            </View>
                        )}
                    </View>
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
                    onComplete={doFinish}
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
                        buttonText="Help?"
                        action={() => toggleHelpMenu()}
                        layout="normal"
                        height="default"
                        width="fill"
                    />
                    <GapView width={10} />
                    <Button
                        style="WOR"
                        buttonText="Give up"
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
                        Help with {currentObjectiveSustantivizedName}
                    </BetterText>
                    <BetterText fontSize={14} fontWeight="Light">
                        {helpText}
                    </BetterText>
                    <GapView height={10} />
                    <Button
                        layout="fixed"
                        height="default"
                        style="ACE"
                        buttonText="Got it"
                        action={toggleHelpMenu}
                    />
                    <GapView height={10} />
                    <BetterText
                        fontSize={10}
                        fontWeight="Light"
                        textColor="#C8C8C8"
                        textAlign="center"
                    >
                        Psst... Don&apos;t worry, the timer has been paused so
                        you can read!
                    </BetterText>
                </View>
            )}
        </View>
    );
}
