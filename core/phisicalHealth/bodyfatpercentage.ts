/*
CALCULATE BODY FAT PERCENTAGE
*/
import calculateBodyMassIndex from "./bodymassindex";

// LAST UPDATE TO THIS FUNCTION, ITS DATA, ITS CALCULATIONS, OR ANYTHING THAT DOES AFFECT THE RESULT
// Changes that do not affect the result, like just bug-fixes, performance improvments, code-legibility improvments, or that kind of stuff, do not need to bump the date.
const UPDATED: string = "26/06/2024";
// ANY SOURCE THAT HAS BEEN USED TO DEVELOP THE CALCULATIONS / DATA PROVIDED or that BACKS IT UP.
const SOURCE: string = "https://www.inchcalculator.com/body-fat-calculator/ and https://pubmed.ncbi.nlm.nih.gov/10966886/";

export function getSource() {
    return SOURCE;
}

export function getLastUpdate() {
    return UPDATED;
}

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

export default function calculateBodyFatPercentage(age: number, gender: "male" | "female", weight: number, height: number, provideContext?: boolean, provideExplanation?: boolean): BFPResponse | number {
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
