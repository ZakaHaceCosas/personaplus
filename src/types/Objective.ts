// src/types/Objective.ts
// Objective Type

import { TodaysDay } from "../toolkit/today";

/**
 * A type with all the exercises that are currently supported by Active Objectives.
 *
 * @export
 * @typedef {ActiveObjectiveSupportedExercises}
 */
export type ActiveObjectiveSupportedExercises = "Push Up" | "Lifting" | "Running" | "Meditation"

/**
 * Extra data for active objectives. **Note: Due to the old codebase sucking so hard and this thing not being rewritten, you need to specify** ***everything***, **even if you don't need it, e.g. the "speed" of a push-ups session. For this cases, use `0`, `null`, `" "`, or whatever, as the app will just ignore unneeded values.** I will refactor this whenever I get spare time.
 *
 * @interface extra
 * @typedef {extra}
 */
interface extra {
    /**
     * **PUSH-UPS**: The amount of push-ups to do.
     *
     * @type {number}
     */
    amount: number;
    /**
     * **PUSH-UPS**: Estimatedly, how much does the user take to make a push-up. `Deprecated`.
     *
     * @type {number}
     */
    time: number;
    /**
     * **LIFTING**: The amount of lifts the user will do.
     *
     * @type {number}
     */
    lifts: number; // How many lifts
    /**
     * **LIFTING**: Weight, in kilograms, of each weight plate.
     *
     * @type {number}
     */
    liftWeight: number;
    /**
     * **LIFTING**: Weight, in kilograms, of the barbell.
     *
     * @type {number}
     */
    barWeight: number;
    /**
     * **LIFTING** + **PUSH-UPS**: Whether one or two hands are going to be used.
     *
     * @type {number}
     */
    hands: 1 | 2; // You know there are weights that are for one hand and then there are those big weights that require both hands to be lifted cause' they are so long? Depending on what you're using, this specifies the "amount of hands" you're using (basically the total weight of what you're lifting will be multiplied by this)
    /* RUNNING */
    /**
     * **RUNNING**: The estimate speed the user will run to. **Actually, this number is the index of an array with different speed options**, which you can find on `CreateObjective.tsx` or `InfoIcons.tsx`.
     *
     * @type {number}
     */
    speed: number;
}

/**
 * Interface for an **Active Objective** (or simply an *objective*).
 *
 * @export
 * @interface Objective
 * @typedef {Objective}
 */
export interface Objective {
    /**
     * The unique identifier of the objective. **Must be 10 numeric-only characters. Exactly ten.**
     *
     * @type {number}
     */
    identifier: number;
    /**
     * An array of 7 booleans, being each boolean a day of the week. Starts at monday. Each `true` value is a day where that objective has to be done, and each `false` boolean is a day it doesn't have to be done.
     *
     * @type {[boolean, boolean, boolean, boolean, boolean, boolean, boolean]}
     */
    days: [boolean, boolean, boolean, boolean, boolean, boolean, boolean];
    /**
     * Duration, in seconds, of the session that's tied to the objective.
     *
     * @type {number}
     */
    duration: number;
    /**
     * The kind of sport that's tied to the objective.
     *
     * @type {(ActiveObjectiveSupportedExercises)}
     */
    exercise: ActiveObjectiveSupportedExercises;
    /**
     * The `extra` data of the objective.
     *
     * @type {extra}
     */
    extra: extra;
    /**
     * The amount of repetitions of the session that's tied to the objective.
     *
     * @type {number}
     */
    repetitions: number;
    /**
     * The duration of each rest.
     *
     * @type {number}
     */
    restDuration: number;
    /**
     * The amount of rests that's tied to the objective.
     *
     * @type {number}
     */
    rests: number;
}

/**
 * Active objectives without the identifier. This type is only used for the creation process.
 *
 * @export
 * @typedef {ObjectiveWithoutId}
 */
export type ObjectiveWithoutId = Omit<Objective, "identifier">;

/**
 * A registry of all the objectives, whether they're done or not, when, and their performance stats if they exist.
 *
 * @export
 * @interface ObjectiveDailyLog
 * @typedef {ObjectiveDailyLog}
 */
export interface ObjectiveDailyLog {
    [date: TodaysDay]: {
        [id: string | number]: {
            wasDone: boolean;
            performance: "undefined" | string | {
                result?: number;
                subject?: {
                    age: number;
                    gender: string;
                    weight: number;
                    height: number;
                    speed?: number;
                    time: number;
                    pushUps?: number;
                    hands?: number;
                };
                context?: string;
            };
        };
    };
}
