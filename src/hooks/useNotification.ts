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
    cancelScheduledNotificationAsync
} from "expo-notifications";
import { termLog } from '@/src/toolkit/debug/console';
import * as Constants from "expo-constants";
import { TFunction } from 'i18next';

setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

async function registerForPushNotificationsAsync() {
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
        }
        token = await getExpoPushTokenAsync({
            projectId: Constants.default.easConfig?.projectId,
        });
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
        termLog('Must use physical device for Push Notifications', "warn");
    }

    return token;
}

const useNotification = () => {
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
 * This function registers today's reminders
 * @param t Pass here the translate function
 * @returns {boolean} True if everything went alright, false if otherwise. Should log the try-catch error to termLog.
 */

export const scheduleRandomNotifications = async (t: TFunction) => {
    try {
        const notificationMessages: string[] = t("cool_messages.all_done", {
            returnObjects: true,
        });

        const randomDelay = () => (Math.floor(Math.random() * 1800) + 1800) * 1000;
        // a random interval of 30-60 minutes, so user gets many reminders, but not too annoying

        for (let i = 0; i < 2; i++) {
            const randomMessage: string = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];
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
};

/**
 * This function cancels today's registered reminders
 * @returns {boolean} True if everything went alright, false if otherwise. Should log the try-catch error to termLog.
 */

export const cancelScheduledNotifications = async () => {
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
};

export default useNotification
