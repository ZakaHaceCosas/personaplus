// section/Section.tsx
// Sección

import React from "react";
import { View } from "react-native";
import SectionHeader from "@/components/section/SectionHeader";
import { useTranslation } from "react-i18next";

// TypeScript, supongo
interface DivisionProps {
    kind:
        | "Objectives"
        | "PassiveObjs"
        | "HowYouAreDoing"
        | "Unknown"
        | "Settings"
        | "Profile"
        | "About"
        | "Developer";
    children: React.ReactNode;
}

// Creamos la función
export default function Division({ kind, children }: DivisionProps) {
    const { t } = useTranslation();
    let label: string;
    let icon: string;

    switch (kind) {
        case "Objectives":
            label = t("sections.headers.your_active_objectives");
            icon = "OBJS";
            break;
        case "PassiveObjs":
            label = t("sections.headers.your_passive_objectives");
            icon = "POBJS";
            break;
        case "HowYouAreDoing":
            label = t("sections.headers.how_you_are_doing");
            icon = "HYAD";
            break;
        case "Unknown":
            label = t("sections.headers.unknown");
            icon = "IDK";
            break;
        case "Settings":
            label = t("sections.headers.settings");
            icon = "SETS";
            break;
        case "Developer":
            label = t("sections.headers.developer");
            icon = "DEV";
            break;
        case "Profile":
            label = t("sections.headers.your_profile");
            icon = "PROF";
            break;
        case "About":
            label = t("sections.headers.about");
            icon = "ABOUT";
            break;
        default:
            label = "UNKNOWN";
            icon = "IDK";
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
            <SectionHeader label={label} icon={icon} />
            {children}
        </View>
    );
}
