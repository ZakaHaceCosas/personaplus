import { ActiveObjective, ActiveObjectiveDailyLog, ActiveObjectiveWithoutId } from "@/types/ActiveObjectives";
import { logToConsole } from "@/toolkit/debug/Console";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adjustedToday, getCurrentDate, TodaysDay } from "../debug/Today";

/**
 * The names of the AsyncStorage entries, so there's no confussion with data saving.
 *
 * @type {{ objectives: string; dailylog: string; }}
 */
const AsyncStorageEntryNames = {
    objectives: "objectives",
    dailylog: "activeObjectiveDailyLog",
}

/**
 * Returns the objectives from AsyncStorage as an `ActiveObjective[]`, or `null` if there aren't any objectives.
 *
 * @async
 * @returns {Promise<ActiveObjective[] | null>} - Returns the objectives as an `Objective[]`.
 */
async function GetAllObjectives(): Promise<ActiveObjective[] | null> {
    try {
        const storedObjectives: string | null = await AsyncStorage.getItem(AsyncStorageEntryNames.objectives);
        const objectives: ActiveObjective[] = storedObjectives ? JSON.parse(storedObjectives) : [];

        if (!Array.isArray(objectives)) {
            logToConsole("Warning! Objectives are not an array", "warn");
            return null;
        }

        return objectives;
    } catch (e) {
        logToConsole("Got an error getting all objectives! " + e, "error");
        throw new Error("Got an error getting all objectives! " + e);
    }
}

/**
 * @deprecated
 */
async function GetActiveObjectiveDailyLog(): Promise<ActiveObjectiveDailyLog[] | null> {
    try {
        const response: string | null = await AsyncStorage.getItem(AsyncStorageEntryNames.dailylog)
        const dailyLog: ActiveObjectiveDailyLog[] = (response !== null) ? JSON.parse(response) : null
        return dailyLog
    } catch (e) {
        logToConsole("Error accessing active objective daily log! " + e, "error")
        throw e
    }
}

/**
 * Saves the results of an objective to a daily registry. **Async function.**
 *
 * @deprecated
 * @async
 * @param {number} id ID of the objective
 * @param {TodaysDay} date Today's date. Use `getCurrentDate()` to get it.
 * @param {boolean} wasDone Whether the objective was done or not.
 * @param {?string} [performance] Results for the session from OpenHealth. Optional (the user could have not done the objective, so no data would exist).
 */
async function SaveActiveObjectiveToDailyLog(id: number, date: TodaysDay, wasDone: boolean, performance?: string) {
    try {
        // Fetch old data
        const prevDailySavedData = await AsyncStorage.getItem(AsyncStorageEntryNames.dailylog);
        const dailyData = prevDailySavedData ? JSON.parse(prevDailySavedData) : {};

        // If there's no old data for today, creates an {} for today
        if (!dailyData[date]) {
            dailyData[date] = {};
        }

        // Saves the objective data
        dailyData[date][id] = {
            wasDone: wasDone,
            performance: performance !== undefined ? performance : "undefined"
        };

        // Updates data and puts it back to AsyncStorage
        await AsyncStorage.setItem(AsyncStorageEntryNames.dailylog, JSON.stringify(dailyData));
        logToConsole(`Objective ${id} data saved for ${date}`, "success");
    } catch (e) {
        if (id) {
            logToConsole(`Error saving user's performance for objective ${id}, caught: ${e}`, "error");
        } else {
            logToConsole(`Error saving user's performance for objective (no ID), caught: ${e}`, "error");
        }
        throw e
    }
}

/**
 * **TODO: MAKE THIS R6 COMPLIANT. DEPRECATED!** Checks if an objective was already done today or needs to be done. **Async function.**
 *
 * @deprecated
 * @async
 * @param {number} identifier The objective's identifier
 * @returns {Promise<boolean | null>} A promise. Returns **true** if the objective IS done and doesn't need to be done. Returns **false** if otherwise (doesn't need to be done today). If an error occurs, will return null and `logToConsole()` the error.
 */
async function CheckForAnActiveObjectiveDailyStatus(identifier: number): Promise<boolean | null> {
    try {
        const prevDailySavedData = await AsyncStorage.getItem(AsyncStorageEntryNames.dailylog);
        if (!prevDailySavedData) {
            await AsyncStorage.setItem(AsyncStorageEntryNames.dailylog, JSON.stringify({}));
            return false; // If the log doesn't exist, obviously it's not done
        }

        const dailyData: ActiveObjectiveDailyLog = JSON.parse(prevDailySavedData);
        const date: TodaysDay = getCurrentDate();

        // Validate if dailyData and the specific identifier exist
        if (dailyData[date] && dailyData[date][identifier]) {
            const entry = dailyData[date][identifier];
            if (entry.wasDone === true || entry.wasDone === false) {
                return entry.wasDone;
            } else {
                logToConsole(`Error: Invalid 'wasDone' value for objective ${identifier} on date ${date}`, "error");
                throw new Error(`Invalid 'wasDone' value for objective ${identifier} on date ${date}`);
            }
        } else {
            const log = dailyData[date]
                ? `Warning: No data exists for objective ${identifier} on date ${date}.`
                : `Warning: No data exists for date ${date} at all.`;
            logToConsole(log, "warn");
            return null; // it's actually a normal behaviour most of the time: if you didn't interact with the objective at all, it won't be logged. most ineractions will mark it as done, but until those interactions happen, this warning will occur.
        }
    } catch (e) {
        logToConsole("Error checking if an objective is due today: " + e, "error");
        return null;
    }
}

/**
 * **TODO: MAKE THIS R6 COMPLIANT.** ***Consider it DEPRECATED until then.*** Verifies if there are any objectives due today or not, and if they have been done or not. **Async function.**
 *
 * @deprecated
 * @async
 * @param {{ [key: string]: Objective }} objectives A [key: string]: Objective object.
 * @returns {Promise<null | true | false>} Null if no objectives at all, false if none is due today (or there is but was already done), and true if there's any due today.
 */
async function GetAllPendingObjectives(): Promise<ActiveObjective[] | 0 | null> {
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
            Object.values(objectives).map(async (obj) => {
                if (obj.info.days[adjustedToday]) {
                    const status = await CheckForAnActiveObjectiveDailyStatus(obj.identifier);
                    return { identifier: obj.identifier, status }
                }
                return null;
            })
        );

        // okay i dont get whats going on in here
        // only thing i know is 0 equals "there are objetives, but no one's due *today*" while null means there are no existing objectives at all
        // (maybe)
        const objectivesToDo = dueTodayObjectives.filter(obj => obj && !obj.status);
        if (objectivesToDo.length > 0) {
            return 0;
        }

        const allDone = dueTodayObjectives.every(obj => obj === null || obj.status === true);
        return allDone ? 0 : null;
    } catch (e) {
        throw e
    }
}

/**
 * Retrieves a single objective from AsyncStorage by its identifier.
 *
 * @async
 * @param {number} identifier - The unique identifier of the objective to retrieve.
 * @returns {Promise<ActiveObjective | null>} - Returns the objective if found, otherwise null.
 */
async function GetObjective(identifier: number): Promise<ActiveObjective | null> {
    try {
        const objectives: ActiveObjective[] | null = await GetAllObjectives()

        if (objectives === null) {
            throw new Error("No objectives exist!")
        }

        const objective = objectives.find(obj => obj.identifier === identifier);

        if (objective === undefined) {
            return null
        }
        return objective;
    } catch (e) {
        logToConsole("Got an error fetching objective " + identifier + "! " + e, "error");
        throw new Error("Got an error fetching objective " + identifier + "! " + e);
    }
}

/**
 * Creates an objective and saves it. You need to provide all the data for it except the ID, as an `ActiveObjectiveWithoutId` object.
 *
 * @async
 * @param {ActiveObjectiveWithoutId} target An active objective with everything EXCEPT it's ID. Identifier is generated by the own function.
 * @returns {Promise<0>} 0 if success, 1 if failure.
 */
async function CreateActiveObjective(target: ActiveObjectiveWithoutId): Promise<0> {
    try {
        let objs = await GetAllObjectives();
        if (!objs || objs.length === 0 || objs === null) {
            objs = [];
        }

        function generateIdentifier(objs: ActiveObjective[]): number {
            const generateObjectiveId = (): number => {
                return Math.floor(Math.random() * 9000000000) + 1000000000;
            };

            let newIdentifier: number = generateObjectiveId();
            // verify there aren't duplicates
            while (objs.some(obj => obj.identifier === newIdentifier)) {
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
            await AsyncStorage.setItem(AsyncStorageEntryNames.objectives, JSON.stringify(objs));
        } catch (e) {
            logToConsole("Failed to save objectives! " + e, "error");
            throw new Error("Failed to save objectives! " + e);
        }

        logToConsole("Created objective " + newObjective.identifier + " (exercise: " + newObjective.exercise + ") successfully!", "success", true)
        logToConsole("NOTE: Full JSON of the created objective:" + JSON.stringify(newObjective), "log")
        return 0
    } catch (e) {
        logToConsole("Something went wrong creating objetcive: " + e, "error")
        throw new Error("Something went wrong creating objetcive: " + e)
    }
}

export { CreateActiveObjective, GetAllObjectives, GetObjective, GetActiveObjectiveDailyLog, SaveActiveObjectiveToDailyLog, GetAllPendingObjectives, CheckForAnActiveObjectiveDailyStatus }
