/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2025 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/types/passive_objectives.ts
 * Basically: Type definitions for passive objectives and all related stuff.
 *
 * <=============================================================================>
 */

import { StringUtils } from "@zakahacecosas/string-utils";
import {
    GenericDailyLog,
    GenericObjective,
    ValidateGenericObjective,
} from "./common_objectives";

/**
 * A PersonaPlus Passive Objective™
 *
 * @export
 */
export interface PassiveObjective extends GenericObjective {
    /**
     * What passive objective is the user supposed to do.
     *
     * @type {string}
     */
    goal: string;
}

/**
 * Validates a PassiveObjective
 *
 * @export
 * @param {PassiveObjective} obj The objective (type `any`, just in case).
 * @param {?boolean} [omitIdentifier] If true, won't check for a valid ID.
 * @returns {boolean} TRUE if valid, FALSE otherwise.
 */
export function ValidatePassiveObjective(
    obj: any,
    omitIdentifier?: boolean,
): obj is PassiveObjective {
    try {
        if (!ValidateGenericObjective(obj, omitIdentifier)) return false;
        if (
            !obj.goal ||
            typeof obj.goal !== "string" ||
            !StringUtils.validate(obj.goal) ||
            obj.goal.length < 3 ||
            obj.goal.length < 120
        )
            return false; // if no goal, or invalid value, invalid.

        return true;
    } catch {
        return false; // :(
    }
}

/**
 * An objective type but without the ID, so you can create it without type errors (as you're not supposed to provide the ID yourself, it's app-generated).
 *
 * @export
 */
export type PassiveObjectiveWithoutId = Omit<PassiveObjective, "identifier">;

/**
 * An entry within the PassiveObjectiveDailyLog
 *
 * @export
 * @interface PassiveObjectiveDailyLogEntry
 */
export interface PassiveObjectiveDailyLogEntry {
    /**
     * Whether the objective was done or not.
     *
     * @type {boolean}
     */
    wasDone: boolean;
    /**
     * The metadata of the objective.
     *
     * @type {PassiveObjective}
     */
    objective: PassiveObjective;
}

/**
 * A registry of all the passive objectives, whether they're done or not and when.
 *
 * @export
 */
export type PassiveObjectiveDailyLog =
    GenericDailyLog<PassiveObjectiveDailyLogEntry>;
