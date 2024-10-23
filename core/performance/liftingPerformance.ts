// TODO: NOT DONE YET!!!!
// Zaka don't be lazy and work

/*
CALCULATE LIFTING PERFORMANCE
*/

import { default as OneRepetitionMax } from "@/core/physicalHealth/OneRepMax";
import CreateComponentDataUtilities from "@/core/tools/CoreLibraryDataBuilder";
import { CoreLibraryResponse } from "../types/CoreLibraryResponse";

export const { getSource, getLastUpdate } = CreateComponentDataUtilities(
    "01/07/2024",
    "", // FIXME: NEED TO PROVIDE SOURCE
);

/**
 * Calculate the calories burnt during a weight lifting based on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param dumbbellWeight The weight of the dumbbell in kilograms (KG). If two, the weight of one individual scale.
 * @param scales The amount of scales / dumbbells the subject has been working out with.
 * @param time The duration in MINUTES of the exercise performed by the subject.
 * @param repetitions The amount of lifts the subject has done.
 * @returns A standard `CoreLibraryResponse` with the desired results.
 */

export default function calculateLiftingPerformance(
    age: number,
    gender: "male" | "female",
    weight: number,
    time: number,
    dumbbellWeight: number,
    scales: number,
    repetitions: number,
): CoreLibraryResponse {
    // Get the Metabolic Equivalent of Task for this
    const calculateMET = (
        w: number,
        oneRepMax: number,
        a: number,
        g: "male" | "female",
        r: number,
        t: number,
    ): number => {
        const GENDER_COEFFICIENT = g === "male" ? 1 : 0.85;
        const AGE_ADJUSTMENT = 1 / (1 + 0.01 * (a - 22));
        const BASE_MET = 5.0;

        return (
            (BASE_MET *
                (w / oneRepMax) *
                r *
                AGE_ADJUSTMENT *
                GENDER_COEFFICIENT *
                t) /
            60
        );
    };

    const weightLifted = dumbbellWeight * scales;
    const OneRepMaxObject = OneRepetitionMax(weightLifted, repetitions, true);

    const oneRepMax = OneRepMaxObject.result;

    const metabolicEquivOfTask = calculateMET(
        weightLifted,
        oneRepMax,
        age,
        gender,
        repetitions,
        time,
    );

    const caloriesBurntPerKgPerHour = 0.075 * 4.3;

    const caloriesBurnt =
        metabolicEquivOfTask * caloriesBurntPerKgPerHour * weight * time;

    const response: CoreLibraryResponse = {
        result: caloriesBurnt,

        context:
            "The performance of a weight lifting session is measured in burnt calories, being an estimated " +
            caloriesBurnt +
            "cal for this session.",
        explanation:
            "The 'performance' of a weight lifting session can be measured in burnt calories, which are obtained with a series of generic calculations using age, weight, height, gender of the subject, and other parameters weight lifted, time duration of the session, and the One Repetition Max.",
    };

    return response;
}
