// src/BottomNav.tsx
// Navegación "de abajo" (está arriba, pero bueno)

import React, { ReactElement, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import BetterText from "@/components/text/BetterText";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/components/ui/GapView";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import FontSizes from "@/constants/FontSizes";
import ROUTES from "@/constants/Routes";
import { GetExperiments } from "@/toolkit/Experiments";

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
    iconName: "home" | "dashboard" | "person" | "auto-graph";
    label: string;
    isSelected: boolean;
}): ReactElement {
    const color = isSelected
        ? Colors.MAIN.FOOTER.FOOTER_SEL
        : Colors.MAIN.FOOTER.FOOTER_UNS;

    return (
        <Pressable
            onPress={() => {
                router.push(href);
            }}
            style={styles.navItem}
        >
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

// We create the function
export default function NavigationBar({ currentLocation }: SectionProps) {
    const { t } = useTranslation();
    const [reportEnabled, setReport] = useState<boolean>(false);

    useEffect(() => {
        async function handle() {
            setReport((await GetExperiments()).exp_report);
        }
        handle();
    }, []);

    return (
        <View
            style={[
                styles.navBar,
                { backgroundColor: Colors.MAIN.FOOTER.BACKGROUND },
            ]}
        >
            <NavItem
                href={ROUTES.MAIN.HOME}
                iconName="home"
                label={t("globals.navbar.home")}
                isSelected={currentLocation === "/"}
            />
            <NavItem
                href={ROUTES.MAIN.DASHBOARD}
                iconName="dashboard"
                label={t("globals.navbar.dashboard")}
                isSelected={currentLocation === ROUTES.MAIN.DASHBOARD}
            />
            {reportEnabled && (
                <NavItem
                    href={ROUTES.EXPERIMENTS.REPORT}
                    iconName="auto-graph"
                    label={t("globals.navbar.report")}
                    isSelected={currentLocation === ROUTES.EXPERIMENTS.REPORT}
                />
            )}
            <NavItem
                href={ROUTES.MAIN.PROFILE}
                iconName="person"
                label={t("globals.navbar.profile")}
                isSelected={currentLocation === ROUTES.MAIN.PROFILE}
            />
        </View>
    );
}
