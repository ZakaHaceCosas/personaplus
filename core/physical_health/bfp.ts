/*
CALCULATE BODY FAT PERCENTAGE
*/
import { CoreLibraryResponse } from "@/core/types/core_library_response";
import calculateBodyMassIndex from "@/core/physical_health/bmi";
import CreateComponentDataUtilities from "@/core/tools/core_library_data_builder";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "26/06/2024",
    [
        "https://www.inchcalculator.com/body-fat-calculator/",
        "https://pubmed.ncbi.nlm.nih.gov/10966886/",
    ],
);

/**
 * Calculate Body Fat Percentage (BFP) based on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param height The height of the subject in centimeters (CM).
 * @returns A standard `CoreLibraryResponse` with the desired results.
 */

export default function calculateBodyFatPercentage(
    age: number,
    gender: "male" | "female",
    weight: number,
    height: number,
): CoreLibraryResponse {
    // This is calculated using the BMI method, so the BMI is required.
    const bmi: CoreLibraryResponse = calculateBodyMassIndex(
        age,
        gender,
        weight,
        height,
    );
    let bfp: number;

    if (gender === "male") {
        // male
        const firstStep = 1.2 * Number(bmi);
        const secondStep = 0.23 * age;
        const thirdStep = firstStep + secondStep;
        const fourthStep = thirdStep - 16.2;
        bfp = fourthStep;
    } else {
        // female
        const firstStep = 1.2 * Number(bmi);
        const secondStep = 0.23 * age;
        const thirdStep = firstStep + secondStep;
        const fourthStep = thirdStep - 5.4;
        bfp = fourthStep;
    }

    let context: string | undefined;

    if (gender === "male") {
        if (bfp >= 0 || bfp <= 2) {
            context = "extremely low";
        } else if (bfp >= 2 || bfp <= 6) {
            context = "essential fat";
        } else if (bfp >= 6 || bfp <= 13) {
            context = "athlete";
        } else if (bfp >= 13 || bfp <= 17) {
            context = "fitness";
        } else if (bfp >= 18 || bfp <= 25) {
            context = "average";
        } else if (bfp > 25) {
            context = "obesity";
        }
    } else {
        // female
        if (bfp >= 0 || bfp <= 10) {
            context = "extremely low";
        } else if (bfp >= 10 || bfp <= 14) {
            context = "essential fat";
        } else if (bfp >= 14 || bfp <= 21) {
            context = "athlete";
        } else if (bfp >= 21 || bfp <= 25) {
            context = "fitness";
        } else if (bfp >= 25 || bfp <= 31) {
            context = "average";
        } else if (bfp > 32) {
            context = "obesity";
        }
    }

    const response: CoreLibraryResponse = {
        result: bfp,
        context: `Based on BFP, context is ${context}`,
        explanation:
            "Body Fat Percentage, usually calculated as a percentage of body weight. There are several methods for measuring it, and based on the percentage, it's possible to estimate whether the subject has normal weight, overweight, or underweight.",
    };

    return response;
}
