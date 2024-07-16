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
                    <Division
                        preheader="About the project"
                        header="What is PersonaPlus?"
                    >
                        <BetterText fontWeight="Regular" fontSize={15}>
                            It&apos;s clear: an app designed to help you give
                            yourself more and have a better life through help
                            and hard work.
                        </BetterText>
                    </Division>
                    <Division
                        preheader="About the creator"
                        header="Who is PersonaPlus?"
                    >
                        <BetterText fontWeight="Regular" fontSize={15}>
                            PersonaPlus is an independent app made by myself
                            (Zaka). However, it is an open source project, you
                            can contribute to it&apos;s code (and get your name
                            here!)
                        </BetterText>
                    </Division>
                </Section>
                <GapView height={20} />
                <View
                    style={{ flex: 1, display: "flex", flexDirection: "row" }}
                >
                    <Button
                        buttonText="License"
                        style="GOD"
                        action={() => router.navigate("/License")}
                    />
                    <GapView width={10} />
                    <Button
                        buttonText="Credits"
                        style="GOD"
                        action={() => router.navigate("/OpenSourceCredits")}
                    />
                </View>
                <GapView height={10} />
                <View
                    style={{ flex: 1, display: "flex", flexDirection: "row" }}
                >
                    <Button
                        buttonText="Privacy policy"
                        style="ACE"
                        action={() =>
                            Linking.openURL(
                                "https://github.com/ZakaHaceCosas/personaplus/blob/main/PRIVACY.md"
                            )
                        }
                    />
                    <GapView width={10} />
                    <Button
                        buttonText="Open Source"
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
                    Give yourself a plus!
                </BetterText>
                <GapView height={5} />
                <BetterText
                    textAlign="center"
                    fontWeight="Italic"
                    fontSize={12}
                >
                    Psst... You&apos;re currently in the &quot;pre-app&quot;
                    stage - the earliest early versions of the app! Thanks for
                    being part of the testing version, it means a lot.
                    Don&apos;t forget to report any issues you find!
                </BetterText>
            </ScrollView>
        </View>
    );
}
