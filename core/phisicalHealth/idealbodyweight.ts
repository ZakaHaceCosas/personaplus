/*
CALCULATE IDEAL BODY WEIGHT

LAST UPDATED: 25/06/2024
REFERENCE: Not specified
SOURCE: https://www.inchcalculator.com/body-fat-calculator/ and https://pubmed.ncbi.nlm.nih.gov/27030535/
*/

import { calculateBodyMassIndex } from "./bodymassindex";

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

export default function calculateIdealBodyWeight(age: number, gender: "male" | "female", weight: number, height: number, provideContext?: boolean, provideExplanation?: boolean): IBWResponse | number {
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

    const context: string | undefined = "this would be the ideal body weight for the given data, based on BMI and BFP."

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
