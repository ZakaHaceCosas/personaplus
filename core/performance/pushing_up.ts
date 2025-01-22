/*
CALCULATE PUSHING UP PERFORMANCE
*/

import CreateComponentDataUtilities from "@/core/tools/core_library_data_builder";
import { CoreLibraryResponse } from "@/core/types/core_library_response";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "22/01/2025",
    [
        "https://fitnessvolt.com/calories-burned-push-up-calculator/",
        "https://download.lww.com/wolterskluwer_vitalstream_com/PermaLink/MSS/A/MSS_43_8_2011_06_13_AINSWORTH_202093_SDC1.pdf",
    ],
);

/**
 * Calculate the calories burnt during a push up session based on given parameters.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param time The duration in MINUTES of the exercise performed by the subject.
 * @param pushUps The amount of push ups that were done.
 * @param hands Whether push ups were done with both hands or only one.
 * @returns A standard `CoreLibraryResponse` with the desired results.
 */
export default function calculateLiftingPerformance(
    gender: "male" | "female",
    weight: number,
    time: number,
    pushUps: number,
    hands: number,
): CoreLibraryResponse {
    const calcMet: () => number = (): number => {
        // base MET for moderate-intensity push-ups
        const baseMET = 3.8;

        // reference pace: moderate intensity defined as ~15 push-ups/min
        // this should aligned with research on MET thresholds for resistance exercises.
        const referencePace = 15;

        // for every additional push-up/min estimated increase is ~0.1 MET
        const adjustmentFactor = 0.1;

        // just one hand = more effort, so higher MET
        const oneHandedMultiplier = 1.5;

        // gender adjustment, cause women tend to burn ~10% fewer calories during the same as dudes
        const genderAdjustment: 0.9 | 1 = gender === "female" ? 0.9 : 1;

        // Push-up rate
        const rate: number = pushUps / time;

        // estimate effort
        let met: number = baseMET + adjustmentFactor * (rate - referencePace);

        // adjust for one-handed push-ups
        if (hands === 1) {
            met *= oneHandedMultiplier;
        }

        // adjust for gender
        met *= genderAdjustment;

        return met;
    };

    const calculatePerformance: () => number = (): number => {
        const met: number = calcMet();

        const calculateCaloriesBurntPerMinute: () => number = (): number => {
            // (3.5 * MET * WEIGHT[kg]) / 200
            const firstStep: number = 3.5 * met;
            const secondStep: number = firstStep * weight;
            const thirdStep: number = secondStep / 200; // CALORIES FOR ONE MINUTE
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
