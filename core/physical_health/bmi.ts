/*
CALCULATE BODY MASS INDEX
*/

import { CoreLibraryResponse } from "@/core/types/core_library_response";
import CreateComponentDataUtilities from "@/core/tools/core_library_data_builder";
import {
    FEMALE_PERCENTILES,
    MALE_PERCENTILES,
} from "@/core/physical_health/utils/bmi_percentiles";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "27/12/2024",
    [
        "https://www.cdc.gov/growthcharts/extended-bmi-data-files.htm",
        "https://www.cdc.gov/growthcharts/data/extended-bmi/BMI-Age-percentiles-GIRLS.pdf",
        "https://www.cdc.gov/growthcharts/data/extended-bmi/BMI-Age-percentiles-BOYS.pdf",
    ],
);

export function getPercentile(
    bmi: number,
    age: number,
    gender: "male" | "female",
): number {
    const percentilesForAge =
        gender === "male" ? MALE_PERCENTILES[age] : FEMALE_PERCENTILES[age];

    if (!percentilesForAge) {
        throw new Error(`Percentiles data for age ${age} not available.`);
    } else if (age < 2 || age > 20) {
        throw new Error(
            `Percentiles data for age ${age} not available. If you passed an age over twenty, then you're using this function mistakenly, as percentiles are not required for BMI calculations over 20 years of age.`,
        );
    } else {
        // sort the percentiles i guess
        const sortedPercentiles = Object.keys(percentilesForAge)
            .map(Number)
            .sort((a, b) => a - b);

        // spot the percentile that corresponds to the BMI/AGE data and return it
        for (const percentile of sortedPercentiles) {
            if (
                bmi <=
                percentilesForAge[percentile as 5 | 10 | 25 | 50 | 75 | 85 | 95]
            ) {
                return percentile;
            }
        }
    }

    return 100; // max percentile is 95. a return of 100 means that bro got a serious problem :skull:
}

/**
 * Calculate Body Mass Index (BMI) based on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param height The height of the subject in centimeters (CM).
 * @returns A standard `CoreLibraryResponse` with the desired results.
 */
export default function calculateBodyMassIndex(
    age: number,
    gender: "male" | "female",
    weight: number,
    height: number,
): CoreLibraryResponse {
    // You MUST pass weight as KG (kilograms) and height as CM (centimeters)
    const bmi: number = weight / (height / 100) ** 2;

    let context: string | undefined;

    if (age <= 0) {
        throw new Error("Invalid age provided.");
    } else if (age <= 20) {
        const percentile: number = getPercentile(bmi, age, gender);
        if (percentile <= 5) {
            context = "severely underweight";
        } else if (percentile >= 5 && percentile <= 10) {
            context = "underweight";
        } else if (percentile >= 10 && percentile < 80) {
            context = "healthy weight";
        } else if (percentile >= 80 && percentile <= 90) {
            context = "overweight";
        } else {
            context = "obesity";
        }
    } else {
        if (bmi < 16.0) {
            context = "severely underweight";
        } else if (bmi >= 16.0 && bmi < 18.5) {
            context = "underweight";
        } else if (bmi >= 18.5 && bmi < 25.0) {
            context = "healthy weight";
        } else if (bmi >= 25.0 && bmi < 30.0) {
            context = "overweight";
        } else {
            context = "obesity";
        }
    }

    const response: CoreLibraryResponse = {
        result: bmi,
        context: context,
        explanation:
            "(According to CDC) Body mass index (BMI) is a person's weight in kilograms divided by the square of height in meters. BMI is an inexpensive and easy screening method for weight category—underweight, healthy weight, overweight, and obesity. BMI does not measure body fat directly, but BMI is moderately correlated with more direct measures of body fat. Furthermore, BMI appears to be as strongly correlated with various metabolic and disease outcomes as are these more direct measures of body fatness.",
    };

    return response;
}
