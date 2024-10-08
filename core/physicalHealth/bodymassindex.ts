/*
CALCULATE BODY MASS INDEX
*/

import { CoreLibraryResponse } from "@/core/types/CoreLibraryResponse";
import CreateComponentDataUtilities from "@/core/tools/CoreLibraryDataBuilder";
import {
    MALE_PERCENTILES,
    FEMALE_PERCENTILES,
} from "@/core/physicalHealth/utils/bmiPercentiles";

export const { getSource, getLastUpdate } = CreateComponentDataUtilities(
    "10/08/2024",
    "https://www.cdc.gov/growthcharts/data/set1clinical/cj41c024.pdf and https://www.cdc.gov/growthcharts/data/set1clinical/cj41c023.pdf",
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
 * @param provideContext Whether to provide a brief contextualization about the result.
 * @param provideExplanation Whether to provide a detailed explanation about what the calculation means.
 * @returns The BMI value if neither provideContext nor provideExplanation are true, otherwise returns an object with "result" as the BMI value.
 */

export default function calculateBodyMassIndex(
    age: number,
    gender: "male" | "female",
    weight: number,
    height: number,
    provideContext?: boolean,
    provideExplanation?: boolean,
): CoreLibraryResponse {
    // You MUST pass weight as KG (kilograms) and height as CM (centimeters)
    const bmi = weight / (height / 100) ** 2;

    let context: string | undefined;

    if (age < 0) {
        throw new Error("Invalid age provided.");
    } else if (age < 20) {
        const percentile = getPercentile(bmi, age, gender);

        if (percentile <= 5) {
            context = "underweight";
        } else if (percentile >= 5 && percentile <= 75) {
            context = "healthy weight";
        } else if (percentile >= 75 && percentile < 85) {
            context = "overweight";
        } else if (percentile >= 85 && percentile <= 95) {
            context = "obesity";
        } else {
            context = "severe obesity";
        }
    } else {
        if (bmi < 18.5) {
            context = "underweight";
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            context = "healthy weight";
        } else if (bmi >= 25.0 && bmi <= 29.9) {
            context = "overweight";
        } else {
            context = "obesity";
        }
    }

    const response: CoreLibraryResponse = {
        result: bmi,
    };

    if (provideContext) {
        response.subject = {
            age,
            gender,
            weight,
            height,
        };
        response.context = context;
    }

    if (provideExplanation) {
        response.explanation =
            "(According to CDC) Body mass index (BMI) is a person's weight in kilograms divided by the square of height in meters. BMI is an inexpensive and easy screening method for weight category—underweight, healthy weight, overweight, and obesity. BMI does not measure body fat directly, but BMI is moderately correlated with more direct measures of body fat. Furthermore, BMI appears to be as strongly correlated with various metabolic and disease outcomes as are these more direct measures of body fatness.";
    }

    return response;
}
