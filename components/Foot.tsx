import * as React from "react";
import * as Native from "react-native";
import * as Router from "expo-router";
import BeText from "./Text";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "./GapView";

// TypeScript, supongo
interface SectionProps {
    page: string;
}

// Definimos los estilos
const styles = Native.StyleSheet.create({
    container: {
        backgroundColor: "#16191E",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
        paddingBottom: 20,
        position: "absolute",
        zIndex: 99,
        bottom: 0,
        left: 0,
        right: 0,
    },
    icon: {
        width: 40,
        height: 40,
    },
    touchme: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
});

// Creamos la función del componente
export default function Foot({ page }: SectionProps) {
    const [currentPage, setCurrentPage] = React.useState<string>(page);

    // Define la función para manejar el cambio de página
    const handlePageChange = (newPage: string) => {
        setCurrentPage(newPage);
    };

    return (
        <Native.View style={styles.container}>
            <Router.Link
                href="/"
                onPress={() => handlePageChange("/")}
                style={styles.touchme}
            >
                <Ionicons
                    name="home"
                    size={25}
                    color={currentPage === "/" ? "#FFF" : "#8A8C8E"}
                />
                <GapView height={5} />
                <BeText
                    align="normal"
                    weight="Bold"
                    size={12}
                    color={currentPage === "/" ? "#FFF" : "#8A8C8E"}
                >
                    Home
                </BeText>
            </Router.Link>
            <Router.Link
                href="/Dash"
                onPress={() => handlePageChange("/Dash")}
                style={styles.touchme}
            >
                <Ionicons
                    name="dashboard"
                    size={25}
                    color={currentPage === "/Dash" ? "#FFF" : "#8A8C8E"}
                />
                <GapView height={5} />
                <BeText
                    align="normal"
                    weight="Bold"
                    size={12}
                    color={currentPage === "/Dash" ? "#FFF" : "#8A8C8E"}
                >
                    Dash
                </BeText>
            </Router.Link>
            <Router.Link
                href="/Prof"
                onPress={() => handlePageChange("/Prof")}
                style={styles.touchme}
            >
                <Ionicons
                    name="person"
                    size={25}
                    color={currentPage === "/Prof" ? "#FFF" : "#8A8C8E"}
                />
                <GapView height={5} />
                <BeText
                    align="normal"
                    weight="Bold"
                    size={12}
                    color={currentPage === "/Prof" ? "#FFF" : "#8A8C8E"}
                >
                    Profile
                </BeText>
            </Router.Link>
        </Native.View>
    );
}
