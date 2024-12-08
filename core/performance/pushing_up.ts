/*
CALCULATE PUSHING UP PERFORMANCE
*/

import CreateComponentDataUtilities from "@/core/tools/core_library_data_builder";
import { CoreLibraryResponse } from "@/core/types/core_library_response";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "03/08/2024",
    ["https://fitnessvolt.com/calories-burned-push-up-calculator/"],
);

/**
 * Calculate the calories burnt during a push up session based on given parameters.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param time The duration in MINUTES of the exercise performed by the subject.
 * @param hands Whether push ups were done with both hands or only one.
 * @param pushUps The amount of push ups that were done.
 * @returns A standard `CoreLibraryResponse` with the desired results.
 */

export default function calculateLiftingPerformance(
    gender: "male" | "female",
    weight: number,
    time: number,
    pushUps: number,
    _hands: number, // TODO - USE THIS
): CoreLibraryResponse {
    const calcMet = (): number => {
        // General MET values, according to source
        const moderateMET = 3.8;
        const vigorousMET = 8.0;

        // Thresholds for moderate and vigorous effort push-up rates
        // Source? Good question :skull:
        // let's rely on open-source repo getting popular and all of this being reviewed
        // don't kill me if i mistake, im not medic, i just trust online sources
        const moderateThreshold = gender === "male" ? 10 : 8;
        const vigorousThreshold = gender === "male" ? 20 : 15;

        // Push-up rate
        const rate = pushUps / time;

        // Estimate effort based on push-up rate and adjust based on age
        if (rate >= vigorousThreshold) {
            return vigorousMET;
        } else if (rate >= moderateThreshold) {
            return moderateMET;
        } else {
            // Less than moderate effort, assuming moderate MET for calculation
            return moderateMET;
        }
    };

    const calculatePerformance = (): number => {
        const met = calcMet();

        const calculateCaloriesBurntPerMinute = () => {
            // (3.5 * MET * WEIGHT[kg]) / 200
            const firstStep = 3.5 * met;
            const secondStep = firstStep * weight;
            const thirdStep = secondStep / 200; // CALORIES FOR ONE MINUTE
            return thirdStep;
        };
        const caloriesBurnt: number = calculateCaloriesBurntPerMinute() * time;
        return caloriesBurnt;
    };

    const caloriesBurnt: number = calculatePerformance();

    const response: CoreLibraryResponse = {
        result: caloriesBurnt,
        context: `We estimated ${caloriesBurnt} cal burnt for this session.`,
        explanation:
            "The 'performance' of a pushing up session can be measured in burnt calories, which are obtained with a series of generic calculations using weight of the subject and other parameters like the push ups or the duration of the session.",
    };

    return response;
}
