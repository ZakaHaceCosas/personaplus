/*
CALCULATE BODY FAT PERCENTAGE
*/
import { OpenHealthResponse } from "@/core/types/OpenHealthResponse";
import calculateBodyMassIndex from "@/core/physicalHealth/BodyMassIndex";
import CreateComponentDataUtilities from "@/core/tools/OpenHealthDataBuilder";

export const { getSource, getLastUpdate } = CreateComponentDataUtilities(
    "26/06/2024",
    "https://www.inchcalculator.com/body-fat-calculator/ and https://pubmed.ncbi.nlm.nih.gov/10966886/"
);

/**
 * Calculate Body Fat Percentage (BFP) based on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param height The height of the subject in centimeters (CM).
 * @param provideContext Whether to provide a brief contextualisation about the result.
 * @param provideExplanation Whether to provide a detailed explanation about what the calculation means.
 * @returns The BFP value if neither provideContext nor provideExplanation are true, otherwise returns an object with "result" as the BFP value.
*/

export default function calculateBodyFatPercentage(age: number, gender: "male" | "female", weight: number, height: number, provideContext?: boolean, provideExplanation?: boolean): OpenHealthResponse {
    // This is calculated using the BMI method, so the BMI is required.
    const bmi = calculateBodyMassIndex(age, gender, weight, height, false, false);
    let bfp: number;

    if (gender === "male") { // male
        const firststep = 1.20 * Number(bmi)
        const secondstep = 0.23 * age
        const thirdstep = firststep + secondstep
        const fourthstep = thirdstep - 16.2
        bfp = fourthstep
    } else { // female
        const firststep = 1.20 * Number(bmi)
        const secondstep = 0.23 * age
        const thirdstep = firststep + secondstep
        const fourthstep = thirdstep - 5.4
        bfp = fourthstep
    }

    let context: string | undefined;

    if (gender === "male") {
        if (bfp >= 0 || bfp <= 2) {
            context = "extremely low"
        } else if (bfp >= 2 || bfp <= 6) {
            context = "essential fat"
        } else if (bfp >= 6 || bfp <= 13) {
            context = "athlete"
        } else if (bfp >= 13 || bfp <= 17) {
            context = "fitness"
        } else if (bfp >= 18 || bfp <= 25) {
            context = "average"
        } else if (bfp > 25) {
            context = "obesity"
        }
    } else { // female
        if (bfp >= 0 || bfp <= 10) {
            context = "extremely low"
        } else if (bfp >= 10 || bfp <= 14) {
            context = "essential fat"
        } else if (bfp >= 14 || bfp <= 21) {
            context = "athlete"
        } else if (bfp >= 21 || bfp <= 25) {
            context = "fitness"
        } else if (bfp >= 25 || bfp <= 31) {
            context = "average"
        } else if (bfp > 32) {
            context = "obesity"
        }
    }

    const response: OpenHealthResponse = {
        result: bfp,
    };

    if (provideContext) {
        response.subject = {
            age,
            gender,
            weight,
            height,
        };
        response.context = "Based on the Body Fat Percentage calculations, in this case we're talking of an " + context + " BFP.";
    }

    if (provideExplanation) {
        response.explanation = "Body Fat Percentage, usually calculated as a percentage of body weight. There are several methods for measuring it, and based on the percentage, it's possible to estimate whether the subject has normal weight, overweight, or underweight.";
    }

    return response;
}
