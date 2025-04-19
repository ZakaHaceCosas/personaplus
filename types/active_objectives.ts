/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/types/active_objectives.ts
 * Basically: Type definitions for active objectives, live sessions, daily log, and all related stuff.
 *
 * <=============================================================================>
 */

import { CoreLibraryResponse } from "@/core/types/core_library_response";
import { ExpoRouterParams } from "../toolkit/glue_fix";
import {
    GenericDailyLog,
    GenericObjective,
    ValidateGenericObjective,
} from "./common_objectives";

/**
 * A type with all supported active objectives. **Tied to const `SupportedActiveObjectivesList`, note that in case of modifications.**
 *
 * @export
 */
export type SupportedActiveObjectives = "" | "Push Ups" | "Lifting" | "Running";
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
    // "Biking",
];

/**
 * A tuple of booleans for the days of the week. Use within active objectives.
 *
 * @export
 */
export type WeekTuple = {
    MO: boolean;
    TU: boolean;
    WE: boolean;
    TH: boolean;
    FR: boolean;
    SA: boolean;
    SU: boolean;
};

/**
 * Info from an active objective, like what days should it be done, it's duration, etc...
 */
type ActiveObjectiveInfo = {
    /**
     * What days of the week is this objective scheduled for.
     *
     * @type {WeekTuple}
     */
    days: WeekTuple;
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
export interface ActiveObjective extends GenericObjective {
    /**
     * What exercise is the user supposed to do.
     *
     * @type {SupportedActiveObjectives}
     */
    exercise: SupportedActiveObjectives;
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
        if (!ValidateGenericObjective(obj, omitIdentifier)) return false;
        if (!obj.info) return false; // no info, invalid
        const info = obj.info as ActiveObjectiveInfo; // (for vsc intellisense)
        if (
            !Array.isArray(Object.values(info.days)) ||
            !Object.values(info.days).includes(true) ||
            Object.keys(info.days).length !== 7
        ) {
            return false; // if all days are disabled, invalid
        }
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
        } else if (exercise === "Running") {
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
 * @export
 * @interface ActiveObjectiveDailyLogEntry
 */
export interface ActiveObjectiveDailyLogEntry {
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
export type ActiveObjectiveDailyLog =
    GenericDailyLog<ActiveObjectiveDailyLogEntry>;

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
    /**
     * If true, the current action for the create page it's an edit. If false, it's a creation.
     *
     * @type {boolean}
     */
    edit: boolean;
    /**
     * In case of editing, the objective to edit.
     *
     * @type {ActiveObjective}
     */
    objective: ActiveObjective;
}
