// section/division/Division.tsx
// División

import BeText from "@/components/Text";
import React from "react";
import { View, StyleSheet } from "react-native";

// TypeScript, supongo
interface DivisionProps {
    status: string; // Estado. No se usa por ahora. Definiría el color de fondo.
    // hasIcon: boolean; // ¿Tiene un icono?
    iconName: string; // Si lo tiene, ¿Cuál es?
    preheader: string; // Título
    header: string; // Texto grande
    subheader: string; // El texto pequeño
    children: React.ReactNode; // Los hijos (botones, básicamente)
}

// Definimos los estilos
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: "#202328",
        flexDirection: "row",
        padding: 20
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
        <View style={styles.container}>
            <View>
                {/*<Icon></Icon>*/}
                <View>
                    <View>
                        <BeText weight="Bold" size={22} color="#FFF">
                            {header}
                        </BeText>
                        <BeText weight="Regular" size={12} color="#C8C8C8">{subheader}</BeText>
                        {children}
                    </View>
                </View>
            </View>
        </View>
    );
}