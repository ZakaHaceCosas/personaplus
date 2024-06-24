// section/SectionHeader.tsx
// Encabezado de Sección

import * as React from "react";
import * as Native from "react-native";
import BeText from "@/components/Text";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/components/GapView";

// TypeScript, supongo
interface SectionProps {
    icon: string;
    label: string;
}

// Definimos la hoja de estilos
const styles = Native.StyleSheet.create({
    mainview: {
        display: "flex",
        flexDirection: "row",
        padding: 15,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    items: {
        color: "#DDDDDD",
    },
});

// Creamos la función
export default function SectionHeader({ icon, label }: SectionProps) {
    let i: string;
    // Ya que habrá una cantidad definida de secciones, utilizamos switch y creamos diferentes casos, uno para cada sección dentro de la app.
    switch (icon) {
        case "OBJS":
            i = "timer";
            break;
        case "POBJS":
            i = "calendar-today";
            break;
        case "HYAD":
            i = "space-dashboard";
            break;
        case "SETS":
            i = "settings";
            break;
        case "DEV":
            i = "dev";
            break;
        default:
            i = "question-mark";
            break;
    }

    return (
        <Native.View style={styles.mainview}>
            {/* Replaced name={i} with this longer but simpler code due to a type error */}
            {i === "question-mark" && (
                <Ionicons name="question-mark" size={15} color="#DDDDDD" />
            )}
            {i === "settings" && (
                <Ionicons name="settings" size={15} color="#DDDDDD" />
            )}
            {i === "space-dashboard" && (
                <Ionicons name="space-dashboard" size={15} color="#DDDDDD" />
            )}
            {i === "calendar-today" && (
                <Ionicons name="calendar-today" size={15} color="#DDDDDD" />
            )}
            {i === "timer" && (
                <Ionicons name="timer" size={15} color="#DDDDDD" />
            )}
            {i === "dev" && <Ionicons name="code" size={15} color="#DDDDDD" />}
            <GapView width={10} />
            <BeText align="normal" weight="Bold" size={12} color="#DDDDDD">
                {label}
            </BeText>
        </Native.View>
    );
}
