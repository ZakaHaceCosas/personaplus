/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/app/_layout.tsx
 * Basically: The layout of the entire app. It's the layout, font, and splashscreen loader.
 *
 * <=============================================================================>
 */

import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Fragment, ReactElement, useEffect } from "react";
import "@/translations/translate";
import { StatusBar } from "react-native";
import Colors from "@/constants/colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
    duration: 500,
    fade: true,
});

export default function RootLayout(): ReactElement | null {
    const [loaded] = useFonts({
        "JetBrainsMono-SemiBold": require("../assets/fonts/JetBrainsMono-SemiBold.ttf"),
        "JetBrainsMono-LightItalic": require("../assets/fonts/JetBrainsMono-LightItalic.ttf"),
        "JetBrainsMono-SemiBoldItalic": require("../assets/fonts/JetBrainsMono-SemiBoldItalic.ttf"),
        "JetBrainsMono-BoldItalic": require("../assets/fonts/JetBrainsMono-BoldItalic.ttf"),
        "BeVietnamPro-Medium": require("../assets/fonts/BeVietnamPro-Medium.ttf"),
        "BeVietnamPro-ExtraLightItalic": require("../assets/fonts/BeVietnamPro-ExtraLightItalic.ttf"),
        "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
        "BeVietnamPro-BoldItalic": require("../assets/fonts/BeVietnamPro-BoldItalic.ttf"),
        "JetBrainsMono-Bold": require("../assets/fonts/JetBrainsMono-Bold.ttf"),
        "JetBrainsMono-Italic": require("../assets/fonts/JetBrainsMono-Italic.ttf"),
        "BeVietnamPro-Italic": require("../assets/fonts/BeVietnamPro-Italic.ttf"),
        "BeVietnamPro-ExtraLight": require("../assets/fonts/BeVietnamPro-ExtraLight.ttf"),
        "JetBrainsMono-Regular": require("../assets/fonts/JetBrainsMono-Regular.ttf"),
        "BeVietnamPro-Bold": require("../assets/fonts/BeVietnamPro-Bold.ttf"),
        "BeVietnamPro-LightItalic": require("../assets/fonts/BeVietnamPro-LightItalic.ttf"),
        "BeVietnamPro-SemiBoldItalic": require("../assets/fonts/BeVietnamPro-SemiBoldItalic.ttf"),
        "BeVietnamPro-MediumItalic": require("../assets/fonts/BeVietnamPro-MediumItalic.ttf"),
        "BeVietnamPro-SemiBold": require("../assets/fonts/BeVietnamPro-SemiBold.ttf"),
        "BeVietnamPro-Regular": require("../assets/fonts/BeVietnamPro-Regular.ttf"),
        "BeVietnamPro-Light": require("../assets/fonts/BeVietnamPro-Light.ttf"),
        "JetBrainsMono-Light": require("../assets/fonts/JetBrainsMono-Light.ttf"),
        "JetBrainsMono-MediumItalic": require("../assets/fonts/JetBrainsMono-MediumItalic.ttf"),
    });

    useEffect((): void => {
        if (loaded) SplashScreen.hideAsync();
    }, [loaded]);

    if (!loaded) return null;

    return (
        <Fragment>
            <StatusBar
                animated={true}
                barStyle={"light-content"}
                backgroundColor={Colors.MAIN.APP}
                translucent={true}
            />
            <Slot />
        </Fragment>
    );
}
