import {
    ActiveObjective,
    ActiveObjectiveDailyLog,
    ActiveObjectiveWithoutId,
} from "@/types/ActiveObjectives";
import { logToConsole } from "@/toolkit/debug/Console";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    adjustedToday,
    getCurrentDate,
    TodaysDay,
} from "@/toolkit/debug/Today";
import StoredItemNames from "@/constants/StoredItemNames";

/**
 * Returns the objectives from AsyncStorage as an `ActiveObjective[]`, or `null` if there aren't any objectives.
 *
 * @async
 * @returns {Promise<ActiveObjective[] | null>} - Returns the objectives as an `Objective[]`.
 */
async function GetAllObjectives(): Promise<ActiveObjective[] | null> {
    try {
        const storedObjectives: string | null = await AsyncStorage.getItem(
            StoredItemNames.objectives,
        );
        let objectives: ActiveObjective[] = [];
        try {
            objectives = storedObjectives ? JSON.parse(storedObjectives) : [];
        } catch (e) {
            logToConsole(
                "Failed to parse stored objectives: " + e,
                "error",
                {
                    location: "@/toolkit/objectives/ActiveObjectives.ts",
                    isHandler: false,
                    function:
                        "GetAllObjectives() @ try-catch #1 @ sub try-catch #1",
                },
                false,
            );
            return null;
        }

        if (!Array.isArray(objectives)) {
            logToConsole(
                "Warning! Objectives are not an array",
                "warn",
                undefined,
            );
            return null;
        }

        return objectives;
    } catch (e) {
        throw new Error("Got an error getting all objectives! " + e);
    }
}

/**
 * Returns the ActiveObjectiveDailyLog. **Async function.**
 *
 * @rawR5code
 * @returns {ActiveObjectiveDailyLog} The entire daily log.
 */
async function GetActiveObjectiveDailyLog(): Promise<ActiveObjectiveDailyLog | null> {
    try {
        const response: string | null = await AsyncStorage.getItem(
            StoredItemNames.dailyLog,
        );
        if (!response) {
            return {};
        }
        const dailyLog: ActiveObjectiveDailyLog = JSON.parse(response);
        return dailyLog;
    } catch (e) {
        throw new Error("Error accessing active objective daily log! " + e);
    }
}

/**
 * Saves the results of an objective to a daily registry. **Async function.**
 *
 * @rawR5code
 * @async
 * @param {number} id ID of the objective
 * @param {TodaysDay} date Today's date. Use `getCurrentDate()` to get it.
 * @param {boolean} wasDone Whether the objective was done or not.
 * @param {any} [performance] Results for the session from CoreLibrary. Optional (the user could have not done the objective, so no data would exist).
 */
async function SaveActiveObjectiveToDailyLog(
    id: number,
    wasDone: boolean,
    performance: any,
) {
    try {
        // Fetch old data
        const prevDailySavedData: ActiveObjectiveDailyLog | null =
            await GetActiveObjectiveDailyLog();
        const dailyData: ActiveObjectiveDailyLog = prevDailySavedData ?? {};
        const today = getCurrentDate();

        // If there's no old data for today, creates an {} for today
        if (!dailyData[today]) {
            dailyData[today] = {};
        }

        // Saves the objective data
        dailyData[today][id] = {
            wasDone: wasDone,
            performance: performance !== undefined ? performance : 0,
        };

        // Updates data and puts it back to AsyncStorage
        await AsyncStorage.setItem(
            StoredItemNames.dailyLog,
            JSON.stringify(dailyData),
        );
        logToConsole(`Objective ${id} data saved for ${today}`, "success");
    } catch (e) {
        if (id) {
            logToConsole(
                `Error saving user's performance for objective ${id}, caught: ${e}`,
                "error",
            );
        } else {
            logToConsole(
                `Error saving user's performance for objective (no ID), caught: ${e}`,
                "error",
            );
        }
        throw e;
    }
}

/**
 * Checks if an objective was already done today or needs to be done. **Async function.**
 *
 * @rawR5code
 * @async
 * @param {number} identifier The objective's identifier
 * @returns {Promise<boolean>} Returns **true** if the objective IS done and doesn't need to be done. Returns **false** if otherwise (DOES need to be done today).
 */
async function CheckForAnActiveObjectiveDailyStatus(
    identifier: number,
): Promise<boolean> {
    try {
        const prevDailySavedData: string | null = await AsyncStorage.getItem(
            StoredItemNames.dailyLog,
        );

        if (!prevDailySavedData) {
            await AsyncStorage.setItem(
                StoredItemNames.dailyLog,
                JSON.stringify({}),
            );
            return false; // log does not exist, so the objective isn't done today.
        }

        const dailyData: ActiveObjectiveDailyLog =
            JSON.parse(prevDailySavedData);
        const date: TodaysDay = getCurrentDate();

        // Validate if dailyData and the specific identifier exist
        if (dailyData[date] && dailyData[date][identifier]) {
            const entry = dailyData[date][identifier];
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
            const log =
                dailyData[date] ?
                    `Warning: No data exists for objective ${identifier} on date ${date}. Note: This warning is actually a normal behavior most of the time: if you didn't interact with the objective at all, it won't be logged. most interactions will mark it as done, but until those interactions happen, this warning will occur.`
                    : `Warning: No data exists for date ${date} at all. Note: This warning is actually a normal behavior most of the time: if you didn't interact with the objective at all, it won't be logged. most interactions will mark it as done, but until those interactions happen, this warning will occur.`;
            logToConsole(log, "warn");
            return false; // no interaction with the objective means no data logged.
        }
    } catch (e) {
        throw new Error("Error checking if an objective is due today: " + e);
    }
}

/**
 * **TODO: MAKE THIS R6 COMPLIANT.** Tells you if the user has any active objective due today or not. If he does, returns all of them, as an `number[]` being each number the ID of each active objective. **Async function.**
 *
 * @deprecated
 * @rawR5code
 * @async
 * @returns {Promise<number[] | 0 | false | null>} Read carefully: `null` if there are no objectives at all, `false` if there are, but none is due today, and `0` if there are for today user took care of all of them), and a `number[]` if there's any active objective due today, being each number an active objective identifier.
 */
async function GetAllPendingObjectives(): Promise<number[] | 0 | false | null> {
    try {
        const objectives = await GetAllObjectives();
        if (!objectives || Object.keys(objectives).length === 0) {
            return null; // no objectives at all
        }

        // okay k this thing is kinda like: doing a foreach with all the objective entries and for each entry doing a map looking for its identifier and its status
        // (only if its due today, otherwise we directly skip it)

        // the return inside the loop *should* return an ActiveObjective[]
        // (aka an array of ActiveObjectives)
        const dueTodayObjectives = await Promise.all(
            Object.values(objectives).map(async (obj: ActiveObjective) => {
                if (obj.info.days[adjustedToday]) {
                    const status = await CheckForAnActiveObjectiveDailyStatus(
                        obj.identifier,
                    );
                    return { identifier: obj.identifier, status };
                }
                return null;
            }),
        );

        // filter out null entries and separate the dueToday objectives based on their status
        const activeObjectivesDueToday = dueTodayObjectives.filter(
            (obj) => obj !== null,
        ) as { identifier: number; status: boolean }[];

        if (activeObjectivesDueToday.length === 0) {
            return false; // there are objectives, but none are due today
        }

        // okay i don't get whats going on in here
        // only thing i know is 0 equals "there are objetives, but no one's due *today*" while null means there are no existing objectives at all
        // (maybe)
        /* const objectivesToDo = dueTodayObjectives.filter(obj => obj && !obj.status);
        if (objectivesToDo.length > 0) {
            return 0;
        }

        const allDone = dueTodayObjectives
            .every(
                obj => obj === null || obj.status === true);
        return allDone ? 0 : null; */
        const allDone: boolean = activeObjectivesDueToday.every(
            (obj: { identifier: number; status: boolean }): boolean =>
                obj.status,
        );
        return allDone ? 0 : (
            activeObjectivesDueToday.map(
                (obj: { identifier: number; status: boolean }): number =>
                    obj.identifier,
            )
        ); // Return 0 if all are done, otherwise return the active objectives due today (well, their identifiers)
    } catch (e) {
        throw new Error("Failed to get all pending objectives: " + e);
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
    try {
        const objectives: ActiveObjective[] | null = await GetAllObjectives();

        if (objectives === null) {
            throw new Error("No objectives exist!");
        }

        const objective = objectives.find(
            (obj) => obj.identifier === identifier,
        );

        if (objective === undefined) {
            return null;
        }
        return objective;
    } catch (e) {
        throw new Error(
            "Got an error fetching objective " + identifier + "! " + e,
        );
    }
}

/**
 * Creates an objective and saves it. You need to provide all the data for it except the ID, as an `ActiveObjectiveWithoutId` object.
 *
 * @async
 * @param {ActiveObjectiveWithoutId} target An active objective with everything EXCEPT it's ID. Identifier is generated by the own function.
 * @returns {Promise<0>} 0 if success, 1 if failure.
 */
async function CreateActiveObjective(
    target: ActiveObjectiveWithoutId,
): Promise<0> {
    try {
        let objs: ActiveObjective[] | null = await GetAllObjectives();
        if (!objs || objs.length === 0 || objs === null) {
            objs = [];
        }

        function generateIdentifier(objs: ActiveObjective[]): number {
            const generateObjectiveId = (): number => {
                return Math.floor(Math.random() * 9000000000) + 1000000000;
            };

            let newIdentifier: number = generateObjectiveId();
            // verify there aren't duplicates
            while (
                objs.some(
                    (obj: ActiveObjective): boolean =>
                        obj.identifier === newIdentifier,
                )
            ) {
                newIdentifier = generateObjectiveId();
            }
            return newIdentifier;
        }

        const newObjective: ActiveObjective = {
            ...target,
            identifier: generateIdentifier(objs),
        };

        objs.push(newObjective);

        try {
            await AsyncStorage.setItem(
                StoredItemNames.objectives,
                JSON.stringify(objs),
            );
        } catch (e) {
            throw new Error("Failed to save objectives! " + e);
        }

        logToConsole(
            "Created objective " +
            newObjective.identifier +
            " (exercise: " +
            newObjective.exercise +
            ") successfully!",
            "success",
            undefined,
            false,
        );
        logToConsole(
            "NOTE: Full JSON of the created objective:" +
            JSON.stringify(newObjective),
            "log",
            undefined,
            false,
        );
        return 0;
    } catch (e) {
        throw new Error("Something went wrong creating objective: " + e);
    }
}

export {
    CreateActiveObjective,
    GetAllObjectives,
    GetActiveObjective,
    GetActiveObjectiveDailyLog,
    SaveActiveObjectiveToDailyLog,
    GetAllPendingObjectives,
    CheckForAnActiveObjectiveDailyStatus,
};
