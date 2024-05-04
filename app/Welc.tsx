// Welc.tsx
// Welcome page

import Btn from "@/components/Btns";
import GapView from "@/components/GapView";
import BeText from "@/components/Text";
import React from "react"
import * as Native from "react-native";

// Definimos los estilos
const styles = Native.StyleSheet.create({
    defview: {
        width: "100vw", // Ignora el error, funciona correctamente. Cosas de TypeScript.
        height: "100vh", // Ignora el error, funciona correctamente. Cosas de TypeScript.
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 40
    }
})

// Definimos la función
export default function WelcomePage() {
    function gonext() {
        console.log("a")
    }

    return (
        <Native.View style={styles.defview}>
            <BeText align="normal" weight="Bold" size={40}>
                Welcome to <BeText align="normal" weight="ExtraBold" size={40} color="#32FF80">PersonaPlus</BeText>!
            </BeText>
            <GapView height={10} />
            <BeText align="normal" weight="Regular" size={20}>
                We're proud to see you want to give yourself a plus.
            </BeText>
            <GapView height={20} />
            <Btn kind="ACE" onclick={gonext()} text="Let's go!" width="fill"/>
        </Native.View>
    )
}