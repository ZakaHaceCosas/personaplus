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
 * @param {boolean} providePercentage Whether to provide the One-Repetition Maximum percentage, an extra calculation helpful to determine the Metabolic Equivalent of Task for weightlifting.
 * @returns A standard `CoreLibraryResponse` with the desired results.
 */

export default function calculateOneRepetitionMax(
    weightLiftedPerRep: number,
    amountOfReps: number,
    providePercentage?: boolean,
): CoreLibraryResponse {
    const repsTimesThirty: number = amountOfReps / 30;

    function firstOperation(): number {
        const secondStep: number = 1 + repsTimesThirty;
        const thirdStep: number = weightLiftedPerRep * secondStep;

        const result: number = thirdStep;
        return result;
    }

    const result: number = firstOperation();

    const response: CoreLibraryResponse = {
        result: result,
        context:
            "The OneRepMax is the max amount of weight that a person can lift, being of " +
            result +
            " for this context.",
        explanation:
            "The One Repetition Maximum is the maximum amount of weight a person can lift. It can also be considered the max amount of force a person can apply in one maximal contraction. While the most precise method of measuring would be just trial and error testing with the person, it can be estimated mathematically using one of the many possible formulas, e.g., Epley's formula.",
    };

    if (providePercentage) {
        function secondOperation(): number {
            const firstStep: number = repsTimesThirty;
            const secondStep: number = 1 / firstStep;
            const result: number = secondStep * 100;

            return result;
        }
        response.alternate = secondOperation();
    }

    return response;
}
