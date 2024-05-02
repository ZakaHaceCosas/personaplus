// Dash.tsx
// Dashboard, where you setup your path to success.

import React from "react"
import { View, ScrollView, StyleSheet } from 'react-native';
import BeText from "@/components/Text";
import Foot from "@/components/Foot";
import { usePathname } from "expo-router"

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
export default function Dash() {
    let currentpage: string;
    currentpage = usePathname();

    return (
        <ScrollView>
            <View style={styles.mainview}>
                <BeText weight="Bold" size={40}>Dashboard</BeText>
                <BeText weight="Regular" size={20}>Lets set up your path to success</BeText>
            </View>
            <Foot page={currentpage}></Foot>
        </ScrollView>
    )
}