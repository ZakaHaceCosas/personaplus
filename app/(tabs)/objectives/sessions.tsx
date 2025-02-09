/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2025 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/app/(tabs)/objectives/sessions.tsx
 * Basically: Live sporting sessions.
 *
 * <=============================================================================>
 */

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
    CalculateSessionPerformance,
    GetActiveObjective,
    SaveActiveObjectiveToDailyLog,
} from "@/toolkit/objectives/active_objectives";
import {
    router,
    UnknownOutputParams,
    useGlobalSearchParams,
} from "expo-router";
import GapView from "@/components/ui/gap_view";
import { logToConsole } from "@/toolkit/console";
import { useTranslation } from "react-i18next";
import BetterButton from "@/components/interaction/better_button";
import Colors from "@/constants/colors";
import Loading from "@/components/static/loading";
import { ActiveObjective, SessionParams } from "@/types/active_objectives";
import { GetCommonScreenSize } from "@/constants/screen";
import IslandDivision from "@/components/ui/sections/island_division";
import { Routes } from "@/constants/routes";
import { HexColorString } from "@/types/color";
import { BasicUserHealthData } from "@/types/user";
import { OrchestrateUserData } from "@/toolkit/user";
import { ShowToast } from "@/toolkit/android";
import SessionTimer from "@/components/ui/pages/timer";
import { StringifyMinutes } from "@/toolkit/today";
import { CoreLibraryResponse } from "@/core/types/core_library_response";
import { GenerateRandomMessage } from "@/toolkit/strings";
import { HelpView, TopView } from "@/components/ui/pages/sessions";

const styles = StyleSheet.create({
    mainView: {
        width: GetCommonScreenSize("width"),
        height: GetCommonScreenSize("height"),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.MAIN.APP,
    },
});

export default function Sessions(): ReactElement {
    // Stateful values and stuff
    const { t } = useTranslation();

    // data
    const params: UnknownOutputParams = useGlobalSearchParams();
    const objectiveIdentifier: number = Number(params.id);
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
    const [currentObjectiveVerbalName, setObjectiveVerbalName] =
        useState<string>(t("pages.sessions.resting"));

    useEffect((): void => {
        if (!objective) return;
        const { durationMinutes } = objective.info;
        const result: string = !isUserResting
            ? t(
                  `globals.supportedActiveObjectives.${objective.exercise}.doing`,
                  { duration: StringifyMinutes(durationMinutes) },
              )
            : t("pages.sessions.resting");

        setObjectiveVerbalName(result);
    }, [isUserResting, objective, t]);

    useEffect((): void => {
        async function handler(): Promise<void> {
            setUserData(await OrchestrateUserData("health"));
        }
        handler();
    }, []);

    useEffect((): void => {
        async function handler(): Promise<void> {
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

    // the color of the timer
    const timerColor: HexColorString = isTimerRunning
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
                    onPress: (): void => {},
                },
                {
                    text: t("globals.interaction.giveUp"),
                    style: "destructive",
                    onPress: (): void => {
                        router.replace(Routes.MAIN.HOME); // basically goes home without saving, easy.
                    },
                },
            ],
            { cancelable: false },
        );
    }

    // pauses/plays the timer
    // you can pass a specific boolean value (true = play, false = pause), or don't pass anything for it to revert (true to false / false to true)
    const toggleTimerStatus: (target: boolean) => void = useCallback(
        (target: boolean): void => {
            setTimerStatus(target);
        },
        [],
    );

    // total duration of the session, including rests
    const calculateTotalTime: () => number = useCallback((): number => {
        if (!objective) return 0;
        const { durationMinutes, rests, restDurationMinutes } = objective.info;
        return durationMinutes + (rests ?? 0) * restDurationMinutes;
    }, [objective]);

    useEffect((): void => {
        setTotalTime(calculateTotalTime());
    }, [calculateTotalTime]);

    // handle the state changes for resting
    const handleRestState: (isResting: boolean) => void = useCallback(
        (isResting: boolean): void => {
            toggleTimerStatus(!isResting); // if resting, pause; if not, play
            setIsUserResting(isResting);
        },
        [toggleTimerStatus],
    );

    function toggleHelpMenu(status: boolean): void {
        setIsUserCheckingHelp(status);
        toggleTimerStatus(!status); // Pause if checking help, play otherwise
    }

    // this function is basically to finish the session
    // will mark the obj as done, save it, and head to the results page
    const FinishSession: () => void = useCallback((): void => {
        async function handle(): Promise<void> {
            try {
                if (!objective || !userData) return; // i mean if we finished we can asume we already have both things, but typescript disagrees

                ShowToast(GenerateRandomMessage("sessionCompleted", t));

                const response: CoreLibraryResponse =
                    CalculateSessionPerformance(objective, userData, totalTime);
                if (!response) throw new Error("Response is null or undefined");

                await SaveActiveObjectiveToDailyLog(
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
                    pathname: Routes.ACTIVE_OBJECTIVES.RESULTS,
                    params: params,
                });
            } catch (e) {
                logToConsole(
                    `Error finishing session for ${
                        objective ? objective.identifier : "(UNKNOWN OBJECTIVE)"
                    }: ${e}`,
                    "error",
                );
            }
        }
        handle();
    }, [objective, userData, totalTime, t, objectiveIdentifier]);

    if (loading || !objective) {
        return <Loading />;
    }

    return (
        <View style={styles.mainView}>
            <TopView
                objective={objective}
                verbalName={currentObjectiveVerbalName}
            />
            <GapView height={20} />
            <SessionTimer
                objective={objective}
                onComplete={FinishSession}
                timerColor={timerColor}
                running={isTimerRunning}
                restingStateHandler={handleRestState}
            />
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
                <HelpView
                    objective={objective}
                    toggleHelpMenu={(): void => toggleHelpMenu(false)}
                />
            )}
        </View>
    );
}
