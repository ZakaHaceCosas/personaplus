// src/hooks/useNotification.ts
// A hook to send reminder notifications for users to do what they have to do.

import { useState, useEffect } from 'react'
import { Platform } from 'react-native';
import { isDevice } from 'expo-device';
import {
    setNotificationChannelAsync,
    getPermissionsAsync,
    requestPermissionsAsync,
    setNotificationHandler,
    AndroidImportance,
    getExpoPushTokenAsync,
    scheduleNotificationAsync,
    cancelScheduledNotificationAsync,
    ExpoPushToken,
    getAllScheduledNotificationsAsync
} from "expo-notifications";
import { termLog } from '@/src/toolkit/debug/console';
import * as Constants from "expo-constants";
import { TFunction } from 'i18next';
import generateRandomMessage from '@/src/toolkit/design/randomMessages';

setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

/**
 * Function to register for using the push notifications. **Async function.**
 *
 * @async
 * @returns {ExpoPushToken | undefined} An `ExpoPushToken`, or `undefined` if an error happened.
 */
async function registerForPushNotificationsAsync(): Promise<ExpoPushToken | undefined> {
    try {
        let token;

        if (Platform.OS === 'android') {
            setNotificationChannelAsync('default', {
                name: 'default',
                importance: AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#32FF80FF',
            });
        }

        if (isDevice) {
            const { status: existingStatus } = await getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                termLog('Failed to get push token for push notification!', "error");
                return;
            } else {
                token = await getExpoPushTokenAsync({
                    projectId: Constants.default.easConfig?.projectId,
                });
            }
        } else {
            alert('Must use physical device for Push Notifications');
            termLog('Must use physical device for Push Notifications', "warn");
        }

        return token;
    } catch (e) {
        termLog("Error registering for push notifications: " + e, "error")
    }
}

/**
 * Registers for push notifications and returns the token as a string.
 *
 * @returns {string} The Expo push token
 */
export default function useNotification(): string {
    const [expoPushToken, setExpoPushToken] = useState('');

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            if (token) {
                setExpoPushToken(token.data);
            }
        });
    }, []);

    return expoPushToken
}

interface NotificationIdentifier {
    identifier: string;
}

const scheduledNotifications: NotificationIdentifier[] = [];

/**
 * This function registers today's reminders. **Async function.**
 *
 * @async
 * @param t Pass here the translate function
 * @returns {boolean | undefined} True if everything went alright, false if otherwise. Should log the try-catch error to termLog.
 */
export async function scheduleRandomNotifications(t: TFunction): Promise<boolean | undefined> {
    try {
        const randomDelay = () => (Math.floor(Math.random() * 1800) + 1800) * 1000;
        // a random interval of 30-60 minutes, so user gets many reminders, but not too annoying

        for (let i = 0; i < 2; i++) {
            const randomMessage: string = generateRandomMessage("reminders", t);
            const trigger = {
                hour: Math.floor(Math.random() * 12) + 11,
                minute: Math.floor(Math.random() * 60),
                repeats: true,
            };

            const identifier = await scheduleNotificationAsync({
                content: {
                    title: t("notifications.daily_active_objectives_pending"),
                    body: randomMessage,
                },
                trigger,
            });

            // Store the notification identifier
            scheduledNotifications.push({ identifier });

            await new Promise(resolve => setTimeout(resolve, randomDelay()));
            termLog(String(scheduledNotifications), "log");
            termLog("Scheduled Notis ENABLED", "log");
            return true
        }
    } catch (e) {
        termLog("ERROR REGISTERING NOTIFICATIONS: " + e, "error")
        return false
    }
}

/**
 * This function cancels today's registered reminders. **Async function.**
 *
 * @async
 * @returns {boolean} True if everything went alright, false if otherwise. Should log the try-catch error to termLog.
 */
export async function cancelScheduledNotifications(): Promise<boolean> {
    try {
        for (const { identifier } of scheduledNotifications) {
            await cancelScheduledNotificationAsync(identifier);
        }

        scheduledNotifications.length = 0;
        termLog(String(scheduledNotifications), "log");
        termLog("Scheduled Notis DISABLED", "log");
        return true
    } catch (e) {
        termLog("ERROR REGISTERING NOTIFICATIONS: " + e, "error")
        return false
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

    const today = new Date(); // today
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today); // tomorrow
    tomorrow.setDate(today.getDate() + 1);

    const hasNotificationForToday = notifications.some(notification => {
        const trigger = notification.trigger; // gets da trigger of each notification
        if (trigger && 'date' in trigger) { // seeks for the date param
            const notificationDate = new Date(trigger.date as string); // converts it to actual date
            return notificationDate >= today && notificationDate < tomorrow; // compares, and returns
        }
        return false; // no date? then just false ig
    });

    return hasNotificationForToday; // return
}
