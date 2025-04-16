// TODO - review this, something feels off
// src/hooks/useNotification.ts
// A hook to send reminder notifications for users to do what they have to do.

import { Platform } from "react-native";
import {
    AndroidImportance,
    cancelScheduledNotificationAsync,
    type ExpoPushToken,
    getAllScheduledNotificationsAsync,
    getExpoPushTokenAsync,
    getPermissionsAsync,
    // type NotificationBehavior,
    type NotificationRequest,
    type PermissionStatus,
    requestPermissionsAsync,
    SchedulableTriggerInputTypes,
    scheduleNotificationAsync,
    setNotificationChannelAsync,
    // setNotificationHandler
} from "expo-notifications";
import Constants from "expo-constants";
import { TFunction } from "i18next";
import { ShowToast } from "@/toolkit/android";
import { GenerateRandomMessage } from "@/toolkit/strings";

// setNotificationHandler({
//     handleNotification: async (): Promise<NotificationBehavior> => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: true,
//     })
// })

/**
 * Function to register for using the push notifications.
 *
 * @async
 * @returns {ExpoPushToken | undefined} An `ExpoPushToken`, or `undefined` if an error happened.
 */
async function registerForPushNotifications(
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

    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus: PermissionStatus = existingStatus;
    if (existingStatus !== "granted") {
        const { status } = await requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== "granted") {
        console.error(
            "Failed to get push token for push notification!",
            "error",
        );
        return;
    }

    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    const projectId: string =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
    if (!projectId) {
        console.error("Project ID not found");
        return;
    }
    token = (
        await getExpoPushTokenAsync({
            projectId,
        })
    ).data;
    if (!token) {
        console.error("No ExpoPushToken! Cannot register notifications");
        return;
    }
    const response: ExpoPushToken = {
        type: "expo",
        data: token,
    };
    return response;
}

/**
 * Registers for push notifications and returns the token as a string.
 *
 * @returns {string} The Expo push token
 */
export async function handleNotifications(channel: string): Promise<string> {
    try {
        const token: ExpoPushToken | undefined =
            await registerForPushNotifications(channel);

        if (!token || !token.data)
            throw new Error(
                "Registering didn't throw an error, but ExpoPushToken.data (the token) is null. I don't know what's up.",
            );
        return token.data;
    } catch (e) {
        console.error(`Error with notification handler: ${e}`, {
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
        }
        return true;
    } catch (e) {
        console.error(`ERROR REGISTERING NOTIFICATIONS: ${e}`);
        return false;
    }
}

/**
 * This function cancels all registered reminder notifications.
 *
 * @async
 * @param {TFunction} t Pass the translate function here, please.
 * @param {boolean} shouldTell If true, the user is told about the change.
 * @returns {boolean} True if everything went alright, false if otherwise.
 */
export async function cancelScheduledNotifications(
    t: TFunction,
    shouldTell: boolean,
): Promise<boolean> {
    try {
        const identifiers: NotificationRequest[] =
            await getAllScheduledNotificationsAsync();
        if (identifiers.length === 0) return true;
        if (shouldTell)
            ShowToast(
                t("pages.settings.preferences.notifications.flow.disabling"),
            );
        for (const identifier of identifiers) {
            await cancelScheduledNotificationAsync(identifier.identifier);
        }
        if (!shouldTell) return true;
        ShowToast(t("pages.settings.preferences.notifications.flow.disabled"));
        return true;
    } catch (e) {
        console.error(`ERROR UNREGISTERING NOTIFICATIONS: ${e}`);
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
    const notifications: NotificationRequest[] =
        await getAllScheduledNotificationsAsync(); // get notifications

    return notifications.length > 0;
}
