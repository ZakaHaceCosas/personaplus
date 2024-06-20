import * as ExpoConfig from '@expo/config';
import dotenv from 'dotenv';

dotenv.config();

const config: ExpoConfig.ExpoConfig = {
    name: "PersonaPlus",
    slug: "PersonaPlus",
    scheme: "personaplus",
    description: "Give yourself a PLUS",
    owner: "zakahacecosas",
    version: "0.0.1-R5-b9",
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
        androidMode: "collapse",
        androidCollapsedTitle: "Hey! #{unread_notifications} PersonaPlus notifications!"
    },
    assetBundlePatterns: [
        "**/*"
    ],
    ios: {
        supportsTablet: true
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon-foreground.png",
            backgroundImage: "./assets/adaptive-icon-background.png",
            backgroundColor: "#0E1013"
        },
        allowBackup: false,
        package: "com.zakahacecosas.personaplus"
    },
    web: {
        favicon: "./assets/favicon.png",
        bundler: "metro"
    },
    plugins: [
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
                    "./fonts/BeVietnamPro-ThinItalic.ttf"
                ]
            }
        ],
        "expo-router"
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
