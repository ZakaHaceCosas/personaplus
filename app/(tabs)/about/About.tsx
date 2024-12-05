// About.tsx
// Info about the app
import React from "react";
import { version } from "../../../package.json";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import BackButton from "@/components/navigation/GoBack";
import GapView from "@/components/ui/GapView";
import BetterText from "@/components/text/BetterText";
import FontSizes from "@/constants/FontSizes";
import Section from "@/components/ui/sections/Section";
import Division from "@/components/ui/sections/Division";
import BetterButton from "@/components/interaction/BetterButton";
import { SafelyOpenUrl } from "@/toolkit/Routing";
import URLs from "@/constants/Urls";
import ROUTES from "@/constants/Routes";

// We define the styles
const styles = StyleSheet.create({
    headerContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    versionBadge: {
        padding: 6,
        backgroundColor: Colors.PRIMARIES.GOD.GOD,
        borderRadius: 6,
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
    },
});

// We create the function
export default function About() {
    const { t } = useTranslation(); // translate

    return (
        <>
            {/* Doesn't use <TopBar /> because it's a different layout */}
            <BackButton t={t} />
            <GapView height={10} />
            <View style={styles.headerContainer}>
                <BetterText
                    fontSize={FontSizes.EXTRA_LARGE}
                    fontWeight="Bold"
                    fontFamily="JetBrainsMono"
                >
                    PersonaPlus
                </BetterText>
                <GapView width={5} />
                <View style={styles.versionBadge}>
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontFamily="JetBrainsMono"
                        fontSize={FontSizes.ALMOST_REGULAR}
                        textColor={Colors.MAIN.APP}
                    >
                        {version}
                    </BetterText>
                </View>
            </View>
            <BetterText
                textAlign="center"
                fontWeight="Bold"
                fontFamily="JetBrainsMono"
                fontSize={FontSizes.LARGER}
                textColor={Colors.PRIMARIES.GOD.GOD}
            >
                Give yourself a plus!
            </BetterText>
            <GapView height={20} />
            <Section kind="About">
                <Division
                    header={"About app"}
                    subHeader="TODO: all of this content. This is about the app."
                />
                <Division
                    header={"about maker"}
                    subHeader="this is about me :] and all contributors"
                />
            </Section>
            <GapView height={20} />
            <View style={styles.buttonContainer}>
                <BetterButton
                    buttonHint="TODO"
                    buttonText={t("License")}
                    style="GOD"
                    action={() => router.push(ROUTES.ABOUT.LICENSE)}
                />
                <GapView width={10} />
                <BetterButton
                    buttonHint="TODO"
                    buttonText={"Credits"}
                    style="GOD"
                    action={() => router.push(ROUTES.ABOUT.CREDITS)}
                />
            </View>
            <GapView height={10} />
            <View style={styles.buttonContainer}>
                <BetterButton
                    buttonHint="TODO"
                    buttonText={"Your privacy"}
                    style="ACE"
                    action={async () => {
                        await SafelyOpenUrl(URLs.privacy);
                    }}
                />
                <GapView width={10} />
                <BetterButton
                    buttonHint="TODO"
                    buttonText={"Open Source"}
                    style="ACE"
                    action={async () => {
                        await SafelyOpenUrl(URLs.repo);
                    }}
                />
            </View>
            <GapView height={5} />
            <GapView height={5} />
            <BetterText
                textAlign="center"
                fontWeight="Italic"
                fontSize={FontSizes.SMALL}
            >
                PS. You're running an early version of the app. Thank you for
                testing it and being among the first ones to do so! Remember to
                report on GitHub ("Open Source") any issue you find with the app
                so we can fix it. Thanks!
            </BetterText>
        </>
    );
}
