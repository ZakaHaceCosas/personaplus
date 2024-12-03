import StoredItemNames from "@/constants/StoredItemNames";
import { Experiment, Experiments } from "@/types/User";
import { AsyncStorage } from "expo-sqlite/kv-store";
import { logToConsole } from "./debug/Console";
import { DEFAULT_EXPERIMENTS } from "@/constants/Experiments";

async function GetExperiments(): Promise<Experiments> {
    try {
        const stuff = await AsyncStorage.getItem(StoredItemNames.experiments);
        if (!stuff || stuff === null || stuff === "") {
            await logToConsole(
                "Turns out experiments don't exist? Something has probably gone wrong during the onboarding process. Whatever, no error thrown, we'll set everything to disabled and carry on.",
                "warn",
            );
            await AsyncStorage.setItem(
                StoredItemNames.experiments,
                JSON.stringify(DEFAULT_EXPERIMENTS),
            );
            return DEFAULT_EXPERIMENTS;
        }
        return JSON.parse(stuff);
    } catch (e) {
        throw e;
    }
}

async function ToggleExperiment(
    experiment: Experiment,
    toggle: boolean,
): Promise<void> {
    try {
        const experiments = await GetExperiments();
        if (experiments[experiment] === toggle) return; // avoid unneeded AsyncStorage request to rewrite the same stuff
        experiments[experiment] = toggle;
        await AsyncStorage.setItem(
            StoredItemNames.experiments,
            JSON.stringify(experiments),
        );
        return;
    } catch (e) {
        throw e;
    }
}

export { ToggleExperiment, GetExperiments };
