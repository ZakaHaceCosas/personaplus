// src/BottomNav.tsx
// Navegación "de abajo" (está arriba, pero bueno)

import React from "react";
import { StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import BetterText from "@/src/BetterText";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/src/GapView";
import { useTranslation } from "react-i18next";
import colors from "@/src/toolkit/design/colors";

// TypeScript, supongo
interface SectionProps {
    currentLocation: string; // en que página ( /WelcomeScreen, /Profile...) está ahora
}

// We define the styles
const styles = StyleSheet.create({
    touchme: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
});

const TouchMe = ({
    href,
    iconName,
    label,
    isSelected,
}: {
    href: string;
    iconName: string;
    label: string;
    isSelected: boolean;
}) => (
    <Link href={href}>
        <View style={styles.touchme}>
            <Ionicons
                // @ts-expect-error: This uses a type that's just "icon-name" | "icon-name-2" etc... and it's not exported, so I have no way to specify the correct type for this. Hence, gives a type error.
                name={iconName}
                size={25}
                color={
                    isSelected
                        ? colors.MAIN.FOOTER.FOOTERSEL
                        : colors.MAIN.FOOTER.FOOTERUNS
                }
            />
            <GapView height={5} />
            <BetterText
                textAlign="normal"
                fontWeight="Bold"
                fontSize={12}
                textColor={
                    isSelected
                        ? colors.MAIN.FOOTER.FOOTERSEL
                        : colors.MAIN.FOOTER.FOOTERUNS
                }
            >
                {label}
            </BetterText>
        </View>
    </Link>
);

// We create the function
export default function BottomNav({ currentLocation }: SectionProps) {
    const { t } = useTranslation();

    return (
        // Usamos estilos en línea ya que tienen un efecto pequeño pero positivo en el rendimiento final, salvo en "touchme" ya que este se repite varias veces.
        <View
            style={{
                backgroundColor: colors.MAIN.FOOTER.BACKGROUND,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 30,
                zIndex: 99,
                height: 100,
                left: 0,
                right: 0,
                bottom: 0,
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
