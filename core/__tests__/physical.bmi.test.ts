import CoreLibrary from "@/core/core";
import { expect } from "@jest/globals";
import { getPercentile } from "@/core/physical_health/bmi";
import { CoreLibraryResponse } from "@/core/types/core_library_response";
import { toBeWithinMargin } from "../tools/jest";

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

    test("should handle and return all BMI contexts", () => {
        const cases = [
            {
                age: 25,
                weight: 45,
                height: 170,
                expected: "severely underweight",
            },
            {
                age: 25,
                weight: 50,
                height: 170,
                expected: "underweight",
            },
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
        expect(calculation.context).toBe("severely underweight");
    });
});

describe("calibrate percentile calculations", () => {
    // since i've been having more errors than expected, i added this to try to find the error by calibrating the way i get the percentiles

    test("should return accurate percentile", () => {
        const result = getPercentile(15.6, 14, "male");
        expect(result).toBe(5); // 5, 1st percentile
    });
});
