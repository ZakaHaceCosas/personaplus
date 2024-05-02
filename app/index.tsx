// index.tsx
// Welcome to PersonaPlus, my friend!

import React from "react"
import { View, ScrollView, StyleSheet } from 'react-native';
import BeText from "@/components/Text";
import Section from "@/components/section/Section";
import Foot from "@/components/Foot";
import { usePathname } from "expo-router"
import Division from "@/components/section/division/Division";

// Creamos los estilos
const styles = StyleSheet.create({
    mainview: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
    },
    epicspacingdiv: {
        height: 20,
        width: 1
    }
})

// Creamos la función
export default function Home() {
    // Por defecto
    let username: string = "zaka";
    let currentpage: string;
    currentpage = usePathname();

    return (
        <ScrollView>
            <View style={styles.mainview}>
                <BeText weight="Bold" size={40}>Hello, {username}!</BeText>
                <BeText weight="Regular" size={20}>This is your summary for today</BeText>
                <View style={styles.epicspacingdiv}></View> {/* oye, ¿por qué no? */}
                <Section kind="OBJS">
                    <Division preheader="OBJECTIVE" header="RUNNING" subheader="For 12 minutes" iconName={null} status="REGULAR">
                        <BeText weight="BoldItalic" size={12} color="#FF3232">Botones aquí</BeText>
                    </Division>
                </Section>
            </View>
            <Foot page={currentpage}></Foot>
        </ScrollView>
    )
}