/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/toolkit/User.ts
 * Basically: A toolkit to work around with user data.
 *
 * <=============================================================================>
 */

import AsyncStorage from "expo-sqlite/kv-store";
import { Alert } from "react-native";
import {
    BasicUserData,
    BasicUserHealthData,
    FullProfile,
    FullProfileForCreation,
} from "@/types/user";
import { router } from "expo-router";
import StoredItemNames from "@/constants/stored_item_names";
import { Routes } from "@/constants/routes";
import { TFunction } from "i18next";
import { ShowToast } from "./android";

/**
 * Limits to what we consider "real" user data.
 */
export const VALID_USER_CAPS = {
    /** years of age. */
    AGE: {
        MIN: 5,
        MAX: 99,
    },
    /** kilograms. */
    WEIGHT: {
        MIN: 15,
        MAX: 300,
    },
    /** centimeters. */
    HEIGHT: {
        MIN: 45,
        MAX: 260,
    },
    /** char length. also includes invalid usernames. */
    USERNAME: {
        MIN: 3,
        MAX: 40,
        /** the two last entries are a joke, somewhat. */
        INVALID: ["error", "error.", "pedro sánchez", "pedro sanchez", "psoe"],
    },
};

/**
 * Validates the basic user data, to ensure the gender, age, height, weight, and username values are valid. This doesn't just check for types, but actually does some extra validation, like username length or "normal limits" (e.g. returning invalid if the user wants to set his weight to 999kg).
 *
 * @export
 * @param {any} user Anything
 * @param {("BasicHealth" | "Basic" | "Full")} level What level of validation you require.
 *
 * @returns Whether the given user is valid.
 */
export function ValidateUserData(
    user: any,
    level: "BasicHealth",
): user is BasicUserHealthData;
export function ValidateUserData(user: any, level: "Full"): user is FullProfile;
export function ValidateUserData(
    user: any,
    level: "Basic",
): user is BasicUserData;
export function ValidateUserData(
    user: any,
    level: "BasicHealth" | "Basic" | "Full",
): user is BasicUserHealthData | BasicUserData | FullProfile {
    const {
        gender,
        age,
        username,
        height,
        weight,
        theThinkHour,
        sleepHours,
        language,
        activeness,
        isNewUser,
        wantsNotifications,
        healthConditions,
    } = user as FullProfileForCreation;

    const isGenderValid: boolean = gender === "male" || gender === "female";
    const isAgeValid: boolean =
        age !== null &&
        age !== undefined &&
        age !== "" &&
        !isNaN(Number(age)) &&
        Number(age) >= VALID_USER_CAPS.AGE.MIN &&
        Number(age) <= VALID_USER_CAPS.AGE.MAX;
    const isWeightValid: boolean =
        weight !== null &&
        weight !== undefined &&
        weight !== "" &&
        !isNaN(Number(weight)) &&
        Number(weight) >= VALID_USER_CAPS.WEIGHT.MIN &&
        Number(weight) <= VALID_USER_CAPS.WEIGHT.MAX;
    const isHeightValid: boolean =
        height !== null &&
        height !== undefined &&
        height !== "" &&
        !isNaN(Number(height)) &&
        Number(height) >= VALID_USER_CAPS.HEIGHT.MIN &&
        Number(height) <= VALID_USER_CAPS.HEIGHT.MAX;
    const isUsernameValid: boolean =
        username !== null &&
        username !== undefined &&
        username.trim() !== "" &&
        username.trim().length >= VALID_USER_CAPS.USERNAME.MIN &&
        username.trim().length <= VALID_USER_CAPS.USERNAME.MAX &&
        !VALID_USER_CAPS.USERNAME.INVALID.includes(username.toLowerCase());
    const isThinkHourValid: boolean =
        theThinkHour !== null &&
        theThinkHour !== undefined &&
        theThinkHour.trim() !== "" &&
        new RegExp("^(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$").test(theThinkHour);
    const areSleepHoursValid: boolean =
        sleepHours !== null &&
        sleepHours !== undefined &&
        typeof sleepHours === "number" &&
        sleepHours >= 3 &&
        sleepHours <= 11;
    const isLanguageValid: boolean =
        language !== null &&
        language !== undefined &&
        ["en", "es"].includes(language);
    const isActivenessValid: boolean =
        activeness !== null &&
        activeness !== undefined &&
        ["poor", "light", "moderate", "intense", "super"].includes(activeness);
    const areGenericBooleansValid: boolean =
        typeof isNewUser === "boolean" &&
        typeof wantsNotifications === "boolean";
    const areMedicalConditionsValid: boolean =
        healthConditions !== "" &&
        healthConditions !== null &&
        (healthConditions === "none" ||
            (Array.isArray(healthConditions) &&
                healthConditions.every((condition: string): boolean =>
                    [
                        "broCantBreathe",
                        "broCantHeartbeat",
                        "broCantMove",
                        "broCantEat",
                    ].includes(condition),
                )));

    const isBasicHealthDataValid: boolean =
        isGenderValid &&
        isAgeValid &&
        isWeightValid &&
        isHeightValid &&
        areMedicalConditionsValid;
    const isBasicDataValid: boolean =
        isBasicHealthDataValid && areSleepHoursValid && isActivenessValid;
    const isFullProfileValid: boolean =
        isBasicDataValid &&
        isBasicHealthDataValid &&
        isLanguageValid &&
        areGenericBooleansValid &&
        isUsernameValid &&
        isThinkHourValid;

    switch (level) {
        case "BasicHealth":
            return isBasicHealthDataValid;
        case "Basic":
            return isBasicDataValid;
        case "Full":
            return isFullProfileValid;
    }
}

// i think this is called overloading or something
// it fixes a type error
type Filter = "basic" | "health";

/**
 * Fetches and orchestrates all of the user's data onto a `FullProfile` object. Returns `ErrorUserData` if an error happens - it shouldn't do that however. The home page validates user data, so you should assume data is valid.
 *
 * @export
 * @async
 * @param {"basic" | "health"} filter If passed, it will instead return the specified (basic data or health data).
 * @returns {Promise<FullProfile | BasicUserData | BasicUserHealthData>} The specified user data object (`FullProfile` by default) if a profile exists and the function succeeds in orchestrating it, `ErrorUserData` otherwise.
 */
export async function OrchestrateUserData(
    filter: "basic",
): Promise<BasicUserData>;
export async function OrchestrateUserData(
    filter: "health",
): Promise<BasicUserHealthData>;
export async function OrchestrateUserData(
    filter?: undefined,
): Promise<FullProfile>;
export async function OrchestrateUserData(
    filter?: Filter,
): Promise<FullProfile | BasicUserData | BasicUserHealthData> {
    try {
        const data: string | null = await AsyncStorage.getItem(
            StoredItemNames.userData,
        );

        if (
            !data ||
            data === null ||
            data === "" ||
            Object.keys(JSON.parse(data)).length === 0
        ) {
            throw new Error("NO_DATA");
        }

        const fullData: FullProfile = JSON.parse(data);

        if (filter === "basic") {
            return {
                username: fullData.username,
                age: fullData.age,
                weight: fullData.weight,
                height: fullData.height,
                gender: fullData.gender,
                theThinkHour: fullData.theThinkHour,
                activeness: fullData.activeness,
                sleepHours: fullData.sleepHours,
                healthConditions: fullData.healthConditions,
            };
        }

        if (filter === "health") {
            return {
                age: fullData.age,
                weight: fullData.weight,
                height: fullData.height,
                gender: fullData.gender,
                activeness: fullData.activeness,
                sleepHours: fullData.sleepHours,
                healthConditions: fullData.healthConditions,
            };
        }

        return fullData;
    } catch (e) {
        console.error(`Error orchestrating user data! ${e}`);
        return ErrorUserData;
    }
}

// don't mind the name this function was given. do not change it :)
/**
 * **Removes all of the users data.**
 *
 * @async
 * @export
 * @param {TFunction} t Pass here the translate function, please.
 */
export async function updateBrm5(t: TFunction): Promise<void> {
    /**
     * Handles the removal.
     *
     * @async
     * @returns {Promise<number>} 0 if success, 1 if failure.
     */
    async function releaseOperationResurgence(): Promise<number> {
        try {
            await AsyncStorage.multiRemove([
                StoredItemNames.userData,
                StoredItemNames.activeObjectives,
                StoredItemNames.passiveObjectives,
                StoredItemNames.activeDailyLog,
                StoredItemNames.passiveDailyLog,
                StoredItemNames.colorTheme,
            ]);
            router.replace(Routes.MAIN.WELCOME_SCREEN);
            return 0;
        } catch (e) {
            ShowToast("Unknown error removing user data!"); // to the user, we show a normal message
            console.error(
                `Error releasing op. Resurgence AKA removing user data: ${e}`,
                {
                    function: "updateBrm5()",
                    location: "@/toolkit/User.ts",
                    isHandler: true,
                    handlerName: "releaseOperationResurgence()",
                },
            ); // to the developer, the full error info and the real name of the function
            throw e;
        }
    }

    Alert.alert(
        t("pages.settings.dangerous.resetApp.flow.areYouSure"),
        t("pages.settings.dangerous.resetApp.flow.areYouSureText"),
        [
            {
                isPreferred: false,
                text: t("globals.interaction.goAheadBad"),
                style: "destructive",
                onPress: async (): Promise<void> => {
                    await releaseOperationResurgence();
                },
            },
            {
                isPreferred: true,
                text: t("globals.interaction.nevermind"),
                style: "cancel",
                onPress: (): void => {},
            },
        ],
    );
}

/**
 * Use this only as placeholder data in case an error happens fetching user data.
 *
 * @type {FullProfile}
 */
export const ErrorUserData: FullProfile = {
    username: "Error",
    age: 0,
    height: 0,
    weight: 0,
    theThinkHour: "0",
    gender: "female",
    language: "en",
    activeness: "poor",
    focus: "noPriority",
    sleepHours: 3,
    isNewUser: true,
    wantsNotifications: true,
    healthConditions: "none",
};

const validatorPrefix = "errors.userData.formValidation";

export const IndividualUserDataValidators = {
    username: {
        validator: (username: string): boolean => {
            return username.length === 0 ||
                (username.length >= 3 &&
                    username.length < 40 &&
                    !(
                        username.toLowerCase() === "error" ||
                        username.toLowerCase() === "error." ||
                        username.toLowerCase().includes("pedro sánchez") ||
                        username.toLowerCase().includes("pedro sanchez") ||
                        username.toLowerCase().includes("psoe")
                    ))
                ? true
                : false;
        },
        message: (username: string, t: TFunction): string => {
            return username.length === 0
                ? t(`${validatorPrefix}.username.required`)
                : username.length < VALID_USER_CAPS.USERNAME.MIN ||
                    username.length >= VALID_USER_CAPS.USERNAME.MAX
                  ? t(`${validatorPrefix}.username.length`, {
                        minCap: VALID_USER_CAPS.USERNAME.MIN,
                        maxCap: VALID_USER_CAPS.USERNAME.MAX,
                    })
                  : VALID_USER_CAPS.USERNAME.INVALID.includes(
                          username.toLowerCase(),
                      )
                    ? t(`${validatorPrefix}.username.forbidden`)
                    : "";
        },
    },
    age: {
        validator: (age: number | ""): boolean => {
            const { MIN, MAX } = VALID_USER_CAPS.AGE;

            return age === "" || (age >= MIN && age <= MAX) ? true : false;
        },
        message: (age: number | "", t: TFunction): string => {
            const { MIN, MAX } = VALID_USER_CAPS.AGE;

            return age === ""
                ? ""
                : !(age >= MIN)
                  ? t(`${validatorPrefix}.age.min`, { minCap: MIN })
                  : !(age <= MAX)
                    ? t(`${validatorPrefix}.age.max`, { maxCap: MAX })
                    : "";
        },
    },
    weight: {
        validator: (weight: number | ""): boolean => {
            const { MIN, MAX } = VALID_USER_CAPS.WEIGHT;

            return weight === "" || (weight >= MIN && weight <= MAX)
                ? true
                : false;
        },
        message: (weight: number | "", t: TFunction): string => {
            const { MIN, MAX } = VALID_USER_CAPS.WEIGHT;

            return weight === ""
                ? ""
                : !(weight >= MIN)
                  ? t(`${validatorPrefix}.weight.min`, { minCap: MIN })
                  : !(weight <= MAX)
                    ? t(`${validatorPrefix}.weight.max`, { maxCap: MAX })
                    : "";
        },
    },
    height: {
        validator: (height: number | ""): boolean => {
            const { MIN, MAX } = VALID_USER_CAPS.HEIGHT;

            return height === "" || (height >= MIN && height <= MAX)
                ? true
                : false;
        },
        message: (height: number | "", t: TFunction): string => {
            const { MIN, MAX } = VALID_USER_CAPS.HEIGHT;

            return height === ""
                ? ""
                : !(height >= MIN)
                  ? t(`${validatorPrefix}.height.min`, { minCap: MIN })
                  : !(height <= MAX)
                    ? t(`${validatorPrefix}.height.max`, { maxCap: MAX })
                    : "";
        },
    },
};
