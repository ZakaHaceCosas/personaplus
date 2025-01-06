import StoredItemNames from "@/constants/stored_item_names";
import { Experiment, Experiments } from "@/types/user";
import { AsyncStorage } from "expo-sqlite/kv-store";
import { logToConsole } from "@/toolkit/console";
import { DEFAULT_EXPERIMENTS } from "@/constants/experiments";

/**
 * Returns all experiments and their status.
 *
 * @async
 * @returns {Promise<Experiments>}
 */
async function GetExperiments(): Promise<Experiments> {
    try {
        const stuff = await AsyncStorage.getItem(StoredItemNames.experiments);
        if (!stuff || stuff === null || stuff === "") {
            logToConsole(
                "Turns out experiments don't exist? Something has probably gone wrong during the onboarding process. Whatever, no error thrown, we'll set everything to disabled and carry on.",
                "warn",
            );
            await AsyncStorage.setItem(
                StoredItemNames.experiments,
                JSON.stringify(DEFAULT_EXPERIMENTS),
            );
            return DEFAULT_EXPERIMENTS;
        }
        let experiments: Experiments;
        try {
            experiments = JSON.parse(stuff);
            // validate
            for (const key in DEFAULT_EXPERIMENTS) {
                if (!(key in experiments)) {
                    // if smth is missing, reset to default because we don't want to break anything (as we can just remove experiments from one update to another)
                    logToConsole(
                        `Missing experiment key "${key}". Resetting to default.`,
                        "warn",
                    );
                    await AsyncStorage.setItem(
                        StoredItemNames.experiments,
                        JSON.stringify(DEFAULT_EXPERIMENTS),
                    );
                    return DEFAULT_EXPERIMENTS;
                }
            }
        } catch (e) {
            // if anything goes wrong, just return the default experiments
            logToConsole(
                `Error parsing stored experiments, resetting to default. ${e}`,
                "warn",
            );
            await AsyncStorage.setItem(
                StoredItemNames.experiments,
                JSON.stringify(DEFAULT_EXPERIMENTS),
            );
            return DEFAULT_EXPERIMENTS;
        }
        return experiments;
    } catch (e) {
        logToConsole(
            `Unexpected error while fetching experiments: ${e}`,
            "warn",
        );
        throw e;
    }
}

/**
 * Enables or disables a given experiment.
 *
 * @async
 * @param {Experiment} experiment Experiment to be toggled.
 * @param {boolean} toggle Status you want to set it to.
 * @returns {Promise<void>}
 */
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

export { GetExperiments, ToggleExperiment };
