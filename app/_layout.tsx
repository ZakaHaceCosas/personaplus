/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/app/_layout.tsx
 * Basically: The main _layout of the entire app, AKA the font loader.
 *
 * <=============================================================================>
 */

import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Fragment, useEffect } from "react";
import "@/translations/translate";
import { StatusBar } from "react-native";
import Colors from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});

export default function RootLayout() {
    const [loaded] = useFonts({
        "RobotoSerif-Light": require("../assets/fonts/RobotoSerif-Light.ttf"),
        "BeVietnamPro-ThinItalic": require("../assets/fonts/BeVietnamPro-ThinItalic.ttf"),
        "RobotoSerif-Regular": require("../assets/fonts/RobotoSerif-Regular.ttf"),
        "JetBrainsMono-Light": require("../assets/fonts/JetBrainsMono-Light.ttf"),
        "BeVietnamPro-ExtraBoldItalic": require("../assets/fonts/BeVietnamPro-ExtraBoldItalic.ttf"),
        "RobotoSerif-Italic": require("../assets/fonts/RobotoSerif-Italic.ttf"),
        "RobotoSerif-BlackItalic": require("../assets/fonts/RobotoSerif-BlackItalic.ttf"),
        "JetBrainsMono-ExtraLight": require("../assets/fonts/JetBrainsMono-ExtraLight.ttf"),
        "RobotoSerif-Medium": require("../assets/fonts/RobotoSerif-Medium.ttf"),
        "RobotoSerif-ExtraBoldItalic": require("../assets/fonts/RobotoSerif-ExtraBoldItalic.ttf"),
        "BeVietnamPro-LightItalic": require("../assets/fonts/BeVietnamPro-LightItalic.ttf"),
        "BeVietnamPro-MediumItalic": require("../assets/fonts/BeVietnamPro-MediumItalic.ttf"),
        "BeVietnamPro-Medium": require("../assets/fonts/BeVietnamPro-Medium.ttf"),
        "BeVietnamPro-ExtraBold": require("../assets/fonts/BeVietnamPro-ExtraBold.ttf"),
        "BeVietnamPro-Black": require("../assets/fonts/BeVietnamPro-Black.ttf"),
        "BeVietnamPro-BoldItalic": require("../assets/fonts/BeVietnamPro-BoldItalic.ttf"),
        "BeVietnamPro-Light": require("../assets/fonts/BeVietnamPro-Light.ttf"),
        "JetBrainsMono-ExtraBold": require("../assets/fonts/JetBrainsMono-ExtraBold.ttf"),
        "BeVietnamPro-Italic": require("../assets/fonts/BeVietnamPro-Italic.ttf"),
        "JetBrainsMono-MediumItalic": require("../assets/fonts/JetBrainsMono-MediumItalic.ttf"),
        "JetBrainsMono-ExtraBoldItalic": require("../assets/fonts/JetBrainsMono-ExtraBoldItalic.ttf"),
        "JetBrainsMono-ExtraLightItalic": require("../assets/fonts/JetBrainsMono-ExtraLightItalic.ttf"),
        "BeVietnamPro-Bold": require("../assets/fonts/BeVietnamPro-Bold.ttf"),
        "JetBrainsMono-ThinItalic": require("../assets/fonts/JetBrainsMono-ThinItalic.ttf"),
        "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
        "RobotoSerif-Bold": require("../assets/fonts/RobotoSerif-Bold.ttf"),
        "JetBrainsMono-SemiBoldItalic": require("../assets/fonts/JetBrainsMono-SemiBoldItalic.ttf"),
        "JetBrainsMono-LightItalic": require("../assets/fonts/JetBrainsMono-LightItalic.ttf"),
        "JetBrainsMono-BoldItalic": require("../assets/fonts/JetBrainsMono-BoldItalic.ttf"),
        "JetBrainsMono-Thin": require("../assets/fonts/JetBrainsMono-Thin.ttf"),
        "BeVietnamPro-Regular": require("../assets/fonts/BeVietnamPro-Regular.ttf"),
        "RobotoSerif-ThinItalic": require("../assets/fonts/RobotoSerif-ThinItalic.ttf"),
        "RobotoSerif-Thin": require("../assets/fonts/RobotoSerif-Thin.ttf"),
        "RobotoSerif-SemiBold": require("../assets/fonts/RobotoSerif-SemiBold.ttf"),
        "JetBrainsMono-Italic": require("../assets/fonts/JetBrainsMono-Italic.ttf"),
        "RobotoSerif-LightItalic": require("../assets/fonts/RobotoSerif-LightItalic.ttf"),
        "RobotoSerif-SemiBoldItalic": require("../assets/fonts/RobotoSerif-SemiBoldItalic.ttf"),
        "RobotoSerif-BoldItalic": require("../assets/fonts/RobotoSerif-BoldItalic.ttf"),
        "BeVietnamPro-Thin": require("../assets/fonts/BeVietnamPro-Thin.ttf"),
        "BeVietnamPro-SemiBold": require("../assets/fonts/BeVietnamPro-SemiBold.ttf"),
        "JetBrainsMono-Regular": require("../assets/fonts/JetBrainsMono-Regular.ttf"),
        "RobotoSerif-Black": require("../assets/fonts/RobotoSerif-Black.ttf"),
        "RobotoSerif-ExtraLight": require("../assets/fonts/RobotoSerif-ExtraLight.ttf"),
        "BeVietnamPro-SemiBoldItalic": require("../assets/fonts/BeVietnamPro-SemiBoldItalic.ttf"),
        "BeVietnamPro-BlackItalic": require("../assets/fonts/BeVietnamPro-BlackItalic.ttf"),
        "BeVietnamPro-ExtraLightItalic": require("../assets/fonts/BeVietnamPro-ExtraLightItalic.ttf"),
        "JetBrainsMono-SemiBold": require("../assets/fonts/JetBrainsMono-SemiBold.ttf"),
        "BeVietnamPro-ExtraLight": require("../assets/fonts/BeVietnamPro-ExtraLight.ttf"),
        "RobotoSerif-ExtraBold": require("../assets/fonts/RobotoSerif-ExtraBold.ttf"),
        "JetBrainsMono-Bold": require("../assets/fonts/JetBrainsMono-Bold.ttf"),
        "RobotoSerif-ExtraLightItalic": require("../assets/fonts/RobotoSerif-ExtraLightItalic.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

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
