/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/app/(tabs)/objectives/sessions.tsx
 * Basically: Live sporting sessions.
 *
 * <=============================================================================>
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
    GetActiveObjective,
    CalculateSessionFragmentsDuration,
    SaveActiveObjectiveToDailyLog,
    CalculateSessionPerformance,
} from "@/toolkit/objectives/active_objectives";
import { router, useGlobalSearchParams } from "expo-router";
import BetterText from "@/components/text/better_text";
import GapView from "@/components/ui/gap_view";
import { logToConsole } from "@/toolkit/debug/console";
import { CountdownCircleTimer } from "rn-countdown-timer";
import { useTranslation } from "react-i18next";
import BetterButton from "@/components/interaction/better_button";
import SessionsPageInfoIcons from "@/components/ui/pages/sessions/info_icons";
import Colors from "@/constants/colors";
import Loading from "@/components/static/loading";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import SessionsPageHelpView from "@/components/ui/pages/sessions/help_view";
import { ActiveObjective, SessionParams } from "@/types/active_objectives";
import getCommonScreenSize from "@/constants/screen";
import IslandDivision from "@/components/ui/sections/island_division";
import GenerateRandomMessage from "@/toolkit/random_message";
import ROUTES from "@/constants/routes";
import { Color } from "@/types/color";
import { BasicUserHealthData } from "@/types/user";
import { OrchestrateUserData } from "@/toolkit/user";
import { ShowToast } from "@/toolkit/android";

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

export default function Sessions() {
    // Stateful values and stuff
    const { t } = useTranslation();

    // data
    const params = useGlobalSearchParams();
    const objectiveIdentifier = Number(params.id);
    const [loading, setLoading] = useState<boolean>(true);
    const [objective, setObjective] = useState<ActiveObjective | null>(null);
    const [userData, setUserData] = useState<BasicUserHealthData>();

    // session itself
    const [isTimerRunning, setTimerStatus] = useState(true);
    const [isUserCheckingHelp, setIsUserCheckingHelp] = useState(false);
    const [isUserResting, setIsUserResting] = useState(false);
    const [totalTime, setTotalTime] = useState<number>(0);
    // the verbal version of the objective name (i don't know how to call it)
    // like if the exercise is "Push ups" this variable is "Pushing up" (or "Doing pushups"? i don't remember)
    const currentObjectiveVerbalName = useMemo(() => {
        if (!objective) return;

        const { durationMinutes } = objective.info;

        return objective?.exercise
            ? `${t(
                  `globals.supportedActiveObjectives.${objective.exercise}.doing`,
                  { duration: durationMinutes },
              )}${durationMinutes > 1 ? "s" : ""}`
            : "Doing something";
    }, [objective, t]);

    const [currentObjectiveDescription, setObjectiveDescription] =
        useState<string>(t("page_sessions.resting"));

    useEffect(() => {
        async function handler() {
            setUserData(await OrchestrateUserData("health"));
        }
        handler();
    }, []);

    useEffect(() => {
        async function handler() {
            try {
                if (objectiveIdentifier === null) {
                    throw new Error("objectiveIdentifier is null.");
                }
                const obj: ActiveObjective | null =
                    await GetActiveObjective(objectiveIdentifier);
                if (!obj) {
                    throw new Error(
                        `${objectiveIdentifier} is not an objective.`,
                    );
                }
                setObjective(obj);
                setLoading(false);
            } catch (e) {
                logToConsole(
                    `Error fetching objective for session! ${e}`,
                    "error",
                );
                setLoading(false);
            }
        }
        handler();
    }, [objectiveIdentifier]);

    useEffect(() => {
        if (!objective) return;
        const result = !isUserResting
            ? currentObjectiveVerbalName
            : t("page_sessions.resting");

        setObjectiveDescription(result!);
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
            t("globals.interaction.areYouSure"),
            t("pages.sessions.giveUpDescription"),
            [
                {
                    text: t("globals.interaction.nevermind"),
                    style: "cancel",
                    onPress: () => {},
                },
                {
                    text: t("globals.interaction.giveUp"),
                    style: "destructive",
                    onPress: () => {
                        router.replace(ROUTES.MAIN.HOME); // basically goes home without saving, easy.
                    },
                },
            ],
            { cancelable: false },
        );
    }

    // pauses/plays the timer
    // you can pass a specific boolean value (true = play, false = pause), or don't pass anything for it to revert (true to false / false to true)
    const toggleTimerStatus = useCallback((target: boolean) => {
        setTimerStatus((prev) =>
            typeof target === "boolean" ? target : !prev,
        );
    }, []);

    // total duration of the session, including rests
    const calculateTotalTime = useCallback(() => {
        if (!objective) return 0;
        const { durationMinutes, rests, restDurationMinutes } = objective.info;
        return durationMinutes + (rests ?? 0) * restDurationMinutes;
    }, [objective]);

    useEffect(() => {
        setTotalTime(calculateTotalTime());
    }, [calculateTotalTime]);

    // handle the state changes for resting
    const handleRestState = useCallback(
        (isResting: boolean) => {
            toggleTimerStatus(!isResting); // if resting, pause; if not, play
            setIsUserResting(isResting);
        },
        [toggleTimerStatus],
    );

    // this handles pausing the timer for resting
    const handleResting = useCallback(
        (
            totalDuration: number,
            timeLeft: number,
            fragmentDuration: number,
            restDuration: number,
            rests: number,
        ) => {
            if (rests === 0) return;
            const elapsedTime = totalDuration - timeLeft; // Elapsed time. The circle timer is supposed to call this thing each second, so it should work
            const currentFragment = Math.floor(elapsedTime / fragmentDuration);

            /*
            i'll try to explain what's up
            sessions get divided in equally lasting "fragments", one division per rest
            1 session (60 seconds) + 1 rest = 1 division = 2 fragments (30 seconds)
            alright?
            */

            if (
                elapsedTime > 0 &&
                elapsedTime % fragmentDuration === 0 &&
                currentFragment <= rests
            ) {
                handleRestState(true); // Pauses
                setTimeout(
                    () => handleRestState(false), // Plays, after the time has passed
                    restDuration * 60 * 1000, // Convert seconds to milliseconds
                );
            }
        },
        [handleRestState],
    );

    function toggleHelpMenu(status: boolean): void {
        setIsUserCheckingHelp(status);
        toggleTimerStatus(!status); // Pause if checking help, play otherwise
    }

    // this function is basically to finish the session
    // will mark the obj as done, save it, and head to the results page
    const FinishSession = useCallback(() => {
        if (!objective || !userData) return; // i mean if we finished we can asume we already have both things, but typescript disagrees

        try {
            ShowToast(GenerateRandomMessage("sessionCompleted", t));

            const response = CalculateSessionPerformance(
                objective,
                userData,
                totalTime,
            );
            if (!response) throw new Error("Response is null or undefined");

            SaveActiveObjectiveToDailyLog(
                objectiveIdentifier,
                true,
                objective,
                response,
            );

            const params: SessionParams = {
                burntCalories: response.result,
                elapsedTime: totalTime ?? 0,
                id: objective.identifier,
            };

            router.replace({
                pathname: ROUTES.ACTIVE_OBJECTIVES.RESULTS,
                params: params,
            });
        } catch (e) {
            logToConsole(
                `Error parsing active objectives for update: ${e}`,
                "error",
            );
        }
    }, [objective, userData, totalTime, t, objectiveIdentifier]);

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
                    {t("pages.sessions.live").toUpperCase()}
                </BetterText>
            </IslandDivision>
            <GapView height={20} />
            <IslandDivision direction="vertical" alignment="center">
                <BetterText
                    fontWeight="Regular"
                    fontSize={12}
                    textAlign="center"
                >
                    {t("pages.sessions.currentObjective")}
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
                onComplete={FinishSession}
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
                    buttonHint={
                        isTimerRunning
                            ? t("pages.sessions.toggleTimer.hintPause")
                            : t("pages.sessions.toggleTimer.hintPlay")
                    }
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
                    buttonHint={t("pages.sessions.helpHint")}
                    style="HMM"
                    buttonText={t("globals.interaction.help")}
                    action={() => toggleHelpMenu(true)}
                    layout="normal"
                />
                <GapView width={10} />
                <BetterButton
                    buttonHint={t("pages.sessions.giveUpHint")}
                    style="WOR"
                    buttonText={t("globals.interaction.giveUp")}
                    action={() => GiveUp()}
                    layout="normal"
                />
            </IslandDivision>
            {isUserCheckingHelp && (
                <SessionsPageHelpView
                    objective={objective}
                    toggleHelpMenu={() => toggleHelpMenu(false)}
                />
            )}
        </View>
    );
}
