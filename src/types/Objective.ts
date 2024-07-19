// src/types/Objective.ts
// Objective Type

export interface Objective {
    identifier: number;
    days: boolean[];
    duration: number;
    exercise: "Push Up" | "Lifting" | "Running" | "Walking" | "Meditation" | string;
    extra: {
        /* PUSH-UP */
        amount: number; // Amount of pushups
        // hands?: 1 | 2; // Wether they are made with only one hand or two. Commented as lifting uses the exact same value - we can recycle it :]
        time: number; // Estimatedly, how much does the user take to make a push-up.
        /* LIFTING */
        lifts: number; // How many lifts
        liftWeight: number; // Weight in KG per weight
        barWeight: number; // Weight in KG of the bar
        hands: number; // You know there are weights that are for one hand and then there are those big weights that require both hands to be lifted cause' they are so long? Depending on what you're using, this specifies the "amount of hands" you're using (basically the total weight of what you're lifting will be multiplied by this)
        /* RUNNING */
        speed: number; // In kilometers per hour, how fast the user wants to run. Of course, estimatedly.
        /* WALKING */
        // Nothing for this - just speed, which is already declared.
        /* MEDITATION */
        // Nothing for this
    };
    repetitions: number;
    restDuration: number;
    rests: number;
    wasDone: boolean;
}

export type ObjectiveWithoutId = Omit<Objective, "identifier">; // for the CreateObjective form
