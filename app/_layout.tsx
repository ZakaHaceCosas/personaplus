// _layout.tsx
// Para evitar código duplicado, básicamente

import * as React from "react";
import { StatusBar } from "expo-status-bar";
import * as Native from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Router from "expo-router";
import { useFonts } from "expo-font";

// Definimos los estilos
const styles = Native.StyleSheet.create({
    mainview: {
        backgroundColor: "#0E1013",
    },
});

// Definimos la función
export default function Layout() {
    // BeVietnamPro, nuestra tipografía (no es nuestra, pero la usamos xd)
    const [fontsLoaded, fontError] = useFonts({
        "BeVietnamPro-Black": require("../fonts/BeVietnamPro-Black.ttf"),
        "BeVietnamPro-BlackItalic": require("../fonts/BeVietnamPro-BlackItalic.ttf"),
        "BeVietnamPro-ExtraBold": require("../fonts/BeVietnamPro-ExtraBold.ttf"),
        "BeVietnamPro-ExtraBoldItalic": require("../fonts/BeVietnamPro-ExtraBoldItalic.ttf"),
        "BeVietnamPro-Bold": require("../fonts/BeVietnamPro-Bold.ttf"),
        "BeVietnamPro-BoldItalic": require("../fonts/BeVietnamPro-BoldItalic.ttf"),
        "BeVietnamPro-SemiBold": require("../fonts/BeVietnamPro-SemiBold.ttf"),
        "BeVietnamPro-SemiBoldItalic": require("../fonts/BeVietnamPro-SemiBoldItalic.ttf"),
        "BeVietnamPro-Medium": require("../fonts/BeVietnamPro-Medium.ttf"),
        "BeVietnamPro-MediumItalic": require("../fonts/BeVietnamPro-MediumItalic.ttf"),
        "BeVietnamPro-Regular": require("../fonts/BeVietnamPro-Regular.ttf"),
        "BeVietnamPro-Italic": require("../fonts/BeVietnamPro-Italic.ttf"),
        "BeVietnamPro-Light": require("../fonts/BeVietnamPro-Light.ttf"),
        "BeVietnamPro-LightItalic": require("../fonts/BeVietnamPro-LightItalic.ttf"),
        "BeVietnamPro-ExtraLight": require("../fonts/BeVietnamPro-ExtraLight.ttf"),
        "BeVietnamPro-ExtraLightItalic": require("../fonts/BeVietnamPro-ExtraLightItalic.ttf"),
        "BeVietnamPro-Thin": require("../fonts/BeVietnamPro-Thin.ttf"),
        "BeVietnamPro-ThinItalic": require("../fonts/BeVietnamPro-ThinItalic.ttf"),
    });

    // Cargamos las fuentes
    React.useEffect(() => {
        const onLayoutRootView = async () => {
            if (fontsLoaded || fontError) {
                await SplashScreen.hideAsync();
            }
        };

        onLayoutRootView();
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    // Creamos el layout de la aplicación
    return (
        <Native.ScrollView style={styles.mainview}>
            <StatusBar style="auto" />
            <Router.Slot />
        </Native.ScrollView>
    );
}
