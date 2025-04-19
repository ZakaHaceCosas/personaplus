/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/toolkit/strings
 * Basically: Various string-related utilities.
 *
 * <=============================================================================>
 */

import { TFunction } from "i18next";

/**
 * Handles pluralization of strings. Borrowed from [here](https://github.com/SokoraDesu/Sokora/blob/dev/src/utils/pluralOrNot.ts), ngl.
 *
 * @export
 * @param {string} word The word itself.
 * @param {number} numberToCheck The number you depend on to check if you should be using plural or singular.
 * @param {("es" | "en")} lang Pass the user's language. Most places are already fetching UserData anyway - this is better than making this function async ;).
 * @returns {string} The string.
 */
function PluralOrNot(
    word: string,
    numberToCheck: number,
    lang: "es" | "en",
): string {
    if (numberToCheck === 1) return word;

    if (lang === "en") {
        return word.charAt(word.length - 1) === "y"
            ? `${word.slice(0, -1)}ies` // "city" -> "cities"
            : `${word}s`; // "constant" -> "constants"
    }

    if (lang === "es") {
        if (word.endsWith("z")) {
            return `${word.slice(0, -1)}ces`; // "luz" -> "luces"
        } else if (word.endsWith("ión")) {
            return `${word.slice(0, -3)}iones`; // "canción" -> "canciones"
        } else if (word.endsWith("s")) {
            return word; // already plural, probably
        } else {
            return `${word}s`; // General: "libro" -> "libros"
        }
    }

    return word;
}

/**
 * Generates a random message for certain parts of the UI to make the app feel more friendly. *Due to React's Rules of Hooks, you need to manually pass the `t`(translate) function as the second param.*
 *
 * @export
 * @param {string} target The type of random message you're seeking. It uses the name of the `translations/*.json` files, e.g. "`allObjectivesDone`" will return a random message from `coolRandomMessages.allObjectivesDone`.
 * @param {TFunction} t Pass the translate function
 * @returns {string} A random message string.
 */
function GenerateRandomMessage(
    target:
        | "allObjectivesDone"
        | "sessionCompleted"
        | "activeObjectiveReminders"
        | "createActiveObjective"
        | "createPassiveObjective",
    t: TFunction,
): string {
    // Get all messages for the specified target
    // so the app feels more friendly :D
    const allMessages = t(`coolRandomMessages.${target}`, {
        returnObjects: true,
    });

    // Handle case where no messages are found
    if (!Array.isArray(allMessages) || allMessages.length === 0) {
        throw new Error(`No messages found for target: ${target}`);
    }

    // Choose a random message
    const randomIndex: number = Math.floor(Math.random() * allMessages.length);
    return allMessages[randomIndex];
}

export { GenerateRandomMessage, PluralOrNot };
