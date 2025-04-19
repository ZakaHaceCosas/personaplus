import CoreLibrary from "@/core/core";
import { expect } from "@jest/globals";
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

const calculateBodyFatPercentage =
    CoreLibrary.physicalHealth.BodyFatPercentage.calculate;

describe("body fat percentage calculations", () => {
    // expected results are provided from the formula itself (manually done)
    // allowed error margin is of 0.1

    test("should calculate properly", () => {
        const cases = [
            {
                age: 31,
                weight: 76,
                height: 180,
                gender: "male",
                expected: 19.1,
            },
        ];

        cases.forEach(({ age, weight, height, gender, expected }) => {
            const calculation: CoreLibraryResponse = calculateBodyFatPercentage(
                age,
                gender as "male" | "female",
                weight,
                height,
            );
            expect(calculation.result).toBeWithinMargin(expected, 0.1);
        });
    });
});
