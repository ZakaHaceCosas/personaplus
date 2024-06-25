/*
CALCULATE IDEAL BODY WEIGHT

LAST UPDATED: 25/06/2024
REFERENCE: Not specified
SOURCE: https://www.inchcalculator.com/body-fat-calculator/ and https://pubmed.ncbi.nlm.nih.gov/27030535/
*/

import calculateBodyFatPercentage from "./bodyfatpercentage";

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
    // This is calculated using the BFP / BMI method, so the BMI is required.
    /*
    NOTE: ORIGINAL FORMULA IN AMERICAN: IBW [lb] = 5 × BMI + ((BMI ÷ 5) × (height − 60 [in]))
    Converted by myself (@ZakaHaceCosas) to American't - will check if it's correct.
    IBW [kg]=2.204625×BMI+(5BMI​×(height [cm]−60×2.54))​
    */
    const bmi = calculateBodyFatPercentage(age, gender, weight, height, false, false);
    const bfp = calculateBodyFatPercentage(age, gender, weight, height, false, false);
    let ibw: number;

    let firststep = 60 * 2.54
    let secondstep = height - firststep
    let thirdstep = Number(bmi) / 5
    let fourthstep = thirdstep * secondstep
    let fifthstep = fourthstep / 2.20462
    ibw = fifthstep

    let context: string | undefined;

    context = "this would be the ideal body weight for the given data, based on BMI and BFP."

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