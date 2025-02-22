// src/hooks/useNotification.ts
// A hook to send reminder notifications for users to do what they have to do.

import { Platform } from "react-native";
import {
    AndroidImportance,
    cancelScheduledNotificationAsync,
    ExpoPushToken,
    getAllScheduledNotificationsAsync,
    getExpoPushTokenAsync,
    getPermissionsAsync,
    NotificationRequest,
    PermissionStatus,
    requestPermissionsAsync,
    SchedulableTriggerInputTypes,
    scheduleNotificationAsync,
    setNotificationChannelAsync,
} from "expo-notifications";
import { logToConsole } from "@/toolkit/console";
import Constants from "expo-constants";
import { TFunction } from "i18next";
import { ShowToast } from "@/toolkit/android";
import { GenerateRandomMessage } from "@/toolkit/strings";

/**
 * Function to register for using the push notifications.
 *
 * @async
 * @returns {ExpoPushToken | undefined} An `ExpoPushToken`, or `undefined` if an error happened.
 */
async function registerForPushNotificationsAsync(
    channel: string,
): Promise<ExpoPushToken | undefined> {
    try {
        let token;

        if (Platform.OS === "android") {
            await setNotificationChannelAsync(channel, {
                name: channel,
                importance: AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }

        const { status: existingStatus } = await getPermissionsAsync();
        let finalStatus: PermissionStatus = existingStatus;
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
            const projectId: string =
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
    } catch (e) {
        const err = `Error registering for push notifications: ${e}`;
        logToConsole(err, "error");
        throw new Error(err);
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
        const token: ExpoPushToken | undefined =
            await registerForPushNotificationsAsync(channel);

        if (token && token.data) {
            return token.data;
        } else {
            throw new Error(
                "Registering didn't throw an error, but ExpoPushToken.data (the token) is null. I don't know what's up.",
            );
        }
    } catch (e) {
        logToConsole(`Error with notification handler: ${e}`, "error", {
            function: `handleNotificationsAsync(${channel})`,
            location: "@/hooks/use_notification()",
            isHandler: false,
        });
        return "error";
    }
}

/**
 * This function registers today's reminders.
 *
 * @async
 * @param {TFunction} t Pass here the translate function
 * @returns {boolean} True if everything went alright, false if otherwise. Should log the try-catch error to termLog.
 */
export async function scheduleRandomNotifications(
    t: TFunction,
): Promise<boolean> {
    try {
        const amountOfNotifications = 5;

        interface NotificationIdentifier {
            identifier: string;
        }

        const scheduledNotifications: NotificationIdentifier[] = [];

        for (let i: number = 0; i < amountOfNotifications; i++) {
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
                    `Notification scheduled: ${notification.identifier}`,
                    "log",
                );
            }
            logToConsole("Scheduled Notifications ENABLED", "log");
        }
        return true;
    } catch (e) {
        logToConsole(`ERROR REGISTERING NOTIFICATIONS: ${e}`, "error");
        return false;
    }
}

/**
 * This function cancels all registered reminder notifications.
 *
 * @async
 * @param {TFunction} t Pass the translate function here, please.
 * @param {boolean} shouldTell If true, the user is told about the change.
 * @returns {boolean} True if everything went alright, false if otherwise. Should log the try-catch error to termLog.
 */
export async function cancelScheduledNotifications(
    t: TFunction,
    shouldTell: boolean,
): Promise<boolean> {
    try {
        const identifiers: NotificationRequest[] =
            await getAllScheduledNotificationsAsync();
        if (identifiers.length === 0) {
            logToConsole("No notifications to disable", "log");
            return true;
        }
        if (shouldTell) {
            ShowToast(
                t("pages.settings.preferences.notifications.flow.disabling"),
            );
        }
        for (const identifier of identifiers) {
            logToConsole(
                `Cancelling notification ${identifier.identifier}`,
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
        logToConsole(`ERROR UNREGISTERING NOTIFICATIONS: ${e}`, "error");
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
    try {
        const notifications: NotificationRequest[] =
            await getAllScheduledNotificationsAsync(); // get notifications

        if (notifications.length > 5) {
            logToConsole(
                `There are ${notifications.length} registered notifications. Isn't that too much?`,
                "warn",
            );
        }

        return notifications.length > 0;
    } catch (e) {
        const err = `Error checking for scheduled notifications: ${e}`;
        logToConsole(err, "error");
        throw new Error(err);
    }
}
