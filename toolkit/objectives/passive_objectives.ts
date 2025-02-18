/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2025 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/toolkit/objectives/passive_objectives.ts
 * Basically: Objectives are one of the most important parts of the app, and this toolkit contains all the base functions to interact with PASSIVE objectives.
 *
 * <=============================================================================>
 */

import { TFunction } from "i18next";
import {
    CreateObjective,
    DeleteObjective,
    GetAllObjectives,
    GetObjective,
} from "@/toolkit/objectives/common";
import {
    PassiveObjective,
    PassiveObjectiveWithoutId,
} from "@/types/passive_objectives";
import { logToConsole } from "@/toolkit/console";

/**
 * Creates a passive objective and saves it. You need to provide all the data for it (except the ID) as an `PassiveObjectiveWithoutId` object.
 *
 * @async
 * @param {PassiveObjectiveWithoutId} target A passive objective with everything EXCEPT it's ID. Identifier is generated by the own function.
 * @param {TFunction} t Pass here the translate function, please.
 * @returns {Promise<0 | 1>} 0 if success, 1 if failure.
 */
async function CreatePassiveObjective(
    target: PassiveObjectiveWithoutId,
    t: TFunction,
): Promise<0 | 1> {
    return await CreateObjective(target, "passive", t);
}

/**
 * Returns the objectives from AsyncStorage as an `PassiveObjective[]`, or `null` if there aren't any objectives.
 *
 * @async
 * @returns {Promise<PassiveObjective[] | null>} - Returns the objectives as an `Objective[]`.
 */
async function GetAllPassiveObjectives(): Promise<PassiveObjective[] | null> {
    return await GetAllObjectives("passive");
}

/**
 * Retrieves a single objective from AsyncStorage by its identifier.
 *
 * @async
 * @param {number} identifier - The unique identifier of the objective to retrieve.
 * @returns {Promise<PassiveObjective | null>} - Returns the objective if found, otherwise null.
 */
async function GetPassiveObjective(
    identifier: number,
): Promise<PassiveObjective | null> {
    return await GetObjective(identifier, "passive");
}

/**
 * Deletes a specific passive objective from the AsyncStorage, given it's identifier.
 *
 * @async
 * @param {number} identifier The identifier.
 * @returns {Promise<void>}
 */
async function DeletePassiveObjective(identifier: number): Promise<void> {
    await DeleteObjective(identifier, "passive");
}

async function MarkPassiveObjectiveAsDoneToday(
    identifier: number,
): Promise<void> {
    logToConsole(
        "Marked passive obj as done (placeholder lol, this is a TODO) " +
            identifier,
        "log",
    );
}

export {
    CreatePassiveObjective,
    DeletePassiveObjective,
    GetPassiveObjective,
    GetAllPassiveObjectives,
    MarkPassiveObjectiveAsDoneToday,
};
