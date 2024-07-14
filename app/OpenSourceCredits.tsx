import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";
import GapView from "@/components/GapView";
import * as Router from "expo-router";
import { useTranslation } from "react-i18next";

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
        name: "Async Storage",
        author: "Facebook",
        license: "MIT License",
        description:
            "An asynchronous, persistent, key-value storage system for React Native.",
        url: "https://react-native-async-storage.github.io/async-storage/",
    },
    {
        name: "React Native Picker",
        author: "Facebook",
        license: "MIT License",
        description:
            "Picker is a cross-platform UI component for selecting an item from a list of options.",
        url: "https://github.com/react-native-picker/picker",
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
];

const styles = Native.StyleSheet.create({
    containerview: {
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
    },
    mainview: {
        padding: 20,
        paddingTop: 50,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
        overflow: "scroll",
        // backgroundColor: "#FFF",
        // i dont know why, but i feel a credits section in an app should have its background white (edit: nevermind)
    },
});

export default function OpenSourceCredits() {
    const { t } = useTranslation();

    return (
        <Native.View style={styles.containerview}>
            <Native.ScrollView style={styles.mainview}>
                <BetterText
                    fontSize={20}
                    fontWeight="Light"
                    onTap={() => Router.router.navigate("/About")}
                >
                    {"<"} {t("globals.go_back")}
                </BetterText>
                <GapView height={20} />
                <BetterText fontSize={30} fontWeight="SemiBold">
                    All this open source software helps PersonaPlus be as
                    awesome it is!
                </BetterText>
                <GapView height={20} />
                {libraries.map((library, index) => (
                    <Native.View key={index} style={{ marginBottom: 40 }}>
                        <BetterText fontWeight="SemiBold" fontSize={18}>
                            {library.name}
                        </BetterText>
                        <BetterText
                            textColor="#BBB"
                            fontWeight="Regular"
                            fontSize={14}
                        >
                            {library.license}
                        </BetterText>
                        <BetterText
                            textColor="#999"
                            fontWeight="Light"
                            fontSize={14}
                        >
                            Made by{" "}
                            <BetterText
                                textColor="#999"
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
                            textColor="#3280FF"
                            fontWeight="Light"
                            fontSize={15}
                            url={true}
                            onTap={() => Native.Linking.openURL(library.url)}
                        >
                            {library.url}
                        </BetterText>
                    </Native.View>
                ))}
            </Native.ScrollView>
        </Native.View>
    );
}
