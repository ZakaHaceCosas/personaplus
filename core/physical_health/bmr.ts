/*
CALCULATE BASAL METABOLIC RATE
*/

import { CoreLibraryResponse } from "@/core/types/core_library_response";
import CreateComponentDataUtilities from "@/core/tools/core_library_data_builder";
import { CoreLibraryType_Activeness } from "@/core/types/misc_types";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "04/12/2024",
    [
        "https://en.wikipedia.org/wiki/Harris%E2%80%93Benedict_equation",
        "https://ajcn.nutrition.org/article/S0002-9165(23)16698-6/abstract",
        "https://web.archive.org/web/20081014132915/http://gottasport.com/weight-loss/71/harris-benedict-formula-for-women-and-men.html",
    ],
);

/**
 * Calculate Basal Metabolic Rate (BMR) based on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param height The height of the subject in centimeters (CM).
 * @param activeness From "poor" to "super", how active the subject is in terms of exercising, being "poor" very little or no exercise, light 1 to 3 days of exercise a week (being one time each day), normal 3 to 5 days a week, intense 6 or seven days a week, and super being very intense exercises and/or more than once a day.
 * @returns A standard `CoreLibraryResponse` with the desired results.
 */

export default function calculateBasalMetabolicRate(
    age: number,
    gender: "male" | "female",
    weight: number,
    height: number,
    activeness: CoreLibraryType_Activeness,
): CoreLibraryResponse {
    const firstStep: number = 10 * weight;
    const secondStep: number = 6.25 * height;
    const thirdStep: number = 5 * age;
    const fourthStep: number = firstStep + secondStep;
    const fifthStep: number = fourthStep - thirdStep;
    let sixthStep: number;
    if (gender === "male") {
        sixthStep = fifthStep + 5;
    } else {
        // female
        sixthStep = fifthStep - 161;
    }
    let activenessIndex: number;
    switch (activeness) {
        case "poor":
            activenessIndex = 1.2;
            break;
        case "light":
            activenessIndex = 1.375;
            break;
        case "moderate":
            activenessIndex = 1.55;
            break;
        case "intense":
            activenessIndex = 1.725;
            break;
        case "super":
            activenessIndex = 1.9;
            break;
    }
    const bmr: number = sixthStep * activenessIndex;

    const context: string = `Estimate of ${bmr.toPrecision(
        6,
    )} daily burnt calories.`;

    const response: CoreLibraryResponse = {
        result: bmr,
        context: context,
        explanation:
            "The BMR (Basal Metabolic Rate) is the rate of energy expenditure per unit time by endothermic animals at rest. It is used to approximate how much energy (in calories) the human body requires to stay alive on a daily basis. This value is necessary to calculate the TDEE (Total Daily Energy Expenditure), which provides a more precise estimation of the daily energy requirement by taking into account the individual's level of physical activity.",
    };

    return response;
}
