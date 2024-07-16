import React from 'react'
import { Platform } from 'react-native';
import { isDevice } from 'expo-device';
import { setNotificationChannelAsync, getPermissionsAsync, requestPermissionsAsync, setNotificationHandler, AndroidImportance, getExpoPushTokenAsync } from "expo-notifications";
import * as Constants from "expo-constants";

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
            importance: AndroidImportance.HIGH,
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
            return;
        }
        token = await getExpoPushTokenAsync({
            projectId: Constants.default.easConfig?.projectId,
        });
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

const useNotification = () => {

    const [expoPushToken, setExpoPushToken] = React.useState('');

    React.useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            if (token) {
                setExpoPushToken(token.data);
            }
        });
    }, []);

    return expoPushToken
}

export default useNotification
