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
import { adjustedToday } from '@/src/toolkit/today';

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

export { deleteObjective, markObjectiveAsDone, clearObjectives, getObjectiveByIdentifier, defineObjectiveDescription, registerBackgroundObjectivesFetchAsync, checkForTodaysObjectives };
