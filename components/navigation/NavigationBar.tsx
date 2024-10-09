// src/BottomNav.tsx
// Navegación "de abajo" (está arriba, pero bueno)

import React, { ReactElement } from "react";
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
    navBar: {
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
    },
    navItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
});

function NavItem({
    href,
    iconName,
    label,
    isSelected,
}: {
    href: string;
    iconName: "home" | "dashboard" | "person";
    label: string;
    isSelected: boolean;
}): ReactElement {
    const color =
        isSelected ?
            Colors.MAIN.FOOTER.FOOTER_SEL
        :   Colors.MAIN.FOOTER.FOOTER_UNS;

    return (
        <Pressable
            onPress={() => router.push(href)}
            style={styles.navItem}
        >
            <Ionicons
                name={iconName}
                size={25}
                color={color}
            />
            <GapView height={5} />
            <BetterText
                textAlign="normal"
                fontWeight="Bold"
                fontSize={FontSizes.SMALL}
                textColor={color}
            >
                {label}
            </BetterText>
        </Pressable>
    );
}

// We create the function
export default function NavigationBar({ currentLocation }: SectionProps) {
    const { t } = useTranslation();

    return (
        <View
            style={[
                styles.navBar,
                { backgroundColor: Colors.MAIN.FOOTER.BACKGROUND },
            ]}
        >
            <NavItem
                href="/"
                iconName="home"
                label={t("navbar.home")}
                isSelected={currentLocation === "/"}
            />
            <NavItem
                href="/Dashboard"
                iconName="dashboard"
                label={t("navbar.dashboard")}
                isSelected={currentLocation === "/Dashboard"}
            />
            <NavItem
                href="/Profile"
                iconName="person"
                label={t("navbar.profile")}
                isSelected={currentLocation === "/Profile"}
            />
        </View>
    );
}
