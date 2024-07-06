// section/SectionHeader.tsx
// Encabezado de Sección

import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/components/GapView";

// TypeScript, supongo
interface SectionProps {
    icon: string;
    label: string;
}

// Creamos la función
export default function SectionHeader({ icon, label }: SectionProps) {
    let headerIcon: string;
    // Ya que habrá una cantidad definida de secciones, utilizamos switch y creamos diferentes casos, uno para cada sección dentro de la app.
    switch (icon) {
        case "OBJS":
            headerIcon = "timer";
            break;
        case "POBJS":
            headerIcon = "calendar-today";
            break;
        case "HYAD":
            headerIcon = "space-dashboard";
            break;
        case "SETS":
            headerIcon = "settings";
            break;
        case "DEV":
            headerIcon = "dev";
            break;
        case "PROF":
            headerIcon = "prof";
            break;
        case "ABOUT":
            headerIcon = "info";
            break;
        default:
            headerIcon = "question-mark";
            break;
    }

    return (
        <Native.View
            style={{
                display: "flex",
                flexDirection: "row",
                padding: 15,
                alignItems: "center",
                justifyContent: "flex-start",
            }}
        >
            {headerIcon === "question-mark" && (
                <Ionicons name="question-mark" size={15} color="#DDDDDD" />
            )}
            {headerIcon === "settings" && (
                <Ionicons name="settings" size={15} color="#DDDDDD" />
            )}
            {headerIcon === "space-dashboard" && (
                <Ionicons name="space-dashboard" size={15} color="#DDDDDD" />
            )}
            {headerIcon === "calendar-today" && (
                <Ionicons name="calendar-today" size={15} color="#DDDDDD" />
            )}
            {headerIcon === "timer" && (
                <Ionicons name="timer" size={15} color="#DDDDDD" />
            )}
            {headerIcon === "prof" && (
                <Ionicons name="person" size={15} color="#DDDDDD" />
            )}
            {headerIcon === "dev" && (
                <Ionicons name="code" size={15} color="#DDDDDD" />
            )}
            {headerIcon === "info" && (
                <Ionicons name="info" size={15} color="#DDDDDD" />
            )}
            <GapView width={10} />
            <BetterText
                textAlign="normal"
                fontWeight="Bold"
                fontSize={12}
                textColor="#DDDDDD"
            >
                {String(label)}
            </BetterText>
        </Native.View>
    );
}
