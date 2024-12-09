/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/toolkit/User.ts
 * Basically: A toolkit to work around with user data.
 *
 * <=============================================================================>
 */

import AsyncStorage from "expo-sqlite/kv-store";
import { logToConsole } from "@/toolkit/debug/console";
import { Alert } from "react-native";
import { BasicUserData, BasicUserHealthData, FullProfile } from "@/types/user";
import { router } from "expo-router";
import StoredItemNames from "@/constants/stored_item_names";
import ROUTES from "@/constants/routes";
import { TFunction } from "i18next";

/**
 * Validates the basic user data, to ensure the gender, age, height, weight, and username values are valid. This doesn't just check for types, but actually does some extra validation, like username length or "normal limits" (e.g. returning invalid if the user wants to set his weight to 999kg).
 *
 * @export
 * @param {(string | "male" | "female" | null)} gender Gender value
 * @param {(string | number | null)} age Age value
 * @param {(string | number | null)} weight Weight value (kilograms)
 * @param {(string | number | null)} height Height value (centimeters)
 * @param {(string | null)} username Username
 * @returns {boolean} `true` if everything's valid, `false` otherwise.
 */
export function ValidateUserData(
    gender: string | "male" | "female" | null,
    age: string | number | null,
    weight: string | number | null,
    height: string | number | null,
    username: string | null,
): boolean {
    const isGenderValid = gender === "male" || gender === "female";
    const isAgeValid =
        age !== null &&
        age !== undefined &&
        age !== "" &&
        !isNaN(Number(age)) &&
        Number(age) >= 5 &&
        Number(age) <= 99;
    const isWeightValid =
        weight !== null &&
        weight !== undefined &&
        weight !== "" &&
        !isNaN(Number(weight)) &&
        Number(weight) >= 15 &&
        Number(weight) <= 300;
    const isHeightValid =
        height !== null &&
        height !== undefined &&
        height !== "" &&
        !isNaN(Number(height)) &&
        Number(height) >= 45 &&
        Number(height) <= 260;
    const isUsernameValid =
        username !== null &&
        username !== undefined &&
        username.trim() !== "" &&
        username.trim().length >= 3 &&
        username.trim().length <= 40;

    return (
        isGenderValid &&
        isAgeValid &&
        isWeightValid &&
        isHeightValid &&
        isUsernameValid
    );
}

// i think this is called overloading or something
// it fixes a type error
type Filter = "basic" | "health";

export async function OrchestrateUserData(
    filter: "basic",
): Promise<BasicUserData>;
export async function OrchestrateUserData(
    filter: "health",
): Promise<BasicUserHealthData>;
export async function OrchestrateUserData(
    filter?: undefined,
): Promise<FullProfile>;
/**
 * Fetches and orchestrates all of the user's data onto a `FullProfile` object. Returns `ErrorUserData` if an error happens.
 *
 * @export
 * @async
 * @param {"basic" | "health"} filter If passed, it will instead return the specified (basic data or health data).
 * @returns {Promise<FullProfile | BasicUserData | BasicUserHealthData>} A `FullProfile` if a profile exists and the function succeeds in orchestrating it, `ErrorUserData` otherwise.
 */
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
            };
        }

        if (filter === "health") {
            return {
                age: fullData.age,
                weight: fullData.weight,
                height: fullData.height,
                gender: fullData.gender,
            };
        }

        return fullData;
    } catch (e) {
        if ((e as string).includes("NO_DATA")) {
            router.replace(ROUTES.MAIN.WELCOME_SCREEN);
            return ErrorUserData;
        }
        logToConsole(
            `Error orchestrating user data! ${e}`,
            "error",
            undefined,
            false,
        );
        return ErrorUserData;
    }
}

// don't mind the name this function was given. do not change it :)
/**
 * **Removes all of the users data.** Doesn't remove some key pieces of data that are important (those can be deleted using separate functions), e.g. developer logs.
 *
 * @async
 * @export
 * @param {boolean} careAboutTheUser Whether you care about the user or not in the specific context you're calling this. Basically: if `true`, a confirmation modal is shown, otherwise (`false`) data's just deleted without asking.
 * @param {TFunction} t Pass here the translate function, please.
 */
export async function updateBrm5(
    careAboutTheUser: boolean,
    t: TFunction,
): Promise<void> {
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
                StoredItemNames.objectives,
                StoredItemNames.dailyLog,
                StoredItemNames.colorTheme,
                StoredItemNames.experiments,
            ]);
            router.replace(ROUTES.MAIN.WELCOME_SCREEN);
            return 0;
        } catch (e) {
            logToConsole(
                "Unknown error removing user data!",
                "error",
                undefined,
                true,
            ); // to the user, we show a normal message
            logToConsole(
                `Error releasing op. Resurgence AKA removing user data: ${e}`,
                "error",
                {
                    function: "updateBrm5()",
                    location: "@/toolkit/User.ts",
                    isHandler: true,
                    handlerName: "releaseOperationResurgence()",
                },
                false,
            ); // to the developer, the full error info and the real name of the function
            throw e;
        }
    }

    if (careAboutTheUser) {
        Alert.alert(
            t("pages.settings.dangerous.resetApp.flow.areYouSure"),
            t("pages.settings.dangerous.resetApp.flow.areYouSureText"),
            [
                {
                    isPreferred: false,
                    text: t("globals.interaction.goAheadBad"),
                    style: "destructive",
                    onPress: async () => {
                        await releaseOperationResurgence();
                    },
                },
                {
                    isPreferred: true,
                    text: t("globals.interaction.nevermind"),
                    style: "cancel",
                    onPress: () => {},
                },
            ],
        );
    } else {
        logToConsole(
            "WATCHOUT! BAD PRACTICE SUMMONED!! (someone called `updateBrm5` with param `careAboutTheUser` set to `false`)",
            "warn",
        );
        await releaseOperationResurgence();
    }
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
};
