import {
    ErrorUserData,
    OrchestrateUserData,
    ValidateUserData,
} from "@/toolkit/user";
import AsyncStorage from "expo-sqlite/kv-store";
import { FullProfile } from "@/types/user";

jest.mock("expo-sqlite/kv-store", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<
    (key: string) => Promise<string | null>
>;

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
    healthConditions: ["broCantBreathe"],
};

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
        expect(result).toEqual(ErrorUserData);
    });

    test("should return null for empty or invalid JSON data", async () => {
        mockGetItem.mockResolvedValueOnce("");

        const result = await OrchestrateUserData();
        expect(result).toEqual(ErrorUserData);
    });
});

describe("ValidateUserData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return true for valid data", () => {
        const result: boolean = ValidateUserData(
            {
                gender: "male",
                age: 25,
                weight: 75,
                height: 180,
                username: "validUser",
                theThinkHour: "15:35:00",
                sleepHours: 6,
                activeness: "moderate",
                healthConditions: [],
            },
            "Basic",
        );
        expect(result).toBe(true);
    });

    test("should return false for invalid gender", () => {
        const result = ValidateUserData(
            {
                gender: "transformational being LMAO",
                age: 25,
                weight: 75,
                height: 180,
                username: "validUser",
                healthConditions: [],
            },
            "Basic",
        );
        expect(result).toBe(false);
    });

    test("should return false for age below cap", () => {
        const result = ValidateUserData(
            {
                gender: "male",
                age: 1,
                weight: 75,
                height: 180,
                username: "validUser",
                healthConditions: [],
            },
            "Basic",
        );
        expect(result).toBe(false);
    });

    test("should return false for age above cap", () => {
        const result = ValidateUserData(
            {
                gender: "male",
                age: 25432,
                weight: 75,
                height: 180,
                username: "validUser",
                healthConditions: [],
            },
            "Basic",
        );
        expect(result).toBe(false);
    });

    test("should return false for weight below cap", () => {
        const result = ValidateUserData(
            {
                gender: "male",
                age: 25,
                weight: 12,
                height: 4,
                username: "validUser",
                healthConditions: [],
            },
            "Basic",
        );
        expect(result).toBe(false);
    });

    test("should return false for weight above cap", () => {
        const result = ValidateUserData(
            {
                gender: "male",
                age: 25,
                weight: 75,
                height: 2180,
                username: "validUser",
                healthConditions: [],
            },
            "Basic",
        );
        expect(result).toBe(false);
    });

    test("should return false for height below cap", () => {
        const result = ValidateUserData(
            {
                gender: "male",
                age: 25,
                weight: 5,
                height: 180,
                username: "validUser",
                healthConditions: [],
            },
            "Basic",
        );
        expect(result).toBe(false);
    });

    test("should return false for height above cap", () => {
        const result = ValidateUserData(
            {
                gender: "male",
                age: 25,
                weight: 75312,
                height: 180,
                username: "validUser",
                healthConditions: [],
            },
            "Basic",
        );
        expect(result).toBe(false);
    });

    test("should return false for username below cap", () => {
        const result = ValidateUserData(
            {
                gender: "male",
                age: 25,
                weight: 75,
                height: 180,
                username: "a",
                healthConditions: [],
            },
            "Basic",
        );
        expect(result).toBe(false);
    });

    test("should return false for username above cap", () => {
        const result = ValidateUserData(
            {
                gender: "male",
                age: 25,
                weight: 75,
                height: 180,
                username: "a".repeat(41),
                healthConditions: [],
            },
            "Basic",
        );
        expect(result).toBe(false);
    });

    test("should return false for no username", () => {
        const result1 = ValidateUserData(
            {
                gender: "male",
                age: 25,
                weight: 75,
                height: 180,
                username: "",
                healthConditions: [],
            },
            "Basic",
        );
        const result2 = ValidateUserData(
            {
                gender: "male",
                age: 25,
                weight: 75,
                height: 180,
                username: null,
                healthConditions: [],
            },
            "Basic",
        );
        expect(result1).toBe(false);
        expect(result2).toBe(false);
    });

    test("should return false for wrong username", () => {
        const result1 = ValidateUserData(
            {
                gender: "male",
                age: 25,
                weight: 75,
                height: 180,
                username: "ErrOr.",
                healthConditions: [],
            },
            "Basic",
        );
        const result2 = ValidateUserData(
            {
                gender: "male",
                age: 25,
                weight: 75,
                height: 180,
                username: "PEdro Sánchez",
                healthConditions: [],
            },
            "Basic",
        );
        expect(result1).toBe(false);
        expect(result2).toBe(false);
    });
});
