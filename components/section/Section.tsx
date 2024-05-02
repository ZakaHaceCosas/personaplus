// section/Section.tsx
// Sección

import React from "react";
import { View, StyleSheet } from "react-native";
import SectionHeader from "./SectionHeader";

// TypeScript, supongo
interface DivisionProps {
    kind: string;
    children: React.ReactNode;
}

// Definimos los estilos
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: "#14171C",
        flexDirection: "column",
        borderRadius: 15,
        overflow: "hidden"
    },
});

// Creamos la función
export default function Division({ kind, children }: DivisionProps) {
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