/*
CALCULATE RUNNING PERFORMANCE
*/

import CreateComponentDataUtilities from "@/core/tools/core_library_data_builder";
import { CoreLibraryResponse } from "@/core/types/core_library_response";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "06/12/2024",
    [
        "https://downhilltodowntown.com/how-to-calculate-your-caloric-burn-while-running/",
        // "https://www.topendsports.com/weight-loss/energy-met.htm and https://journals.lww.com/acsm-msse/fulltext/2000/09001/compendium_of_physical_activities__an_update_of.9.aspx",
    ],
);

/**
 * Calculate the calories burnt during a running session based on given parameters.
 * @param weight The weight of the subject in kilograms (KG).
 * @param speed The speed in KM/h the subject was running to.
 * @param time The duration in MINUTES of the exercise performed by the subject.
 * @returns A standard `CoreLibraryResponse` with the desired results.
 */

export default function calculateRunningPerformance(
    weight: number,
    speed: number,
    time: number,
): CoreLibraryResponse {
    let METs: number; // MET - Metabolic Equivalent of Task

    // Assign METs based on speed in km/h
    if (speed > 1.6092 && speed < 3.2181) {
        METs = 2;
    } else if (speed >= 3.2181 && speed <= 4.023) {
        METs = 2.5;
    } else if (speed > 4.023 && speed <= 4.8276) {
        METs = 3.5;
    } else if (speed > 4.8276 && speed <= 5.51) {
        METs = 4;
    } else if (speed > 5.51 && speed <= 6.44) {
        METs = 5;
    } else if (speed > 6.44 && speed <= 8.05) {
        METs = 6;
    } else if (speed > 8.05 && speed <= 9.65) {
        METs = 8;
    } else if (speed > 9.65 && speed <= 11.27) {
        METs = 10;
    } else if (speed > 11.27 && speed <= 12.87) {
        METs = 11;
    } else if (speed > 12.87 && speed <= 14.48) {
        METs = 11.5;
    } else if (speed > 14.48 && speed <= 16.09) {
        METs = 12.5;
    } else {
        METs = 16;
    }

    // Calculate calories burnt
    const result: number = METs * weight * (time * 60);

    const response: CoreLibraryResponse = {
        result,
        context: `Estimated ${result}cal burnt for this session (MET: ${METs}).`,
        explanation:
            "The 'performance' of a running session can be measured in burnt calories, which are obtained calculating the MET value (based on avg. speed) and multiplying by the person's weight and by the duration in hours of the session.",
    };

    return response;
}
