/*
CALCULATE TOTAL DAILY ENERGY EXPENDITURE
*/

import CoreLibrary from "@/core/core";
import { CoreLibraryResponse } from "@/core/types/core_library_response";
import CreateComponentDataUtilities from "@/core/tools/core_library_data_builder";
import { CoreLibraryType_Activeness } from "@/core/types/misc_types";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "07/07/2024",
    [
        "https://en.wikipedia.org/wiki/Harris%E2%80%93Benedict_equation",
        "https://ajcn.nutrition.org/article/S0002-9165(23)16698-6/abstract",
        "https://web.archive.org/web/20081014132915/http://gottasport.com/weight-loss/71/harris-benedict-formula-for-women-and-men.html",
    ],
);

/**
 * Calculate Total Daily Energy Expenditure (TDEE) based on the Basal Metabolic Rate (BMR) and on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param height The height of the subject in centimeters (CM).
 * @param activeness From "poor" to "extreme", how active the subject is in terms of exercising, being "poor" very little or no exercise, light 1 to 3 days of exercise a week (being one time each day), moderate 3 to 5 days a week, intense 6 or seven days a week, and extreme being very intense exercises and/or more than once a day.
 * @returns A standard `CoreLibraryResponse` with the desired results.
 */

export default function calculateTotalDailyEnergyExpenditure(
    age: number,
    gender: "male" | "female",
    weight: number,
    height: number,
    activeness: CoreLibraryType_Activeness,
): CoreLibraryResponse {
    const bmrSource: CoreLibraryResponse =
        CoreLibrary.physicalHealth.BasalMetabolicRate.calculate(
            age,
            gender,
            weight,
            height,
            activeness,
        );

    const bmr = bmrSource.result;

    let calc: number;

    if (activeness === "poor") {
        calc = bmr * 1.2;
    } else if (activeness === "light") {
        calc = bmr * 1.375;
    } else if (activeness === "moderate") {
        calc = bmr * 1.55;
    } else if (activeness === "intense") {
        calc = bmr * 1.725;
    } else {
        calc = bmr * 1.9;
    }

    const context = `The recommended daily caloric ingest would be of ${calc}, taking into account the specified level of activeness is ${activeness} and the BMR is ${bmr}.`;

    const response: CoreLibraryResponse = {
        result: calc,
        context: context,
        explanation:
            "The TDEE (Total Daily Energy Expenditure) is an estimate of the amount of energy (in calories) an individual needs to sustain themselves daily. It is calculated using the BMR (Basal Metabolic Rate) formula and an estimate of the individual's physical activity level. This value serves as a recommendation for the amount of calories the individual should consume daily.",
    };

    return response;
}
