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
import BetterText from "@/src/BetterText";
import Section from "@/src/section/Section";
import Division from "@/src/section/Division";
import Button from "@/src/Buttons";
import GapView from "@/src/GapView";
import { useTranslation } from "react-i18next";
import colors from "@/src/toolkit/design/colors";

// Constants for fixed values
const FONT_SIZES = {
  SMALL: 12,
  MEDIUM: 15,
  LARGE: 20,
  EXTRA_LARGE: 30,
};

const SPACING = {
  SMALL: 5,
  MEDIUM: 10,
  LARGE: 20,
};

// We define the styles
const styles = StyleSheet.create({
  containerview: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
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

type TranslateFunction = ReturnType<typeof useTranslation>['t'];

interface BackButtonProps {
  t: TranslateFunction;
}

// Memoized back button component
const BackButtonComponent: React.FC<BackButtonProps> = ({ t }) => (
  <BetterText
    fontSize={FONT_SIZES.LARGE}
    fontWeight="Light"
    onTap={router.back}
  >
    {"<"} {t("globals.go_back")}
  </BetterText>
);

export const BackButton = React.memo(BackButtonComponent);

BackButton.displayName = "BackButton";

// We create the function
export default function Home() {
  const { t } = useTranslation(); // translate

  // Use useCallback for event handler functions
  const handlePrivacyPress = useCallback(() => {
    Linking.openURL(
      "https://github.com/ZakaHaceCosas/personaplus/blob/main/PRIVACY.md"
    );
  }, []);

  const handleOssPress = useCallback(() => {
    Linking.openURL("https://github.com/ZakaHaceCosas/personaplus");
  }, []);

  return (
    <View style={styles.containerview}>
      <ScrollView style={styles.mainview}>
        <BackButton t={t} />
        <GapView height={SPACING.LARGE} />
        <View style={styles.headerContainer}>
          <BetterText
            textAlign="normal"
            fontWeight="Bold"
            fontSize={FONT_SIZES.EXTRA_LARGE}
          >
            PersonaPlus
          </BetterText>
          <GapView width={SPACING.MEDIUM} />
          <View style={styles.preAppBadge}>
            <BetterText
              textAlign="normal"
              fontWeight="Bold"
              fontSize={FONT_SIZES.MEDIUM}
              textColor={colors.MAIN.APP}
            >
              PRE-APP
            </BetterText>
          </View>
        </View>
        <GapView height={SPACING.LARGE} />
        <Section kind="About">
          <Division header={t("about_page.project.header")}>
            <BetterText fontWeight="Regular" fontSize={FONT_SIZES.MEDIUM}>
              {t("about_page.project.subheader")}
            </BetterText>
          </Division>
          <Division header={t("about_page.creator.header")}>
            <BetterText fontWeight="Regular" fontSize={FONT_SIZES.MEDIUM}>
              {t("about_page.creator.subheader")}
            </BetterText>
          </Division>
        </Section>
        <GapView height={SPACING.LARGE} />
        <View style={styles.buttonContainer}>
          <Button
            buttonText={t("about_page.buttons.license")}
            style="GOD"
            action={() => router.navigate("/License")}
          />
          <GapView width={SPACING.MEDIUM} />
          <Button
            buttonText={t("about_page.buttons.credits")}
            style="GOD"
            action={() => router.navigate("/OpenSourceCredits")}
          />
        </View>
        <GapView height={SPACING.MEDIUM} />
        <View style={styles.buttonContainer}>
          <Button
            buttonText={t("about_page.buttons.privacy")}
            style="ACE"
            action={handlePrivacyPress}
            // actually https://personaplus.vercel.app/privacy exists, but it doesnt look good
          />
          <GapView width={SPACING.MEDIUM} />
          <Button
            buttonText={t("about_page.buttons.oss")}
            style="ACE"
            action={handleOssPress}
          />
        </View>
        <GapView height={SPACING.MEDIUM} />
        <BetterText
          textAlign="center"
          fontWeight="Bold"
          fontSize={FONT_SIZES.EXTRA_LARGE}
          textColor={colors.PRIMARIES.GOD.GOD}
        >
          {t("globals.gyap!")}
        </BetterText>
        <GapView height={SPACING.SMALL} />
        <BetterText
          textAlign="center"
          fontWeight="Italic"
          fontSize={FONT_SIZES.SMALL}
        >
          {t("about_page.testing")}
        </BetterText>
      </ScrollView>
    </View>
  );
}
