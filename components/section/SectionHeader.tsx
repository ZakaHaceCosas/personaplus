// section/SectionHeader.tsx
// Encabezado de Sección

import React from "react";
import * as Native from "react-native";
import BeText from "../Text";

// TypeScript, supongo
interface SectionProps {
    icon: string;
    label: string;
}

// Definimos la hoja de estilos
const styles = Native.StyleSheet.create({
    mainview: {
        display: 'flex',
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center'
    },
    items: {
        color: "#DDDDDD"
    }
})

// Creamos la función
export default function SectionHeader({ icon, label }: SectionProps) {
    let i: string;
    // Ya que habrá una cantidad definida de secciones, utilizamos switch y creamos diferentes casos, uno para cada sección dentro de la app.
    switch (icon) {
        case "OBJS":
            i = "OBJS";
            break;
        case "POBJS":
            i = "POBJS"; // Se cambiará cuando se me ocurra algo que pegue
            break;
        case "HYAD":
            i = "HYAD";
            break;
        default:
            i = "IDK";
            break;
    }

    return (
        <Native.View style={styles.mainview}>
            <BeText align="normal" weight="Bold" size={12} color="#DDDDDD">{label}</BeText>
        </Native.View>
    );
}
