// Results.tsx
// Results page for when a session is done.

import React from "react";
import { View, StyleSheet } from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import GenerateRandomMessage from "@/toolkit/RandomMessage";
import {
    BetterTextHeader,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import GapView from "@/components/ui/GapView";
import Section from "@/components/ui/sections/Section";
import Division from "@/components/ui/sections/Division";
import BetterText from "@/components/text/BetterText";
import BetterButton from "@/components/interaction/BetterButton";
import ROUTES from "@/constants/Routes";
import { SessionParams } from "./Sessions";

// We define the styles
const styles = StyleSheet.create({
    mainView: {
        backgroundColor: Colors.MAIN.APP,
        padding: 20,
        paddingTop: 40,
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
    },
    thirdView: {
        display: "flex",
        flexDirection: "column",
    },
});

export default function Results() {
    // Params
    const originalParams = useGlobalSearchParams();
    const parseNumber = (value: any) => Number(value) || 0;

    const params: SessionParams = {
        burntCalories: parseNumber(originalParams.burntCalories),
        elapsedTime: parseNumber(originalParams.elapsedTime),
        id: parseNumber(originalParams.identifier),
    };

    // Get translation function for multilingual support
    const { t } = useTranslation();

    return (
        <>
            <View style={styles.thirdView}>
                <BetterTextHeader>{t("globals.session_done")}</BetterTextHeader>
                <BetterTextSubHeader>
                    {GenerateRandomMessage("sessionCompleted", t)}
                </BetterTextSubHeader>
                <GapView height={10} />
                <Section kind="HowYouAreDoing">
                    <Division
                        preHeader={t(
                            "page_session_results.results.burnt_calories",
                        )}
                        header={parseFloat(
                            params.burntCalories.toFixed(2),
                        ).toString()}
                    />
                    <Division
                        preHeader={t(
                            "page_session_results.results.elapsed_time",
                        )}
                        header={parseFloat(
                            params.elapsedTime.toFixed(2),
                        ).toString()}
                    />
                </Section>
                <GapView height={10} />
                <BetterText fontSize={20} fontWeight="Regular">
                    {t("page_session_results.well_done_bud")}
                </BetterText>
            </View>
            <GapView height={10} />
            <BetterButton
                action={() => {
                    router.replace(ROUTES.MAIN.HOME);
                }}
                style="ACE"
                buttonText={t("globals.success")}
                buttonHint="TODO"
            />
        </>
    );
}
