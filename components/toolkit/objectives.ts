// OBJECTIVE TYPE
import { Objective } from '@/components/types/Objective';
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
import { adjustedToday } from '@/components/toolkit/today';

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
const markObjectiveAsDone = async (identifier: number): Promise<void> => {
    try {
        const objectives = await getObjectives();
        const updatedObjectives = objectives.map(obj =>
            obj.identifier === identifier ? { ...obj, wasDone: true } : obj
        );
        await saveObjectives(updatedObjectives);
        router.navigate("/");
        if (Platform.OS === "android") {
            ToastAndroid.show("Marked as done!", ToastAndroid.LONG);
        }
    } catch (e) {
        const log: string = "Got an error marking objective as done! " + e;
        termLog(log, "error");
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
        const log: string = "Got an error fetching objectives! " + e;
        termLog(log, "error");
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
        const log: string = "Got an error clearing objectives! " + e;
        termLog(log, "error");
    }
};

// Función para obtener un objetivo dado su identificador
const getObjectiveByIdentifier = async (identifier: number): Promise<Objective | null> => {
    try {
        const objectives = await getObjectives();
        const objective = objectives.find(obj => obj.identifier === identifier);
        return objective || null;
    } catch (e) {
        const log: string = "Got an error fetching the objective by identifier! " + e;
        termLog(log, "error");
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
        const log: string = "Got an error resetting objectives! " + e;
        termLog(log, "error");
    }
};

// La registramos
const BACKGROUND_FETCH_TASK = 'background-fetch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
        await resetObjectivesDaily();
        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (e) {
        termLog('Error executing background fetch task: ' + e, "error");
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

export async function registerBackgroundObjectivesFetchAsync() {
    try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 60 * 15,
            stopOnTerminate: false,
            startOnBoot: true,
        });
        termLog('Background fetch task registered', "success");
    } catch (e) {
        termLog('Error registering background fetch task: ' + e, "error");
    }
}

export { deleteObjective, markObjectiveAsDone, clearObjectives, fetchObjectives, getObjectiveByIdentifier, defineObjectiveDescription };
