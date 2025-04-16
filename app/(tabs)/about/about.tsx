// About.tsx
// Info about the app
import React, { ReactElement } from "react";
import { version } from "../../../package.json";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/colors";
import BackButton from "@/components/navigation/back_button";
import GapView from "@/components/ui/gap_view";
import BetterText from "@/components/text/better_text";
import FontSizes from "@/constants/font_sizes";
import Section from "@/components/ui/sections/section";
import Division from "@/components/ui/sections/division";
import BetterButton from "@/components/interaction/better_button";
import { SafelyOpenUrl } from "@/toolkit/routing";
import URLs from "@/constants/urls";
import { Routes } from "@/constants/routes";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BetterTextNormalText } from "@/components/text/better_text_presets";
import PageEnd from "@/components/static/page_end";

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
        backgroundColor: Colors.PRIMARIES.ACE.ACE,
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
export default function About(): ReactElement {
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
            </Section>
            <GapView height={20} />
            <View style={styles.buttonContainer}>
                <BetterButton
                    buttonHint={t("pages.about.grid.license.hint")}
                    buttonText={t("pages.about.grid.license.text")}
                    style="ACE"
                    action={(): void => router.push(Routes.ABOUT.LICENSE)}
                />
                <GapView width={10} />
                <BetterButton
                    buttonHint={t("pages.about.grid.credits.hint")}
                    buttonText={t("pages.about.grid.credits.text")}
                    style="ACE"
                    action={(): void => router.push(Routes.ABOUT.CREDITS)}
                />
            </View>
            <GapView height={10} />
            <View style={styles.buttonContainer}>
                <BetterButton
                    buttonHint={t("pages.about.grid.privacy.hint")}
                    buttonText={t("pages.about.grid.privacy.text")}
                    style="DEFAULT"
                    action={async (): Promise<void> => {
                        await SafelyOpenUrl(URLs.privacy);
                    }}
                />
                <GapView width={10} />
                <BetterButton
                    buttonHint={t("pages.about.grid.openSource.hint")}
                    buttonText={t("pages.about.grid.openSource.text")}
                    style="DEFAULT"
                    action={async (): Promise<void> => {
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
                {/* i don't post stuff here but well, keep it here anyway */}
                <Pressable
                    style={styles.buttonContainer}
                    onPress={async (): Promise<void> => {
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
                </Pressable>
                <Pressable
                    style={styles.buttonContainer}
                    onPress={async (): Promise<void> => {
                        await SafelyOpenUrl(URLs.discord);
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
                <Pressable
                    style={styles.buttonContainer}
                    onPress={async (): Promise<void> => {
                        await SafelyOpenUrl(URLs.yt);
                    }}
                >
                    <MaterialCommunityIcons
                        name="youtube"
                        color={Colors.BASIC.WHITE}
                        size={FontSizes.LARGE}
                    />
                    <GapView width={5} />
                    <BetterTextNormalText>@zakahacecosas</BetterTextNormalText>
                </Pressable>
            </View>
            <PageEnd includeText={false} size="tiny" />
        </>
    );
}
