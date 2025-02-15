import StoredItemNames from "@/constants/stored_item_names";
import {
    ActiveObjective,
    ActiveObjectiveWithoutId,
} from "@/types/active_objectives";
import {
    PassiveObjective,
    PassiveObjectiveWithoutId,
} from "@/types/passive_objectives";
import AsyncStorage from "expo-sqlite/kv-store";
import { logToConsole } from "../console";
import { TFunction } from "i18next";
import { ShowToast } from "../android";

/**
 * Returns all objectives from AsyncStorage as an `ActiveObjective[]` or a `PassiveObjective[]` (depending on chosen category), or `null` if there aren't any objectives.
 *
 * @async
 * @param {"active" | "passive"} category Category to retrieve.
 * @returns {Promise<ActiveObjective[] | PassiveObjective[] | null>} - Returns the objectives as an `ActiveObjective[] | PassiveObjective[]`.
 */
async function GetAllObjectives(
    category: "passive",
): Promise<PassiveObjective[] | null>;
async function GetAllObjectives(
    category: "active",
): Promise<ActiveObjective[] | null>;
async function GetAllObjectives(
    category: "active" | "passive",
): Promise<ActiveObjective[] | PassiveObjective[] | null> {
    try {
        const storedObjectives: string | null = await AsyncStorage.getItem(
            category === "active"
                ? StoredItemNames.activeObjectives
                : StoredItemNames.passiveObjectives,
        );

        if (!storedObjectives || storedObjectives.trim() === "") {
            logToConsole(
                `Warning! There are no ${category} objectives`,
                "warn",
                undefined,
            );
            return null;
        }

        // non-explicitly typed in purpose
        const objectives = JSON.parse(storedObjectives);

        if (!Array.isArray(objectives)) {
            logToConsole(
                "Warning! Objectives are not an array",
                "warn",
                undefined,
            );
            return null;
        }

        if (objectives.length === 0) {
            return null;
        }

        return objectives;
    } catch (e) {
        logToConsole(`Failed to get objectives: ${e}`, "error", {
            location: "@/toolkit/objectives/common.ts",
            isHandler: false,
            function: "GetAllObjectives()",
        });
        return null;
    }
}

/**
 * Retrieves a single objective from AsyncStorage by its identifier.
 *
 * @async
 * @param {number} identifier The unique identifier of the objective to retrieve.
 * @param {"active" | "passive"} category Category to retrieve from.
 * @returns {Promise<ActiveObjective | PassiveObjective | null>} Returns the objective if found, otherwise null.
 */
async function GetObjective(
    identifier: number,
    category: "passive",
): Promise<PassiveObjective | null>;
async function GetObjective(
    identifier: number,
    category: "active",
): Promise<ActiveObjective | null>;
async function GetObjective(
    identifier: number,
    category: "active" | "passive",
): Promise<ActiveObjective | PassiveObjective | null> {
    try {
        // PS. doing GetAllObjectives(category) sounds smarter BUT gives a type error
        const objectives: (PassiveObjective[] | ActiveObjective[]) | null =
            category === "active"
                ? await GetAllObjectives("active")
                : await GetAllObjectives("passive");

        if (!objectives) {
            logToConsole("No objectives exist!", "error");
            return null;
        }

        const objective: ActiveObjective | PassiveObjective | undefined =
            objectives.find(
                (obj: ActiveObjective | PassiveObjective): boolean =>
                    obj.identifier === identifier,
            );

        if (objective === undefined) {
            return null;
        }

        return objective;
    } catch (e) {
        throw new Error(
            `Got an error getting ${category} objective ${identifier}: ${e}`,
        );
    }
}

/**
 * Deletes a specific objective from the AsyncStorage, given it's identifier.
 *
 * @async
 * @param {number} identifier The identifier.
 * @param {"active" | "passive"} category Category to delete from.
 * @returns {Promise<void>}
 */
async function DeleteObjective(
    identifier: number,
    category: "active" | "passive",
): Promise<void> {
    try {
        const objectives: ActiveObjective[] | PassiveObjective[] | null =
            category === "active"
                ? await GetAllObjectives("active")
                : await GetAllObjectives("passive");
        if (!objectives) return;

        const updatedObjectives: PassiveObjective[] | ActiveObjective[] =
            category === "active"
                ? (objectives as ActiveObjective[]).filter(
                      (obj: ActiveObjective): boolean =>
                          obj.identifier !== identifier,
                  )
                : (objectives as PassiveObjective[]).filter(
                      (obj: PassiveObjective): boolean =>
                          obj.identifier !== identifier,
                  );

        await AsyncStorage.setItem(
            category === "active"
                ? StoredItemNames.activeObjectives
                : StoredItemNames.passiveObjectives,
            JSON.stringify(updatedObjectives),
        );
    } catch (e) {
        logToConsole(
            `Error deleting ${category} objective ${identifier}: ${e}`,
            "error",
        );
    }
}

/**
 * Creates an objective given it's category and data.
 *
 * @async
 * @param {ActiveObjectiveWithoutId | PassiveObjectiveWithoutId} target The objective to create.
 * @param {"active" | "passive"} category Category to delete from.
 * @returns {Promise<void>}
 */
async function CreateObjective(
    target: ActiveObjectiveWithoutId,
    category: "active",
    t: TFunction,
): Promise<0 | 1>;
async function CreateObjective(
    target: PassiveObjectiveWithoutId,
    category: "passive",
    t: TFunction,
): Promise<0 | 1>;
async function CreateObjective(
    target: ActiveObjectiveWithoutId | PassiveObjectiveWithoutId,
    category: "active" | "passive",
    t: TFunction,
): Promise<0 | 1> {
    try {
        const nullishObjectives: ActiveObjective[] | PassiveObjective[] | null =
            category === "active"
                ? await GetAllObjectives("active")
                : await GetAllObjectives("passive");
        const objectives: ActiveObjective[] | PassiveObjective[] =
            !nullishObjectives || nullishObjectives.length === 0
                ? category === "active"
                    ? ([] as ActiveObjective[])
                    : ([] as PassiveObjective[])
                : nullishObjectives;

        function generateIdentifier(
            objs: ActiveObjective[] | PassiveObjective[],
        ): number {
            const generateObjectiveId: () => number = (): number => {
                return Math.floor(Math.random() * 9000000000) + 1000000000;
            };

            let newIdentifier: number = generateObjectiveId();
            // verify there aren't duplicates
            while (
                objs.some(
                    (obj: ActiveObjective | PassiveObjective): boolean =>
                        obj.identifier === newIdentifier,
                )
            ) {
                newIdentifier = generateObjectiveId();
            }
            return newIdentifier;
        }

        const newObjective: ActiveObjective | PassiveObjective = {
            ...(target as ActiveObjectiveWithoutId | PassiveObjectiveWithoutId),
            identifier: generateIdentifier(objectives),
        };

        if (category === "active") {
            (objectives as ActiveObjective[]).push(
                newObjective as ActiveObjective,
            );
        } else {
            (objectives as PassiveObjective[]).push(
                newObjective as PassiveObjective,
            );
        }

        await AsyncStorage.setItem(
            category === "active"
                ? StoredItemNames.activeObjectives
                : StoredItemNames.passiveObjectives,
            JSON.stringify(objectives),
        );

        let message: string;
        if (category === "active") {
            const activeTarget = target as ActiveObjectiveWithoutId;
            message = t("pages.createActiveObjective.doneFeedback", {
                obj: t(
                    `globals.supportedActiveObjectives.${activeTarget.exercise}.name`,
                ),
            });
        } else {
            const passiveTarget = target as PassiveObjectiveWithoutId;
            message = `Created ${passiveTarget.goal} successfully (TODO: translate)`;
        }

        ShowToast(message);
        logToConsole(
            `Created objective with ID ${newObjective.identifier} successfully! Full JSON of the created objective:\n${JSON.stringify(
                newObjective,
            )}"`,
            "success",
            undefined,
            false,
        );
        return 0;
    } catch (e) {
        logToConsole(
            `Something went wrong creating an objective. JSON:\n${JSON.stringify(
                target,
            )}\n\nError: ${e}`,
            "error",
        );
        return 1;
    }
}

export { GetAllObjectives, GetObjective, DeleteObjective, CreateObjective };
