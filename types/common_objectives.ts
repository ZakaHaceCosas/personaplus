/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/types/common_objectives.ts
 * Basically: Type definitions that are common to both passive & active objectives.
 *
 * <=============================================================================>
 */

import { StrUtils } from "../toolkit/glue_fix";
import { ActiveObjective } from "./active_objectives";
import { PassiveObjective } from "./passive_objectives";
import { TodaysDate, ValidateTodaysDateString } from "./today";

export interface GenericObjective {
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
 * Generic type guard that works for both active and passive objectives. Doesn't assert validness, but does some of the heavy lifting. Use at the beginning of active/passive obj. type guards.
 *
 * @export
 * @param {*} obj Anything.
 * @param {?boolean} [omitIdentifier] If true, won't check for a valid ID.
 * @returns {boolean} If true, the base is valid (it's not null and it follows the structure of an objective). You still need to do additional checks. *Returns `boolean` instead of `obj is GenericObjective` because of type-error stuff.*
 */
export function ValidateGenericObjective(
    obj: any,
    omitIdentifier: boolean = false,
): boolean {
    if (!obj || typeof obj !== "object") return false;
    if (
        !omitIdentifier &&
        (!obj.identifier ||
            typeof obj.identifier !== "number" ||
            !StrUtils.validate(obj.identifier.toString()) ||
            obj.identifier.toString().length !== 10)
    )
        return false; // if no ID or invalid ID, invalid. can be skipped because you might be creating the objective still.
    if (
        !obj.createdAt ||
        typeof obj.createdAt !== "string" ||
        !StrUtils.validate(obj.createdAt) ||
        !ValidateTodaysDateString(obj.createdAt)
    ) {
        return false;
    } // if no createdAt, invalid.

    return true;
}

/**
 * A registry of all the objectives, whether they're done or not, when, and their performance stats if they exist.
 *
 * @export
 */
export type GenericDailyLog<T> = {
    /**
     * Each entry uses the date as a key, and then each objective has its own entry.
     */
    [date: TodaysDate]: {
        /**
         * Each objective uses its ID as the key, then an entry of type `T` as the value.
         */
        [identifier: number]: T;
    };
};

/**
 * A daily log that may be both Active or Passive - it uses `unknown` to avoid type checking.
 *
 * @export
 */
export type UncheckedDailyLog = GenericDailyLog<unknown>;

/** Since only `ActiveObjective`s have the `exercise` key, this type guard checks for it, so TS knows what are you working with, instead of throwing type errors all the time. */
export function IsActiveObjective(
    obj: ActiveObjective | PassiveObjective,
): obj is ActiveObjective {
    if (
        (obj as ActiveObjective).exercise &&
        (obj as ActiveObjective).exercise !== null
    )
        return true;
    return false;
}

/** String indicating the status of a single objective. */
export type SingleObjectivePendingReturn = "done" | "pending" | "notDueToday";

/** Either an array of the IDs of pending objectives, or a self-descriptive status code. IDs should not be mixed up - either an active objective ID array or a passive objective one. */
export type AllObjectivesPendingReturn =
    | number[]
    | "allDone"
    | "noneDueToday"
    | "noneExists";
