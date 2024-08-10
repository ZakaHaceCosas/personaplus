import calculateBodyMassIndex from "@/core/physicalHealth/bodymassindex";
import { expect } from '@jest/globals';
import type { MatcherFunction } from 'expect';

const toBeWithinMargin: MatcherFunction<[expected: number, margin?: number]> =
    function (received, expected, margin = 0.3) {
        if (typeof received !== 'number' || typeof expected !== 'number' || typeof margin !== 'number') {
            throw new TypeError('All arguments must be of type number!');
        }

        const pass = received >= (expected - margin) && received <= (expected + margin);
        if (pass) {
            return {
                message: () =>
                    `expected ${this.utils.printReceived(received)} not to be within ${margin} of ${this.utils.printExpected(expected)}`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected ${this.utils.printReceived(received)} to be within ${margin} of ${this.utils.printExpected(expected)}`,
                pass: false,
            };
        }
    };

expect.extend({
    toBeWithinMargin,
});

declare module 'expect' {
    interface AsymmetricMatchers {
        toBeWithinMargin(expected: number, margin?: number): void;
    }
    interface Matchers<R> {
        toBeWithinMargin(expected: number, margin?: number): R;
    }
}

describe("body mass index calculations", () => {
    test("should return an accurate BMI value", () => {
        const calculation = calculateBodyMassIndex(14, "male", 45.6, 170, false, false)

        expect(calculation.result).toBeWithinMargin(15.8, 0.3)
    })
})
