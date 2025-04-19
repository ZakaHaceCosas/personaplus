import type { MatcherFunction } from "expect";

/**
 * There is a possible error margin for CoreLibrary's calculations, so this custom function allows for minimal errors within an acceptable range to pass the tests
 */
export const toBeWithinMargin: MatcherFunction<
    [expected: number, margin?: number]
> = function (received, expected, margin = 0.3) {
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
                `expected ${this.utils.printReceived(
                    received,
                )} not to be within ${margin} of ${this.utils.printExpected(
                    expected,
                )}`,
            pass: true,
        };
    } else {
        return {
            message: (): string =>
                `expected ${this.utils.printReceived(
                    received,
                )} to be within ${margin} of ${this.utils.printExpected(
                    expected,
                )}`,
            pass: false,
        };
    }
};
