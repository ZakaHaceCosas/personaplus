import BetterText from "@/components/text/better_text";
import Colors from "@/constants/colors";
import { CalculateSessionFragmentsDuration } from "@/toolkit/objectives/active_objectives";
import { ActiveObjective } from "@/types/active_objectives";
import { Color } from "@/types/color";
import { ReactElement } from "react";
import { CountdownCircleTimer, TimeProps } from "rn-countdown-timer";

interface SessionTimerProps {
    objective: ActiveObjective;
    running: boolean;
    timerColor: Color;
    restingHandler: (
        totalDuration: number,
        timeLeft: number,
        fragmentDuration: number,
        restDuration: number,
        rests: number,
    ) => void;
    onComplete: () => void;
}

export default function SessionTimer({
    objective,
    running,
    timerColor,
    restingHandler,
    onComplete,
}: SessionTimerProps): ReactElement {
    return (
        <CountdownCircleTimer
            duration={objective.info.durationMinutes * 60}
            size={160}
            isPlaying={running}
            colors={[timerColor, timerColor]}
            colorsTime={[15, 5]}
            isSmoothColorTransition={true}
            onComplete={onComplete}
            onUpdate={(remainingTime: number): void =>
                restingHandler(
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
