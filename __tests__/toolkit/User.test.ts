import { OrchestrateUserData, validateUserData } from "@/toolkit/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FullProfile } from "@/types/User";

jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
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
};

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<
    typeof AsyncStorage.getItem
>;

describe("OrchestrateUserData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return a valid FullProfile object when data is present", async () => {
        mockGetItem.mockResolvedValueOnce(JSON.stringify(samplesValidProfile));

        const result = await OrchestrateUserData();
        expect(result).toEqual(samplesValidProfile);
    });

    test("should return null if AsyncStorage has no data", async () => {
        mockGetItem.mockResolvedValueOnce(null);

        const result = await OrchestrateUserData();
        expect(result).toBeNull();
    });

    test("should return null for empty or invalid JSON data", async () => {
        mockGetItem.mockResolvedValueOnce("");

        const result = await OrchestrateUserData();
        expect(result).toBeNull();
    });

    test("should throw an error when AsyncStorage throws", async () => {
        mockGetItem.mockRejectedValueOnce(
            new Error("This is a sample error. Everything works!"),
        );

        await expect(OrchestrateUserData()).rejects.toThrow(
            "This is a sample error. Everything works!",
        );
    });
});

describe("validateUserData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return true for valid data", () => {
        const result = validateUserData("male", 25, 75, 180, "validUser");
        expect(result).toBe(true);
    });

    test("should return false for invalid gender", () => {
        const result = validateUserData("other", 25, 75, 180, "validUser");
        expect(result).toBe(false);
    });

    test("should return false for age less than 5", () => {
        const result = validateUserData("female", 3, 60, 160, "validUser");
        expect(result).toBe(false);
    });

    test("should return false for age more than 99", () => {
        const result = validateUserData("female", 100, 60, 160, "validUser");
        expect(result).toBe(false);
    });

    test("should return false for invalid weight (less than 15)", () => {
        const result = validateUserData("male", 30, 10, 180, "validUser");
        expect(result).toBe(false);
    });

    test("should return false for invalid weight (more than 300)", () => {
        const result = validateUserData("male", 30, 310, 180, "validUser");
        expect(result).toBe(false);
    });

    test("should return false for invalid height (less than 45)", () => {
        const result = validateUserData("male", 25, 75, 30, "validUser");
        expect(result).toBe(false);
    });

    test("should return false for invalid height (more than 260)", () => {
        const result = validateUserData("male", 25, 75, 270, "validUser");
        expect(result).toBe(false);
    });

    test("should return false for invalid username (less than 3 characters)", () => {
        const result = validateUserData("male", 25, 75, 180, "ab");
        expect(result).toBe(false);
    });

    test("should return false for invalid username (more than 40 characters)", () => {
        const result = validateUserData("male", 25, 75, 180, "a".repeat(41));
        expect(result).toBe(false);
    });

    test("should return false if username is empty or null", () => {
        const result1 = validateUserData("male", 25, 75, 180, "");
        const result2 = validateUserData("male", 25, 75, 180, null);
        expect(result1).toBe(false);
        expect(result2).toBe(false);
    });
});
