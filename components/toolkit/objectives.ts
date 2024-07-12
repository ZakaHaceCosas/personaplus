import AsyncStorage from '@react-native-async-storage/async-storage';
import { Objective } from '@/components/types/Objective';
import { termLog } from '@/app/DeveloperInterface';
import * as Router from "expo-router"
import * as Native from "react-native"

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

// Función para marcar un objetivo como 'wasDone: true' dado su identificador
const markObjectiveAsDone = async (identifier: number): Promise<void> => {
    try {
        const objectives = await getObjectives();
        const updatedObjectives = objectives.map(obj =>
            obj.identifier === identifier ? { ...obj, wasDone: true } : obj
        );
        await saveObjectives(updatedObjectives);
        Router.router.navigate("/")
        if (Native.Platform.OS === "android") {
            Native.ToastAndroid.show(
                "Marked as done!",
                Native.ToastAndroid.LONG
            )
        }
    }
    catch (e) {
        const log: string = "Got an error marking objective as done! " + e
        termLog(log, "error")
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

export { deleteObjective, markObjectiveAsDone, clearObjectives, fetchObjectives };
