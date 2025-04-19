/*
CALCULATE ONE REPETITION MAX
*/

import CreateComponentDataUtilities from "@/core/tools/core_library_data_builder";
import { CoreLibraryResponse } from "@/core/types/core_library_response";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "08/07/2024",
    ["https://en.wikipedia.org/wiki/One-repetition_maximum"],
);

/**
 * Calculate the One-Repetition Maximum (1RM) for weight lifting sessions.
 * @param {number} weightLiftedPerRep The total weight lifted per repetition (in kilograms or pounds).
 * @param {number} amountOfReps The number of repetitions performed.
 * @returns A standard `CoreLibraryResponse` with the desired results. Includes `alternate`; the One-Repetition Maximum percentage, an extra calculation helpful to determine the Metabolic Equivalent of Task for weightlifting.
 */

export default function calculateOneRepetitionMax(
    weightLiftedPerRep: number,
    amountOfReps: number,
): CoreLibraryResponse {
    const repsTimesThirty: number = amountOfReps / 30;

    function firstOperation(): number {
        const secondStep: number = 1 + repsTimesThirty;
        const thirdStep: number = weightLiftedPerRep * secondStep;

        const result: number = thirdStep;
        return result;
    }

    const result: number = firstOperation();

    function secondOperation(): number {
        const firstStep: number = repsTimesThirty;
        const secondStep: number = 1 / firstStep;
        const result: number = secondStep * 100;

        return result;
    }

    const alternate: number = secondOperation();

    return {
        result,
        alternate,
        context: `The one rep max would be of ${result} for this context.`,
        explanation:
            "The One Repetition Maximum is the maximum amount of weight a person can lift. It can also be considered the max amount of force a person can apply in one maximal contraction. While the most precise method of measuring would be just trial and error testing with the person, it can be estimated mathematically using one of the many possible formulas, e.g., Epley's formula.",
    };
}
