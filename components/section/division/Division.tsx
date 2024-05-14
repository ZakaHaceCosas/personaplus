// section/division/Division.tsx
// División

import BeText from "@/components/Text";
import React from "react";
import * as Native from "react-native";
import GapView from "@/components/GapView";

// TypeScript, supongo
interface DivisionProps {
    status: string; // Estado. No se usa por ahora. Definiría el color de fondo.
    // hasIcon: boolean; // ¿Tiene un icono?
    iconName: string | null; // Si lo tiene, ¿Cuál es?
    preheader: string; // Título
    header: string; // Texto grande
    subheader: string; // El texto pequeño
    children: React.ReactNode; // Los hijos (botones, básicamente)
}

// Definimos los estilos
const styles = Native.StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: "#202328",
        flexDirection: "row",
        padding: 20,
        width: "100%"
    },
});

// Creamos la función
export default function Division({ status, iconName, preheader, header, subheader, children }: DivisionProps) {
    switch (status) {
        case "REGULAR":
            // El color de fondo es el de siempre (#202328)
            break;
        default:
            // Por defecto
            break;
    }

    return (
        <Native.View style={styles.container}>
            <Native.View style={{ width: "100%" }}>
                {/*<Icon></Icon>*/}
                <Native.View style={{ width: "100%" }}>
                    <Native.View>
                        <BeText align="normal" weight="Bold" size={10} color="#FFF">
                            {preheader}
                        </BeText>
                        <GapView height={10}/>
                        <BeText align="normal" weight="Bold" size={22} color="#FFF">
                            {header}
                        </BeText>
                        <GapView height={10}/>
                        <BeText align="normal" weight="Regular" size={12} color="#C8C8C8">
                            {subheader}
                        </BeText>
                        <GapView height={10}/>
                        <Native.View style={{ display: "flex", flexDirection: "row", flex: 1, width: "100%", gap: 15 }}>
                            {children}
                        </Native.View>
                    </Native.View>
                </Native.View>
            </Native.View>
        </Native.View>
    );
}