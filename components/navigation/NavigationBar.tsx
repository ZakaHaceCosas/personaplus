// src/BottomNav.tsx
// Navegación "de abajo" (está arriba, pero bueno)

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import BetterText from "@/components/text/BetterText";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/components/ui/GapView";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import FontSizes from "@/constants/FontSizes";

// TypeScript, supongo
interface SectionProps {
    currentLocation: string; // on what page ( /Dashboard, /Profile...) the user is
}

// We define the styles
const styles = StyleSheet.create({
    touchme: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
});

const TouchMe = ({
    href,
    iconName,
    label,
    isSelected,
}: {
    href: string;
    iconName: "home" | "dashboard" | "person";
    label: string;
    isSelected: boolean;
}) => (
    <Pressable onPress={() => router.push(href)} style={styles.touchme}>
        <Ionicons
            name={iconName}
            size={25}
            color={
                isSelected
                    ? Colors.MAIN.FOOTER.FOOTERSEL
                    : Colors.MAIN.FOOTER.FOOTERUNS
            }
        />
        <GapView height={5} />
        <BetterText
            textAlign="normal"
            fontWeight="Bold"
            fontSize={FontSizes.SMALL}
            textColor={
                isSelected
                    ? Colors.MAIN.FOOTER.FOOTERSEL
                    : Colors.MAIN.FOOTER.FOOTERUNS
            }
        >
            {label}
        </BetterText>
    </Pressable>
);

// We create the function
export default function NavigationBar({ currentLocation }: SectionProps) {
    const { t } = useTranslation();

    return (
        // Usamos estilos en línea ya que tienen un efecto pequeño pero positivo en el rendimiento final, salvo en "touchme" ya que este se repite varias veces.
        <View
            style={{
                backgroundColor: Colors.MAIN.FOOTER.BACKGROUND,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                zIndex: 99,
                height: 100,
                left: 0,
                right: 0,
                bottom: 0,
                padding: 0,
                position: "absolute",
            }}
        >
            <TouchMe
                href="/"
                iconName="home"
                label={t("navbar.home")}
                isSelected={currentLocation === "/"}
            />
            <TouchMe
                href="/Dashboard"
                iconName="dashboard"
                label={t("navbar.dashboard")}
                isSelected={currentLocation === "/Dashboard"}
            />
            <TouchMe
                href="/Profile"
                iconName="person"
                label={t("navbar.profile")}
                isSelected={currentLocation === "/Profile"}
            />
        </View>
    );
}
