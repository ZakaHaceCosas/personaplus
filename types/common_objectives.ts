/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2025 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/types/common_objectives.ts
 * Basically: Type definitions that are common to both passive & active objectives.
 *
 * <=============================================================================>
 */

import { StringUtils } from "@zakahacecosas/string-utils";
import { TodaysDate, TodaysDateRegularExpression } from "./today";

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
            !StringUtils.validate(obj.identifier.toString()) ||
            obj.identifier.toString().length !== 10)
    )
        return false; // if no ID or invalid ID, invalid. can be skipped because you might be creating the objective still.
    if (
        !obj.createdAt ||
        typeof obj.createdAt !== "string" ||
        !StringUtils.validate(obj.createdAt) ||
        !TodaysDateRegularExpression.test(obj.createdAt)
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
