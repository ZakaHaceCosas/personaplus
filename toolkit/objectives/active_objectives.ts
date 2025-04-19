/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/toolkit/objectives/active_objectives.ts
 * Basically: Objectives are one of the most important parts of the app, and this toolkit contains all the base functions to interact with ACTIVE objectives.
 *
 * <=============================================================================>
 */

import type {
    ActiveObjective,
    ActiveObjectiveDailyLog,
    ActiveObjectiveWithoutId,
} from "@/types/active_objectives";
import AsyncStorage from "expo-sqlite/kv-store";
import { GetCurrentDateCorrectly } from "@/toolkit/today";
import type { TodaysDate } from "@/types/today";
import StoredItemNames from "@/constants/stored_item_names";
import { Routes } from "@/constants/routes";
import { router } from "expo-router";
import CoreLibrary from "@/core/core";
import type { CoreLibraryResponse } from "@/core/types/core_library_response";
import type { BasicUserHealthData } from "@/types/user";
import { ShowToast } from "../android";
import type { TFunction } from "i18next";
import {
    CreateObjective,
    DeleteObjective,
    GetAllObjectives,
    GetGenericObjectiveDailyLog,
    GetObjective,
    GetPendingGenericObjectives,
    SaveGenericObjectiveDailyLog,
} from "./common";
import type { AllObjectivesPendingReturn } from "@/types/common_objectives";

/**
 * Returns the objectives from AsyncStorage as an `ActiveObjective[]`, or `null` if there aren't any objectives.
 *
 * @async
 * @returns {Promise<ActiveObjective[] | null>} - Returns the objectives as an `Objective[]`.
 */
async function GetAllActiveObjectives(): Promise<ActiveObjective[] | null> {
    return await GetAllObjectives("active");
}

/**
 * Returns the user's `ActiveObjectiveDailyLog`.
 *
 * @returns {ActiveObjectiveDailyLog} The entire daily log, or an empty object if it doesn't exist.
 */
async function GetActiveObjectiveDailyLog(): Promise<ActiveObjectiveDailyLog> {
    return await GetGenericObjectiveDailyLog("active");
}

/**
 * Saves the results of an objective to a daily registry.
 *
 * @async
 * @param {number} id ID of the objective
 * @param {boolean} wasDone Whether the objective was done or not.
 * @param {?CoreLibraryResponse} [performance] Results for the session from CoreLibrary. Optional (the user could have not done the objective, so no data would exist).
 * @returns {Promise<void>}
 */
async function SaveActiveObjectiveToDailyLog(
    id: number,
    wasDone: boolean,
    performance?: CoreLibraryResponse,
): Promise<void> {
    try {
        // Fetch old data
        const dailyData: ActiveObjectiveDailyLog =
            await GetActiveObjectiveDailyLog();
        const today: TodaysDate = GetCurrentDateCorrectly().string;
        const objective: ActiveObjective | null = await GetActiveObjective(id);

        if (!objective) throw new Error(`${id} is a wrong identifier.`);

        // If there's no old data for today, creates an {} for today
        if (!dailyData[today]) {
            dailyData[today] = {};
        }

        // Saves the objective data
        dailyData[today][id] = {
            wasDone: wasDone,
            objective: objective,
            performance: performance ?? 0,
        };

        // Updates data and puts it back to AsyncStorage
        await SaveGenericObjectiveDailyLog(dailyData, "active");
        console.log(
            `Success! Session ${id} data saved for ${today}.`,
            "success",
        );
    } catch (e) {
        throw new Error(
            `Error saving user's performance for objective ${id}: ${e}`,
        );
    }
}

/**
 * Tells you if the user has any active objective due today or not. If he does, returns all of them, as an `number[]` being each number the ID of each active objective.
 *
 * @async
 * @returns {Promise<AllObjectivesPendingReturn>} Either an array with pending objective identifiers _only_ or a text-based code indicating context.
 */
async function GetPendingActiveObjectives(): Promise<AllObjectivesPendingReturn> {
    return await GetPendingGenericObjectives("active");
}

/**
 * Retrieves a single objective from AsyncStorage by its identifier.
 *
 * @async
 * @param {number} identifier - The unique identifier of the objective to retrieve.
 * @returns {Promise<ActiveObjective | null>} - Returns the objective if found, otherwise null.
 */
async function GetActiveObjective(
    identifier: number,
): Promise<ActiveObjective | null> {
    return await GetObjective(identifier, "active");
}

/**
 * Creates an objective and saves it. You need to provide all the data for it (except the ID) as an `ActiveObjectiveWithoutId` object.
 *
 * @async
 * @param {ActiveObjectiveWithoutId} target An active objective with everything EXCEPT it's ID. Identifier is generated by the own function.
 * @param {TFunction} t Pass here the translate function, please.
 * @returns {Promise<void>} 0 if success, 1 if failure.
 */
async function CreateActiveObjective(
    target: ActiveObjectiveWithoutId,
    t: TFunction,
): Promise<void> {
    return await CreateObjective(target, "active", t);
}

/**
 * Edits an Active Objective, overwriting it's data.
 *
 * @async
 * @param {ActiveObjectiveWithoutId} obj Data WITHOUT ID of the new objective (what content you'll use for overwriting).
 * @param {number} id ID of the objective to overwrite.
 * @param {TFunction} t Pass here the translate function, please.
 * @returns {Promise<void>} 0 if success, 1 if failure.
 */
async function EditActiveObjective(
    obj: ActiveObjectiveWithoutId,
    id: number,
    t: TFunction,
): Promise<void> {
    try {
        const oldObj: ActiveObjective | null = await GetObjective(id, "active");

        if (!oldObj) throw new Error(`No active objective with ID ${id}`);

        const newObjective: ActiveObjective = {
            ...oldObj, // 1st go the oldies
            ...obj, // 2nd go the overrides
            identifier: id, // 3rd goes the ID override
        };

        let objs: ActiveObjective[] | null = await GetAllObjectives("active");
        if (!objs || objs.length === 0) objs = [];

        const index: number = objs.findIndex(
            (o: ActiveObjective): boolean => o.identifier === id,
        );

        if (index !== -1) {
            // overwrite
            objs[index] = newObjective;
        } else {
            // this shouldn't happen
            throw new Error(
                `Objective with ID ${id} not found in the objectives list!`,
            );
        }

        try {
            await AsyncStorage.setItem(
                StoredItemNames.activeObjectives,
                JSON.stringify(objs),
            );
            ShowToast(
                t("pages.createActiveObjective.doneFeedback", {
                    obj: t(
                        `globals.supportedActiveObjectives.${newObjective.exercise}.name`,
                    ),
                }),
            );
            console.log(
                `Edited ${newObjective.exercise} objective with ID ${newObjective.identifier} successfully!\nFull JSON of the new objective:\n${JSON.stringify(
                    newObjective,
                )}"`,
            );
        } catch (e) {
            throw new Error(`Failed to save objectives! ${e}`);
        }
    } catch (e) {
        ShowToast("Error :c");
        throw new Error(
            `Something went wrong editing active objective ${id}.\n\nError: ${e}`,
        );
    }
}

/**
 * Deletes a specific active objective from the AsyncStorage, given it's identifier.
 *
 * @async
 * @param {number} identifier The identifier.
 * @returns {Promise<void>}
 */
async function DeleteActiveObjective(identifier: number): Promise<void> {
    await DeleteObjective(identifier, "active");
}

/**
 * Launches an Active Objective live session.
 *
 * @async
 * @param {number} identifier The identifier.
 * @returns {Promise<void>}
 */
async function LaunchActiveObjective(identifier: number): Promise<void> {
    try {
        const obj = await GetObjective(identifier, "active");

        if (!obj) {
            console.error(
                `Can't launch active objective ${identifier}: it does not exist.`,
            );
            return;
        }

        router.replace({
            pathname: Routes.OBJECTIVES.SESSION,
            params: { id: identifier },
        });

        return;
    } catch (e) {
        throw new Error(`Error launching objective ${identifier}: ${e}`);
    }
}

/**
 * Calculates the performance of a live sessions using CoreLibrary.
 *
 * @param {ActiveObjective} objective The active objective.
 * @param {BasicUserHealthData} userData The user's health data.
 * @param {number} elapsedTime The elapsed time of the session, in minutes.
 * @returns {CoreLibraryResponse}
 */
function CalculateSessionPerformance(
    objective: ActiveObjective,
    userData: BasicUserHealthData,
    elapsedTime: number,
): CoreLibraryResponse {
    try {
        if (objective.exercise === "Running")
            return CoreLibrary.performance.RunningPerformance.calculate(
                userData.weight,
                objective.specificData.estimateSpeed,
                elapsedTime,
            );
        if (objective.exercise === "Lifting")
            return CoreLibrary.performance.LiftingPerformance.calculate(
                userData.age,
                userData.gender,
                userData.weight,
                objective.specificData.dumbbellWeight,
                objective.specificData.amountOfHands,
                elapsedTime,
                objective.specificData.reps,
            );
        if (objective.exercise === "Push Ups")
            return CoreLibrary.performance.PushingUpPerformance.calculate(
                userData.gender,
                userData.weight,
                elapsedTime,
                objective.specificData.amountOfPushUps,
                objective.specificData.amountOfHands,
            );
        throw "Invalid exercise type"; // we should never get here, however TS wants me to add this
    } catch (e) {
        throw new Error(
            `Error handling post-session calculations: ${e}\n${{
                location:
                    "USE: @/app/(tabs)/objectives/Sessions.tsx; FUNC: @/toolkit/objectives/ActiveObjectives.ts",
                function: "FinishSession()",
                isHandler: true,
                handlerName: "Toolkified CalculateSessionPerformance()",
            }}`,
        );
    }
}

const DEFAULT_ACTIVE_OBJECTIVE: ActiveObjectiveWithoutId = {
    exercise: "",
    createdAt: GetCurrentDateCorrectly().string,
    info: {
        days: {
            MO: false,
            TU: false,
            WE: false,
            TH: false,
            FR: false,
            SA: false,
            SU: false,
        },
    },
    specificData: {
        dumbbellWeight: 0,
        reps: 0,
        amountOfHands: 2,
        amountOfPushUps: 0,
        estimateSpeed: 0,
    },
};

// function exports
export {
    CalculateSessionPerformance,
    CreateActiveObjective,
    DeleteActiveObjective,
    EditActiveObjective,
    GetActiveObjective,
    GetActiveObjectiveDailyLog,
    GetAllActiveObjectives,
    GetPendingActiveObjectives,
    LaunchActiveObjective,
    SaveActiveObjectiveToDailyLog,
};

// const exports
export { DEFAULT_ACTIVE_OBJECTIVE };
