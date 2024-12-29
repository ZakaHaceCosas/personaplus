import React, { ReactElement, useCallback } from "react";
import BetterText from "@/components/text/better_text";
import Colors from "@/constants/colors";
import { CalculateSessionFragmentsDuration } from "@/toolkit/objectives/active_objectives";
import { ActiveObjective } from "@/types/active_objectives";
import { Color } from "@/types/color";
import { CountdownCircleTimer, TimeProps } from "rn-countdown-timer";

interface SessionTimerProps {
    objective: ActiveObjective;
    running: boolean;
    timerColor: Color;
    restingStateHandler: (state: boolean) => void;
    onComplete: () => void;
}

export default function SessionTimer({
    objective,
    running,
    timerColor,
    restingStateHandler,
    onComplete,
}: SessionTimerProps): ReactElement {
    const { rests, restDurationMinutes, durationMinutes } = objective.info;
    const totalDuration: number = durationMinutes * 60;
    const fragmentDuration: number = CalculateSessionFragmentsDuration(
        totalDuration,
        rests,
    );

    const restingHandler: (timeLeft: number) => void = useCallback(
        (timeLeft: number): void => {
            if (rests === 0) return;
            const elapsedTime: number = totalDuration - timeLeft; // Elapsed time. The circle timer is supposed to call this thing each second, so it should work
            const currentFragment: number = Math.floor(
                elapsedTime / fragmentDuration,
            );

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
                restingStateHandler(true); // Pauses
                setTimeout(
                    (): void => restingStateHandler(false), // Plays, after the time has passed
                    restDurationMinutes * 60 * 1000, // Convert seconds to milliseconds
                );
            }
        },
        [
            fragmentDuration,
            restDurationMinutes,
            restingStateHandler,
            rests,
            totalDuration,
        ],
    );

    return (
        <CountdownCircleTimer
            duration={totalDuration}
            size={160}
            isPlaying={running}
            colors={[timerColor, timerColor]}
            colorsTime={[15, 5]}
            isSmoothColorTransition={true}
            onComplete={onComplete}
            onUpdate={(remainingTime: number): void =>
                restingHandler(remainingTime)
            }
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
    );
}
