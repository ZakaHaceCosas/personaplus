import { CoreLibraryResponse } from "@/core/types/core_library_response";
import CreateComponentDataUtilities from "@/core/tools/core_library_data_builder";
import { NumUtils } from "@/toolkit/glue_fix";

export const { getSources, getLastUpdate } = CreateComponentDataUtilities(
    "17/04/2025",
    [
        "https://www.inchcalculator.com/body-fat-calculator/",
        "https://pubmed.ncbi.nlm.nih.gov/10966886/",
    ],
);

/**
 * Calculate Body Fat Percentage (BFP) based on the US Navy method using waist, neck, and height (and hip for women).
 * @param gender The gender of the subject (either "male" or "female").
 * @param waist The waist circumference of the subject in centimeters (CM).
 * @param neck The neck circumference of the subject in centimeters (CM).
 * @param height The height of the subject in centimeters (CM).
 * @param hip The hip circumference of the subject in centimeters (CM) (only required for females).
 * @returns A standard `CoreLibraryResponse` with the desired results.
 */
export default function calculateUSNavyBodyFatPercentage(
    gender: "male" | "female",
    waist: number,
    neck: number,
    height: number,
    hip?: number,
): CoreLibraryResponse {
    let bfp: number;

    // because of the formula being... "complex", we'll convert from American't to American
    // to use the untouched US formula accurately

    const freedomWaist = NumUtils.centimetersToInches(waist);
    const freedomNeck = NumUtils.centimetersToInches(neck);
    const freedomHeight = NumUtils.centimetersToInches(height);
    const freedomHip = NumUtils.centimetersToInches(hip ?? 0);

    // i'm impressed this is more accurate without using age or weight
    if (gender === "male") {
        bfp =
            86.01 * Math.log10(freedomWaist - freedomNeck) -
            70.041 * Math.log10(freedomHeight) +
            36.76;
    } else {
        if (!freedomHip || freedomHip === 0) {
            throw new Error("Hip measurement is required for females.");
        }
        bfp =
            163.205 * Math.log10(freedomWaist + freedomHip - freedomNeck) -
            97.684 * Math.log10(freedomHeight) -
            78.387;
    }

    let context: string;

    const thresholds = {
        low: gender === "male" ? 2 : 10,
        essential: gender === "male" ? 6 : 14,
        athlete: gender === "male" ? 13 : 21,
        fitness: gender === "male" ? 17 : 25,
        average: gender === "male" ? 25 : 31,
    };

    if (bfp >= 0 && bfp <= thresholds.low) {
        context = "extremely low";
    } else if (bfp > thresholds.low && bfp <= thresholds.essential) {
        context = "essential fat";
    } else if (bfp > thresholds.essential && bfp <= thresholds.athlete) {
        context = "athlete";
    } else if (bfp > thresholds.athlete && bfp <= thresholds.fitness) {
        context = "fitness";
    } else if (bfp > thresholds.fitness && bfp <= thresholds.average) {
        context = "average";
    } else if (bfp > thresholds.average) {
        context = "obesity";
    } else {
        throw new Error("Below 0 BFP");
    }

    const response: CoreLibraryResponse = {
        result: bfp,
        context,
        explanation:
            "Body Fat Percentage (BFP) is calculated, using the US Navy formula, based on specific measurements such as waist, neck, height, and for women, hip. It helps in estimating the amount of body fat relative to total body mass. Different ranges of BFP indicate varying levels of health, from essential fat to obesity.",
    };

    return response;
}
