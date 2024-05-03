// Dash.tsx
// Dashboard, where you setup your path to success.

import React from "react"
import * as Native from 'react-native';
import BeText from "@/components/Text";
import Foot from "@/components/Foot";
import { usePathname } from "expo-router"
import Section from "@/components/section/Section";
import Division from "@/components/section/division/Division";

// Creamos los estilos
const styles = Native.StyleSheet.create({
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
        <Native.ScrollView>
            <Native.View style={styles.mainview}>
                <BeText align="normal" weight="Bold" size={40}>Dashboard</BeText>
                <BeText align="normal" weight="Regular" size={20}>Lets set up your path to success</BeText>
            </Native.View>
            <Foot page={currentpage}></Foot>
        </Native.ScrollView>
    )
}