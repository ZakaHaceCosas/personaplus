// src/hooks/useNotification.ts
// A hook to send reminder notifications for users to do what they have to do.

import { Platform } from "react-native";
import { isDevice } from "expo-device";
import {
    setNotificationChannelAsync,
    getPermissionsAsync,
    requestPermissionsAsync,
    ExpoPushToken,
    AndroidImportance,
    getExpoPushTokenAsync,
    scheduleNotificationAsync,
    cancelScheduledNotificationAsync,
    SchedulableTriggerInputTypes,
    getAllScheduledNotificationsAsync,
} from "expo-notifications";
import { logToConsole } from "@/toolkit/debug/console";
import Constants from "expo-constants";
import { TFunction } from "i18next";
import GenerateRandomMessage from "@/toolkit/random_message";
import { ShowToast } from "@/toolkit/android";

/**
 * Function to register for using the push notifications.
 *
 * @async
 * @returns {ExpoPushToken | undefined} An `ExpoPushToken`, or `undefined` if an error happened.
 */
async function registerForPushNotificationsAsync(
    channel: string,
): Promise<ExpoPushToken | undefined> {
    let token;

    if (Platform.OS === "android") {
        await setNotificationChannelAsync(channel, {
            name: channel,
            importance: AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    if (isDevice) {
        const { status: existingStatus } = await getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            logToConsole(
                "Failed to get push token for push notification!",
                "error",
            );
            return;
        }
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        // EAS projectId is used here.
        try {
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ??
                Constants?.easConfig?.projectId;
            if (!projectId) {
                logToConsole("Project ID not found", "error");
                return;
            }
            token = (
                await getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            if (!token) {
                logToConsole(
                    "No ExpoPushToken! Cannot register notifications",
                    "error",
                );
                return;
            }
            const response: ExpoPushToken = {
                type: "expo",
                data: token,
            };
            return response;
        } catch (e) {
            throw new Error(`Error getting Expo Push token: ${e}`);
        }
    } else {
        logToConsole("Must use physical device for Push Notifications", "warn");
        return;
    }
}

/**
 * Registers for push notifications and returns the token as a string.
 *
 * @returns {string} The Expo push token
 */
export async function handleNotificationsAsync(
    channel: string,
): Promise<string> {
    try {
        const token = await registerForPushNotificationsAsync(channel);

        if (token && token.data) {
            return token.data;
        } else {
            throw new Error(
                "Registering didn't throw an error, but ExpoPushToken.data (the token is null). I don't know what's up.",
            );
        }
    } catch (e) {
        logToConsole(`Error with useNotification(${channel}): ${e}`, "error", {
            function: "useNotification()",
            location: "@/hooks/useNotification()",
            isHandler: true,
        });
        return "error";
    }
}

/**
 * This function registers today's reminders.
 *
 * @async
 * @param t Pass here the translate function
 * @param {boolean} shouldTell if true, the user is told about the change.
 * @returns {boolean} True if everything went alright, false if otherwise. Should log the try-catch error to termLog.
 */
export async function scheduleRandomNotifications(
    amountOfNotifications: number,
    t: TFunction,
): Promise<boolean> {
    try {
        interface NotificationIdentifier {
            identifier: string;
        }

        const scheduledNotifications: NotificationIdentifier[] = [];

        for (let i = 0; i < amountOfNotifications; i++) {
            const randomMessage: string = GenerateRandomMessage(
                "activeObjectiveReminders",
                t,
            );
            const trigger = {
                hour: Math.floor(Math.random() * 12) + 11,
                minute: Math.floor(Math.random() * 60),
            };
            const triggerDate = new Date();
            triggerDate.setHours(trigger.hour);
            triggerDate.setMinutes(trigger.minute);

            const identifier: string = await scheduleNotificationAsync({
                content: {
                    title: t("notifications.reminder"),
                    body: randomMessage,
                },
                trigger: {
                    type: SchedulableTriggerInputTypes.DATE,
                    date: triggerDate,
                },
            });

            // Store the notification identifier
            scheduledNotifications.push({ identifier });

            for (const notification of scheduledNotifications) {
                logToConsole(
                    "Notification scheduled: " + notification.identifier,
                    "log",
                );
            }
            logToConsole("Scheduled Notifications ENABLED", "log");
        }
        return true;
    } catch (e) {
        logToConsole("ERROR REGISTERING NOTIFICATIONS: " + e, "error");
        return false;
    }
}

/**
 * This function cancels all registered reminder notifications.
 *
 * @async
 * @param {TFunction} t Pass the translate function here, please.
 * @param {?boolean} shouldTell If true, the user is told about the change.
 * @returns {boolean} True if everything went alright, false if otherwise. Should log the try-catch error to termLog.
 */
export async function cancelScheduledNotifications(
    t: TFunction,
    shouldTell: boolean,
): Promise<boolean> {
    try {
        const identifiers = await getAllScheduledNotificationsAsync();
        if (shouldTell) {
            ShowToast(
                t("pages.settings.preferences.notifications.flow.disabling"),
            );
        }
        for (const identifier of identifiers) {
            logToConsole(
                "Cancelling notification " + identifier.identifier,
                "log",
            );
            await cancelScheduledNotificationAsync(identifier.identifier);
        }
        logToConsole("Scheduled Notifications DISABLED", "log");
        if (shouldTell) {
            ShowToast(
                t("pages.settings.preferences.notifications.flow.disabled"),
            );
        }
        return true;
    } catch (e) {
        logToConsole("ERROR REGISTERING NOTIFICATIONS: " + e, "error");
        return false;
    }
}

/**
 * Checks if reminders are already set up for today. **Async function.**
 *
 * @export
 * @async
 * @returns {Promise<boolean>} `true` if there are notifications already scheduled for today, `false` if otherwise.
 */
export async function areNotificationsScheduledForToday(): Promise<boolean> {
    const notifications = await getAllScheduledNotificationsAsync(); // get notifications

    if (notifications.length > 15) {
        logToConsole(
            `There are ${notifications.length} registered notifications. Isn't that too much?`,
            "warn",
        );
    }

    return notifications.length > 0;
}
