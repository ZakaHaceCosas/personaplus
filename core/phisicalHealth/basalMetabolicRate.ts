/*
CALCULATE BASAL METABOLIC RATE
*/

// LAST UPDATE TO THIS FUNCTION, ITS DATA, ITS CALCULATIONS, OR ANYTHING THAT DOES AFFECT THE RESULT
// Changes that do not affect the result, like just bug-fixes, performance improvments, code-legibility improvments, or that kind of stuff, do not need to bump the date.
const UPDATED: string = "26/06/2024";
// ANY SOURCE THAT HAS BEEN USED TO DEVELOP THE CALCULATIONS / DATA PROVIDED or that BACKS IT UP.
const SOURCE: string = "https://en.wikipedia.org/wiki/Harris%E2%80%93Benedict_equation and https://ajcn.nutrition.org/article/S0002-9165(23)16698-6/abstract and https://web.archive.org/web/20081014132915/http://gottasport.com/weight-loss/71/harris-benedict-formula-for-women-and-men.html";

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

interface BMRResponse {
    result: number;
    subject?: {
        age: number;
        gender: "male" | "female";
        weight: number;
        height: number;
        activness: "poor" | "light" | "moderate" | "intense" | "extreme"
    };
    context?: string;
    explanation?: string;
}

/**
 * Calculate Basal Metabolic Rate (BMR) based on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param height The height of the subject in centimeters (CM).
 * @param activness From "poor" to "extreme", how active a person is, being "poor" very little or no exercise, light 1 to 3 days of exercise a week (being one time each day), moderate 3 to 5 days a week, intense 6 or seven days a week, and extreme being very intense exercies and/or more than once a day.
 * @param provideContext Whether to provide a brief contextualisation about the result.
 * @param provideExplanation Whether to provide a detailed explanation about what the calculation means.
 * @returns The BMR value if neither provideContext nor provideExplanation are true, otherwise returns an object with "result" as the BMR value.
*/

export default function calculateBasalMetabolicRate(age: number, gender: "male" | "female", weight: number, height: number, activness: "poor" | "light" | "moderate" | "intense" | "extreme", provideContext?: boolean, provideExplanation?: boolean): BMRResponse {
    const firststep: number = 10 * weight
    const secondstep: number = 6.25 * height
    const thirdstep: number = 5 * age
    const fourthstep: number = firststep + secondstep
    const fifthstep: number = fourthstep - thirdstep
    let sixthstep: number;
    if (gender === "male") {
        sixthstep = fifthstep + 5
    } else { // female
        sixthstep = fifthstep - 161
    }
    const bmr: number = sixthstep;

    let context: string | undefined;

    if (activness === "poor") {
        const calc: number = bmr * 1.2;
        context = "The basal metabolic rate would be " + bmr + " and, taking into account the specified level of activness is " + activness + ", the recommended daily calorical ingest would be of " + calc;
    } else if (activness === "light") {
        const calc: number = bmr * 1.375;
        context = "The basal metabolic rate would be " + bmr + " and, taking into account the specified level of activness is " + activness + ", the recommended daily calorical ingest would be of " + calc;
    } else if (activness === "moderate") {
        const calc: number = bmr * 1.55;
        context = "The basal metabolic rate would be " + bmr + " and, taking into account the specified level of activness is " + activness + ", the recommended daily calorical ingest would be of " + calc;
    } else if (activness === "intense") {
        const calc: number = bmr * 1.725;
        context = "The basal metabolic rate would be " + bmr + " and, taking into account the specified level of activness is " + activness + ", the recommended daily calorical ingest would be of " + calc;
    } else { // extreme
        const calc: number = bmr * 1.9;
        context = "The basal metabolic rate would be " + bmr + " and, taking into account the specified level of activness is " + activness + ", the recommended daily calorical ingest would be of " + calc;
    }

    const response: BMRResponse = {
        result: bmr,
    };

    if (provideContext) {
        response.subject = {
            age,
            gender,
            weight,
            height,
            activness
        };
        response.context = context;
    }

    if (provideExplanation) {
        response.explanation = "not done.";
    }

    return response;
}
