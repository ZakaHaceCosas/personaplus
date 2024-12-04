/*
CALCULATE IDEAL BODY WEIGHT
*/

import { CoreLibraryResponse } from "@/core/types/CoreLibraryResponse";
import calculateBodyMassIndex from "@/core/physicalHealth/BodyMassIndex";
import CreateComponentDataUtilities from "@/core/tools/CoreLibraryDataBuilder";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "26/06/2024",
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
    IBW [kg]=2.204625×BMI+(5BMI x (height [cm]−60×2.54)))
    */
    const bmi: CoreLibraryResponse = calculateBodyMassIndex(
        age,
        gender,
        weight,
        height,
    );

    const firstStep = 60 * 2.54;
    const secondStep = height - firstStep;
    const thirdStep = Number(bmi) / 5;
    const fourthStep = thirdStep * secondStep;
    const fifthStep = fourthStep / 2.20462;
    const ibw: number = fifthStep;

    const context: string | undefined =
        "The ideal body weight for the given profile, based on the BMI, would be of " +
        ibw +
        "kg.";

    const response: CoreLibraryResponse = {
        result: ibw,
        context: context,
        explanation:
            "The Ideal Body Weight (IDW) is an estimate of what the ideal weight would be for a person. There are several ways of calculating it, e.g. using the Body Mass Index of the subject, his basic data like age, gender, weight and height, and a series of calculations.",
    };

    return response;
}
