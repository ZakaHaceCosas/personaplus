/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/app/(tabs)/toolkit.tsx
 * Basically: A toolkit with some random but useful tools for users.
 *
 * <=============================================================================>
 */

import TopBar from "@/components/navigation/top_bar";
import {
    BetterTextHeader,
    BetterTextNormalText,
    BetterTextSmallHeader,
} from "@/components/text/better_text_presets";
import SessionTimer from "@/components/ui/pages/timer";
import { GetCommonScreenSize } from "@/constants/screen";
import { ShowToast } from "@/toolkit/android";
import React from "react";
import { ReactElement, useEffect, useRef, useState } from "react";
import StopwatchTimer, {
    StopwatchTimerMethods,
} from "react-native-animated-stopwatch-timer";
import Colors from "@/constants/colors";
import BetterInputField from "@/components/interaction/better_input_field";
import GapView from "@/components/ui/gap_view";
import BetterButton from "@/components/interaction/better_button";
import { View } from "react-native";
import PageEnd from "@/components/static/page_end";
import { useTranslation } from "react-i18next";

export default function Toolkit(): ReactElement {
    const [focusTraining, setFocusTraining] = useState<boolean>(false);
    const [isRunnerStopwatchRunning, setRunnerStopwatch] =
        useState<boolean>(false);
    const [runnerTime, setRunnerTime] = useState<number>(0);
    const [runnerDistance, setRunnerDistance] = useState<string>("");

    // NEW TIMER METHODS
    const runnerStopwatchTimerRef = useRef<StopwatchTimerMethods>(null);

    function play(): void {
        runnerStopwatchTimerRef.current?.play();
    }

    function pause(): void {
        runnerStopwatchTimerRef.current?.pause();
    }

    function getRunnerTimeInSeconds(): number {
        // in milliseconds
        const snap: number | undefined =
            runnerStopwatchTimerRef.current?.getSnapshot();
        if (!snap) return 0;
        return snap / 1000;
    }

    useEffect((): void => {
        if (isRunnerStopwatchRunning) {
            play();
        } else {
            pause();
        }
    }, [isRunnerStopwatchRunning]);

    useEffect(() => {
        setRunnerTime(getRunnerTimeInSeconds());
    }, [isRunnerStopwatchRunning]);

    const { t } = useTranslation();

    return (
        <>
            {!focusTraining && (
                <>
                    <TopBar
                        includeBackButton={false}
                        header={t("pages.toolkit.header")}
                        subHeader={t("pages.toolkit.subHeader")}
                    />
                    <BetterTextHeader>
                        {t("pages.toolkit.stopwatchTool.name")}
                    </BetterTextHeader>
                    <BetterTextNormalText>
                        {t("pages.toolkit.stopwatchTool.desc")}
                    </BetterTextNormalText>
                    <GapView height={10} />
                    <StopwatchTimer
                        mode="stopwatch"
                        ref={runnerStopwatchTimerRef}
                        trailingZeros={2}
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
                            color: isRunnerStopwatchRunning
                                ? Colors.PRIMARIES.ACE.ACE
                                : Colors.PRIMARIES.HMM.HMM,
                        }}
                        textCharStyle={{
                            fontSize: 40,
                            color: Colors.MAIN.DEFAULT_ITEM.TEXT,
                            fontFamily: "BeVietnamPro-SemiBold",
                        }}
                    />
                    <GapView height={10} />
                    <BetterInputField
                        label={t("pages.toolkit.stopwatchTool.dist")}
                        placeholder={t(
                            "pages.toolkit.stopwatchTool.distPlaceholder",
                        )}
                        value={runnerDistance}
                        refIndex={0}
                        keyboardType="numeric"
                        name="runnerDistanceInput"
                        length={5}
                        changeAction={setRunnerDistance}
                        readOnly={false}
                        isValid={true}
                        validatorMessage=""
                        refParams={{
                            inputRefs: { current: [] },
                            totalRefs: 1,
                        }}
                    />
                    <GapView height={10} />
                    <BetterButton
                        style={isRunnerStopwatchRunning ? "DEFAULT" : "ACE"}
                        buttonHint="Timer"
                        buttonText={(isRunnerStopwatchRunning
                            ? t("globals.interaction.done")
                            : t("globals.interaction.goAheadGood")
                        ).toUpperCase()}
                        action={(): void => {
                            setRunnerStopwatch(!isRunnerStopwatchRunning);
                        }}
                    />
                    <GapView height={10} />
                    {runnerDistance.trim() !== "" && runnerTime !== 0 && (
                        <View
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <BetterTextNormalText>
                                mts/sec:{" "}
                                {(
                                    parseFloat(runnerDistance) / runnerTime
                                ).toPrecision(3)}
                                {"  |  "}
                                kms/hr:{" "}
                                {(
                                    parseFloat(runnerDistance) /
                                    1000 /
                                    (runnerTime / 3600)
                                ).toPrecision(3)}
                            </BetterTextNormalText>
                        </View>
                    )}
                    <GapView height={40} />
                </>
            )}
            <BetterTextHeader>
                {t("pages.toolkit.focusTool.name")}
            </BetterTextHeader>
            <BetterTextNormalText>
                {t("pages.toolkit.focusTool.desc")}
            </BetterTextNormalText>
            <GapView height={focusTraining ? 150 : 10} />
            <View
                style={{ width: "100%", display: "flex", alignItems: "center" }}
            >
                <SessionTimer
                    durationSeconds={300}
                    running={focusTraining}
                    timerColor={Colors.PRIMARIES.ACE.ACE}
                    onComplete={(): void => {
                        ShowToast(t("globals.interaction.wellDoneBud"));
                        setFocusTraining(false);
                    }}
                />
            </View>
            <GapView height={focusTraining ? 100 : 10} />
            {focusTraining && (
                <BetterTextSmallHeader>
                    {t("pages.toolkit.focusTool.warning")}
                </BetterTextSmallHeader>
            )}
            {!focusTraining && (
                <BetterButton
                    style={"ACE"}
                    buttonHint="Focus"
                    buttonText={"START!"}
                    action={(): void => {
                        setFocusTraining(true);
                    }}
                />
            )}
            <PageEnd includeText />
        </>
    );
}
