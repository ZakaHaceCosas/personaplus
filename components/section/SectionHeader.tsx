// section/SectionHeader.tsx
// Encabezado de Sección

import React from "react";
import { View, StyleSheet } from "react-native";
import BeText from "../Text";

// TypeScript, supongo
interface SectionProps {
    icon: string;
    label: string;
}

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
        <View style={styles.mainview}>
            {/*
            {i === "OBJS" && <CalendarDayFilled />}
            {i === "POBJS" && <CalendarDayFilled />}
            {i === "HYAD" && <HeartPulseFilled />}
            {i === "IDK" && <QuestionFilled />*/}
            <BeText weight="Bold" size={12} color="#DDDDDD">{label}</BeText>
        </View>
    );
}

// Definimos la hoja de estilos
const styles = StyleSheet.create({
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