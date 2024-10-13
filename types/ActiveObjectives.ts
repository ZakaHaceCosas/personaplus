import { TodaysDay } from "@/toolkit/debug/Today";

/**
 * A type with all supported active objectives. **Tied to const `SupportedActiveObjectivesList`, note that in case of modifications.**
 *
 * @export
 * @typedef {SupportedActiveObjectives}
 */
export type SupportedActiveObjectives =
    | ""
    | "Push Ups"
    | "Lifting"
    | "Running"
    | "Walking";

export const SupportedActiveObjectivesList = [
    "Push Ups",
    "Lifting",
    "Running",
    "Walking",
];

/**
 * Info from an active objective, like what days should it be done, it's duration, etc...
 *
 * @typedef {ActiveObjectiveInfo}
 */
type ActiveObjectiveInfo = {
    days: [boolean, boolean, boolean, boolean, boolean, boolean, boolean];
    durationMinutes: number;
    rests: number | null;
    repetitions: number | null;
    restDurationMinutes: number;
};

/**
 * Specific objective data for exercises.
 *
 * @typedef {ActiveObjectiveSpecificData}
 */

interface ActiveObjectiveSpecificData {
    /**
     * LIFTING - Weight of each thingamabob that weights
     *
     * @type {number}
     */
    dumbbellWeight: number;
    /**
     * LIFTING - How many lifts
     *
     * @type {number}
     */
    reps: number;
    /**
     * GENERIC - Amount of hands - AKA amount of dumbbells for lifting - AKA amount of hands to be used when pushing up (<- this one is why it defaults to two).
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
    specificData: ActiveObjectiveSpecificData;
}

/**
 * An objective type but without the ID, so you can create it without type errors (as you're not supposed to provide the ID yourself, it's app-generated).
 *
 * @export
 * @typedef {ActiveObjectiveWithoutId}
 */
export type ActiveObjectiveWithoutId = Omit<ActiveObjective, "identifier">;

/**
 * A registry of all the objectives, whether they're done or not, when, and their performance stats if they exist.
 *
 * @rawR5code
 * @export
 * @typedef {ActiveObjectiveDailyLog}
 */
export type ActiveObjectiveDailyLog = {
    [date: TodaysDay]: {
        [identifier: number]: {
            wasDone: boolean;
            performance: object;
        };
    };
};
