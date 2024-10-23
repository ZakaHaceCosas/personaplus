import CoreLibrary from "@/core/CoreLibrary";
import { expect } from "@jest/globals";
import type { MatcherFunction } from "expect";
import { getPercentile } from "@/core/physicalHealth/BodyMassIndex";
import { CoreLibraryResponse } from "@/core/types/CoreLibraryResponse";

// there is a possible error margin for CoreLibrary's calculations, so this custom function allows for minimal errors within an acceptable range to pass the tests
const toBeWithinMargin: MatcherFunction<[expected: number, margin?: number]> =
    function (received, expected, margin = 0.3) {
        if (
            typeof received !== "number" ||
            typeof expected !== "number" ||
            typeof margin !== "number"
        ) {
            throw new TypeError("All arguments must be of type number!");
        }

        const pass: boolean =
            received >= expected - margin && received <= expected + margin;
        if (pass) {
            return {
                message: (): string =>
                    `expected ${this.utils.printReceived(received)} not to be within ${margin} of ${this.utils.printExpected(expected)}`,
                pass: true,
            };
        } else {
            return {
                message: (): string =>
                    `expected ${this.utils.printReceived(received)} to be within ${margin} of ${this.utils.printExpected(expected)}`,
                pass: false,
            };
        }
    };

expect.extend({
    toBeWithinMargin,
});

declare module "expect" {
    interface AsymmetricMatchers {
        toBeWithinMargin(expected: number, margin?: number): void;
    }
    interface Matchers<R> {
        toBeWithinMargin(expected: number, margin?: number): R;
    }
}

const calculateBodyMassIndex =
    CoreLibrary.physicalHealth.BodyMassIndex.calculate;

describe("body mass index calculations", () => {
    // expected results are provided from the CDC's calculator
    // allowed error margin is of 0.1

    test("should return accurate BMI value for age 19, female", () => {
        const calculation = calculateBodyMassIndex(19, "female", 50, 160);
        expect(calculation.result).toBeWithinMargin(19.5, 0.1);
    });

    test("should return accurate BMI value for age 21, male", () => {
        const calculation = calculateBodyMassIndex(21, "male", 70, 175);
        expect(calculation.result).toBeWithinMargin(22.9, 0.1);
    });

    test("should return accurate BMI value for age 30, female", () => {
        const calculation = calculateBodyMassIndex(30, "female", 60, 165);
        expect(calculation.result).toBeWithinMargin(22.0, 0.1);
    });

    test("should handle and return all BMI contexts (underweight, healthy weight, overweight, obesity)", () => {
        const cases = [
            { age: 25, weight: 45, height: 170, expected: "underweight" },
            { age: 25, weight: 60, height: 170, expected: "healthy weight" },
            { age: 25, weight: 80, height: 170, expected: "overweight" },
            { age: 25, weight: 100, height: 170, expected: "obesity" },
        ];

        cases.forEach(({ age, weight, height, expected }) => {
            const calculation: CoreLibraryResponse = calculateBodyMassIndex(
                age,
                "female",
                weight,
                height,
            );
            expect(calculation.context).toBe(expected);
        });
    });
});

describe("body mass index function handling", () => {
    test("should include explanation", (): void => {
        const calculation = calculateBodyMassIndex(25, "female", 60, 165);
        expect(calculation.explanation).toBe(
            "(According to CDC) Body mass index (BMI) is a person's weight in kilograms divided by the square of height in meters. BMI is an inexpensive and easy screening method for weight category—underweight, healthy weight, overweight, and obesity. BMI does not measure body fat directly, but BMI is moderately correlated with more direct measures of body fat. Furthermore, BMI appears to be as strongly correlated with various metabolic and disease outcomes as are these more direct measures of body fatness.",
        );
    });

    test("should handle invalid age input", () => {
        expect(() => {
            calculateBodyMassIndex(-5, "male", 70, 175);
        }).toThrowError("Invalid age provided.");
    });

    test("should return context", () => {
        const calculation = calculateBodyMassIndex(25, "male", 70, 175);
        expect(calculation.context).toBe("healthy weight");
    });
});

describe("body mass index underage calculations", () => {
    // under 20 years of age, calculations are more strict / require of more precision,
    // hence they got additional tests

    test("should return accurate BMI value for age 14, male", () => {
        const calculation = calculateBodyMassIndex(14, "male", 45, 170);
        expect(calculation.result).toBeWithinMargin(15.6, 0.1);
        expect(calculation.context).toBe("underweight");
    });
});

describe("calibrate percentile calculations", () => {
    // since i've been having more errors than expected, i added this to try to find the error by calibrating the way i get the percentiles

    test("should return accurate percentile", () => {
        const result = getPercentile(15.6, 14, "male");
        expect(result).toBe(5); // 5, 1st percentile
    });
});
