import StoredItemNames from "@/constants/stored_item_names";
import {
    ActiveObjective,
    ActiveObjectiveDailyLog,
    ActiveObjectiveWithoutId,
    WeekTuple,
} from "@/types/active_objectives";
import {
    PassiveObjective,
    PassiveObjectiveDailyLog,
    PassiveObjectiveWithoutId,
} from "@/types/passive_objectives";
import AsyncStorage from "expo-sqlite/kv-store";
import { TFunction } from "i18next";
import { ShowToast } from "../android";
import { GenericDailyLog, IsActiveObjective } from "@/types/common_objectives";
import {
    ADJUSTED_TODAY_INDEX,
    AlterDate,
    GetCurrentDateCorrectly,
    JavaScriptifyTodaysDate,
    StringifyDate,
    TODAY_CODE_ARRAY,
    TurnJavaScriptDateIntoCurrentDate,
} from "../today";
import { CorrectCurrentDate, TodaysDate } from "@/types/today";
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

        if (!storedObjectives || storedObjectives.trim() === "") {
            console.warn(
                `Warning! There are no ${category} objectives`,
            );
            return null;
        }

        // non-explicitly typed in purpose
        const objectives = JSON.parse(storedObjectives);

        if (!Array.isArray(objectives)) {
            console.warn(
                "Warning! Objectives are not an array",
            );
            return null;
        }

        if (objectives.length === 0) {
            return null;
        }

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

        if (!objectives) {
            console.error("No objectives exist!");
            return null;
        }

        const objective: ActiveObjective | PassiveObjective | undefined =
            objectives.find(
                (obj: ActiveObjective | PassiveObjective): boolean =>
                    obj.identifier === identifier,
            );

        if (objective === undefined) {
            return null;
        }

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

type UncheckedDailyLog = GenericDailyLog<any>;

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
                ? StoredItemNames.dailyLog
                : StoredItemNames.passiveDailyLog,
        );
        if (!StrUtils.validate(response)) {
            await AsyncStorage.setItem(
                StoredItemNames.dailyLog,
                JSON.stringify({}),
            );
            return {};
        }
        return JSON.parse(response);
    } catch (e) {
        throw new Error(`Error getting ${category} daily log: ${e}`);
    }
}

/**
 * Handles saving the daily log, sorting stuff by date.
 *
 * @async
 * @param {GenericDailyLog<any>} log Any log.
 * @param {"active" | "passive"} category Category to save to.
 * @returns {Promise<void>}
 */
async function SaveGenericObjectiveDailyLog(
    log: UncheckedDailyLog,
    category: "active" | "passive",
): Promise<void> {
    try {
        function removeDuplicates(obj: UncheckedDailyLog): UncheckedDailyLog {
            const uniqueEntries = new Map<string, any>();
            for (const [date, value] of Object.entries(obj)) {
                uniqueEntries.set(date, value);
            }
            return Object.fromEntries(uniqueEntries);
        }

        function sortObjectByDate(obj: UncheckedDailyLog): UncheckedDailyLog {
            return Object.fromEntries(
                Object.entries(obj).sort(([dateA], [dateB]) => {
                    return (
                        JavaScriptifyTodaysDate(dateA as TodaysDate).getTime() -
                        JavaScriptifyTodaysDate(dateB as TodaysDate).getTime()
                    );
                }),
            );
        }

        const dedupedLog: UncheckedDailyLog = removeDuplicates(log);
        const sortedLog: UncheckedDailyLog = sortObjectByDate(dedupedLog);

        await AsyncStorage.setItem(
            category === "active"
                ? StoredItemNames.dailyLog
                : StoredItemNames.passiveDailyLog,
            JSON.stringify(sortedLog),
        );
    } catch (e) {
        throw new Error(`Error saving to ${category} daily log: ${e}`);
    }
}

/**
 * Fails objectives not done yesterday.
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
 * @returns {Promise<boolean>} Returns **true** if the objective IS NOT done and NEEDS TO BE DONE. Returns **false** if otherwise (DOES NOT NEED to be done today).
 */
async function IsGenericObjectivePending(
    objective: ActiveObjective | PassiveObjective,
): Promise<boolean> {
    try {
        const { identifier } = objective;

        const dailyLog: ActiveObjectiveDailyLog | PassiveObjectiveDailyLog = IsActiveObjective(objective) ?
            await GetGenericObjectiveDailyLog("active") :
            await GetGenericObjectiveDailyLog("passive");

        console.debug("CHECKING", objective)
        console.debug(dailyLog)

        // the opposite ("&& !obj.days") seemed more logical to me (return NOT due today IF NOT added for today), however that does the opposite and this somehow does it right...
        // sometimes i wonder if it's me or JS who has a problem
        if (IsActiveObjective(objective) && objective.info.days[ADJUSTED_TODAY_INDEX]) return false; // not due today

        if (Object.keys(dailyLog).length === 0) return true; // log does not exist, so the objective is due today.

        const date: TodaysDate = GetCurrentDateCorrectly().string;

        // Validate if dailyLog and the specific identifier exist
        if (dailyLog[date] && dailyLog[date][identifier]) {
            const entry: { wasDone: boolean } =
                dailyLog[date][identifier];
            if (typeof entry.wasDone !== "boolean") {
                throw new Error(
                    `Invalid 'wasDone' value for objective ${identifier} on date ${date}`,
                );
            }
            return !entry.wasDone; // if it IS done, it IS NOT due today
        }
        return true; // no interaction with the objective means no data logged.
    } catch (e) {
        throw new Error(
            `Error checking if the ${objective.identifier} objective is due today: ${e}`,
        );
    }
}

/** Either an array of the IDs of pending objectives, or a self-descriptive status code. IDs should not be mixed up - either an active objective ID array or a passive objective one. */
type PendingReturn =
    | number[]
    | "allDone"
    | "noneDueToday"
    | "noneExists"

/**
 * Tells you if the user has any pending objective or not. If he does, returns all of them, as an `number[]` being each number the ID of each active objective.
 *
 * @async
 * @param {"active" | "passive"} category Category to read from.
 * @returns {Promise<PendingReturn>} Either an array with pending objective identifiers _only_ or a text-based code indicating context.
 */
async function GetPendingGenericObjectives(category: "active" | "passive"): Promise<PendingReturn> {
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

        if (!objectives || Object.keys(objectives).length === 0) {
            return "noneExists"; // no objectives at all
        }

        // TODO: make this PassiveObjective-compatible
        // NOTE: half done
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
                obj: ActiveObjective | PassiveObjective,
            ): Promise<thing> {
                const status: boolean = await IsGenericObjectivePending(obj);
                return { identifier: obj.identifier, status };
            }),
        );

        // filter out null entries and separate the dueToday objectives based on their status
        const activeObjectivesDueToday = dueTodayObjectives.filter(
            (obj: thing): boolean => obj !== null,
        ) as safeThing[];

        if (activeObjectivesDueToday.length === 0) {
            return "noneDueToday"; // there are objectives, but none are due today
        }

        // okay i don't get whats going on in here
        // hope this works
        // check if all objectives due today are done
        const allDone: boolean = activeObjectivesDueToday.every(
            (obj: safeThing): boolean => obj.status,
        );

        if (allDone) return "allDone"; // all objectives for today are done

        // get the identifiers of objectives that are not done yet
        const pendingObjectives: number[] = activeObjectivesDueToday
            // no i did not write this
            .filter((obj: safeThing): boolean => obj.status === false)
            .map((obj: safeThing): number => obj.identifier);

        return pendingObjectives.length > 0 ? pendingObjectives : "allDone"; // return pending objectives or 0 if none
    } catch (e) {
        throw new Error(`Failed to get all pending objectives: ${e}`);
    }
}

// function exports
export {
    GetObjective,
    DeleteObjective,
    CreateObjective,
    GetAllObjectives,
    GetPendingGenericObjectives,
    GetGenericObjectiveDailyLog,
    SaveGenericObjectiveDailyLog,
    FailGenericObjectivesNotDoneYesterday,
};

// type exports
export {
    PendingReturn
};
