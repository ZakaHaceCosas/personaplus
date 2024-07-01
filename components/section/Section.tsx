// section/Section.tsx
// Sección

import * as React from "react";
import * as Native from "react-native";
import SectionHeader from "@/components/section/SectionHeader";

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
    let label: string;
    let icon: string;

    switch (kind) {
        case "Objectives":
            label = "YOUR ACTIVE OBJECTIVES";
            icon = "OBJS";
            break;
        case "PassiveObjs":
            label = "YOUR PASSIVE OBJECTIVES";
            icon = "POBJS";
            break;
        case "HowYouAreDoing":
            label = "HOW YOU ARE DOING";
            icon = "HYAD";
            break;
        case "Unknown":
            label = "UNKNOWN";
            icon = "IDK";
            break;
        case "Settings":
            label = "SETTINGS";
            icon = "SETS";
            break;
        case "Developer":
            label = "DEVELOPER OPTIONS";
            icon = "DEV";
            break;
        case "Profile":
            label = "YOUR PROFILE";
            icon = "PROF";
            break;
        case "About":
            label = "ABOUT";
            icon = "ABOUT";
            break;
        default:
            label = "UNKNOWN";
            icon = "IDK";
            break;
    }

    return (
        <Native.View
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
        </Native.View>
    );
}
