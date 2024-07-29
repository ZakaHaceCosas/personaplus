// OBJECTIVE TYPE
import { Objective } from '@/src/types/Objective';
// INTERNALS
import { termLog } from '@/src/toolkit/debug/console';
// FRONTEND
import { router } from "expo-router";
import { Platform, ToastAndroid } from 'react-native';
import { TFunction } from 'i18next';
// BACKEND
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { adjustedToday, getCurrentDate, TodaysDay } from '@/src/toolkit/today';

// Función para obtener los objetivos
/**
 * Returns the objectives from AsyncStorage in the specified format.
 *
 * @async
 * @param {("object" | "string")} [wayToGetThem="object"] - The format to return the objectives in.
 * @returns {Promise<Objective[] | string>} - Returns the objectives in the specified format.
 */
const getObjectives = async (wayToGetThem: "object" | "string" = "object"): Promise<Objective[] | string> => {
    try {
        const storedObjectives: string | null = await AsyncStorage.getItem("objectives");
        const objectives: Objective[] = storedObjectives ? JSON.parse(storedObjectives) : [];

        if (wayToGetThem === "object") {
            return objectives;
        } else if (wayToGetThem === "string") {
            return JSON.stringify(objectives);
        } else {
            throw new Error("Invalid wayToGetThem specified");
        }
    } catch (e) {
        termLog("Got an error fetching objectives! " + e, "error");
        return wayToGetThem === "object" ? [] : ""; // Return empty array or string based on format
    }
};

// Función para guardar los objetivos en el AsyncStorage
/**
 * Saves a given `Objective[]` array to the AsyncStorage.
 *
 * @async
 * @param {Objective[]} objectives The array of objectives.
 * @returns {Promise<void>}
 */
const saveObjectives = async (objectives: Objective[]): Promise<void> => {
    await AsyncStorage.setItem("objectives", JSON.stringify(objectives));
};

// Función para eliminar un objetivo dado su identificador
/**
 * Deletes a specific objective from the AsyncStorage, given it's identifier.
 *
 * @async
 * @param {number} identifier The identifier.
 * @returns {Promise<void>}
 */
const deleteObjective = async (identifier: number): Promise<void> => {
    try {
        const objectives = await getObjectives("object");

        if (Array.isArray(objectives)) {
            const updatedObjectives = objectives.filter(obj => obj.identifier !== identifier);
            await saveObjectives(updatedObjectives);
        } else {
            termLog("Expected an array of objectives but got a string instead.", "error");
        }
    } catch (error) {
        termLog("Error in deleteObjective: " + error, "error");
    }
};

// Función para marcar un objetivo como completado dado su identificador
/**
 * Marks an objective as done given its identifier.
 *
 * @async
 * @param {number} identifier The identifier.
 * @param {boolean} confirmWithToast Wether to show an Android Toast (`react-native.ToastAndroid`) saying "Marked as done!". Defaults to false. Use `false` when you use a different confirmation method (e.g. the custom toasts seen at the sessions page).
 * @param {TFunction} t Pass here the `i18next` translate function, please.
 * @returns {Promise<void>}
 */
const markObjectiveAsDone = async (identifier: number, confirmWithToast: boolean = true, t: TFunction): Promise<void> => {
    try {
        const objectives = await getObjectives("object");

        if (Array.isArray(objectives)) {
            const updatedObjectives = objectives.map(obj =>
                obj.identifier === identifier ? { ...obj, wasDone: true } : obj
            );
            const date = getCurrentDate()
            saveDailyObjectivePerformance(identifier, date, true)

            await saveObjectives(updatedObjectives);
            router.navigate("/");

            if (Platform.OS === "android" && confirmWithToast) {
                ToastAndroid.show(t("messages.marked_objective_as_done"), ToastAndroid.LONG);
            }
        } else {
            termLog("Expected an array of objectives but got a string instead.", "error");
        }
    } catch (e) {
        termLog("Got an error marking objective as done! " + e, "error");
    }
};

// Funcion para vaciar / borrar los objetivos
/**
 * Clears all the objectives, setting the AsyncStorage object to `[]`.
 *
 * @async
 * @returns {*}
 */
const clearObjectives = async () => {
    try {
        const objectives = await getObjectives();
        if (objectives !== null) {
            await AsyncStorage.setItem("objectives", JSON.stringify([]));
        }
    } catch (e) {
        termLog("Got an error clearing objectives! " + e, "error");
    }
};

// Función para obtener un objetivo dado su identificador
/**
 * Gets a specific objective given its identifier, allowing to read all of its data easily.
 *
 * @async
 * @param {number} identifier The identifier.
 * @returns {Promise<Objective | null>}
 */
const getObjectiveByIdentifier = async (identifier: number): Promise<Objective | null | undefined> => {
    try {
        const objectives = await getObjectives("object");
        if (Array.isArray(objectives)) {
            const objective = objectives.find(obj => obj.identifier === identifier);
            return objective || null;
        } else {
            termLog("Expected an array of objectives but got a string instead.", "error")
        }
    } catch (e) {
        termLog("Got an error fetching the objective by identifier! " + e, "error");
        return null;
    }
};

// Funcion para definir la descripción del objetivo
/**
 * Function to generate an objective's dashboard description.
 *
 * @param {TFunction} t Pass here the translate function, please.
 * @param {Objective} objective The objective itself.
 * @returns {string}
 */
const defineObjectiveDescription = (t: TFunction, objective: Objective): string => {
    let descriptionDraft: string = t('page_dashboard.objective.description', {
        duration: objective.duration,
        rests: objective.rests,
        repetitions: objective.repetitions,
    });

    if (objective?.rests > 0) {
        descriptionDraft = t('page_dashboard.objective.description_with_rests', {
            duration: objective.duration,
            rests: objective.rests,
            restDuration: objective.restDuration,
            repetitions: objective.repetitions,
        });
    }

    descriptionDraft += objective?.wasDone === true
        ? t('page_dashboard.objective.was_done.true')
        : t('page_dashboard.objective.was_done.false');

    const description: string = `${descriptionDraft}\nID: ${String(objective.identifier)}.`;

    return description;
}

// Funcion para reiniciar diariamente los objetivos
/**
 * Function to daily reset objectives.
 *
 * @async
 * @returns {Promise<void>}
 */
const resetObjectivesDaily = async (): Promise<void> => {
    try {
        const objectives = await getObjectives();
        const nextDay = (adjustedToday + 1) % 7;

        if (Array.isArray(objectives)) {
            const updatedObjectives = objectives.map(obj => {
                if (obj.days && obj.days[nextDay]) {
                    return { ...obj, wasDone: false };
                }
                return obj;
            });

            await saveObjectives(updatedObjectives);
        } else {
            termLog("", "error")
        }
    } catch (e) {
        termLog("Got an error resetting objectives! " + e, "error");
    }
};

// La registramos
const BACKGROUND_ACTIVE_OBJECTIVE_FETCHING = 'background-active-objective-fetching';

TaskManager.defineTask(BACKGROUND_ACTIVE_OBJECTIVE_FETCHING, async () => {
    try {
        await resetObjectivesDaily();
        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (e) {
        termLog('Error executing background fetch task: ' + e, "error");
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

async function registerBackgroundObjectivesFetchAsync() {
    try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_ACTIVE_OBJECTIVE_FETCHING, {
            minimumInterval: 60 * 10,
            stopOnTerminate: false,
            startOnBoot: true,
        });
        termLog('Background fetch task registered', "success");
    } catch (e) {
        termLog('Error registering background fetch task: ' + e, "error");
    }
}

// Funcion para verificar si tienes que hacer objetivos hoy o no, y si los has hecho
/**
 * Verifies if there are any objectives due today or not, and if they have been done or not.
 *
 * @param {{ [key: string]: Objective }} objectives A [key: string]: Objective object.
 * @returns {(null | true | false)} Null if no objectives at all, false if none is due today (or there is but was already done), and true if there's any due today.
 */
function checkForTodaysObjectives(objectives: { [key: string]: Objective }): null | true | false {
    if (!objectives || Object.keys(objectives).length === 0) {
        return null;
    }

    const objectiveKeys = Object.keys(objectives);
    const dueTodayObjectives = objectiveKeys
        .map(key => objectives[key])
        .filter(obj => obj.days[adjustedToday] && !obj.wasDone);

    if (dueTodayObjectives.length > 0) {
        return true;
    }

    const allObjectivesDone = objectiveKeys.every(
        key => objectives[key].wasDone || !objectives[key].days || !objectives[key].days[adjustedToday]
    );

    return allObjectivesDone ? false : null;
}

/**
 * Turns objective arrays where [key: string] is used onto objects to avoid errors.
 *
 * @param {Objective[]} objectives The `Objective[]` you want to correct
 * @returns {{ [key: string]: Objective }} The corrected object
 */
function objectiveArrayToObject(objectives: Objective[]): { [key: string]: Objective } {
    // i'll be honest, this .reduce() thingy is not something i wrote...
    // if it breaks, dont blame it on me lmao
    const objectivesObject = objectives.reduce((acc, objective) => {
        acc[objective.identifier] = objective;
        return acc;
    }, {} as { [key: string]: Objective });

    return objectivesObject;
}

/**
 * Calculates the duration of each fragment of a session. Let me explain: Sessions support rests, which - as the name implies - are pauses of a fixed duration between a session, for the user to rest.
 * While the duration of a rest is specified by the user, it's position is not, instead PersonaPlus will (thanks to this function) distribute evenly each rest between all the duration of the session. This implies splitting the session's duration into **fragments**, separated by rests.
 *
 * @param {number | null} duration The duration (in seconds) of the whole session.
 * @param {number | null} rests The amount of rests of the session.
 * @returns {number} A number, the amount of seconds each fragment shall last. If any of the params is null / invalid, throws an error.
 */
function calculateSessionFragmentsDuration(duration: number | null, rests: number | null): number {
    if (rests !== null && rests < 0) {
        termLog("React error: Negative rests? Seriously? Check your code", "error");
        throw new Error("Negative rests? Seriously? Check your code"); // heh~
    } else if (rests === null || duration === null) {
        termLog("React error: Got a null value. Objective is not getting fetched correctly? Check your code", "error");
        throw new Error("React error: Got a null value. Objective is not getting fetched correctly? Check your code"); // heh~
    } else {
        return duration / (rests + 1);
    }
}

/**
 * Saves the results of an objective to a daily registry.
 *
 * @param {number} id ID of the objective
 * @param {TodaysDay} date Today's date. Use `getCurrentDate()` to get it.
 * @param {boolean} wasDone Wether the objective was done or not.
 * @param {?string} [performance] Results for the session from OpenHealth. Optional (the user could have not done the objective, so no data would exist).
 */
function saveDailyObjectivePerformance(id: number, date: TodaysDay, wasDone: boolean, performance?: string) {
    const saveObjective = async () => {
        try {
            // Fetch old data
            const prevDailySavedData = await AsyncStorage.getItem("dailyObjectivesStorage");
            if (!prevDailySavedData) {
                await AsyncStorage.setItem("dailyObjectivesStorage", JSON.stringify({}))
            }
            // If there's no old data, creates an {}
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
            await AsyncStorage.setItem("dailyObjectivesStorage", JSON.stringify(dailyData));
            termLog(`Objective ${id} data saved for ${date}`, "success");
        } catch (e) {
            if (id) {
                termLog(`Error saving user's performance for objective ${id}, caught: ${e}`, "error");
            } else {
                termLog(`Error saving user's performance for objective (no ID), caught: ${e}`, "error");
            }
        }
    };

    saveObjective();
}

/**
 * Fetches the daily objective registry. Async function.
 *
 * @async
 * @param {("string" | "object")} [wayToGetThem="object"] Whether you want to get them as an object or as a stringified JSON
 * @returns {Promise<string | object>} The objectives daily log in the desired format
 */
const getObjectivesDailyLog = async (wayToGetThem: "string" | "object" = "object"): Promise<string | object> => {
    try {
        const storedObjectives: string | null = await AsyncStorage.getItem("dailyObjectivesStorage");
        const objectives: object = storedObjectives ? JSON.parse(storedObjectives) : [];

        if (wayToGetThem === "object") {
            return objectives;
        } else if (wayToGetThem === "string") {
            return JSON.stringify(objectives);
        } else {
            throw new Error("Invalid wayToGetThem specified");
        }
    } catch (e) {
        termLog("Got an error fetching objectives! " + e, "error");
        return wayToGetThem === "object" ? [] : ""; // Return empty array or string based on format
    }
}

export { getObjectives, deleteObjective, markObjectiveAsDone, clearObjectives, getObjectiveByIdentifier, defineObjectiveDescription, registerBackgroundObjectivesFetchAsync, checkForTodaysObjectives, objectiveArrayToObject, calculateSessionFragmentsDuration, saveDailyObjectivePerformance, getObjectivesDailyLog };
