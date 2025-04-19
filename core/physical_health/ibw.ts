/*
CALCULATE IDEAL BODY WEIGHT
*/

import { CoreLibraryResponse } from "@/core/types/core_library_response";
import calculateBodyMassIndex from "@/core/physical_health/bmi";
import CreateComponentDataUtilities from "@/core/tools/core_library_data_builder";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "17/04/2025",
    [
        "https://www.inchcalculator.com/body-fat-calculator/",
        "https://pubmed.ncbi.nlm.nih.gov/27030535/",
    ],
);

/**
 * Calculate Ideal Body Weight (IBW) based on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param height The height of the subject in centimeters (CM).
 * @returns A standard `CoreLibraryResponse` with the desired results.
 */
export default function calculateIdealBodyWeight(
    age: number,
    gender: "male" | "female",
    weight: number,
    height: number,
): CoreLibraryResponse {
    // This is calculated using the BMI method, so the BMI is required.
    /*
    NOTE: ORIGINAL FORMULA IN AMERICAN: IBW [lb] = 5 × BMI + ((BMI ÷ 5) × (height − 60 [in]))
    Converted by myself (@ZakaHaceCosas) to American't - will check if it's correct.
    IBW [kg] = (5 × BMI + ((BMI ÷ 5) × (height − 152.4)))
    */
    const { result: bmi } = calculateBodyMassIndex(age, gender, weight, height);

    const firstStep: number = 5 * bmi;
    const secondStep: number = bmi / 5;
    const thirdStep: number = height - 152.4;
    const fourthStep: number = thirdStep * secondStep;
    const ibw: number = firstStep + fourthStep;

    const context: string = `The IBW for the given profile would be of ${ibw} kg.`;

    const response: CoreLibraryResponse = {
        result: ibw,
        context: context,
        explanation:
            "The Ideal Body Weight (IDW) is an estimate of what the ideal weight would be for a person. There are several ways of calculating it, e.g. using the Body Mass Index of the subject, his basic data like age, gender, weight and height, and a series of calculations.",
    };

    return response;
}
