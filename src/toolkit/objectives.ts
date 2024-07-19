// OBJECTIVE TYPE
import { Objective } from '@/src/types/Objective';
// INTERNALS
import { termLog } from '@/app/DeveloperInterface';
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
const getObjectives = async (): Promise<Objective[]> => {
    const storedObjectives: string | null = await AsyncStorage.getItem("objectives");
    return storedObjectives ? JSON.parse(storedObjectives) : [];
};

// Función para guardar los objetivos en el AsyncStorage
const saveObjectives = async (objectives: Objective[]): Promise<void> => {
    await AsyncStorage.setItem("objectives", JSON.stringify(objectives));
};

// Función para eliminar un objetivo dado su identificador
const deleteObjective = async (identifier: number): Promise<void> => {
    const objectives = await getObjectives();
    const updatedObjectives = objectives.filter(obj => obj.identifier !== identifier);
    await saveObjectives(updatedObjectives);
};

// Función para marcar un objetivo como completado dado su identificador
const markObjectiveAsDone = async (identifier: number, confirmWithToast: boolean, t: TFunction): Promise<void> => {
    try {
        const objectives = await getObjectives();
        const updatedObjectives = objectives.map(obj =>
            obj.identifier === identifier ? { ...obj, wasDone: true } : obj
        );
        await saveObjectives(updatedObjectives);
        router.navigate("/");
        if (Platform.OS === "android" && confirmWithToast === true) {
            ToastAndroid.show(t("messages.marked_objective_as_done"), ToastAndroid.LONG);
        }
    } catch (e) {
        termLog("Got an error marking objective as done! " + e, "error");
    }
};

// Funcion para obtener los objetivos tanto como cadena como como arreglo
// eslint-disable-next-line
const fetchObjectives = async (wayToGetThem: "object" | "string"): Promise<any> => {
    try {
        const objectives = await getObjectives();
        let response: null | object | string = null;

        if (objectives !== null) {
            if (wayToGetThem === "object") {
                response = objectives;
            } else if (wayToGetThem === "string") {
                response = JSON.stringify(objectives);
            } else {
                termLog("Invalid value for parameter wayToGetThem", "error");
            }
        }

        return response;
    } catch (e) {
        termLog("Got an error fetching objectives! " + e, "error");
    }
};

// Funcion para vaciar / borrar los objetivos
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
const getObjectiveByIdentifier = async (identifier: number): Promise<Objective | null> => {
    try {
        const objectives = await getObjectives();
        const objective = objectives.find(obj => obj.identifier === identifier);
        return objective || null;
    } catch (e) {
        termLog("Got an error fetching the objective by identifier! " + e, "error");
        return null;
    }
};

// Funcion para definir la descripción del objetivo
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
const resetObjectivesDaily = async (): Promise<void> => {
    try {
        const objectives = await getObjectives();
        const nextDay = (adjustedToday + 1) % 7;

        const updatedObjectives = objectives.map(obj => {
            if (obj.days && obj.days[nextDay]) {
                return { ...obj, wasDone: false };
            }
            return obj;
        });

        await saveObjectives(updatedObjectives);
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
 * Checks the objectives and determines if there are any objectives to be done today.
 *
 * The function performs the following checks:
 * - Returns `null` if there are no objectives.
 * - Returns `true` if there is at least one objective that needs to be done today.
 * - Returns `false` if all objectives are either done or not due today.
 *
 * @param {Objective[]} objectives - The Objectives[] object
 * @returns {null | true | false} - Returns `null` if there are no objectives, `true` if there is at least one objective due today, and `false` if all objectives are either completed or not due today.
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

export { deleteObjective, markObjectiveAsDone, clearObjectives, fetchObjectives, getObjectiveByIdentifier, defineObjectiveDescription, registerBackgroundObjectivesFetchAsync, checkForTodaysObjectives };
