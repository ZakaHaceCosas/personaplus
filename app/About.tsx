// index.tsx
// Welcome to PersonaPlus. Give yourself a plus!

import React from "react";
import {
    DimensionValue,
    StyleSheet,
    View,
    ScrollView,
    Linking,
} from "react-native";
import { router } from "expo-router";
import BetterText from "@/components/BetterText";
import Section from "@/components/section/Section";
import Division from "@/components/section/division/Division";
import Button from "@/components/Buttons";
import GapView from "@/components/GapView";
import { useTranslation } from "react-i18next";

// Creamos los estilos
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
    },
});

// Creamos la función
export default function Home() {
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
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}
                >
                    <BetterText
                        textAlign="normal"
                        fontWeight="Bold"
                        fontSize={30}
                    >
                        PersonaPlus
                    </BetterText>
                    <GapView width={10} />
                    <View
                        style={{
                            paddingTop: 7.5,
                            paddingBottom: 7.5,
                            paddingLeft: 15,
                            paddingRight: 15,
                            backgroundColor: "#32FF80",
                            borderRadius: 10,
                        }}
                    >
                        <BetterText
                            textAlign="normal"
                            fontWeight="Bold"
                            fontSize={18}
                            textColor="#0E1013"
                        >
                            PRE-APP
                        </BetterText>
                    </View>
                </View>
                <GapView height={20} />
                <Section kind="About">
                    <Division header={t("about_page.project.header")}>
                        <BetterText fontWeight="Regular" fontSize={15}>
                            {t("about_page.project.subheader")}
                        </BetterText>
                    </Division>
                    <Division header={t("about_page.creator.header")}>
                        <BetterText fontWeight="Regular" fontSize={15}>
                            {t("about_page.creator.subheader")}
                        </BetterText>
                    </Division>
                </Section>
                <GapView height={20} />
                <View
                    style={{ flex: 1, display: "flex", flexDirection: "row" }}
                >
                    <Button
                        buttonText={t("about_page.buttons.license")}
                        style="GOD"
                        action={() => router.navigate("/License")}
                    />
                    <GapView width={10} />
                    <Button
                        buttonText={t("about_page.buttons.credits")}
                        style="GOD"
                        action={() => router.navigate("/OpenSourceCredits")}
                    />
                </View>
                <GapView height={10} />
                <View
                    style={{ flex: 1, display: "flex", flexDirection: "row" }}
                >
                    <Button
                        buttonText={t("about_page.buttons.privacy")}
                        style="ACE"
                        action={() =>
                            Linking.openURL(
                                "https://github.com/ZakaHaceCosas/personaplus/blob/main/PRIVACY.md"
                            )
                        }
                    />
                    <GapView width={10} />
                    <Button
                        buttonText={t("about_page.buttons.oss")}
                        style="ACE"
                        action={() =>
                            Linking.openURL(
                                "https://github.com/ZakaHaceCosas/personaplus"
                            )
                        }
                    />
                </View>
                <GapView height={15} />
                <BetterText
                    textAlign="center"
                    fontWeight="Bold"
                    fontSize={30}
                    textColor="#32FF80"
                >
                    {t("globals.gyap!")}
                </BetterText>
                <GapView height={5} />
                <BetterText
                    textAlign="center"
                    fontWeight="Italic"
                    fontSize={12}
                >
                    {t("about_page.testing")}
                </BetterText>
            </ScrollView>
        </View>
    );
}
