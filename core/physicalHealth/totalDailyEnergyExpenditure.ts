/*
CALCULATE TOTAL DAILY ENERGY EXPENDITURE
*/

import OpenHealth from "../openhealth";
import OpenHealthResponse from "../types/OpenHealthResponse";

// LAST UPDATE TO THIS FUNCTION, ITS DATA, ITS CALCULATIONS, OR ANYTHING THAT DOES AFFECT THE RESULT
// Changes that do not affect the result, like just bug-fixes, performance improvments, code-legibility improvments, or that kind of stuff, do not need to bump the date.
const UPDATED: string = "07/07/2024";
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

/* interface TDEEResponse {
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
} */

/**
 * Calculate Total Daily Energy Expenditure (TDEE) based on the Basal Metabolic Rate (BMR) and on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param height The height of the subject in centimeters (CM).
 * @param activness From "poor" to "extreme", how active the subject is in terms of exercising, being "poor" very little or no exercise, light 1 to 3 days of exercise a week (being one time each day), moderate 3 to 5 days a week, intense 6 or seven days a week, and extreme being very intense exercies and/or more than once a day.
 * @param provideContext Whether to provide a brief contextualisation about the result.
 * @param provideExplanation Whether to provide a detailed explanation about what the calculation means.
 * @returns The TDEE value if neither provideContext nor provideExplanation are true, otherwise returns an object with "result" as the TDEE value.
*/

export default function calculateBasalMetabolicRate(age: number, gender: "male" | "female", weight: number, height: number, activness: "poor" | "light" | "moderate" | "intense" | "extreme", provideContext?: boolean, provideExplanation?: boolean): OpenHealthResponse {
    const bmrsource = OpenHealth.physicalHealth.BasalMetabolicRate.calculate(age, gender, weight, height, activness, true, true)

    const bmr = bmrsource.result

    let context: string | undefined;

    let calc: number;

    if (activness === "poor") {
        calc = bmr * 1.2;
        context = "The recommended daily calorical ingest would be of " + calc + ", taking into account the specified level of activness is " + activness + " and the BMR is " + bmr;
    } else if (activness === "light") {
        calc = bmr * 1.375;
        context = "The recommended daily calorical ingest would be of " + calc + ", taking into account the specified level of activness is " + activness + " and the BMR is " + bmr;
    } else if (activness === "moderate") {
        calc = bmr * 1.55;
        context = "The recommended daily calorical ingest would be of " + calc + ", taking into account the specified level of activness is " + activness + " and the BMR is " + bmr;
    } else if (activness === "intense") {
        calc = bmr * 1.725;
        context = "The recommended daily calorical ingest would be of " + calc + ", taking into account the specified level of activness is " + activness + " and the BMR is " + bmr;
    } else {
        calc = bmr * 1.9;
        context = "The recommended daily calorical ingest would be of " + calc + ", taking into account the specified level of activness is " + activness + " and the BMR is " + bmr;
    }

    const response: OpenHealthResponse = {
        result: calc,
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
        response.explanation = "The TDEE (Total Daily Energy Expenditure) is an estimate of the amount of energy (in calories) an individual needs to sustain themselves daily. It is calculated using the BMR (Basal Metabolic Rate) formula and an estimate of the individual's physical activity level. This value serves as a recommendation for the amount of calories the individual should consume daily.";
    }

    return response;
}
