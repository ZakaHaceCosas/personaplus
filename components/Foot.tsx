import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import BeText from "./Text";

// TypeScript, supongo
interface SectionProps {
    page: string;
}

// Creamos la función del componente
export default function Foot({ page }: SectionProps) {
    const [currentPage, setCurrentPage] = useState<string>(page);

    // Define la función para manejar el cambio de página
    const handlePageChange = (newPage: string) => {
        setCurrentPage(newPage);
    };

    return (
        <View style={styles.container}>
            <Link href="/" onPress={() => handlePageChange("/")}>
                <BeText weight="Bold" size={12} color={currentPage === "/" ? "#FFF" : "#8A8C8E"}>
                    Home
                </BeText>
            </Link>
            <Link href="/Dash" onPress={() => handlePageChange("/Dash")}>
                <BeText weight="Bold" size={12} color={currentPage === "/Dash" ? "#FFF" : "#8A8C8E"}>
                    Board
                </BeText>
            </Link>
            <Link href="/Prof" onPress={() => handlePageChange("/Prof")}>
                <BeText weight="Bold" size={12} color={currentPage === "/Prof" ? "#FFF" : "#8A8C8E"}>
                    Person
                </BeText>
            </Link>
        </View>
    );
}

// Definimos los estilos usando StyleSheet
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#16191E",
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 30,
        paddingBottom: 30,
        bottom: 0,
        left: 0,
        right: 0
    },
    icon: {
        width: 40,
        height: 40
    }
});
