/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/toolkit/objectives/common.ts
 * Basically: Common features to active and passive objectives.
 *
 * <=============================================================================>
 */

import StoredItemNames from "@/constants/stored_item_names";
import {
    ActiveObjective,
    ActiveObjectiveDailyLog,
    ActiveObjectiveWithoutId,
    EditObjectiveParams,
    RealEditObjectiveParams,
    ValidateActiveObjective,
    WeekTuple,
} from "@/types/active_objectives";
import {
    PassiveObjective,
    PassiveObjectiveDailyLog,
    PassiveObjectiveWithoutId,
    ValidatePassiveObjective,
} from "@/types/passive_objectives";
import AsyncStorage from "expo-sqlite/kv-store";
import { TFunction } from "i18next";
import { ShowToast } from "../android";
import {
    IsActiveObjective,
    AllObjectivesPendingReturn,
    UncheckedDailyLog,
    SingleObjectivePendingReturn,
} from "@/types/common_objectives";
import {
    ADJUSTED_TODAY_INDEX,
    AlterDate,
    GetCurrentDateCorrectly,
    JavaScriptifyTodaysDate,
    StringifyDate,
    TODAY_CODE_ARRAY,
    TurnJavaScriptDateIntoCurrentDate,
} from "../today";
import {
    CorrectCurrentDate,
    TodaysDate,
    ValidateTodaysDateString,
} from "@/types/today";
import { StrUtils } from "../glue_fix";

/**
 * Returns all objectives from AsyncStorage as an `ActiveObjective[]` or a `PassiveObjective[]` (depending on chosen category), or `null` if there aren't any objectives.
 *
 * @async
 * @param {"active" | "passive"} category Category to retrieve.
 * @returns {Promise<ActiveObjective[] | PassiveObjective[] | null>} - Returns the objectives as an `ActiveObjective[] | PassiveObjective[]`.
 */
async function GetAllObjectives(
    category: "passive",
): Promise<PassiveObjective[] | null>;
async function GetAllObjectives(
    category: "active",
): Promise<ActiveObjective[] | null>;
async function GetAllObjectives(
    category: "active" | "passive",
): Promise<ActiveObjective[] | PassiveObjective[] | null> {
    try {
        const storedObjectives: string | null = await AsyncStorage.getItem(
            category === "active"
                ? StoredItemNames.activeObjectives
                : StoredItemNames.passiveObjectives,
        );

        if (!storedObjectives || storedObjectives.trim() === "") return null;

        const objectives = JSON.parse(storedObjectives);

        if (!Array.isArray(objectives)) return null;

        if (objectives.length === 0) return null;

        return objectives;
    } catch (e) {
        console.error(`Failed to get objectives: ${e}`, {
            location: "@/toolkit/objectives/common.ts",
            isHandler: false,
            function: "GetAllObjectives()",
        });
        return null;
    }
}

/**
 * Retrieves a single objective from AsyncStorage by its identifier.
 *
 * @async
 * @param {number} identifier The unique identifier of the objective to retrieve.
 * @param {"active" | "passive"} category Category to retrieve from.
 * @returns {Promise<ActiveObjective | PassiveObjective | null>} Returns the objective if found, otherwise null.
 */
async function GetObjective(
    identifier: number,
    category: "passive",
): Promise<PassiveObjective | null>;
async function GetObjective(
    identifier: number,
    category: "active",
): Promise<ActiveObjective | null>;
async function GetObjective(
    identifier: number,
    category: "active" | "passive",
): Promise<ActiveObjective | PassiveObjective | null> {
    try {
        // PS. doing GetAllObjectives(category) sounds smarter BUT gives a type error
        const objectives: (PassiveObjective[] | ActiveObjective[]) | null =
            category === "active"
                ? await GetAllObjectives("active")
                : await GetAllObjectives("passive");

        if (!objectives) return null;

        const objective: ActiveObjective | PassiveObjective | undefined =
            objectives.find(
                (obj: ActiveObjective | PassiveObjective): boolean =>
                    obj.identifier === identifier,
            );

        if (objective === undefined) return null;

        return objective;
    } catch (e) {
        throw new Error(
            `Got an error getting ${category} objective ${identifier}: ${e}`,
        );
    }
}

/**
 * Deletes a specific objective from the AsyncStorage, given it's identifier.
 *
 * @async
 * @param {number} identifier The identifier.
 * @param {"active" | "passive"} category Category to delete from.
 * @returns {Promise<void>}
 */
async function DeleteObjective(
    identifier: number,
    category: "active" | "passive",
): Promise<void> {
    try {
        const objectives: ActiveObjective[] | PassiveObjective[] | null =
            category === "active"
                ? await GetAllObjectives("active")
                : await GetAllObjectives("passive");
        if (!objectives) return;

        const updatedObjectives: PassiveObjective[] | ActiveObjective[] =
            category === "active"
                ? (objectives as ActiveObjective[]).filter(
                      (obj: ActiveObjective): boolean =>
                          obj.identifier !== identifier,
                  )
                : (objectives as PassiveObjective[]).filter(
                      (obj: PassiveObjective): boolean =>
                          obj.identifier !== identifier,
                  );

        await AsyncStorage.setItem(
            category === "active"
                ? StoredItemNames.activeObjectives
                : StoredItemNames.passiveObjectives,
            JSON.stringify(updatedObjectives),
        );
    } catch (e) {
        throw new Error(
            `Error deleting ${category} objective ${identifier}: ${e}`,
        );
    }
}

/**
 * Creates an objective given it's category and data.
 *
 * @async
 * @param {ActiveObjectiveWithoutId | PassiveObjectiveWithoutId} target The objective to create.
 * @param {"active" | "passive"} category Category to delete from.
 * @returns {Promise<void>}
 */
async function CreateObjective(
    target: ActiveObjectiveWithoutId | PassiveObjectiveWithoutId,
    category: "active" | "passive",
    t: TFunction,
): Promise<void> {
    try {
        const nullishObjectives: ActiveObjective[] | PassiveObjective[] | null =
            category === "active"
                ? await GetAllObjectives("active")
                : await GetAllObjectives("passive");
        const objectives: ActiveObjective[] | PassiveObjective[] =
            !nullishObjectives || nullishObjectives.length === 0
                ? category === "active"
                    ? ([] as ActiveObjective[])
                    : ([] as PassiveObjective[])
                : nullishObjectives;

        function generateIdentifier(
            objs: ActiveObjective[] | PassiveObjective[],
        ): number {
            const generateObjectiveId: () => number = (): number => {
                return Math.floor(Math.random() * 9000000000) + 1000000000;
            };

            let newIdentifier: number = generateObjectiveId();
            // verify there aren't duplicates
            while (
                objs.some(
                    (obj: ActiveObjective | PassiveObjective): boolean =>
                        obj.identifier === newIdentifier,
                )
            ) {
                newIdentifier = generateObjectiveId();
            }
            return newIdentifier;
        }

        const newObjective: ActiveObjective | PassiveObjective = {
            ...(target as ActiveObjectiveWithoutId | PassiveObjectiveWithoutId),
            identifier: generateIdentifier(objectives),
        };

        if (category === "active") {
            (objectives as ActiveObjective[]).push(
                newObjective as ActiveObjective,
            );
        } else {
            (objectives as PassiveObjective[]).push(
                newObjective as PassiveObjective,
            );
        }

        await AsyncStorage.setItem(
            category === "active"
                ? StoredItemNames.activeObjectives
                : StoredItemNames.passiveObjectives,
            JSON.stringify(objectives),
        );

        let message: string;
        if (category === "active") {
            const activeTarget = target as ActiveObjectiveWithoutId;
            message = t("pages.createActiveObjective.doneFeedback", {
                obj: t(
                    `globals.supportedActiveObjectives.${activeTarget.exercise}.name`,
                ),
            });
        } else {
            const passiveTarget = target as PassiveObjectiveWithoutId;
            message = t("pages.createPassiveObjective.doneFeedback", {
                obj: passiveTarget.goal,
            });
        }

        ShowToast(message);
        console.log(
            `Created objective with ID ${newObjective.identifier} successfully! Full JSON of the created objective:\n${JSON.stringify(
                newObjective,
            )}`,
        );
        return;
    } catch (e) {
        throw new Error(
            `Something went wrong creating an objective.\nJSON:\n${JSON.stringify(
                target,
            )}\n\nError: ${e}`,
        );
    }
}

/**
 * Handles saving the daily log, sorting stuff by date.
 *
 * @async
 * @param {"active" | "passive"} category Category to get from.
 * @returns {Promise<void>}
 */
async function GetGenericObjectiveDailyLog(
    category: "active",
): Promise<ActiveObjectiveDailyLog>;
async function GetGenericObjectiveDailyLog(
    category: "passive",
): Promise<PassiveObjectiveDailyLog>;
async function GetGenericObjectiveDailyLog(
    category: "active" | "passive",
): Promise<ActiveObjectiveDailyLog | PassiveObjectiveDailyLog> {
    try {
        const response: string | null = await AsyncStorage.getItem(
            category === "active"
                ? StoredItemNames.activeDailyLog
                : StoredItemNames.passiveDailyLog,
        );
        if (!StrUtils.validate(response)) {
            await AsyncStorage.setItem(
                category === "active"
                    ? StoredItemNames.activeDailyLog
                    : StoredItemNames.passiveDailyLog,
                "{}",
            );
            return {};
        }
        return JSON.parse(response);
    } catch (e) {
        throw new Error(`Error getting ${category} daily log: ${e}`);
    }
}

/**
 * Given a daily log, dedupes it and sorts it by date, returning a new and clean log.
 *
 * @param {UncheckedDailyLog} log
 * @returns {UncheckedDailyLog}
 */
function CleanupGenericDailyLog(log: any): UncheckedDailyLog {
    type entry = [string, { [identifier: number]: UncheckedDailyLog }];

    const uniqueEntries = new Map<string, any>();
    for (const [date, value] of Object.entries(log)) {
        uniqueEntries.set(date, value);
    }

    return Object.fromEntries(
        Object.entries(Object.fromEntries(uniqueEntries.entries())).sort(
            ([dateA]: entry, [dateB]: entry): number => {
                if (
                    !ValidateTodaysDateString(dateA) ||
                    !ValidateTodaysDateString(dateB)
                )
                    throw new Error(
                        `Invalid dates, don't match TodaysDate type! dateA: ${dateA}, dateB: ${dateB}`,
                    );
                return (
                    JavaScriptifyTodaysDate(dateB).getTime() -
                    JavaScriptifyTodaysDate(dateA).getTime()
                );
            },
        ),
    );
}

/**
 * Handles saving the daily log, sorting stuff by date.
 *
 * @async
 * @param {UncheckedDailyLog} log Any log.
 * @param {"active" | "passive"} category Category to save to.
 * @returns {Promise<void>}
 */
async function SaveGenericObjectiveDailyLog(
    log: UncheckedDailyLog,
    category: "active" | "passive",
): Promise<void> {
    try {
        await AsyncStorage.setItem(
            category === "active"
                ? StoredItemNames.activeDailyLog
                : StoredItemNames.passiveDailyLog,
            JSON.stringify(CleanupGenericDailyLog(log)),
        );
    } catch (e) {
        throw new Error(`Error saving to ${category} daily log: ${e}`);
    }
}

/**
 * Fails objectives not done yesterday. Gets all objectives, finds the ones that you had to do yesterday (and previous days), and if they weren't done, it adds them as not done to the daily log.
 *
 * @async
 * @param {"active" | "passive"} category Category to fail from.
 * @returns {Promise<void>}
 */
async function FailGenericObjectivesNotDoneYesterday(
    category: "active" | "passive",
): Promise<void> {
    try {
        const objectives: (PassiveObjective[] | ActiveObjective[]) | null =
            category === "active"
                ? await GetAllObjectives("active")
                : await GetAllObjectives("passive");
        const dailyLog: PassiveObjectiveDailyLog | ActiveObjectiveDailyLog =
            category === "active"
                ? await GetGenericObjectiveDailyLog("active")
                : await GetGenericObjectiveDailyLog("passive");
        if (!objectives) return;
        const currentDate: CorrectCurrentDate = GetCurrentDateCorrectly();
        let targetDateObj: Date = new Date(
            JavaScriptifyTodaysDate(currentDate.string),
        );

        // find the earliest not logged date
        let earliestNotLoggedDate: TodaysDate | null = null;
        for (let i: number = 0; i < 365; i++) {
            const dateToCheck: TodaysDate = StringifyDate(
                AlterDate(
                    TurnJavaScriptDateIntoCurrentDate(targetDateObj).object,
                    -i,
                ),
            );
            if (!dailyLog[dateToCheck]) {
                earliestNotLoggedDate = dateToCheck;
            } else {
                break;
            }
        }

        if (!earliestNotLoggedDate) return;

        let startDate: Date = JavaScriptifyTodaysDate(earliestNotLoggedDate);
        const endDate: Date = JavaScriptifyTodaysDate(currentDate.string);
        // loop through all not logged dates
        while (startDate <= endDate) {
            const dateString: TodaysDate = StringifyDate(startDate);

            for (const obj of objectives) {
                const daysIndex: number = Math.floor(
                    (startDate.getTime() -
                        JavaScriptifyTodaysDate(obj.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24),
                );

                const TODAY_INDEX: keyof WeekTuple | undefined =
                    TODAY_CODE_ARRAY[daysIndex];

                if (
                    daysIndex < 0 ||
                    daysIndex >= TODAY_CODE_ARRAY.length ||
                    !TODAY_INDEX ||
                    (IsActiveObjective(obj) && !obj.info.days[TODAY_INDEX])
                )
                    continue;

                if (!dailyLog[dateString]) {
                    dailyLog[dateString] = {};
                }

                if (dailyLog[dateString][obj.identifier]) continue;

                dailyLog[dateString][obj.identifier] = IsActiveObjective(obj)
                    ? {
                          wasDone: false,
                          objective: obj,
                          performance: 0,
                      }
                    : {
                          wasDone: false,
                          objective: obj,
                      };
            }

            // Increment startDate by one day
            startDate.setDate(startDate.getDate() + 1);
        }

        await SaveGenericObjectiveDailyLog(dailyLog, category);

        return;
    } catch (e) {
        throw new Error(`Error failing objectives: ${e}`);
    }
}

/**
 * Checks if an objective was already done today or needs to be done.
 *
 * @async
 * @param {ActiveObjective | PassiveObjective} objective The objective.
 * @returns {Promise<SingleObjectivePendingReturn>} Returns a string indicating status. `noneDueToday` is an Active Objective-only string.
 */
async function IsGenericObjectivePending(
    objective: ActiveObjective | PassiveObjective,
): Promise<SingleObjectivePendingReturn> {
    try {
        const { identifier } = objective;

        const dailyLog: ActiveObjectiveDailyLog | PassiveObjectiveDailyLog =
            IsActiveObjective(objective)
                ? await GetGenericObjectiveDailyLog("active")
                : await GetGenericObjectiveDailyLog("passive");

        // not due today
        if (
            IsActiveObjective(objective) &&
            objective.info.days[ADJUSTED_TODAY_INDEX] === false
        )
            return "notDueToday";

        // log does not exist, so the objective is due today.
        if (Object.keys(dailyLog).length === 0) return "pending";

        const date: TodaysDate = GetCurrentDateCorrectly().string;

        if (!dailyLog[date]) return "pending";

        const entry: { wasDone: boolean } | undefined =
            dailyLog[date][identifier];

        if (entry) return entry.wasDone === true ? "done" : "pending"; // if it IS done, it IS NOT due today

        return "pending"; // no interaction with the objective means no data logged.
    } catch (e) {
        throw new Error(
            `Error checking if the ${objective.identifier} objective is due today: ${e}`,
        );
    }
}

/**
 * Tells you if the user has any pending objective or not. If he does, returns all of them, as an `number[]` being each number the ID of each active objective.
 *
 * @async
 * @param {"active" | "passive"} category Category to read from.
 * @returns {Promise<AllObjectivesPendingReturn>} Either an array with pending objective identifiers _only_ or a text-based code indicating context.
 */
async function GetPendingGenericObjectives(
    category: "active" | "passive",
): Promise<AllObjectivesPendingReturn> {
    try {
        const nullishObjectives: ActiveObjective[] | PassiveObjective[] | null =
            category === "active"
                ? await GetAllObjectives("active")
                : await GetAllObjectives("passive");
        const objectives: ActiveObjective[] | PassiveObjective[] =
            !nullishObjectives || nullishObjectives.length === 0
                ? category === "active"
                    ? ([] as ActiveObjective[])
                    : ([] as PassiveObjective[])
                : nullishObjectives;

        if (!objectives || objectives.length === 0) return "noneExists"; // no objectives at all

        // there are only two hard things in computer science, cache invalidation and naming things
        type thing = {
            identifier: number;
            status: SingleObjectivePendingReturn;
        };

        // okay i think i finally know what's going on in here:

        // this function runs for each objective, checks if it's pending,
        // and returns its status (TRUE if it IS pending) and ID
        async function callbackfn(
            obj: ActiveObjective | PassiveObjective,
        ): Promise<thing | null> {
            const status: SingleObjectivePendingReturn =
                await IsGenericObjectivePending(obj);
            return { identifier: obj.identifier, status };
        }

        // TODO: i should review this code, again...

        // we get the values of the objectives and run the callbackfn for all of them
        const dueTodayObjectives: thing[] = (
            await Promise.all(objectives.map(callbackfn))
        )
            // we filter out null entries
            .filter((obj: thing | null): obj is thing => obj !== null);

        if (
            dueTodayObjectives.every(
                (obj: thing): boolean => obj.status === "done",
            )
        )
            return "allDone";

        if (
            dueTodayObjectives.every(
                (obj: thing): boolean => obj.status === "notDueToday",
            )
        )
            return "noneDueToday";

        // get the identifiers of objectives that are not done yet
        const pendingObjectives: number[] = dueTodayObjectives
            .filter((obj: thing): boolean => obj.status === "pending")
            .map((obj: thing): number => obj.identifier);

        // return pending objectives
        // because of the earlier .every(), we know there's at least one
        return pendingObjectives;
    } catch (e) {
        throw new Error(`Failed to get pending ${category} objectives: ${e}`);
    }
}

/**
 * Handles `?url=params` for editing of objectives.
 *
 * @param {*} params URL parameters.
 * @returns {("noEdit" | "invalidData" | number)} The ID of the objective to edit, or a string representing why no edit will be handled.
 */
function HandleEditObjective(
    params: any,
    category: "active" | "passive",
): "noEdit" | "invalidData" | number {
    const typedParams: EditObjectiveParams = params as EditObjectiveParams;
    const realParams: RealEditObjectiveParams = {
        edit: typedParams.edit === "true" ? true : false,
        objective:
            typedParams.edit === "true"
                ? JSON.parse(typedParams.objective)
                : null,
    };
    if (realParams.edit === false) return "noEdit";
    if (
        (category === "active" &&
            !ValidateActiveObjective(realParams.objective)) ||
        (category === "passive" &&
            !ValidatePassiveObjective(realParams.objective))
    )
        return "invalidData";
    return realParams.objective.identifier;
}

export {
    GetObjective,
    DeleteObjective,
    CreateObjective,
    GetAllObjectives,
    HandleEditObjective,
    CleanupGenericDailyLog,
    IsGenericObjectivePending,
    GetPendingGenericObjectives,
    GetGenericObjectiveDailyLog,
    SaveGenericObjectiveDailyLog,
    FailGenericObjectivesNotDoneYesterday,
};
