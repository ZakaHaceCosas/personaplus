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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logToConsole } from "@/toolkit/debug/Console";
import { Alert } from "react-native";
import { FullProfile } from "@/types/User";
import { router } from "expo-router";

/**
 * Validates the basic user data, to ensure the gender, age, height, weight, and username values are valid. This doesn't just check for types, but actually does some extra validation, like username lenght or "normal limits" (e.g. returning invalid if the user wants to set his weight to 999kg).
 *
 * @export
 * @param {(string | "male" | "female" | null)} gender Gender value
 * @param {(string | number | null)} age Age value
 * @param {(string | number | null)} weight Weight value (kilograms)
 * @param {(string | number | null)} height Height value (centimeters)
 * @param {(string | null)} username Username
 * @returns {boolean} `true` if everything's valid, `false` otherwise.
 */
export function validateUserData(
    gender: string | "male" | "female" | null,
    age: string | number | null,
    weight: string | number | null,
    height: string | number | null,
    username: string | null
): boolean {
    const isGenderValid = gender === "male" || gender === "female";
    const isAgeValid = age !== null && age !== undefined && age !== "" && !isNaN(Number(age)) && Number(age) >= 5 && Number(age) <= 99;
    const isWeightValid = weight !== null && weight !== undefined && weight !== "" && !isNaN(Number(weight)) && Number(weight) >= 15 && Number(weight) <= 300;
    const isHeightValid = height !== null && height !== undefined && height !== "" && !isNaN(Number(height)) && Number(height) >= 45 && Number(height) <= 260;
    const isUsernameValid = username !== null && username !== undefined && username.trim() !== "" && username.trim().length >= 3 && username.trim().length <= 40;

    return isGenderValid && isAgeValid && isWeightValid && isHeightValid && isUsernameValid;
}

/**
 * Fetches and orchestrates all of the user's data onto a `FullProfile` object. **Async function.**
 *
 * @export
 * @async
 * @returns {Promise<FullProfile | null>} A `FullProfile` if a profile exists and the function succeeds in orchestrating it, `null` otherwise.
 */
export async function orchestrateUserData(): Promise<FullProfile | null> {
    let response: FullProfile | null = null
    try {
        async function handler(): Promise<void> {
            const data = await AsyncStorage.getItem("userData")
            response = (data !== null && data !== "" && Object.keys(JSON.parse(data)).length > 0) ? JSON.parse(data) : null
        }

        await handler()
    } catch (e) {
        logToConsole("Error orchestrating user data! " + e, "error", undefined, false)
        throw e
    }

    return response
}

/**
 * **Removes all of the users data.** Doesn't remove some key pieces of data that are important (those can be deleted using separate functions), e.g. developer logs.
 *
 * @export
 * @param {boolean} careAboutTheUser Whether you care about the user or not in the specific context you're calling this. Basically: if `true`, a confirmation modal is shown, otherwise (`false`) data's just deleted without asking.
 */
export function updateBrm5(careAboutTheUser: boolean) {
    async function releaseOperationResurgence() {
        try {
            await AsyncStorage.removeItem("userData")
            router.replace("/Welcome")
            return 0
        } catch (e) {
            logToConsole("Unknown error removing user data!", "error") // to the user, we show a normal message
            logToConsole("Error releasing op. Resurgence AKA removing user data: " + e, "error", undefined, false) // to the developer, the full error info and the real name of the function
            throw e
        }
    }

    if (careAboutTheUser) {
        Alert.alert(
            "Are you sure about that?",
            "There's no way to undo this. Please be certain.",
            [
                {
                    isPreferred: false,
                    text: "Go ahead",
                    style: "destructive",
                    onPress: () => releaseOperationResurgence()
                },
                {
                    isPreferred: true,
                    text: "Nevermind",
                    style: "cancel"
                }
            ]
        )
    } else {
        logToConsole("WATCHOUT! BAD PRACTICE SUMMONED!! (someone called `updateBrm5` with param `careAboutTheUser` set to `false`)", "warn")
        releaseOperationResurgence()
    }
}
