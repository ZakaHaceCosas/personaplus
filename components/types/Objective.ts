// components/types/Objective.ts

export interface Objective {
    identifier: number;
    days: boolean[];
    duration: number;
    exercise: "Push Up" | "Lifting" | "Running" | "Walking" | "Meditation" | string;
    extra: {
        amount: number;
        time: number;
        lifts: number;
        liftWeight: number;
        barWeight: number;
        hands: number;
        speed: number;
    };
    repetitions: number;
    restDuration: number;
    rests: number;
    wasDone: boolean;
}
