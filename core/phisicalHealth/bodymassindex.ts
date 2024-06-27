/*
CALCULATE BODY MASS INDEX
*/

// LAST UPDATE TO THIS FUNCTION, ITS DATA, ITS CALCULATIONS, OR ANYTHING THAT DOES AFFECT THE RESULT
// Changes that do not affect the result, like just bug-fixes, performance improvments, code-legibility improvments, or that kind of stuff, do not need to bump the date.
const UPDATED: string = "26/06/2024";
// ANY SOURCE THAT HAS BEEN USED TO DEVELOP THE CALCULATIONS / DATA PROVIDED or that BACKS IT UP.
const SOURCE: string = "https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html#Interpreted";

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

interface BMIResponse {
    result: number;
    subject?: {
        age: number;
        gender: "male" | "female";
        weight: number;
        height: number;
    };
    context?: string;
    explanation?: string;
}

/**
 * Calculate Body Mass Index (BMI) based on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param height The height of the subject in centimeters (CM).
 * @param provideContext Whether to provide a brief contextualisation about the result.
 * @param provideExplanation Whether to provide a detailed explanation about what the calculation means.
 * @returns The BMI value if neither provideContext nor provideExplanation are true, otherwise returns an object with "result" as the BMI value.
*/

export default function calculateBodyMassIndex(age: number, gender: "male" | "female", weight: number, height: number, provideContext?: boolean, provideExplanation?: boolean): BMIResponse {
    // You MUST pass weight as KG (kilograms) and height as CM (centimeters)
    const bmi = weight / ((height / 100) ** 2);

    let context: string | undefined;

    if (age >= 20) {
        if (bmi < 18.5) {
            context = "underweight";
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            context = "healthy weight";
        } else if (bmi >= 25.0 && bmi <= 29.9) {
            context = "overweight";
        } else if (bmi > 30) {
            context = "obesity";
        }
    } else if (age >= 0 && age <= 20) {
        context = "WARNING: calculation for people under 20 years old is not provided"
    } else {
        context = "this would be the body mass index the given data. no further context can be provided."
    }

    const response: BMIResponse = {
        result: bmi,
    };

    if (provideContext) {
        response.subject = {
            age,
            gender,
            weight,
            height,
        };
        response.context = context;
    }

    if (provideExplanation) {
        response.explanation = "(According to CDC) Body mass index (BMI) is a person's weight in kilograms divided by the square of height in meters. BMI is an inexpensive and easy screening method for weight category—underweight, healthy weight, overweight, and obesity. BMI does not measure body fat directly, but BMI is moderately correlated with more direct measures of body fat. Furthermore, BMI appears to be as strongly correlated with various metabolic and disease outcomes as are these more direct measures of body fatness.";
    }

    return response;
}
