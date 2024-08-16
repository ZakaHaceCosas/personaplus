/*
CALCULATE BASAL METABOLIC RATE
*/

import { OpenHealthResponse } from "@/core/types/OpenHealthResponse";
import CreateComponentDataUtilities from "@/core/tools/OpenHealthDataBuilder";

export const { getSource, getLastUpdate } = CreateComponentDataUtilities(
    "26/06/2024",
    "https://en.wikipedia.org/wiki/Harris%E2%80%93Benedict_equation and https://ajcn.nutrition.org/article/S0002-9165(23)16698-6/abstract and https://web.archive.org/web/20081014132915/http://gottasport.com/weight-loss/71/harris-benedict-formula-for-women-and-men.html"
)

/**
 * Calculate Basal Metabolic Rate (BMR) based on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param height The height of the subject in centimeters (CM).
 * @param activness From "poor" to "extreme", how active the subject is in terms of exercising, being "poor" very little or no exercise, light 1 to 3 days of exercise a week (being one time each day), moderate 3 to 5 days a week, intense 6 or seven days a week, and extreme being very intense exercies and/or more than once a day.
 * @param provideContext Whether to provide a brief contextualisation about the result.
 * @param provideExplanation Whether to provide a detailed explanation about what the calculation means.
 * @returns The BMR value if neither provideContext nor provideExplanation are true, otherwise returns an `OpenHealthResponse` with "result" as the BMR value.
*/

export default function calculateBasalMetabolicRate(age: number, gender: "male" | "female", weight: number, height: number, activness: "poor" | "light" | "moderate" | "intense" | "extreme", provideContext?: boolean, provideExplanation?: boolean): OpenHealthResponse {
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

    const context: string | undefined = "The basal metabolic rate would be " + bmr + ".";

    const response: OpenHealthResponse = {
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
        response.explanation = "The BMR (Basal Metabolic Rate) is the rate of energy expenditure per unit time by endothermic animals at rest. It is used to approximate how much energy (in calories) the human body requires to stay alive on a daily basis. This value is necessary to calculate the TDEE (Total Daily Energy Expenditure), which provides a more precise estimation of the daily energy requirement by taking into account the individual's level of physical activity.";
    }

    return response;
}
