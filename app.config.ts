import * as ExpoConfig from '@expo/config';
import dotenv from 'dotenv';

dotenv.config();

const config: ExpoConfig.ExpoConfig = {
    name: "PersonaPlus",
    slug: "PersonaPlus",
    scheme: "personaplus",
    description: "Give yourself a PLUS",
    owner: "zakahacecosas",
    version: "0.0.1-R5-b24",
    orientation: "portrait",
    githubUrl: "https://github.com/ZakaHaceCosas/personaplus",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#14171C"
    },
    notification: {
        color: "#32FF80",
        androidMode: "default",
        icon: "./assets/notification-icon.png",
        androidCollapsedTitle: "#{unread_notifications} PersonaPlus notifications"
    },
    assetBundlePatterns: [
        "**/*"
    ],
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon-foreground.png",
            backgroundImage: "./assets/adaptive-icon-background.png",
            backgroundColor: "#0E1013"
        },
        allowBackup: false,
        package: "com.zakahacecosas.personaplus",
        permissions: [
            "android.permission.SCHEDULE_EXACT_ALARM",
            "android.permission.POST_NOTIFICATIONS",
            "android.permission.RECEIVE_BOOT_COMPLETED",
            "android.permission.WAKE_LOCK"
        ],
        versionCode: 24,
        backgroundColor: "#0E1013"
    },
    web: {
        favicon: "./assets/favicon.png",
        bundler: "metro"
    },
    privacy: "public",
    androidStatusBar: {
        barStyle: "light-content",
        hidden: false,
        translucent: false,
        backgroundColor: "#0E1013"
    },
    androidNavigationBar: {
        barStyle: "light-content",
        backgroundColor: "#0E1013",
    },
    plugins: [
        "expo-localization",
        "expo-build-properties",
        [
            "expo-font",
            {
                fonts: [
                    "./fonts/BeVietnamPro-Black.ttf",
                    "./fonts/BeVietnamPro-BlackItalic.ttf",
                    "./fonts/BeVietnamPro-ExtraBold.ttf",
                    "./fonts/BeVietnamPro-ExtraBoldItalic.ttf",
                    "./fonts/BeVietnamPro-Bold.ttf",
                    "./fonts/BeVietnamPro-BoldItalic.ttf",
                    "./fonts/BeVietnamPro-SemiBold.ttf",
                    "./fonts/BeVietnamPro-SemiBoldItalic.ttf",
                    "./fonts/BeVietnamPro-Medium.ttf",
                    "./fonts/BeVietnamPro-MediumItalic.ttf",
                    "./fonts/BeVietnamPro-Regular.ttf",
                    "./fonts/BeVietnamPro-Italic.ttf",
                    "./fonts/BeVietnamPro-Light.ttf",
                    "./fonts/BeVietnamPro-LightItalic.ttf",
                    "./fonts/BeVietnamPro-ExtraLight.ttf",
                    "./fonts/BeVietnamPro-ExtraLightItalic.ttf",
                    "./fonts/BeVietnamPro-Thin.ttf",
                    "./fonts/BeVietnamPro-ThinItalic.ttf",
                    "./fonts/NotoSerif-Black.ttf",
                    "./fonts/NotoSerif-BlackItalic.ttf",
                    "./fonts/NotoSerif-Bold.ttf",
                    "./fonts/NotoSerif-BoldItalic.ttf",
                    "./fonts/NotoSerif-ExtraBold.ttf",
                    "./fonts/NotoSerif-ExtraBoldItalic.ttf",
                    "./fonts/NotoSerif-ExtraLight.ttf",
                    "./fonts/NotoSerif-ExtraLightItalic.ttf",
                    "./fonts/NotoSerif-Italic.ttf",
                    "./fonts/NotoSerif-Light.ttf",
                    "./fonts/NotoSerif-LightItalic.ttf",
                    "./fonts/NotoSerif-Medium.ttf",
                    "./fonts/NotoSerif-MediumItalic.ttf",
                    "./fonts/NotoSerif-Regular.ttf",
                    "./fonts/NotoSerif-SemiBold.ttf",
                    "./fonts/NotoSerif-SemiBoldItalic.ttf",
                    "./fonts/NotoSerif-Thin.ttf",
                    "./fonts/NotoSerif-ThinItalic.ttf",
                ]
            }
        ],
        "expo-router",
        [
            "expo-notifications",
            {
                "icon": "./assets/notification-icon.png",
                "color": "#32FF80",
                "defaultChannel": "default"
            }
        ],
        [
            "expo-build-properties",
            {
                "android": {
                    "newArchEnabled": true
                }
            }
        ]
    ],
    extra: {
        router: {
            origin: false
        },
        eas: {
            projectId: process.env.PID
        }
    }
};

export default ({ config: appConfig }: ExpoConfig.ConfigContext): ExpoConfig.ExpoConfig => ({
    ...appConfig,
    ...config
});
