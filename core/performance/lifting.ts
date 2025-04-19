/*
CALCULATE LIFTING PERFORMANCE
*/

import { default as OneRepetitionMax } from "@/core/physical_health/one_rep_max";
import CreateComponentDataUtilities from "@/core/tools/core_library_data_builder";
import { CoreLibraryResponse } from "@/core/types/core_library_response";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "06/12/2024",
    [
        "https://www.calculatorultra.com/es/tool/mets-metabolic-equivalent-calculator.html#gsc.tab=0",
    ],
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
 * @returns {CoreLibraryResponse} A standard `CoreLibraryResponse` with the desired results.
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
    /**
     * Get the Metabolic Equivalent of Task for this
     *
     * TODO - i'll be honest i don't fully trust this formula, but at least we managed to source *part* of the lifting performance, something is something
     */
    const calculateMET = (
        weightLifted: number,
        oneRepMax: number,
        age: number,
        gender: "male" | "female",
        reps: number,
        time: number,
    ): number => {
        const GENDER_COEFFICIENT = gender === "male" ? 1 : 0.85;
        const AGE_ADJUSTMENT = 1 / (1 + 0.01 * (age - 22));
        const BASE_MET = 5.0;

        const firstStep = weightLifted / oneRepMax;
        const secondStep =
            firstStep *
            reps *
            AGE_ADJUSTMENT *
            GENDER_COEFFICIENT *
            time *
            BASE_MET;
        const thirdStep = secondStep / 60;

        return thirdStep;
    };

    const weightLifted = dumbbellWeight * scales;
    const oneRepMax = OneRepetitionMax(weightLifted, repetitions).result;

    const metabolicEquivOfTask = calculateMET(
        weightLifted,
        oneRepMax,
        age,
        gender,
        repetitions,
        time,
    );

    /**
     * Returns calories burnt PER MINUTE
     */
    function calculateCaloriesBurnt() {
        const firstStep = weight / 200;
        const secondStep = firstStep * metabolicEquivOfTask;
        const thirdStep = secondStep * 3.5;
        return thirdStep;
    }

    const caloriesBurnt = calculateCaloriesBurnt() * time;

    const response: CoreLibraryResponse = {
        result: caloriesBurnt,

        context: `We estimated ${calculateCaloriesBurnt()} cal burnt per minute, being ${caloriesBurnt} cal in total.`,
        explanation:
            "The 'performance' of a weight lifting session can be measured in burnt calories, which are obtained with a series of generic calculations using age, weight, height, gender of the subject, and other parameters weight lifted, time duration of the session, and the One Repetition Max.",
    };

    return response;
}
