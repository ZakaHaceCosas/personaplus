// About.tsx
// Info about the app
import React from "react";
import { version } from "../../../package.json";
import { Pressable, StyleSheet, View } from "react-native";
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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BetterTextNormalText } from "@/components/text/BetterTextPresets";
import PageEnd from "@/components/static/PageEnd";

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
        alignItems: "center",
    },
    socialWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        width: "100%",
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
            <GapView height={20} />
            <Section kind="About">
                <Division
                    header={t("pages.about.aboutApp.header")}
                    subHeader={t("pages.about.aboutApp.subheader")}
                />
                <Division
                    header={t("pages.about.aboutTheMaker.header")}
                    subHeader={t("pages.about.aboutTheMaker.subheader")}
                />
            </Section>
            <GapView height={20} />
            <View style={styles.buttonContainer}>
                <BetterButton
                    buttonHint={t("pages.about.grid.license.hint")}
                    buttonText={t("pages.about.grid.license.text")}
                    style="GOD"
                    action={() => router.push(ROUTES.ABOUT.LICENSE)}
                />
                <GapView width={10} />
                <BetterButton
                    buttonHint={t("pages.about.grid.credits.hint")}
                    buttonText={t("pages.about.grid.credits.text")}
                    style="GOD"
                    action={() => router.push(ROUTES.ABOUT.CREDITS)}
                />
            </View>
            <GapView height={10} />
            <View style={styles.buttonContainer}>
                <BetterButton
                    buttonHint={t("pages.about.grid.privacy.hint")}
                    buttonText={t("pages.about.grid.privacy.text")}
                    style="ACE"
                    action={async () => {
                        await SafelyOpenUrl(URLs.privacy);
                    }}
                />
                <GapView width={10} />
                <BetterButton
                    buttonHint={t("pages.about.grid.openSource.hint")}
                    buttonText={t("pages.about.grid.openSource.text")}
                    style="ACE"
                    action={async () => {
                        await SafelyOpenUrl(URLs.repo);
                    }}
                />
            </View>
            <GapView height={20} />
            <BetterText
                textAlign="center"
                fontWeight="Italic"
                fontSize={FontSizes.SMALL}
            >
                {t("pages.about.ps")}
            </BetterText>
            <GapView height={20} />
            <View style={styles.socialWrapper}>
                {/* TODO: uncomment when i actually post something here <Pressable
                    style={styles.buttonContainer}
                    onPress={async () => {
                        await SafelyOpenUrl(URLs.instagram);
                    }}
                >
                    <MaterialCommunityIcons
                        name="instagram"
                        color={Colors.BASIC.WHITE}
                        size={FontSizes.LARGE}
                    />
                    <GapView width={5} />
                    <BetterTextNormalText>giveitaplus</BetterTextNormalText>
                </Pressable> */}
                <Pressable
                    style={styles.buttonContainer}
                    onPress={async () => {
                        await SafelyOpenUrl(URLs.instagram);
                    }}
                >
                    <MaterialCommunityIcons
                        name="discord"
                        color={Colors.BASIC.WHITE}
                        size={FontSizes.LARGE}
                    />
                    <GapView width={5} />
                    <BetterTextNormalText>discord</BetterTextNormalText>
                </Pressable>
            </View>
            <PageEnd includeText={false} size="tiny" />
        </>
    );
}
