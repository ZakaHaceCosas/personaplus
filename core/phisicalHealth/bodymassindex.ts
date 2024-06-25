/*
CALCULATE BODY MASS INDEX

LAST UPDATED: 25/06/2024
REFERENCE: Not specified
SOURCE: https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html#Interpreted
*/

interface BMIResponse {
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

export function calculateBodyMassIndex(age: number, gender: "male" | "female", weight: number, height: number, provideContext?: boolean, provideExplanation?: boolean): BMIResponse | number {
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
    } else {
        // Child calculation (to be implemented)
    }

    if (!provideContext && !provideExplanation) {
        return bmi;
    }

    const response: BMIResponse = {
        result: bmi,
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
        response.explanation = "(According to CDC) Body mass index (BMI) is a person's weight in kilograms divided by the square of height in meters. BMI is an inexpensive and easy screening method for weight category—underweight, healthy weight, overweight, and obesity. BMI does not measure body fat directly, but BMI is moderately correlated with more direct measures of body fat. Furthermore, BMI appears to be as strongly correlated with various metabolic and disease outcomes as are these more direct measures of body fatness.";
    }

    return response;
}
