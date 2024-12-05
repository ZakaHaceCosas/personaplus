import { logToConsole } from "@/toolkit/debug/Console";
import { TFunction } from "i18next";

/**
 * Generates a random message for certain parts of the UI to make the app feel more friendly. *Due to React's Rules of Hooks, you need to manually pass the `t`(translate) function as the second param.*
 *
 * @export
 * @param {string} target The type of random message you're seeking. It uses the name of the `translations/*.json` files, e.g. "`allObjectivesDone`" will return a random message from `coolRandomMessages.allObjectivesDone`.
 * @param {TFunction} t Pass the translate function
 * @returns {string} A random message string.
 */
export default function GenerateRandomMessage(
    target:
        | "allObjectivesDone"
        | "sessionCompleted"
        | "activeObjectiveReminders"
        | "createActiveObjective",
    t: TFunction,
): string {
    // Get all messages for the specified target
    // so the app feels more friendly :D
    const allMessages = t(`coolRandomMessages.${target}`, {
        returnObjects: true,
    });

    // Handle case where no messages are found
    if (!Array.isArray(allMessages) || allMessages.length === 0) {
        logToConsole(`No messages found for target: ${target}`, "warn");
        throw new Error(`No messages found for target: ${target}`);
    }

    // Choose a random message
    const randomIndex: number = Math.floor(Math.random() * allMessages.length);
    return allMessages[randomIndex];
}
