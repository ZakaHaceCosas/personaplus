import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";
import GapView from "@/components/GapView";
import * as Router from "expo-router";

interface OpenSourceLibrary {
    name: string;
    license: string;
    description: string;
    url: string;
}

// Don't add all the libraries, e.g. the 23193211-whatever Expo libraries can be put togheter into "Expo".
const libraries: OpenSourceLibrary[] = [
    {
        name: "React",
        license: "MIT License",
        description: "The library for web and native user interfaces.",
        url: "https://react.dev/",
    },
    {
        name: "React Native",
        license: "MIT License",
        description:
            "A framework for building native applications using React.",
        url: "https://reactnative.dev/",
    },
    {
        name: "Expo",
        license: "MIT License",
        description:
            "An open-source framework for making universal native apps with React. Expo runs on Android, iOS, and the web.",
        url: "https://expo.dev/",
    },
    {
        name: "Async Storage",
        license: "MIT License",
        description:
            "An asynchronous, persistent, key-value storage system for React Native.",
        url: "https://react-native-async-storage.github.io/async-storage/",
    },
    {
        name: "React Native Picker",
        license: "MIT License",
        description:
            "Picker is a cross-platform UI component for selecting an item from a list of options.",
        url: "https://github.com/react-native-picker/picker",
    },
    {
        name: "React Native Animatable",
        license: "MIT License",
        description:
            "Standard set of easy to use animations and declarative transitions for React Native.",
        url: "https://github.com/oblador/react-native-animatable",
    },
    {
        name: "Remove Console Msg",
        license: "MIT License",
        description:
            "A package with the ability to remove all the console.* statement from your code.",
        url: "https://www.npmjs.com/package/remove-console-msg",
    },
];

const styles = Native.StyleSheet.create({
    containerview: {
        width: "100vw" as Native.DimensionValue,
        height: "100vw" as Native.DimensionValue,
    },
    mainview: {
        padding: 20,
        paddingTop: 50,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as Native.DimensionValue,
        height: "100vw" as Native.DimensionValue,
        overflow: "scroll",
        backgroundColor: "#FFF", // i dont know why, but i feel a credits section in an app should have its background white
    },
});

export default function OpenSourceCredits() {
    return (
        <Native.View style={styles.containerview}>
            <Native.ScrollView style={styles.mainview}>
                <BetterText
                    fontSize={25}
                    fontWeight="Light"
                    textColor="#000"
                    onTap={() => Router.router.navigate("/About")}
                >
                    {"<"} Go back
                </BetterText>
                <GapView height={20} />
                <BetterText
                    fontSize={30}
                    textColor="#000"
                    fontWeight="SemiBold"
                >
                    All this open source software helps PersonaPlus be as
                    awesome it is!
                </BetterText>
                <GapView height={20} />
                {libraries.map((library, index) => (
                    <Native.View key={index} style={{ marginBottom: 40 }}>
                        <BetterText
                            textColor="#000"
                            fontWeight="SemiBold"
                            fontSize={18}
                        >
                            {library.name}
                        </BetterText>
                        <BetterText
                            textColor="#333"
                            fontWeight="Italic"
                            fontSize={15}
                        >
                            {library.license}
                        </BetterText>
                        <GapView height={10} />
                        <BetterText
                            textColor="#000"
                            fontWeight="Light"
                            fontSize={15}
                        >
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
