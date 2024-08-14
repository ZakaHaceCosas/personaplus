import { TFunction } from "i18next";

/**
 * For the app to be more friendly, generates a random message for certain parts of the UI.
 *
 * @export
 * @param {("all_done" | "session_done" | "reminders")} target What kind of random message you're seeking. It uses the name of the `translations/*.json` files, e.g. "`all_done`" will return a random message from `cool_messages.all_done`.
 * @param {TFunction} t Pass here the translate function, please.
 * @returns {string} Returns a string with your message.
 */
export default function generateRandomMessage(target: "all_done" | "session_done" | "reminders", t: TFunction): string {
    // choose a random message for certain parts of the UI
    // so the app feels more friendly :D
    const allMessages: string[] = t(`cool_messages.${target}`, {
        returnObjects: true,
    });

    const message: string =
        allMessages[Math.floor(Math.random() * allMessages.length)];

    return message
}
