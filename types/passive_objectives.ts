/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/types/passive_objectives.ts
 * Basically: Type definitions for passive objectives and all related stuff.
 *
 * <=============================================================================>
 */

import type { TodaysDate } from "@/types/today";
import { StringUtils } from "@zakahacecosas/string-utils";
import { TodaysDateRegularExpression } from "./today";

/**
 * A PersonaPlus Passive Objective™
 *
 * @export
 */
export interface PassiveObjective {
    /**
     * What passive objective is the user supposed to do.
     *
     * @type {string}
     */
    goal: string;
    /**
     * A unique, numeric, 10-character long, identifier.
     *
     * @type {number}
     */
    identifier: number;
    /**
     * Date of the creation of this objective.
     *
     * @type {TodaysDate}
     */
    createdAt: TodaysDate;
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
        if (!obj || typeof obj !== "object") return false;
        if (!omitIdentifier && !obj.identifier) return false; // if no ID and no skip, invalid. can be skipped because you might be creating the objective yet
        if (
            !obj.goal ||
            typeof obj.goal !== "string" ||
            !StringUtils.validate(obj.goal)
        )
            return false; // if no goal, or invalid value, invalid.
        if (
            !obj.createdAt ||
            typeof obj.createdAt !== "string" ||
            !StringUtils.validate(obj.createdAt) ||
            !TodaysDateRegularExpression.test(obj.createdAt)
        )
            return false; // if no creation date, or no valid value, invalid.
        if (
            !obj.identifier ||
            typeof obj.identifier !== "number" ||
            !StringUtils.validate(obj.identifier.toString()) ||
            obj.identifier.toString().length !== 10
        )
            return false; // if no ID or invalid ID, invalid.

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
export type PassiveObjectiveDailyLog = {
    /**
     * Each entry uses the date as a key, and then each objective has it's own entry.
     */
    [date: TodaysDate]: {
        /**
         * Each objective uses it's ID as the key, then an `PassiveObjectiveDailyLogEntry` as the value.
         */
        [identifier: number]: PassiveObjectiveDailyLogEntry;
    };
};
