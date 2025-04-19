/*
CALCULATE BODY FAT PERCENTAGE
*/
import { CoreLibraryResponse } from "@/core/types/core_library_response";
import calculateBodyMassIndex from "@/core/physical_health/bmi";
import CreateComponentDataUtilities from "@/core/tools/core_library_data_builder";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "17/04/2025",
    [
        "https://www.inchcalculator.com/body-fat-calculator/",
        "https://pubmed.ncbi.nlm.nih.gov/10966886/",
    ],
);

/**
 * Calculate Body Fat Percentage (BFP) based on given parameters. It's not fully accurate as it's BMI based. The US Navy method would be more reliable, but requires more specific data to implement. See us-bfp.ts on this file's directory for that method.
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
    const bmi: number = calculateBodyMassIndex(
        age,
        gender,
        weight,
        height,
    ).result;

    let bfp: number;

    const firstStep = 1.2 * bmi + 0.23 * age;

    bfp = gender === "male" ? firstStep - 16.2 : firstStep - 5.4;

    let context: string;

    const thresholds = {
        low: gender === "male" ? 2 : 10,
        essential: gender === "male" ? 6 : 14,
        athlete: gender === "male" ? 13 : 21,
        fitness: gender === "male" ? 17 : 25,
        average: gender === "male" ? 25 : 31,
    };

    if (bfp >= 0 && bfp <= thresholds.low) {
        context = "extremely low";
    } else if (bfp > thresholds.low && bfp <= thresholds.essential) {
        context = "essential fat";
    } else if (bfp > thresholds.essential && bfp <= thresholds.athlete) {
        context = "athlete";
    } else if (bfp > thresholds.athlete && bfp <= thresholds.fitness) {
        context = "fitness";
    } else if (bfp > thresholds.fitness && bfp <= thresholds.average) {
        context = "average";
    } else if (bfp > thresholds.average) {
        context = "obesity";
    } else {
        throw new Error("Below 0 BFP");
    }

    const response: CoreLibraryResponse = {
        result: bfp,
        context,
        explanation:
            "Body Fat Percentage, usually calculated as a percentage of body weight. There are several methods for measuring it, and based on the percentage, it's possible to estimate whether the subject has normal weight, overweight, or underweight.",
    };

    return response;
}
