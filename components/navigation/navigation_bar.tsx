// src/BottomNav.tsx
// Navegación "de abajo" (está arriba, pero bueno)

import React, { ReactElement } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import BetterText from "@/components/text/better_text";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/components/ui/gap_view";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/colors";
import FontSizes from "@/constants/font_sizes";
import { Routes } from "@/constants/routes";
import { HexColorString } from "@/types/color";

// TypeScript, supongo
/**
 * SectionProps
 *
 * @interface SectionProps
 */
interface SectionProps {
    /**
     * On what page ( /dashboard, /profile...) the user is right now.
     *
     * @type {string}
     */
    currentLocation: string;
}
/**
 * NavItemProps
 *
 * @interface NavItemProps
 */
interface NavItemProps {
    /**
     * The link this item points to.
     *
     * @type {string}
     */
    href: string;
    /**
     * Name of the icon.
     *
     * @type {("home" | "dashboard" | "person" | "auto-graph" | "build")}
     */
    iconName: "home" | "dashboard" | "person" | "auto-graph" | "build";
    /**
     * Label to be shown.
     *
     * @type {string}
     */
    label: string;
    /**
     * Is this the current tab?
     *
     * @type {boolean}
     */
    isSelected: boolean;
}

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
        backgroundColor: Colors.MAIN.FOOTER.BACKGROUND,
    },
    navItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
});

/**
 * A Nav Item.
 *
 * @param {NavItemProps} p
 * @param {string} p.href
 * @param {("home" | "dashboard" | "person" | "auto-graph")} p.iconName
 * @param {string} p.label
 * @param {boolean} p.isSelected
 * @returns {ReactElement}
 */
function NavItem({
    href,
    iconName,
    label,
    isSelected,
}: NavItemProps): ReactElement {
    const color: HexColorString = isSelected
        ? Colors.MAIN.FOOTER.FOOTER_SEL
        : Colors.MAIN.FOOTER.FOOTER_UNS;

    function handlePress(): void {
        if (!isSelected) router.push(href);
    }

    return (
        <Pressable onPress={handlePress} style={styles.navItem}>
            <Ionicons name={iconName} size={25} color={color} />
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

/**
 * The bottom navbar.
 *
 * @export
 * @param {SectionProps} p
 * @param {string} p.currentLocation
 * @returns {ReactElement}
 */
export default function NavigationBar({
    currentLocation,
}: SectionProps): ReactElement {
    const { t } = useTranslation();

    return (
        <View style={styles.navBar}>
            <NavItem
                href={Routes.MAIN.HOME}
                iconName="home"
                label={t("globals.navbar.home")}
                isSelected={currentLocation === "/"}
            />
            <NavItem
                href={Routes.MAIN.DASHBOARD}
                iconName="dashboard"
                label={t("globals.navbar.dashboard")}
                isSelected={currentLocation === Routes.MAIN.DASHBOARD}
            />
            <NavItem
                href={Routes.MAIN.REPORT}
                iconName="auto-graph"
                label={t("globals.navbar.report")}
                isSelected={currentLocation === Routes.MAIN.REPORT}
            />
            <NavItem
                href={Routes.MAIN.TOOLKIT}
                iconName="build"
                label={t("globals.navbar.toolkit")}
                isSelected={currentLocation === Routes.MAIN.TOOLKIT}
            />
            <NavItem
                href={Routes.MAIN.PROFILE}
                iconName="person"
                label={t("globals.navbar.profile")}
                isSelected={currentLocation === Routes.MAIN.PROFILE}
            />
        </View>
    );
}
