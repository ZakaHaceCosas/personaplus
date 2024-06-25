/*
CALCULATE BODY FAT PERCENTAGE

LAST UPDATED: 25/06/2024
REFERENCE: Not specified
SOURCE: https://www.inchcalculator.com/body-fat-calculator/ and https://pubmed.ncbi.nlm.nih.gov/10966886/
*/

import { calculateBodyMassIndex } from "./bodymassindex";

interface BFPResponse {
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

export default function calculateBodyFatPercentage(age: number, gender: "male" | "female", weight: number, height: number, provideContext?: boolean, provideExplanation?: boolean): BFPResponse | number {
    // This is calculated using the BMI method, so the BMI is required.
    const bmi = calculateBodyMassIndex(age, gender, weight, height, false, false);
    let bfp: number;

    if (gender == "male") { // male
        let firststep = 1.20 * Number(bmi)
        let secondstep = 0.23 * age
        let thirdstep = firststep + secondstep
        let fourthstep = thirdstep - 16.2
        bfp = fourthstep
    } else { // female
        let firststep = 1.20 * Number(bmi)
        let secondstep = 0.23 * age
        let thirdstep = firststep + secondstep
        let fourthstep = thirdstep - 5.4
        bfp = fourthstep
    }

    let context: string | undefined;

    if (gender == "male") {
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

    if (!provideContext && !provideExplanation) {
        return bfp;
    }

    const response: BFPResponse = {
        result: bfp,
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