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
type ActiveObjectiveInfo = {
    days: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
    duration: number;
    rests: number | null;
    repetitions: number | null;
} & (
        { rests: null; restDuration?: never } |
        { rests: number; restDuration: number }
    );

/**
 * Base interface used to construct an Active Objective interface.
 *
 * @interface ActiveObjectiveBase
 * @typedef {ActiveObjectiveBase}
 */
interface ActiveObjectiveBase {
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
}

/**
 * Specific objective data for Push Ups.
 *
 * @typedef {PushUpsSpecificData}
 */
type PushUpsSpecificData = {
    pushUps: number;
    amountOfHands: 1 | 2;
};

/**
 * Specific objective data for Running.
 *
 * @typedef {RunningSpecificData}
 */
type RunningSpecificData = {
    estimateSpeed: number;
    amountOfHands: 1 | 2;
};

/**
 * Specific objective data for Weight Lifting.
 *
 * @typedef {LiftingSpecificData}
 */
type LiftingSpecificData = {
    scaleWeight: number;
    barWeight: number;
    reps: number;
    dumbbells: number;
    amountOfHands: 1 | 2;
};

/**
 * A PersonaPlus Active Objective™
 *
 * @export
 * @typedef {ActiveObjective}
 */
export type ActiveObjective =
    | (ActiveObjectiveBase & { exercise: "Push Ups"; specificData: PushUpsSpecificData })
    | (ActiveObjectiveBase & { exercise: "Running"; specificData: RunningSpecificData })
    | (ActiveObjectiveBase & { exercise: "Lifting"; specificData: LiftingSpecificData })
    | (ActiveObjectiveBase & { exercise: "Walking"; specificData?: never }) // "Walking" does not have specific data tied to it. it's just walking bruh-
    | (ActiveObjectiveBase & { exercise: ""; }); // this is supposed to fix "" not being considered a valid value

export type ActiveObjectiveWithoutId = Omit<ActiveObjective, "identifier">;
