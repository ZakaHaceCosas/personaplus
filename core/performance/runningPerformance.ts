// TODO
// CALCULATIONS *NOT* ALRIGHT
// los cálculos *NO* están bien

/*
CALCULATE RUNNING PERFORMANCE
*/

import CreateComponentDataUtilities from "@/core/tools/CoreLibraryDataBuilder";
import { CoreLibraryResponse } from "@/core/types/CoreLibraryResponse";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "26/06/2024",
    [
        "https://downhilltodowntown.com/how-to-calculate-your-caloric-burn-while-running/",
        "https://scielo.isciii.es/scielo.php?script=sci_arttext&pid=S0212-16112012000400040",
        "https://eresdeportista.com/salud/como-calcular-calorias-quemadas-ejercicio/",
        "https://www.topendsports.com/weight-loss/energy-met.htm andhttps://journals.lww.com/acsm-msse/fulltext/2000/09001/compendium_of_physical_activities__an_update_of.9.aspx",
        "https://www.cmu.edu/common-cold-project/measures-by-study/health-practices/physical-activity/index.html",
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
    let METs: number | null; // MET - Metabolic Equivalent of Task

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
    } else if (speed > 16.09) {
        METs = 16;
    } else {
        METs = null;
    }

    // Constant factor for calories burnt calculation
    const caloriesBurntPerKgPerHour = 0.075 * 4.3;

    // Calculate calories burnt
    let caloriesBurnt: number;

    if (METs) {
        caloriesBurnt = METs * caloriesBurntPerKgPerHour * weight * time;
    } else {
        caloriesBurnt = 0; // if the MET is not calculable, it returns 0.
    }

    const response: CoreLibraryResponse = {
        result: caloriesBurnt,
        context:
            "The performance of a weight lifting session is measured in burnt calories, being an estimated " +
            caloriesBurnt +
            "cal for this session.",
        explanation:
            "The 'performance' of a running session can be measured in burnt calories, which are obtained with a series of generic calculations using age, weight, height, gender of the subject, and other parameters like the estimate speed, time duration of the session, and the MET.",
    };

    return response;
}
