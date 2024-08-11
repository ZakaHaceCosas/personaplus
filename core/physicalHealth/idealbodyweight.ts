/*
CALCULATE IDEAL BODY WEIGHT
*/

import OpenHealthResponse from "../types/OpenHealthResponse";
import calculateBodyMassIndex from "./bodymassindex";

// LAST UPDATE TO THIS FUNCTION, ITS DATA, ITS CALCULATIONS, OR ANYTHING THAT DOES AFFECT THE RESULT
// Changes that do not affect the result, like just bug-fixes, performance improvments, code-legibility improvments, or that kind of stuff, do not need to bump the date.
const UPDATED: string = "26/06/2024";
// ANY SOURCE THAT HAS BEEN USED TO DEVELOP THE CALCULATIONS / DATA PROVIDED or that BACKS IT UP.
const SOURCE: string = "https://www.inchcalculator.com/body-fat-calculator/ and https://pubmed.ncbi.nlm.nih.gov/27030535/";

/**
 * Get all the sources of information used to develop the function, it's data, contents, returns, and etc...
 * @returns A single string with all the URLs, separated by "and" in case there's more than one - e.g. "https://coolsite.com and https://example.source"
*/

export function getSource() {
    return SOURCE;
}

/**
 * Get the date of the last update made to this function (considering "update" any change to it's sources, calculations, data, results, etc... but not trivial, performance, code cleaning or similar changes.)
 * @returns A string with the date of the last update, using the DD/MM/YYYY format.
*/

export function getLastUpdate() {
    return UPDATED;
}

/* interface IBWResponse {
    result: number;
    subject?: {
        age: number;
        gender: "male" | "female";
        weight: number;
        height: number;
    };
    context?: string;
    explanation?: string;
} */

/**
 * Calculate Ideal Body Weight (IBW) based on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param height The height of the subject in centimeters (CM).
 * @param provideContext Whether to provide a brief contextualisation about the result.
 * @param provideExplanation Whether to provide a detailed explanation about what the calculation means.
 * @returns The IBW value if neither provideContext nor provideExplanation are true, otherwise returns an object with "result" as the IBW value.
*/

export default function calculateIdealBodyWeight(age: number, gender: "male" | "female", weight: number, height: number, provideContext?: boolean, provideExplanation?: boolean): OpenHealthResponse {
    // This is calculated using the BMI method, so the BMI is required.
    /*
    NOTE: ORIGINAL FORMULA IN AMERICAN: IBW [lb] = 5 × BMI + ((BMI ÷ 5) × (height − 60 [in]))
    Converted by myself (@ZakaHaceCosas) to American't - will check if it's correct.
    IBW [kg]=2.204625×BMI+(5BMI x (height [cm]−60×2.54)))
    */
    const bmi = calculateBodyMassIndex(age, gender, weight, height, false, false);

    const firststep = 60 * 2.54
    const secondstep = height - firststep
    const thirdstep = Number(bmi) / 5
    const fourthstep = thirdstep * secondstep
    const fifthstep = fourthstep / 2.20462
    const ibw: number = fifthstep

    const context: string | undefined = "The ideal body weight for the given profile, based on the BMI, would be of " + ibw + "kg."

    const response: OpenHealthResponse = {
        result: ibw,
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
        response.explanation = "The Ideal Body Weight (IDW) is an estimate of what the ideal weight would be for a person. There are several ways of calculating it, e.g. using the Body Mass Index of the subject, his basic data like age, gender, weight and height, and a series of calculations.";
    }

    return response;
}
