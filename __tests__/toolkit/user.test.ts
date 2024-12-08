import { OrchestrateUserData, ValidateUserData } from "@/toolkit/user";
import AsyncStorage from "expo-sqlite/kv-store";
import { FullProfile } from "@/types/user";

jest.mock("expo-sqlite/kv-store", () => ({
    getItemSync: jest.fn(),
    setItem: jest.fn(),
}));

const samplesValidProfile: FullProfile = {
    username: "Jesus",
    age: 45,
    gender: "male",
    weight: 60,
    height: 185,
    language: "es",
    activeness: "intense",
    theThinkHour: "19:00:00",
    focus: "exercising",
    isNewUser: false,
    sleepHours: 9,
    wantsNotifications: false,
};

const mockGetItemSync = AsyncStorage.getItemSync as jest.MockedFunction<
    (key: string) => string | null
>;

describe("OrchestrateUserData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return a valid FullProfile object when data is present", () => {
        mockGetItemSync.mockReturnValueOnce(
            JSON.stringify(samplesValidProfile),
        );

        const result = OrchestrateUserData();
        expect(result).toEqual(samplesValidProfile);
    });

    test("should return null if AsyncStorage has no data", () => {
        mockGetItemSync.mockReturnValueOnce(null);

        const result = OrchestrateUserData();
        expect(result).toBeNull();
    });

    test("should return null for empty or invalid JSON data", async () => {
        mockGetItemSync.mockReturnValueOnce("");

        const result = OrchestrateUserData();
        expect(result).toBeNull();
    });

    test("should throw an error when AsyncStorage throws", async () => {
        mockGetItemSync.mockImplementationOnce(() => {
            throw new Error("This is a sample error. Everything works!");
        });

        expect(OrchestrateUserData()).rejects.toThrow(
            "This is a sample error. Everything works!",
        );
    });
});

describe("ValidateUserData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return true for valid data", () => {
        const result = ValidateUserData("male", 25, 75, 180, "validUser");
        expect(result).toBe(true);
    });

    test("should return false for invalid gender", () => {
        const result = ValidateUserData("other", 25, 75, 180, "validUser");
        expect(result).toBe(false);
    });

    test("should return false for age less than 5", () => {
        const result = ValidateUserData("female", 3, 60, 160, "validUser");
        expect(result).toBe(false);
    });

    test("should return false for age more than 99", () => {
        const result = ValidateUserData("female", 100, 60, 160, "validUser");
        expect(result).toBe(false);
    });

    test("should return false for invalid weight (less than 15)", () => {
        const result = ValidateUserData("male", 30, 10, 180, "validUser");
        expect(result).toBe(false);
    });

    test("should return false for invalid weight (more than 300)", () => {
        const result = ValidateUserData("male", 30, 310, 180, "validUser");
        expect(result).toBe(false);
    });

    test("should return false for invalid height (less than 45)", () => {
        const result = ValidateUserData("male", 25, 75, 30, "validUser");
        expect(result).toBe(false);
    });

    test("should return false for invalid height (more than 260)", () => {
        const result = ValidateUserData("male", 25, 75, 270, "validUser");
        expect(result).toBe(false);
    });

    test("should return false for invalid username (less than 3 characters)", () => {
        const result = ValidateUserData("male", 25, 75, 180, "ab");
        expect(result).toBe(false);
    });

    test("should return false for invalid username (more than 40 characters)", () => {
        const result = ValidateUserData("male", 25, 75, 180, "a".repeat(41));
        expect(result).toBe(false);
    });

    test("should return false if username is empty or null", () => {
        const result1 = ValidateUserData("male", 25, 75, 180, "");
        const result2 = ValidateUserData("male", 25, 75, 180, null);
        expect(result1).toBe(false);
        expect(result2).toBe(false);
    });
});
