// Footer.tsx
// No more, nada más, se acabó, it ended...

import * as React from "react";
import * as Native from "react-native";
import BeText from "@/components/BetterText";

// Definimos los estilos
const styles = Native.StyleSheet.create({
    container: {
        height: 120,
        paddingTop: 20,
    },
});

// Creamos la función del componente
export default function Footer() {
    return (
        <Native.View style={styles.container}>
            <BeText
                textAlign="center"
                fontWeight="Regular"
                fontSize={15}
                textColor="#C8C8C8"
            >
                Nothing more to see
            </BeText>
        </Native.View>
    );
}
