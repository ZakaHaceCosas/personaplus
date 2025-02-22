/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2025 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/toolkit/objectives/active_objectives.ts
 * Basically: Objectives are one of the most important parts of the app, and this toolkit contains all the base functions to interact with ACTIVE objectives.
 *
 * <=============================================================================>
 */

import {
    ActiveObjective,
    ActiveObjectiveDailyLog,
    ActiveObjectiveDailyLogEntry,
    ActiveObjectiveWithoutId,
    SupportedActiveObjectives,
} from "@/types/active_objectives";
import { logToConsole } from "@/toolkit/console";
import AsyncStorage from "expo-sqlite/kv-store";
import { ADJUSTED_TODAY_INDEX, GetCurrentDateCorrectly } from "@/toolkit/today";
import type { TodaysDate } from "@/types/today";
import StoredItemNames from "@/constants/stored_item_names";
import { Routes } from "@/constants/routes";
import { router } from "expo-router";
import { GetExperiments } from "@/toolkit/experiments";
import CoreLibrary from "@/core/core";
import { CoreLibraryResponse } from "@/core/types/core_library_response";
import { BasicUserHealthData } from "@/types/user";
import { ShowToast } from "../android";
import { TFunction } from "i18next";
import {
    CreateObjective,
    DeleteObjective,
    FailGenericObjectivesNotDoneYesterday,
    GetAllObjectives,
    GetGenericObjectiveDailyLog,
    GetObjective,
    SaveGenericObjectiveDailyLog,
} from "./common";

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
 * Returns the ActiveObjectiveDailyLog.
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
    objective: ActiveObjective,
    performance?: CoreLibraryResponse,
): Promise<void> {
    try {
        // Fetch old data
        const dailyData: ActiveObjectiveDailyLog =
            await GetActiveObjectiveDailyLog();
        const today: TodaysDate = GetCurrentDateCorrectly().string;

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
        logToConsole(
            `Success! Session ${id} data saved for ${today}.`,
            "success",
        );
    } catch (e) {
        const message: string = id
            ? `Error saving user's performance for objective ${id}: ${e}`
            : `Error saving user's performance (no objective ID): ${e}`;
        logToConsole(message, "error");
        throw new Error(message);
    }
}

/**
 * Checks if an objective was already done today or needs to be done.
 *
 * @async
 * @param {ActiveObjective} objective The objective.
 * @returns {Promise<boolean>} Returns **true** if the objective IS NOT done and NEEDS TO BE DONE. Returns **false** if otherwise (DOES NOT NEED to be done today).
 */
async function IsActiveObjectivePending(
    objective: ActiveObjective,
): Promise<boolean> {
    try {
        const { identifier } = objective;

        const dailyLog: ActiveObjectiveDailyLog =
            await GetActiveObjectiveDailyLog();

        if (objective.info.days[ADJUSTED_TODAY_INDEX] === false) return false; // not due today

        if (Object.keys(dailyLog).length === 0) {
            return false; // log does not exist, so the objective isn't done today.
        }

        const date: TodaysDate = GetCurrentDateCorrectly().string;

        // Validate if dailyLog and the specific identifier exist
        if (dailyLog[date] && dailyLog[date][identifier]) {
            const entry: ActiveObjectiveDailyLogEntry =
                dailyLog[date][identifier];
            if (typeof entry.wasDone === "boolean") {
                return entry.wasDone;
            } else {
                logToConsole(
                    `Error: Invalid 'wasDone' value for objective ${identifier} on date ${date}`,
                    "error",
                );
                throw new Error(
                    `Invalid 'wasDone' value for objective ${identifier} on date ${date}`,
                );
            }
        } else {
            return false; // no interaction with the objective means no data logged.
        }
    } catch (e) {
        throw new Error(
            `Error checking if the ${objective.identifier} active objective is due today: ${e}`,
        );
    }
}

/**
 * Tells you if the user has any active objective due today or not. If he does, returns all of them, as an `number[]` being each number the ID of each active objective.
 *
 * @async
 * @returns {Promise<number[] | 0 | false | null>} Read carefully: `null` if there are no objectives at all, `false` if there are, but none is due today, and `0` if there are for today user took care of all of them), and a `number[]` if there's any active objective due today, being each number an active objective identifier.
 */
async function GetAllPendingObjectives(): Promise<number[] | 0 | false | null> {
    try {
        const objectives: ActiveObjective[] | null =
            await GetAllObjectives("active");
        if (objectives === null || Object.keys(objectives).length === 0) {
            return null; // no objectives at all
        }

        // there are only two hard things in computer science, cache invalidation and naming things
        type safeThing = {
            identifier: number;
            status: boolean;
        };
        type thing = safeThing | null;
        type whatever = thing[];
        // okay i think i finally know what's going on in here, for each
        const dueTodayObjectives: whatever = await Promise.all(
            Object.values(objectives).map(async function (
                obj: ActiveObjective,
            ): Promise<thing> {
                if (obj.info.days[ADJUSTED_TODAY_INDEX]) {
                    const status: boolean = await IsActiveObjectivePending(obj);
                    return { identifier: obj.identifier, status };
                }
                return null; // not due today
            }),
        );

        // filter out null entries and separate the dueToday objectives based on their status
        const activeObjectivesDueToday = dueTodayObjectives.filter(
            (obj: thing): boolean => obj !== null,
        ) as safeThing[];

        if (activeObjectivesDueToday.length === 0) {
            return false; // there are objectives, but none are due today
        }

        // okay i don't get whats going on in here
        // hope this works
        // check if all objectives due today are done
        const allDone: boolean = activeObjectivesDueToday.every(
            (obj: safeThing): boolean => obj.status,
        );

        if (allDone) return 0; // all objectives for today are done

        // get the identifiers of objectives that are not done yet
        const pendingObjectives: number[] = activeObjectivesDueToday
            // no i did not write this
            .filter((obj: safeThing): boolean => obj.status === false)
            .map((obj: safeThing): number => obj.identifier);

        return pendingObjectives.length > 0 ? pendingObjectives : 0; // return pending objectives or 0 if none
    } catch (e) {
        throw new Error(`Failed to get all pending objectives: ${e}`);
    }
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
 * @returns {Promise<0 | 1>} 0 if success, 1 if failure.
 */
async function CreateActiveObjective(
    target: ActiveObjectiveWithoutId,
    t: TFunction,
): Promise<0 | 1> {
    return await CreateObjective(target, "active", t);
}

/**
 * Edits an Active Objective, overwriting it's data.
 *
 * @async
 * @param {ActiveObjectiveWithoutId} obj Data WITHOUT ID of the new objective (what content you'll use for overwriting).
 * @param {number} id ID of the objective to overwrite.
 * @param {TFunction} t Pass here the translate function, please.
 * @returns {Promise<0 | 1>} 0 if success, 1 if failure.
 */
async function EditActiveObjective(
    obj: ActiveObjectiveWithoutId,
    id: number,
    t: TFunction,
): Promise<0 | 1> {
    try {
        const oldObj: ActiveObjective | null = await GetObjective(id, "active");

        if (!oldObj) throw new Error(`No active objective with ID ${id}`);

        const newObjective: ActiveObjective = {
            ...oldObj, // 1st go the oldies
            ...obj, // 2nd go the overrides
            identifier: id, // 3rd goes the ID override
        };

        let objs: ActiveObjective[] | null = await GetAllObjectives("active");
        if (!objs || objs.length === 0) {
            objs = [];
        }

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
            logToConsole(
                `Created ${newObjective.identifier} objective with ID ${newObjective.exercise} successfully! Full JSON of the created objective:\n${JSON.stringify(
                    newObjective,
                )}"`,
                "success",
                undefined,
                false,
            );
            return 0;
        } catch (e) {
            throw new Error(`Failed to save objectives! ${e}`);
        }
    } catch (e) {
        logToConsole(
            `Something went wrong editing ${id}.\n\nError: ${e}`,
            "error",
        );
        ShowToast("Error :c");
        return 1;
    }
}

/**
 * Calculates the duration of each fragment of a session. Let me explain: Sessions support rests, which - as the name implies - are pauses of a fixed duration between a session, for the user to rest.
 *
 * While the duration of a rest is specified by the user, it's position is not, instead PersonaPlus will (thanks to this function) distribute evenly each rest between all the duration of the session. This implies splitting the session's duration into **fragments**, separated by rests.
 *
 * @param {number | null} duration The duration (in seconds) of the whole session.
 * @param {number | null} rests The amount of rests of the session.
 * @returns {number} A number, the amount of seconds each fragment shall last. If any of the params is null / invalid, throws an error.
 */
function CalculateSessionFragmentsDuration(
    duration: number,
    rests: number,
): number {
    if (rests === 0) return 0;
    if (!rests || !duration) {
        logToConsole(
            "Some parameters are missing, can't calculate fragment duration. Objective is not getting fetched correctly? Check your code",
            "error",
        );
        return 0;
    }
    if (rests < 0) {
        logToConsole("Negative rests? Seriously? Check your code", "error");
        throw new Error("Negative rests? Seriously? Check your code"); // heh~
    }
    return duration / (rests + 1);
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
        const [obj, experiments] = await Promise.all([
            GetObjective(identifier, "active"),
            GetExperiments(),
        ]);

        if (!obj) {
            logToConsole(
                `Can't launch active objective ${identifier}: it does not exist.`,
                "error",
            );
            return;
        }

        const track: boolean = experiments.exp_tracker;

        if (obj.exercise === "Running" && track) {
            router.replace({
                pathname: Routes.EXPERIMENTS.TRACKER,
                params: { id: identifier },
            });
            return;
        }

        router.replace({
            pathname: Routes.OBJECTIVES.SESSION,
            params: { id: identifier },
        });

        // TODO - at some point, merge the tracker with the standard session experience
        /*
         router.replace({
            pathname: Routes.OBJECTIVES.SESSION,
            params: { id: identifier, tracker: track ? "yeah" : "nah" },
        });
        */
        return;
    } catch (e) {
        logToConsole(`Error launching objective ${identifier}: ${e}`, "error");
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
        const exercise: SupportedActiveObjectives = objective.exercise;

        switch (exercise) {
            case "Walking":
            case "Running":
                return CoreLibrary.performance.RunningPerformance.calculate(
                    userData.weight,
                    objective.specificData.estimateSpeed,
                    elapsedTime,
                );
            case "Lifting":
                return CoreLibrary.performance.LiftingPerformance.calculate(
                    userData.age,
                    userData.gender,
                    userData.weight,
                    objective.specificData.dumbbellWeight,
                    objective.specificData.amountOfHands,
                    elapsedTime,
                    objective.specificData.reps,
                );
            case "Push Ups":
                return CoreLibrary.performance.PushingUpPerformance.calculate(
                    userData.gender,
                    userData.weight,
                    elapsedTime,
                    objective.specificData.amountOfPushUps,
                    objective.specificData.amountOfHands,
                );
            default:
                throw new Error(
                    `Unknown or invalid exercise type: ${exercise}`,
                );
        }
    } catch (e) {
        const err = `Error handling post-session calculations: ${e}`;
        logToConsole(err, "error", {
            location:
                "USE: @/app/(tabs)/objectives/Sessions.tsx; FUNC: @/toolkit/objectives/ActiveObjectives.ts",
            function: "FinishSession()",
            isHandler: true,
            handlerName: "Toolkified CalculateSessionPerformance()",
        });
        throw new Error(err);
    }
}

/**
 * Gets all objectives, finds the ones that you had to do yesterday (and previous days), and if they weren't done, it adds them as not done to the daily log.
 *
 * @async
 * @returns {Promise<void>}
 */
async function FailObjectivesNotDoneYesterday(): Promise<void> {
    await FailGenericObjectivesNotDoneYesterday("active");
}

export {
    CalculateSessionFragmentsDuration,
    CalculateSessionPerformance,
    IsActiveObjectivePending,
    CreateActiveObjective,
    DeleteActiveObjective,
    EditActiveObjective,
    FailObjectivesNotDoneYesterday,
    GetActiveObjective,
    GetActiveObjectiveDailyLog,
    GetAllActiveObjectives,
    GetAllPendingObjectives,
    LaunchActiveObjective,
    SaveActiveObjectiveToDailyLog,
};
