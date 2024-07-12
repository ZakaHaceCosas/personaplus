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
        // only if success
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

export { deleteObjective, markObjectiveAsDone };
