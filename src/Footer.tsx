// src/Footer.tsx
// No more, nada más, se acabó, it ended...

import React from "react";
import { View, StyleSheet } from "react-native";
import BetterText from "@/src/BetterText";
import { useTranslation } from "react-i18next";
import colors from "@/src/toolkit/design/colors";

// We define the styles
const styles = StyleSheet.create({
    container: {
        height: 100,
        paddingTop: 20,
    },
});

// We create the function
export default function Footer() {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <BetterText
                textAlign="center"
                fontWeight="Regular"
                fontSize={15}
                textColor={colors.LBLS.SDD}
            >
                {t("globals.nothing_more_to_see")}
            </BetterText>
        </View>
    );
}
