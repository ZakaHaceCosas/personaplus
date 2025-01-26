/*
CALCULATE THE METABOLIC EQUIVALENT OF A TASK
*/

import CreateComponentDataUtilities from "@/core/tools/core_library_data_builder";
import { CoreLibraryResponse } from "@/core/types/core_library_response";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "01/07/2024",
    [
        "https://en.wikipedia.org/wiki/Metabolic_equivalent_of_task",
        "https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.107.185649",
        "https://www.inchcalculator.com/calories-burned-weight-lifting-calculator/",
    ],
);

/**
 * Returns the Metabolic Equivalent of a Task
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param intensity The intensity of the activity. It's a very long array of options, see the documentation for more info on which one to choose.
 * @returns A standard `CoreLibraryResponse` with the desired results.
 */

export default function calculateMetabolicEquivalentOfTask(
    intensity:
        | "super_low"
        | "very_low"
        | "low"
        | "low_to_mid"
        | "mid"
        | "mid_to_high"
        | "not_too_high"
        | "high"
        | "higher"
        | "very_high"
        | "very_high_to_intense"
        | "not_too_intense"
        | "a_bit_intense"
        | "intense"
        | "pretty_intense"
        | "very_intense"
        | "really_intense",
): CoreLibraryResponse {
    let METs: number; // MET - Metabolic Equivalent of Task

    // Assign METs based on intensity level
    if (intensity === "super_low") {
        METs = 1.5;
    } else if (intensity === "very_low") {
        METs = 2.0;
    } else if (intensity === "low") {
        METs = 3.0;
    } else if (intensity === "low_to_mid") {
        METs = 3.5;
    } else if (intensity === "mid") {
        METs = 5.0;
    } else if (intensity === "mid_to_high") {
        METs = 5.0;
    } else if (intensity === "not_too_high") {
        METs = 5.8;
    } else if (intensity === "high") {
        METs = 6.0;
    } else if (intensity === "higher") {
        METs = 6.5; // Adjusted for >6.0
    } else if (intensity === "very_high") {
        METs = 7.4;
    } else if (intensity === "very_high_to_intense") {
        METs = 8.0;
    } else if (intensity === "not_too_intense") {
        METs = 8.8;
    } else if (intensity === "a_bit_intense") {
        METs = 9.8;
    } else if (intensity === "intense") {
        METs = 10.3;
    } else if (intensity === "pretty_intense") {
        METs = 10.5;
    } else if (intensity === "very_intense") {
        METs = 11.0;
    } else if (intensity === "really_intense") {
        METs = 11.2;
    } else {
        throw new Error("CALCULATION ERROR! Intensity is not valid");
    }

    const response: CoreLibraryResponse = {
        result: METs,
        context: `The MET is, for this context, ${METs}, and the intensity would be ${intensity}`,
        explanation:
            "The performance can be measured in burnt calories, which are obtained by calculating the time spent on the exercise, the subject's weight, and the Metabolic Equivalent of Task (MET), a value that helps measure the intensity of a task.",
    };

    return response;
}
