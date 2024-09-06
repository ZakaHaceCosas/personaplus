import { TodaysDay } from "@/toolkit/debug/Today";

/**
 * A type with all supported active objectives. **Tied to const `SupportedActiveObjectivesList`, note that in case of modifications.**
 *
 * @export
 * @typedef {SupportedActiveObjectives}
 */
export type SupportedActiveObjectives = "" | "Push Ups" | "Lifting" | "Running" | "Walking";

export const SupportedActiveObjectivesList = ["Push Ups", "Lifting", "Running", "Walking"]

/**
 * Info from an active objective, like what days should it be done, it's duration, etc...
 *
 * @typedef {ActiveObjectiveInfo}
 */
/* type ActiveObjectiveInfo = {
    days: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
    duration: number;
    rests: number | null;
    repetitions: number | null;
} & (
        { rests: 0; restDuration?: never } |
        { rests: number; restDuration: number }
    ); */
type ActiveObjectiveInfo = {
    days: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
    duration: number;
    rests: number | null;
    repetitions: number | null;
    restDuration: number
}

/**
 * Specific objective data for exercises.
 *
 * @typedef {ActiveObjectiveSpecificData}
 */

interface ActiveObjectiveSpecificData {
    /**
     * LIFTING - Weight of each ball / thingamabomb that weight
     *
     * @type {number}
     */
    scaleWeight: number;
    /**
     * LIFTING - Weight of the bar
     *
     * @type {number}
     */
    barWeight: number;
    /**
     * LIFTING - How many lifts
     *
     * @type {number}
     */
    reps: number;
    /**
     * LIFTING - Amount of dumbbells
     *
     * @type {number}
     */
    dumbbells: number;
    /**
     * GENERIC - Amount of hands
     *
     * @type {(1 | 2)}
     */
    amountOfHands: 1 | 2;
    /**
     * RUNNING - Speed (value equals the INDEX in the speed array, not the actual speed!)
     *
     * @type {number}
     */
    estimateSpeed: number;
    /**
     * PUSH UPS - Amount of push ups
     *
     * @type {number}
     */
    amountOfPushUps: number;
}

/**
 * A PersonaPlus Active Objective™
 *
 * @export
 * @typedef {ActiveObjective}
 */
export interface ActiveObjective {
    /**
     * What exercise is the user supposed to do.
     *
     * @type {SupportedActiveObjectives}
     */
    exercise: SupportedActiveObjectives;
    /**
     * A unique, numeric, 5-character long, identifier.
     *
     * @type {number}
     */
    identifier: number;
    /**
     * Global info about the objective, such as it's duration.
     *
     * @type {ActiveObjectiveInfo}
     */
    info: ActiveObjectiveInfo;
    /**
     * Exercise-specific data for the objective.
     *
     * @type {ActiveObjectiveSpecificData}
     */
    specificData: ActiveObjectiveSpecificData
}

/**
 * An objective type but without the ID, so you can create it without type errors (as you're not supposed to provide the ID yourself, it's app-generated).
 *
 * @export
 * @typedef {ActiveObjectiveWithoutId}
 */
export type ActiveObjectiveWithoutId = Omit<ActiveObjective, "identifier">;


/**
 * **Deprecated. TODO! Update this to comply with the R6 codebase.** A registry of all the objectives, whether they're done or not, when, and their performance stats if they exist.
 *
 * @deprecated
 * @export
 * @interface ActiveObjectiveDailyLog
 * @typedef {ActiveObjectiveDailyLog}
 */
export interface ActiveObjectiveDailyLog {
    [date: TodaysDay]: {
        [id: number]: {
            wasDone: boolean;
            performance: "undefined" | string | {
                result?: number;
                subject?: {
                    age: number;
                    gender: string;
                    weight: number;
                    height: number;
                    speed?: number;
                    pushUps?: number;
                    hands?: number;
                };
                context?: string;
            };
        };
    };
}
