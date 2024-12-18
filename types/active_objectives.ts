/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/types/active_objectives.ts
 * Basically: Type definitions for active objectives, live sessions, daily log, and all related stuff.
 *
 * <=============================================================================>
 */

import { CoreLibraryResponse } from "@/core/types/core_library_response";
import type { TodaysDate } from "@/types/today";
import { ExpoRouterParams } from "./glue_fix";

/**
 * A type with all supported active objectives. **Tied to const `SupportedActiveObjectivesList`, note that in case of modifications.**
 *
 * @export
 */
export type SupportedActiveObjectives =
    | ""
    | "Push Ups"
    | "Lifting"
    | "Running"
    | "Walking";
// | "Biking"; (coming soon)

/**
 * A list with all supported active objectives as a `string[]`.
 *
 * @type {string[]}
 */
export const SupportedActiveObjectivesList: string[] = [
    "Push Ups",
    "Lifting",
    "Running",
    "Walking",
    // "Biking",
];

/**
 * A tuple of booleans for the days of the week. Use within active objectives.
 *
 * @export
 */
export type WeekTuple = [
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
];

/**
 * Info from an active objective, like what days should it be done, it's duration, etc...
 */
type ActiveObjectiveInfo = {
    days: WeekTuple;
    durationMinutes: number;
    rests: number;
    restDurationMinutes: number;
};

/**
 * Specific objective data for exercises.
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
     * @deprecated Keep it only until the `exp_tracker` experiments is finished and rolled out.
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
 */
export interface ActiveObjective {
    /**
     * What exercise is the user supposed to do.
     *
     * @type {SupportedActiveObjectives}
     */
    exercise: SupportedActiveObjectives;
    /**
     * A unique, numeric, 10-character long, identifier.
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
 * Validates an ActiveObjective
 *
 * @export
 * @param {ActiveObjective} obj The objective (type `any`, just in case).
 * @param {?boolean} [omitIdentifier] If true, won't check for a valid ID.
 * @returns {boolean} TRUE if valid, FALSE otherwise.
 */
export function ValidateActiveObjective(
    obj: any,
    omitIdentifier?: boolean,
): obj is ActiveObjective {
    try {
        if (!obj || typeof obj !== "object") return false;
        if (!omitIdentifier && !obj.identifier) return false; // if no ID and no skip, invalid. can be skipped because you might be creating the objective yet
        if (!obj.info) return false; // no info, invalid
        const info = obj.info as ActiveObjectiveInfo; // (for vsc intellisense)
        if (!Array.isArray(info.days) || !info.days.includes(true))
            return false; // if all days are disabled, invalid
        if (
            typeof info.durationMinutes !== "number" ||
            info.durationMinutes <= 0
        )
            return false; // if eq or lower than 0, invalid
        if (typeof info.rests !== "number" || info.rests < 0) return false; // if not present, invalid. can be 0
        if (
            info.rests > 0 &&
            (typeof info.restDurationMinutes !== "number" ||
                info.restDurationMinutes <= 0)
        )
            return false; // if not present, or eq / lower than 0 WHILE HAVING rests, invalid
        if (!obj.specificData) return false;
        const specificData = obj.specificData as ActiveObjectiveSpecificData;
        const exercise = obj.exercise as SupportedActiveObjectives;

        let isSpecificDataValid = false;

        if (exercise === "Lifting") {
            isSpecificDataValid =
                (specificData?.dumbbellWeight || 0) > 0 &&
                [1, 2].includes(specificData?.amountOfHands || 0) &&
                (specificData?.reps || 0) > 0;
        } else if (exercise === "Push Ups") {
            isSpecificDataValid = specificData?.amountOfPushUps > 0;
        } else if (exercise === "Running" || exercise === "Walking") {
            isSpecificDataValid = true; // mo additional validation required
            // in reality i should validate the estimateSpeed thingy but i don't care about it, as soon as i get the tracker to work it's getting removed anyway
        } else if (exercise === "") {
            isSpecificDataValid = false; // :D
        }

        return isSpecificDataValid;
    } catch {
        return false; // :(
    }
}

/**
 * An objective type but without the ID, so you can create it without type errors (as you're not supposed to provide the ID yourself, it's app-generated).
 *
 * @export
 */
export type ActiveObjectiveWithoutId = Omit<ActiveObjective, "identifier">;

/**
 * An entry within the ActiveObjectiveDailyLog
 *
 * @interface ActiveObjectiveDailyLogEntry
 */
interface ActiveObjectiveDailyLogEntry {
    /**
     * Whether the objective was done or not.
     *
     * @type {boolean}
     */
    wasDone: boolean;
    /**
     * The metadata of the objective.
     *
     * @type {ActiveObjective}
     */
    objective: ActiveObjective;
    /**
     * The performance data for this session (as it's an ActiveObjective). A CoreLibrary standard response. `0` represents a null / empty value (usually when `wasDone` is false).
     *
     * @type {(CoreLibraryResponse | 0)}
     */
    performance: CoreLibraryResponse | 0;
}

/**
 * A registry of all the objectives, whether they're done or not, when, and their performance stats if they exist.
 *
 * @export
 */
export type ActiveObjectiveDailyLog = {
    [date: TodaysDate]: {
        [identifier: number]: ActiveObjectiveDailyLogEntry;
    };
};

/**
 * URL params for the live sessions page. Concretely, for passing data from `sessions.tsx` to `results.tsx`.
 *
 * @export
 * @interface SessionParams
 */
export interface SessionParams extends ExpoRouterParams {
    /**
     * Burnt calories.
     *
     * @type {number}
     */
    burntCalories: number;
    /**
     * Elapsed time, in seconds (IIRC).
     *
     * @type {number}
     */
    elapsedTime: number;
    /**
     * Active Objective ID.
     *
     * @type {number}
     */
    id: number;
}

/**
 * URL params for passing data to edit an objective. Keep in mind it uses `string` instead of the right types, use `RealEditObjectiveParams` for when you got the data.
 *
 * @export
 * @interface EditObjectiveParams
 * @extends {ExpoRouterParams}
 */
export interface EditObjectiveParams extends ExpoRouterParams {
    /**
     * @type {boolean}
     */
    edit: string;
    /**
     * @type {ActiveObjective}
     */
    objective: string;
}

/**
 * Glue fix for `EditObjectiveParams` with proper typing.
 *
 * @export
 * @interface RealEditObjectiveParams
 */
export interface RealEditObjectiveParams {
    edit: boolean;
    objective: ActiveObjective;
}
