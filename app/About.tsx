// About.tsx
// Info about the app
import React, { useCallback } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Linking,
    Dimensions,
} from "react-native";
import { router } from "expo-router";
import BetterText, { BetterTextHeader } from "@/src/BetterText";
import Section from "@/src/section/Section";
import Division from "@/src/section/Division";
import Button from "@/src/Buttons";
import GapView from "@/src/GapView";
import { useTranslation } from "react-i18next";
import colors from "@/src/toolkit/design/colors";
import spacing from "@/src/toolkit/design/spacing";
import FontSizes from "@/src/toolkit/design/fontSizes";
import BackButton from "@/src/BackButton";

// We define the styles
const styles = StyleSheet.create({
    containerview: {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        backgroundColor: colors.MAIN.APP,
    },
    mainview: {
        padding: 20,
        paddingTop: 40,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
    headerContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    preAppBadge: {
        paddingVertical: 7.5,
        paddingHorizontal: 15,
        backgroundColor: colors.PRIMARIES.GOD.GOD,
        borderRadius: 10,
    },
    buttonContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
    },
});

// We create the function
export default function Home() {
    const { t } = useTranslation(); // translate

    // Use useCallback for event handler functions
    const handlePrivacyPress = useCallback(() => {
        Linking.openURL(
            "https://github.com/ZakaHaceCosas/personaplus/blob/main/PRIVACY.md"
        ); // actually https://personaplus.vercel.app/privacy exists, but it doesnt look good
    }, []);

    const handleOssPress = useCallback(() => {
        Linking.openURL("https://github.com/ZakaHaceCosas/personaplus");
    }, []);

    return (
        <View style={styles.containerview}>
            <ScrollView style={styles.mainview}>
                <BackButton t={t} />
                <GapView height={spacing.LARGE} />
                <View style={styles.headerContainer}>
                    <BetterTextHeader>PersonaPlus</BetterTextHeader>
                    <GapView width={spacing.REGULAR} />
                    <View style={styles.preAppBadge}>
                        <BetterText
                            textAlign="normal"
                            fontWeight="Bold"
                            fontSize={FontSizes.REGULAR}
                            textColor={colors.MAIN.APP}
                        >
                            PRE-APP
                        </BetterText>
                    </View>
                </View>
                <GapView height={spacing.LARGE} />
                <Section kind="About">
                    <Division header={t("about_page.project.header")}>
                        <BetterText
                            fontWeight="Regular"
                            fontSize={FontSizes.REGULAR}
                        >
                            {t("about_page.project.subheader")}
                        </BetterText>
                    </Division>
                    <Division header={t("about_page.creator.header")}>
                        <BetterText
                            fontWeight="Regular"
                            fontSize={FontSizes.REGULAR}
                        >
                            {t("about_page.creator.subheader")}
                        </BetterText>
                    </Division>
                </Section>
                <GapView height={spacing.LARGE} />
                <View style={styles.buttonContainer}>
                    <Button
                        buttonText={t("about_page.buttons.license")}
                        style="GOD"
                        action={() => router.navigate("/License")}
                    />
                    <GapView width={spacing.REGULAR} />
                    <Button
                        buttonText={t("about_page.buttons.credits")}
                        style="GOD"
                        action={() => router.navigate("/OpenSourceCredits")}
                    />
                </View>
                <GapView height={spacing.REGULAR} />
                <View style={styles.buttonContainer}>
                    <Button
                        buttonText={t("about_page.buttons.privacy")}
                        style="ACE"
                        action={handlePrivacyPress}
                    />
                    <GapView width={spacing.REGULAR} />
                    <Button
                        buttonText={t("about_page.buttons.oss")}
                        style="ACE"
                        action={handleOssPress}
                    />
                </View>
                <GapView height={spacing.REGULAR} />
                <BetterText
                    textAlign="center"
                    fontWeight="Bold"
                    fontSize={FontSizes.EXTRA_LARGE}
                    textColor={colors.PRIMARIES.GOD.GOD}
                >
                    {t("globals.gyap!")}
                </BetterText>
                <GapView height={spacing.SMALL} />
                <BetterText
                    textAlign="center"
                    fontWeight="Italic"
                    fontSize={FontSizes.SMALL}
                >
                    {t("about_page.testing")}
                </BetterText>
            </ScrollView>
        </View>
    );
}
