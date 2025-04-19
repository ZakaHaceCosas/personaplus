/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/components/ui/pages/timer.tsx
 * Basically: A countdown timer. Used by early versions of Active Objectives, it's now only used for extra tools, like the focus train feature.
 *
 * <=============================================================================>
 */

import React, { ReactElement } from "react";
import BetterText from "@/components/text/better_text";
import Colors from "@/constants/colors";
import { HexColorString } from "@/types/color";
import { CountdownCircleTimer, TimeProps } from "rn-countdown-timer";

interface SessionTimerProps {
    durationSeconds: number;
    running: boolean;
    timerColor: HexColorString;
    onComplete: () => void;
}

export default function SessionTimer({
    running,
    timerColor,
    durationSeconds,
    onComplete,
}: SessionTimerProps): ReactElement {
    return (
        <CountdownCircleTimer
            duration={durationSeconds}
            size={180}
            isPlaying={running}
            colors={[timerColor, timerColor]}
            colorsTime={[15, 5]}
            isSmoothColorTransition={true}
            onComplete={onComplete}
            isGrowing={true}
            trailColor={Colors.MAIN.DIVISION}
            strokeLinecap="round"
            trailStrokeWidth={10}
            strokeWidth={15}
        >
            {({ remainingTime }: TimeProps): ReactElement => {
                const minutes: number = Math.floor(remainingTime / 60);
                const seconds: number = remainingTime % 60;

                return (
                    <BetterText
                        fontSize={35}
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
    );
}
