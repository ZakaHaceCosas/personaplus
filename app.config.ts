import * as ExpoConfig from "@expo/config";
import dotenv from "dotenv";

dotenv.config();

const config: ExpoConfig.ExpoConfig = {
    name: process.env.PERSONAPLUS_ENV_APP_NAME || "PersonaPlus",
    slug: "PersonaPlus",
    scheme: "personaplus",
    description: "Give yourself a PLUS",
    owner: "zakahacecosas",
    version: "0.0.26-preapp.6", // SemVer-compliant 0.0.1-R6-bX equivalent. on ALPHA milestone bump the minor version.
    orientation: "portrait",
    githubUrl: "https://github.com/ZakaHaceCosas/personaplus",
    icon: "./assets/resources/icon.png",
    userInterfaceStyle: "dark",
    platforms: ["android"],
    backgroundColor: "#0E1013",
    splash: {
        image: "./assets/resources/splash.png",
        resizeMode: "contain",
        backgroundColor: "#0E1013",
    },
    notification: {
        color: "#32FF80",
        androidMode: "default",
        icon: "./assets/resources/notification-icon.png",
        androidCollapsedTitle:
            "#{unread_notifications} PersonaPlus notifications",
    },
    assetBundlePatterns: ["**/*"],
    android: {
        ...(process.env.PERSONAPLUS_ENV_APP_ICON && {
            icon: process.env.PERSONAPLUS_ENV_APP_ICON,
        }), // only specify "icon" when it exists
        adaptiveIcon: {
            foregroundImage: "./assets/resources/adaptive-icon-foreground.png",
            backgroundImage:
                process.env.PERSONAPLUS_ENV_APP_ADAPTIVE_ICON_BACKGROUND ||
                "./assets/resources/adaptive-icon-background.png",
            backgroundColor: "#0E1013",
        },
        allowBackup: false,
        package:
            process.env.PERSONAPLUS_ENV_PACKAGE ||
            "com.zakahacecosas.personaplus",
        permissions: [
            "android.permission.SCHEDULE_EXACT_ALARM",
            "android.permission.POST_NOTIFICATIONS",
            "android.permission.RECEIVE_BOOT_COMPLETED",
            "android.permission.WAKE_LOCK",
            "android.permission.ACCESS_FINE_LOCATION",
        ],
        versionCode: 25,
        backgroundColor: "#0E1013",
    },
    ios: {
        // apple is not supported and wont ever be, this is for some dude who's testing from an iphone
        backgroundColor: "#0E1013",
    },
    web: {
        favicon: "./assets/resources/favicon.png",
        bundler: "metro",
    },
    androidStatusBar: {
        barStyle: "light-content",
        hidden: false,
        translucent: false,
        backgroundColor: "#0E1013",
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
                    "./assets/fonts/RobotoSerif-Light.ttf",
                    "./assets/fonts/BeVietnamPro-ThinItalic.ttf",
                    "./assets/fonts/RobotoSerif-Regular.ttf",
                    "./assets/fonts/JetBrainsMono-Light.ttf",
                    "./assets/fonts/BeVietnamPro-ExtraBoldItalic.ttf",
                    "./assets/fonts/RobotoSerif-Italic.ttf",
                    "./assets/fonts/RobotoSerif-BlackItalic.ttf",
                    "./assets/fonts/JetBrainsMono-ExtraLight.ttf",
                    "./assets/fonts/RobotoSerif-Medium.ttf",
                    "./assets/fonts/RobotoSerif-ExtraBoldItalic.ttf",
                    "./assets/fonts/BeVietnamPro-LightItalic.ttf",
                    "./assets/fonts/BeVietnamPro-MediumItalic.ttf",
                    "./assets/fonts/BeVietnamPro-Medium.ttf",
                    "./assets/fonts/BeVietnamPro-ExtraBold.ttf",
                    "./assets/fonts/BeVietnamPro-Black.ttf",
                    "./assets/fonts/BeVietnamPro-BoldItalic.ttf",
                    "./assets/fonts/BeVietnamPro-Light.ttf",
                    "./assets/fonts/JetBrainsMono-ExtraBold.ttf",
                    "./assets/fonts/BeVietnamPro-Italic.ttf",
                    "./assets/fonts/JetBrainsMono-MediumItalic.ttf",
                    "./assets/fonts/JetBrainsMono-ExtraBoldItalic.ttf",
                    "./assets/fonts/JetBrainsMono-ExtraLightItalic.ttf",
                    "./assets/fonts/BeVietnamPro-Bold.ttf",
                    "./assets/fonts/JetBrainsMono-ThinItalic.ttf",
                    "./assets/fonts/JetBrainsMono-Medium.ttf",
                    "./assets/fonts/RobotoSerif-Bold.ttf",
                    "./assets/fonts/JetBrainsMono-SemiBoldItalic.ttf",
                    "./assets/fonts/JetBrainsMono-LightItalic.ttf",
                    "./assets/fonts/JetBrainsMono-BoldItalic.ttf",
                    "./assets/fonts/JetBrainsMono-Thin.ttf",
                    "./assets/fonts/BeVietnamPro-Regular.ttf",
                    "./assets/fonts/RobotoSerif-ThinItalic.ttf",
                    "./assets/fonts/RobotoSerif-Thin.ttf",
                    "./assets/fonts/RobotoSerif-SemiBold.ttf",
                    "./assets/fonts/JetBrainsMono-Italic.ttf",
                    "./assets/fonts/RobotoSerif-LightItalic.ttf",
                    "./assets/fonts/RobotoSerif-SemiBoldItalic.ttf",
                    "./assets/fonts/RobotoSerif-BoldItalic.ttf",
                    "./assets/fonts/BeVietnamPro-Thin.ttf",
                    "./assets/fonts/BeVietnamPro-SemiBold.ttf",
                    "./assets/fonts/JetBrainsMono-Regular.ttf",
                    "./assets/fonts/RobotoSerif-Black.ttf",
                    "./assets/fonts/RobotoSerif-ExtraLight.ttf",
                    "./assets/fonts/BeVietnamPro-SemiBoldItalic.ttf",
                    "./assets/fonts/BeVietnamPro-BlackItalic.ttf",
                    "./assets/fonts/BeVietnamPro-ExtraLightItalic.ttf",
                    "./assets/fonts/JetBrainsMono-SemiBold.ttf",
                    "./assets/fonts/BeVietnamPro-ExtraLight.ttf",
                    "./assets/fonts/RobotoSerif-ExtraBold.ttf",
                    "./assets/fonts/JetBrainsMono-Bold.ttf",
                    "./assets/fonts/RobotoSerif-ExtraLightItalic.ttf",
                ],
            },
        ],
        "expo-router",
        [
            "expo-notifications",
            {
                icon: "./assets/resources/notification-icon.png",
                color: "#32FF80",
                defaultChannel: "default",
            },
        ],
        [
            "expo-build-properties",
            {
                android: {
                    newArchEnabled: true,
                },
            },
        ],
        [
            "expo-location",
            {
                isAndroidBackgroundLocationEnabled: true,
                isAndroidForegroundServiceEnabled: true,
            },
        ],
    ],
    extra: {
        router: {
            origin: false,
        },
        eas: {
            projectId: process.env.PID,
        },
    },
};

export default ({
    config: appConfig,
}: ExpoConfig.ConfigContext): ExpoConfig.ExpoConfig => ({
    ...appConfig,
    ...config,
});
