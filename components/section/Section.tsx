// section/Section.tsx
// Sección

import React from "react";
import { View, StyleSheet } from "react-native";
import SectionHeader from "./SectionHeader";

// TypeScript, supongo
interface SectionProps {
    kind: string;
    children: React.ReactNode;
}

// Creamos la función del componente
export default function Section({ kind, children }: SectionProps) {
    let lbl: string;
    let icn: string;

    switch (kind) {
        case "OBJS":
            lbl = "YOUR ACTIVE OBJECTIVES";
            icn = "OBJS";
            break;
        case "POBJS":
            lbl = "YOUR PASSIVE OBJECTIVES";
            icn = "POBJS";
            break;
        case "HYAD":
            lbl = "HOW YOU ARE DOING";
            icn = "HYAD";
            break;
        default:
            lbl = "UNKNOWN";
            icn = "IDK";
            break;
    }

    return (
        <View style={styles.container}>
            <SectionHeader label={lbl} icon={icn}></SectionHeader>
            {children}
        </View>
    );
}

// Definimos los estilos usando StyleSheet
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: "#14171C",
        flexDirection: "column",
        borderRadius: 20
    },
});