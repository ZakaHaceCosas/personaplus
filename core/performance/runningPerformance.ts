// TODO
// CALCULATIONS *NOT* ALRIGHT
// los cálculos *NO* están bien

/*
CALCULATE RUNNING / WALKING PERFORMANCE
*/

import CreateComponentDataUtilities from "@/core/tools/CoreLibraryDataBuilder";

export const { getSource, getLastUpdate } = CreateComponentDataUtilities(
    "26/06/2024",
    "https://downhilltodowntown.com/how-to-calculate-your-caloric-burn-while-running/ and https://scielo.isciii.es/scielo.php?script=sci_arttext&pid=S0212-16112012000400040 and https://eresdeportista.com/salud/como-calcular-calorias-quemadas-ejercicio/ and https://www.topendsports.com/weight-loss/energy-met.htm andhttps://journals.lww.com/acsm-msse/fulltext/2000/09001/compendium_of_physical_activities__an_update_of.9.aspx and https://www.cmu.edu/common-cold-project/measures-by-study/health-practices/physical-activity/index.html",
);

interface RUNNING_WALKING_Response {
    result: number;
    subject?: {
        age: number;
        gender: "male" | "female";
        weight: number;
        height: number;
        speed: number;
        time: number;
    };
    context?: string;
    explanation?: string;
}

/**
 * Calculate the calories burnt during running or walking based on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param height The height of the subject in centimeters (CM).
 * @param speed The speed in KM/h the subject was running to.
 * @param time The duration in MINUTES of the exercise performed by the subject.
 * @param provideContext Whether to provide a brief contextualization about the result.
 * @param provideExplanation Whether to provide a detailed explanation about what the calculation means.
 * @returns The calories burnt if neither provideContext nor provideExplanation are true, otherwise returns a RUNNING_WALKING_Response object.
 */

export default function calculateRunningOrWalkingPerformance(
    age: number,
    gender: "male" | "female",
    weight: number,
    height: number,
    speed: number,
    time: number,
    provideContext?: boolean,
    provideExplanation?: boolean,
): RUNNING_WALKING_Response {
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

    const response: RUNNING_WALKING_Response = {
        result: caloriesBurnt,
    };

    if (provideContext) {
        response.subject = {
            age,
            gender,
            weight,
            height,
            speed,
            time,
        };
        response.context =
            "The performance of a weight lifting session is measured in burnt calories, being an estimated " +
            caloriesBurnt +
            "cal for this session.";
    }

    if (provideExplanation) {
        response.explanation =
            "The 'performance' of a running (or walking) session can be measured in burnt calories, which are obtained with a series of generic calculations using age, weight, height, gender of the subject, and other parameters like the estimate speed, time duration of the session, and the MET.";
    }

    return response;
}
