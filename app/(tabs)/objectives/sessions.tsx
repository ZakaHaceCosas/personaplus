/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/app/(tabs)/objectives/sessions.tsx
 * Basically: Live sporting sessions.
 *
 * <=============================================================================>
 */

import React, {
    ReactElement,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
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
import { useTranslation } from "react-i18next";
import BetterButton from "@/components/interaction/better_button";
import Colors from "@/constants/colors";
import Loading from "@/components/static/loading";
import { ActiveObjective } from "@/types/active_objectives";
import { GetCommonScreenSize } from "@/constants/screen";
import IslandDivision from "@/components/ui/sections/island_division";
import { Routes } from "@/constants/routes";
import { BasicUserHealthData } from "@/types/user";
import { OrchestrateUserData } from "@/toolkit/user";
import { ShowToast } from "@/toolkit/android";
import { CoreLibraryResponse } from "@/core/types/core_library_response";
import { GenerateRandomMessage } from "@/toolkit/strings";
import { HelpView, TopView } from "@/components/ui/pages/sessions";
import StopwatchTimer, {
    StopwatchTimerMethods,
} from "react-native-animated-stopwatch-timer";
import { BetterTextSmallText } from "@/components/text/better_text_presets";

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
    const { t } = useTranslation();

    // data
    const params: UnknownOutputParams = useGlobalSearchParams();
    const objectiveIdentifier: number = Number(params.id);

    // stateful values and stuff
    const [loading, setLoading] = useState<boolean>(true);
    const [objective, setObjective] = useState<ActiveObjective | null>(null);
    const [userData, setUserData] = useState<BasicUserHealthData>();

    // session itself
    const [isTimerRunning, setTimerStatus] = useState(false);
    const [isUserCheckingHelp, setIsUserCheckingHelp] = useState(false);

    // the verbal version of the objective name (i don't know how to call it)
    // like if the exercise is "Push ups" this variable is "Pushing up" (or "Doing pushups"? i don't remember)
    const [currentObjectiveVerbalName, setObjectiveVerbalName] =
        useState<string>(t("pages.sessions.resting"));

    useEffect((): void => {
        if (!objective) return;

        setObjectiveVerbalName(
            t(`globals.supportedActiveObjectives.${objective.exercise}.doing`),
        );
    }, [objective, t]);

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
                console.error(
                    `Error fetching objective for session! ${e}`,
                    "error",
                );
                setLoading(false);
            }
        }
        handler();
    }, [objectiveIdentifier]);

    // give up function
    function GiveUp(): void {
        pause();
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

    function toggleHelpMenu(status: boolean): void {
        setIsUserCheckingHelp(status);
        toggleTimerStatus(!status); // Pause if checking help, play otherwise
    }

    // this function is basically to finish the session
    // will mark the obj as done, save it, and head to the results page
    const FinishSession: () => void = useCallback((): void => {
        pause();
        async function handle(): Promise<void> {
            try {
                if (!objective || !userData) return; // i mean if we finished we can asume we already have both things, but typescript disagrees

                ShowToast(GenerateRandomMessage("sessionCompleted", t));

                const response: CoreLibraryResponse =
                    CalculateSessionPerformance(
                        objective,
                        userData,
                        getTimeInMinutes(),
                    );
                if (!response) throw new Error("Response is null or undefined");

                await SaveActiveObjectiveToDailyLog(
                    objectiveIdentifier,
                    true,
                    response,
                );

                router.replace({
                    pathname: Routes.OBJECTIVES.RESULTS,
                    params: {
                        burntCalories: response.result,
                        elapsedTime: getTimeInMinutes(),
                        id: objective.identifier,
                    },
                });
            } catch (e) {
                console.error(
                    `Error finishing session for ${
                        objective ? objective.identifier : "(UNKNOWN)"
                    }: ${e}`,
                    "error",
                );
            }
        }
        handle();
    }, [objective, userData, t, objectiveIdentifier]);

    // NEW TIMER METHODS
    const stopwatchTimerRef = useRef<StopwatchTimerMethods>(null);

    function play(): void {
        stopwatchTimerRef.current?.play();
    }

    function pause(): void {
        stopwatchTimerRef.current?.pause();
    }

    function getTimeInMinutes(): number {
        // in milliseconds
        const snap: number | undefined =
            stopwatchTimerRef.current?.getSnapshot();
        if (!snap) return 0;
        return snap / 1000 / 60;
    }

    useEffect((): void => {
        if (isTimerRunning) {
            play();
        } else {
            pause();
        }
    }, [isTimerRunning]);

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
            <StopwatchTimer
                mode="stopwatch"
                ref={stopwatchTimerRef}
                trailingZeros={0}
                leadingZeros={2}
                enterAnimationType="slide-in-up"
                containerStyle={{
                    height: 90,
                    width: GetCommonScreenSize("width"),
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: Colors.MAIN.SECTION,
                    borderRadius: 20,
                }}
                digitStyle={{
                    color: isTimerRunning
                        ? Colors.PRIMARIES.ACE.ACE
                        : Colors.PRIMARIES.HMM.HMM,
                }}
                textCharStyle={{
                    fontSize: 40,
                    color: Colors.MAIN.DEFAULT_ITEM.TEXT,
                    fontFamily: "BeVietnamPro-SemiBold",
                }}
            />
            {isTimerRunning === false && getTimeInMinutes() === 0 && (
                <>
                    <GapView height={20} />
                    <BetterTextSmallText>
                        {t("pages.sessions.hitStart")}
                    </BetterTextSmallText>
                </>
            )}
            <GapView height={20} />
            <IslandDivision alignment="center" direction="horizontal">
                <BetterButton
                    buttonHint={
                        isTimerRunning
                            ? t("pages.sessions.toggleTimer.hintPause")
                            : t("pages.sessions.toggleTimer.hintPlay")
                    }
                    buttonText={null}
                    style={isTimerRunning ? "DEFAULT" : "HMM"}
                    action={(): void =>
                        setTimerStatus((prev: boolean): boolean => !prev)
                    }
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
                    buttonHint={t("pages.sessions.doneHint")}
                    style="ACE"
                    buttonText={t("globals.interaction.done")}
                    action={(): void => FinishSession()}
                    layout="normal"
                />
                <GapView width={10} />
                <BetterButton
                    buttonHint={t("pages.sessions.helpHint")}
                    style="DEFAULT"
                    buttonText={t("globals.interaction.help")}
                    action={(): void => toggleHelpMenu(true)}
                    layout="normal"
                />
                <GapView width={10} />
                <BetterButton
                    buttonHint={t("pages.sessions.giveUpHint")}
                    buttonText={null}
                    style={"WOR"}
                    action={(): void => GiveUp()}
                    layout="box"
                    icon={{
                        name: "exit-to-app",
                        size: 18,
                        color: Colors.BASIC.WHITE,
                    }}
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
