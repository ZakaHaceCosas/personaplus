/*
CALCULATE IDEAL BODY WEIGHT
*/

import calculateBodyMassIndex from "./bodymassindex";

// LAST UPDATE TO THIS FUNCTION, ITS DATA, ITS CALCULATIONS, OR ANYTHING THAT DOES AFFECT THE RESULT
// Changes that do not affect the result, like just bug-fixes, performance improvments, code-legibility improvments, or that kind of stuff, do not need to bump the date.
const UPDATED: string = "26/06/2024";
// ANY SOURCE THAT HAS BEEN USED TO DEVELOP THE CALCULATIONS / DATA PROVIDED or that BACKS IT UP.
const SOURCE: string = "https://www.inchcalculator.com/body-fat-calculator/ and https://pubmed.ncbi.nlm.nih.gov/27030535/";

export function getSource() {
    return SOURCE;
}

export function getLastUpdate() {
    return UPDATED;
}

interface IBWResponse {
    result: number;
    subject: {
        age: number;
        gender: "male" | "female";
        weight: number;
        height: number;
    };
    context?: string;
    explanation?: string;
}

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

export default function calculateIdealBodyWeight(age: number, gender: "male" | "female", weight: number, height: number, provideContext?: boolean, provideExplanation?: boolean): IBWResponse | number {
    // This is calculated using the BMI method, so the BMI is required.
    /*
    NOTE: ORIGINAL FORMULA IN AMERICAN: IBW [lb] = 5 × BMI + ((BMI ÷ 5) × (height − 60 [in]))
    Converted by myself (@ZakaHaceCosas <zakahacecosas@protonmail.com>) to American't - will check if it's correct.
    IBW [kg]=2.204625×BMI+(5BMI x (height [cm]−60×2.54)))
    */
    const bmi = calculateBodyMassIndex(age, gender, weight, height, false, false);

    const firststep = 60 * 2.54
    const secondstep = height - firststep
    const thirdstep = Number(bmi) / 5
    const fourthstep = thirdstep * secondstep
    const fifthstep = fourthstep / 2.20462
    const ibw: number = fifthstep

    const context: string | undefined = "this would be the ideal body weight for the given data, based on BMI. no further context can be provided."

    if (!provideContext && !provideExplanation) {
        return ibw;
    }

    const response: IBWResponse = {
        result: ibw,
        subject: {
            age,
            gender,
            weight,
            height,
        },
    };

    if (provideContext) {
        response.context = context;
    }

    if (provideExplanation) {
        response.explanation = "not done.";
    }

    return response;
}
