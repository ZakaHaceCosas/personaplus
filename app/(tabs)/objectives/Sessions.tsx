// FIXME - THERE'S A LOT OF WRONG STUFF IN HERE
// TODO - HANDLE ALL TODOs FROM THIS PAGE

// FIXME: KNOWN ERRORS
// FIXME 1: When it "enters" rest state colors change but the timer keeps going

// Sessions.tsx
// Page for live exercising sessions

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ToastAndroid, Platform } from "react-native";
import {
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
import { ActiveObjective } from "@/types/ActiveObjectives";
import getCommonScreenSize from "@/constants/Screen";
import IslandDivision from "@/components/ui/sections/IslandDivision";
import GenerateRandomMessage from "@/toolkit/RandomMessage";
import ROUTES from "@/constants/Routes";
import { Color } from "@/types/Color";

// TypeScript, supongo
export interface SessionParams {
    speed: number;
    time: number;
    id: number;
    exercise: string;
    lifts: number;
    dumbbellWeight: number;
    pushups: number;
    hands: number;
}

// We define the styles
const styles = StyleSheet.create({
    mainView: {
        width: getCommonScreenSize("width"),
        height: getCommonScreenSize("height"),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.MAIN.APP,
    },
});

// We define the main function
export default function Sessions() {
    // Stateful values and stuff
    const { t } = useTranslation();
    const params = useGlobalSearchParams();
    const objectiveIdentifier = Number(params.id);
    const [loading, setLoading] = useState<boolean>(true);
    const [objective, setObjective] = useState<ActiveObjective | null>(null);

    useEffect(() => {
        const handler = async () => {
            try {
                if (objectiveIdentifier === null) {
                    throw new Error("objectiveIdentifier is null.");
                }

                const obj = await GetActiveObjective(objectiveIdentifier);
                setObjective(obj);
                setLoading(false);
            } catch (e) {
                logToConsole(
                    "Error fetching objective for session! " + e,
                    "error",
                );
                setLoading(false);
            }
        };

        handler();
    }, [objectiveIdentifier]);

    const [isTimerRunning, setTimerStatus] = useState(true);
    const [isUserCheckingHelp, setIsUserCheckingHelp] = useState(false);
    const [isUserResting, setIsUserResting] = useState(false);

    const [totalTime, setTotalTime] = useState<number>(0);

    // the verbal version of the objective name (i don't know how to call it)
    // like if the exercise is "Push ups" this variable is "Pushing up" (or "Doing pushups"? i don't remember)
    const currentObjectiveVerbalName: string = objective?.exercise
        ? t(`globals.supported_active_objectives_verbal.${objective.exercise}`) // TODO - rename vars accordingly
        : "Doing something";

    const [currentObjectiveDescription, setObjectiveDescription] =
        useState<string>(t("page_sessions.resting"));

    useEffect(() => {
        if (!objective) return;

        const { durationMinutes } = objective.info;
        const result = !isUserResting
            ? `${currentObjectiveVerbalName} ${durationMinutes}${durationMinutes > 1 ? ` ${t("globals.minute")}s` : ""}`
            : t("page_sessions.resting");

        setObjectiveDescription(result);
    }, [
        currentObjectiveVerbalName,
        isUserResting,
        objective,
        objective?.info.durationMinutes,
        t,
    ]);

    // the color of the timer
    const timerColor: Color = isTimerRunning
        ? Colors.PRIMARIES.GOD.GOD
        : Colors.PRIMARIES.HMM.HMM;

    // give up function
    function GiveUp(): void {
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
                        router.navigate(ROUTES.MAIN.HOME); // basically goes home without saving, easy.
                    },
                },
            ],
            { cancelable: false },
        );
    }

    // pauses/plays the timer
    // you can pass a specific boolean value (true = play, false = pause), or don't pass anything for it to revert (true to false / false to true)
    const toggleTimerStatus = (target?: boolean): void => {
        setTimerStatus((prev) => target ?? !prev);
    };

    // total duration of the session, including rests
    useEffect(() => {
        const calculateTotalTime = (): number => {
            if (!objective) return 0;
            const { durationMinutes, rests, restDurationMinutes } =
                objective.info;
            return durationMinutes + (rests ?? 0) * restDurationMinutes;
        };

        setTotalTime(calculateTotalTime());
    }, [objective]);

    // handle the state changes for resting
    const handleRestState = (isResting: boolean): void => {
        toggleTimerStatus(!isResting); // if resting, pause; if not, play
        setIsUserResting(isResting);
    };

    // this handles pausing the timer for resting
    const handleResting = (
        totalDuration: number,
        timeLeft: number,
        fragmentDuration: number,
        restDuration: number,
        rests: number,
    ): void => {
        const elapsedTime = totalDuration - timeLeft; // Elapsed time. The circle timer is supposed to call this thing each second, so it should work
        const currentFragment = Math.floor(elapsedTime / fragmentDuration);

        /*
        i'll try to explain what's up
        sessions get divided in equally lasting "fragments", one division per rest
        1 session (60 seconds) + 1 rest = 1 division = 2 fragments (30 seconds)
        alright?
        */

        if (
            elapsedTime !== 0 &&
            elapsedTime % fragmentDuration === 0 &&
            currentFragment <= rests
        ) {
            handleRestState(true); // Pauses
            setTimeout(
                () => {
                    handleRestState(false); // Plays, after the time has passed
                },
                restDuration * 60 * 1000, // Convert seconds to milliseconds
            );
        }
    };

    const toggleHelpMenu = (): void => {
        const isChecking: boolean = !isUserCheckingHelp; // maybe this fixes an issue i was having
        setIsUserCheckingHelp(isChecking);
        toggleTimerStatus(isChecking); // Pause if checking help, play otherwise
    };

    // this function is basically to finish the session
    // will mark the obj as done, save it, and head to the results page
    const finishSession = async (): Promise<void> => {
        if (!objective || objective === null) return;

        try {
            if (Platform.OS === "android") {
                ToastAndroid.show(
                    GenerateRandomMessage("sessionCompleted", t),
                    ToastAndroid.LONG,
                );
            }

            const params: SessionParams = {
                speed: objective.specificData.estimateSpeed,
                time: totalTime ?? 0,
                id: objective.identifier,
                exercise: objective.exercise,
                lifts: objective.specificData.reps,
                dumbbellWeight: objective.specificData.dumbbellWeight,
                pushups: objective.specificData.amountOfPushUps,
                hands: objective.specificData.amountOfHands,
            };

            router.replace({
                pathname: ROUTES.ACTIVE_OBJECTIVES.RESULTS,
                // @ts-expect-error TypeError
                params: params,
            });
        } catch (e) {
            logToConsole(
                "Error parsing active objectives for update: " + e,
                "error",
            );
        }
    };

    // handles finishing. this is called whenever the timer runs out of time
    // however repetitions exist, so a handler is required
    // NOTE - repetitions have been deprecated as of now so uh i don't think we'll need this anymore?
    const handleFinish = () => {
        finishSession();
    };

    if (loading || !objective) {
        return <Loading />;
    }

    if (!loading && !objective) {
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
            <IslandDivision alignment="start" direction="horizontal">
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
            </IslandDivision>
            <GapView height={20} />
            <IslandDivision direction="vertical" alignment="center">
                <BetterText
                    fontWeight="Regular"
                    fontSize={12}
                    textAlign="center"
                >
                    {t("page_sessions.current")}
                </BetterText>
                <GapView height={10} />
                <BetterText fontWeight="Bold" fontSize={25} textAlign="center">
                    {currentObjectiveDescription}
                </BetterText>
                <GapView height={10} />
                <SessionsPageInfoIcons objective={objective} t={t} />
            </IslandDivision>
            <GapView height={20} />
            <CountdownCircleTimer
                duration={objective.info.durationMinutes * 60}
                size={160}
                isPlaying={isTimerRunning}
                colors={[timerColor, timerColor]}
                colorsTime={[15, 5]}
                isSmoothColorTransition={true}
                onComplete={handleFinish}
                onUpdate={(remainingTime: number): void =>
                    handleResting(
                        objective.info.durationMinutes * 60,
                        remainingTime,
                        CalculateSessionFragmentsDuration(
                            objective.info.durationMinutes * 60,
                            objective.info.rests,
                        ),
                        objective.info.restDurationMinutes,
                        objective.info.rests ?? 0,
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
                            {seconds < 10
                                ? `${minutes}:0${seconds}`
                                : `${minutes}:${seconds}`}
                        </BetterText>
                    );
                }}
            </CountdownCircleTimer>
            <GapView height={20} />
            <IslandDivision alignment="center" direction="horizontal">
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
                    action={() => GiveUp()}
                    layout="normal"
                />
            </IslandDivision>
            {isUserCheckingHelp && (
                <SessionsPageHelpView
                    t={t}
                    objective={objective}
                    toggleHelpMenu={() => toggleHelpMenu()}
                />
            )}
        </View>
    );
}
