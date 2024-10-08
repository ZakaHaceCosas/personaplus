/* eslint-disable @typescript-eslint/no-require-imports */
// _layout.tsx
// Main layout, (something to avoid duplicate code)

import React, { Fragment, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as Fonts from "expo-font";
import { Slot } from "expo-router";
import "@/src/toolkit/translations";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// We create the function
export default function Layout() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    // BeVietnamPro y NotoSerif, our fonts
    // (not our, but we use them xd)
    useEffect(() => {
        async function loadTheDamnFonts() {
            await Fonts.loadAsync({
                "BeVietnamPro-Black": require("../fonts/BeVietnamPro-Black.ttf"),
                "BeVietnamPro-BlackItalic": require("../fonts/BeVietnamPro-BlackItalic.ttf"),
                "BeVietnamPro-Bold": require("../fonts/BeVietnamPro-Bold.ttf"),
                "BeVietnamPro-BoldItalic": require("../fonts/BeVietnamPro-BoldItalic.ttf"),
                "BeVietnamPro-ExtraBold": require("../fonts/BeVietnamPro-ExtraBold.ttf"),
                "BeVietnamPro-ExtraBoldItalic": require("../fonts/BeVietnamPro-ExtraBoldItalic.ttf"),
                "BeVietnamPro-ExtraLight": require("../fonts/BeVietnamPro-ExtraLight.ttf"),
                "BeVietnamPro-ExtraLightItalic": require("../fonts/BeVietnamPro-ExtraLightItalic.ttf"),
                "BeVietnamPro-Italic": require("../fonts/BeVietnamPro-Italic.ttf"),
                "BeVietnamPro-Light": require("../fonts/BeVietnamPro-Light.ttf"),
                "BeVietnamPro-LightItalic": require("../fonts/BeVietnamPro-LightItalic.ttf"),
                "BeVietnamPro-Medium": require("../fonts/BeVietnamPro-Medium.ttf"),
                "BeVietnamPro-MediumItalic": require("../fonts/BeVietnamPro-MediumItalic.ttf"),
                "BeVietnamPro-Regular": require("../fonts/BeVietnamPro-Regular.ttf"),
                "BeVietnamPro-SemiBold": require("../fonts/BeVietnamPro-SemiBold.ttf"),
                "BeVietnamPro-SemiBoldItalic": require("../fonts/BeVietnamPro-SemiBoldItalic.ttf"),
                "BeVietnamPro-Thin": require("../fonts/BeVietnamPro-Thin.ttf"),
                "BeVietnamPro-ThinItalic": require("../fonts/BeVietnamPro-ThinItalic.ttf"),
                "NotoSerif-Black": require("../fonts/NotoSerif-Black.ttf"),
                "NotoSerif-BlackItalic": require("../fonts/NotoSerif-BlackItalic.ttf"),
                "NotoSerif-Bold": require("../fonts/NotoSerif-Bold.ttf"),
                "NotoSerif-BoldItalic": require("../fonts/NotoSerif-BoldItalic.ttf"),
                "NotoSerif-ExtraBold": require("../fonts/NotoSerif-ExtraBold.ttf"),
                "NotoSerif-ExtraBoldItalic": require("../fonts/NotoSerif-ExtraBoldItalic.ttf"),
                "NotoSerif-ExtraLight": require("../fonts/NotoSerif-ExtraLight.ttf"),
                "NotoSerif-ExtraLightItalic": require("../fonts/NotoSerif-ExtraLightItalic.ttf"),
                "NotoSerif-Italic": require("../fonts/NotoSerif-Italic.ttf"),
                "NotoSerif-Light": require("../fonts/NotoSerif-Light.ttf"),
                "NotoSerif-LightItalic": require("../fonts/NotoSerif-LightItalic.ttf"),
                "NotoSerif-Medium": require("../fonts/NotoSerif-Medium.ttf"),
                "NotoSerif-MediumItalic": require("../fonts/NotoSerif-MediumItalic.ttf"),
                "NotoSerif-Regular": require("../fonts/NotoSerif-Regular.ttf"),
                "NotoSerif-SemiBold": require("../fonts/NotoSerif-SemiBold.ttf"),
                "NotoSerif-SemiBoldItalic": require("../fonts/NotoSerif-SemiBoldItalic.ttf"),
                "NotoSerif-Thin": require("../fonts/NotoSerif-Thin.ttf"),
                "NotoSerif-ThinItalic": require("../fonts/NotoSerif-ThinItalic.ttf"),
            });
            setFontsLoaded(true);
        }

        loadTheDamnFonts();
    }, []);

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    /* useEffect(() => {
        if (fontError) throw fontError;
    }, [fontError]); */

    // We load the fonts
    useEffect(() => {
        const onLayoutRootView = async () => {
            if (fontsLoaded) {
                await SplashScreen.hideAsync(); // Hide the SplashScreen when everything's loaded
            }
        };

        onLayoutRootView();

        return () => {
            // we let this empty
        };
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    // pack it all in a ScrollView, add the android StatusBar, and the <Slot /> where the app will put everything
    return (
        <Fragment>
            <StatusBar style="auto" animated={true} />
            <Slot />
        </Fragment>
    );
}
