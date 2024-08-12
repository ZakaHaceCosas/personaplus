import { TFunction } from "i18next";

export default function generateRandomMessage(target: "all_done", t: TFunction) {
    // choose a random message for certain parts of the UI
    // so the app feels more friendly :D
    const allMessages: string[] = t(`cool_messages.${target}`, {
        returnObjects: true,
    });

    const message =
        allMessages[Math.floor(Math.random() * allMessages.length)];

    return message
}
