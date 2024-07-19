// src/section/Section.tsx

import React, { ReactNode } from "react";
import { View } from "react-native";
import BetterText from "@/src/BetterText";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/src/GapView";
import { useTranslation } from "react-i18next";

// TypeScript, supongo
interface SectionProps {
    kind:
        | "Objectives"
        | "PassiveObjs"
        | "HowYouAreDoing"
        | "Unknown"
        | "Settings"
        | "Profile"
        | "About"
        | "Developer";
    children: ReactNode;
}

// Creamos la función
export default function Section({ kind, children }: SectionProps) {
    const { t } = useTranslation();
    let label: string;
    let headerIcon:
        | "timer"
        | "calendar-today"
        | "space-dashboard"
        | "person"
        | "info"
        | "settings"
        | "code"
        | "question-mark"; // If you add a new icon, add it here

    switch (kind) {
        case "Objectives":
            label = t("sections.headers.your_active_objectives");
            headerIcon = "timer";
            break;
        case "PassiveObjs":
            label = t("sections.headers.your_passive_objectives");
            headerIcon = "calendar-today";
            break;
        case "HowYouAreDoing":
            label = t("sections.headers.how_you_are_doing");
            headerIcon = "space-dashboard";
            break;
        case "Unknown":
            label = t("sections.headers.unknown");
            headerIcon = "question-mark";
            break;
        case "Settings":
            label = t("sections.headers.settings");
            headerIcon = "settings";
            break;
        case "Developer":
            label = t("sections.headers.developer");
            headerIcon = "code";
            break;
        case "Profile":
            label = t("sections.headers.your_profile");
            headerIcon = "person";
            break;
        case "About":
            label = t("sections.headers.about");
            headerIcon = "info";
            break;
        default:
            label = "UNKNOWN";
            headerIcon = "question-mark";
            break;
    }

    return (
        <View
            style={{
                display: "flex",
                backgroundColor: "#14171C",
                flexDirection: "column",
                borderRadius: 15,
                overflow: "hidden",
            }}
        >
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: 15,
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                <Ionicons name={headerIcon} size={15} color="#DDDDDD" />
                <GapView width={10} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Bold"
                    fontSize={12}
                    textColor="#DDDDDD"
                >
                    {String(label)}
                </BetterText>
            </View>
            {children}
        </View>
    );
}
