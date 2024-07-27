import React from "react";
import {
    DimensionValue,
    View,
    ScrollView,
    StyleSheet,
    Linking,
} from "react-native";
import BetterText from "@/src/BetterText";
import GapView from "@/src/GapView";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import colors from "@/src/toolkit/design/colors";

interface OpenSourceLibrary {
    name: string; // Name of the library / package / whatever (bare username if no name found)
    author: string; // Author name, gathered from their GitHub profile, or the license file, or wherever a clear author can be found
    license: string; // License used
    description: string; // Description provided by the author
    url: string; // URL to GitHub or NPMJS.org (unless there's a significant URL to provide, like react.dev)
}

// Don't add all the libraries, e.g. the 23193211-whatever Expo libraries can be put togheter into "Expo".
const libraries: OpenSourceLibrary[] = [
    {
        name: "React",
        author: "Facebook",
        license: "MIT License",
        description: "The library for web and native user interfaces.",
        url: "https://react.dev/",
    },
    {
        name: "React Native",
        license: "MIT License",
        author: "Facebook",
        description:
            "A framework for building native applications using React.",
        url: "https://reactnative.dev/",
    },
    {
        name: "Expo",
        author: "the Expo team",
        license: "MIT License",
        description:
            "An open-source framework for making universal native apps with React. Expo runs on Android, iOS, and the web.",
        url: "https://expo.dev/",
    },
    {
        name: "React Native Animatable",
        author: "Joel Arvidsson",
        license: "MIT License",
        description:
            "Standard set of easy to use animations and declarative transitions for React Native.",
        url: "https://github.com/oblador/react-native-animatable",
    },
    {
        name: "Remove Console Msg",
        author: "akshayjani99",
        license: "MIT License",
        description:
            "A package with the ability to remove all the console.* statement from your code.",
        url: "https://www.npmjs.com/package/remove-console-msg",
    },
    {
        name: "React Native Countdown Circle Timer",
        author: "Vasil Dimitrov",
        license: "MIT License",
        description:
            "Lightweight React/React Native countdown timer component with color and progress animation based on SVG.",
        url: "https://github.com/vydimitrov/react-countdown-circle-timer/",
    },
    {
        name: "React Native SVG",
        author: "Software Mansion",
        license: "MIT License",
        description:
            "SVG library for React Native, React Native Web, and plain React web projects.",
        url: "https://github.com/software-mansion/react-native-svg",
    },
    {
        name: "React Navigation",
        author: "Software Mansion",
        license: "MIT License",
        description: "Routing and navigation for your React Native apps.",
        url: "https://github.com/react-navigation/react-navigation",
    },
    {
        name: "i18next",
        author: "i18next contributors",
        license: "MIT License",
        description: " i18next: learn once - translate everywhere.",
        url: "https://github.com/i18next/i18next",
    },
];

const styles = StyleSheet.create({
    containerview: {
        width: "100vw" as DimensionValue,
        height: "100vh" as DimensionValue,
    },
    mainview: {
        padding: 20,
        paddingTop: 50,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as DimensionValue,
        height: "100vh" as DimensionValue,
        overflow: "scroll",
        // backgroundColor: "#FFF",
        // i dont know why, but i feel a credits section in an app should have its background white (edit: nevermind)
    },
});

export default function OpenSourceCredits() {
    const { t } = useTranslation();

    return (
        <View style={styles.containerview}>
            <ScrollView style={styles.mainview}>
                <BetterText
                    fontSize={20}
                    fontWeight="Light"
                    onTap={router.back}
                >
                    {"<"} {t("globals.go_back")}
                </BetterText>
                <GapView height={20} />
                <BetterText fontSize={30} fontWeight="SemiBold">
                    {t("open_source_credits")}
                </BetterText>
                <GapView height={20} />
                {libraries.map((library, index) => (
                    <View key={index} style={{ marginBottom: 40 }}>
                        <BetterText fontWeight="SemiBold" fontSize={18}>
                            {library.name}
                        </BetterText>
                        <BetterText
                            textColor={colors.LBLS.SHL}
                            fontWeight="Regular"
                            fontSize={14}
                        >
                            {library.license}
                        </BetterText>
                        <BetterText
                            textColor={colors.LBLS.SDD}
                            fontWeight="Light"
                            fontSize={14}
                        >
                            Made by{" "}
                            <BetterText
                                textColor={colors.LBLS.SDD}
                                fontWeight="SemiBold"
                                fontSize={14}
                            >
                                {library.author}
                            </BetterText>
                        </BetterText>
                        <GapView height={10} />
                        <BetterText fontWeight="Light" fontSize={15}>
                            {library.description}
                        </BetterText>
                        <GapView height={5} />
                        <BetterText
                            textColor={colors.PRIMARIES.ACE.ACE}
                            fontWeight="Light"
                            fontSize={15}
                            url={true}
                            onTap={() => Linking.openURL(library.url)}
                        >
                            {library.url}
                        </BetterText>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
