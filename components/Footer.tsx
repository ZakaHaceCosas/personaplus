// Footer.tsx
// No more, nada más, se acabó, it ended...

import React from "react";
import { View, StyleSheet } from "react-native";
import BetterText from "@/components/BetterText";
import { useTranslation } from "react-i18next";

// Definimos los estilos
const styles = StyleSheet.create({
    container: {
        height: 120,
        paddingTop: 20,
    },
});

// Creamos la función del componente
export default function Footer() {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <BetterText
                textAlign="center"
                fontWeight="Regular"
                fontSize={15}
                textColor="#C8C8C8"
            >
                {t("globals.nothing_more_to_see")}
            </BetterText>
        </View>
    );
}
