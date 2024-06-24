import * as React from "react";
import * as Native from "react-native";
import * as Router from "expo-router";
import BeText from "@/components/Text";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/components/GapView";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TypeScript, supongo
interface SectionProps {
    page: string; // en que página ( /welc, /, /prof, está ahora)
}

// Definimos los estilos
const styles = Native.StyleSheet.create({
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

    const [wantsDev, setWantsDev] = React.useState<boolean | null>(null);

    // Busca si quiere usar Dev interface
    React.useEffect(() => {
        const checkForDev = async () => {
            try {
                const useDev = await AsyncStorage.getItem("useDevTools");
                if (useDev === "true") {
                    setWantsDev(true);
                } else {
                    setWantsDev(false);
                }
            } catch (e) {
                const log =
                    "Got an error checking if the user wants to use Dev interface: " +
                    e;
                console.log(
                    "%cWOR%cDev error%c " + log,
                    "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                    "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                    "color: #FFD700;"
                );
            }
        };
        checkForDev();
    }, []);

    return (
        // Usamos estilos en línea ya que tienen un efecto pequeño pero positivo en el rendimiento final
        // Aunque no los usamos en "touchme" ya que este se repite varias veces.
        <Native.View
            style={{
                backgroundColor: "#16191E",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: 30,
                paddingRight: 30,
                paddingTop: 45,
                paddingBottom: 20,
                zIndex: 99,
                left: 0,
                right: 0,
                bottom: 0,
            }}
        >
            {wantsDev && (
                <Router.Link
                    href="/Dev"
                    onPress={() => handlePageChange("/Dev")}
                >
                    <Native.View style={styles.touchme}>
                        <Native.View>
                            <Ionicons
                                name="code"
                                size={25}
                                color={
                                    currentPage === "/Dev"
                                        ? "#3280FF"
                                        : "#8A8C8E"
                                }
                            />
                        </Native.View>
                        <GapView height={5} />
                        <Native.View>
                            <BeText
                                align="normal"
                                weight="Bold"
                                size={12}
                                color={
                                    currentPage === "/Dev"
                                        ? "#3280FF"
                                        : "#8A8C8E"
                                }
                            >
                                Dev
                            </BeText>
                        </Native.View>
                    </Native.View>
                </Router.Link>
            )}
            <Router.Link href="/" onPress={() => handlePageChange("/")}>
                <Native.View style={styles.touchme}>
                    <Native.View>
                        <Ionicons
                            name="home"
                            size={25}
                            color={currentPage === "/" ? "#FFF" : "#8A8C8E"}
                        />
                    </Native.View>
                    <GapView height={5} />
                    <Native.View>
                        <BeText
                            align="normal"
                            weight="Bold"
                            size={12}
                            color={currentPage === "/" ? "#FFF" : "#8A8C8E"}
                        >
                            Home
                        </BeText>
                    </Native.View>
                </Native.View>
            </Router.Link>
            <Router.Link href="/Dash" onPress={() => handlePageChange("/Dash")}>
                <Native.View style={styles.touchme}>
                    <Native.View>
                        <Ionicons
                            name="dashboard"
                            size={25}
                            color={currentPage === "/Dash" ? "#FFF" : "#8A8C8E"}
                        />
                    </Native.View>
                    <GapView height={5} />
                    <Native.View>
                        <BeText
                            align="normal"
                            weight="Bold"
                            size={12}
                            color={currentPage === "/Dash" ? "#FFF" : "#8A8C8E"}
                        >
                            Dash
                        </BeText>
                    </Native.View>
                </Native.View>
            </Router.Link>
            <Router.Link href="/Prof" onPress={() => handlePageChange("/Prof")}>
                <Native.View style={styles.touchme}>
                    <Native.View>
                        <Ionicons
                            name="person"
                            size={25}
                            color={currentPage === "/Prof" ? "#FFF" : "#8A8C8E"}
                        />
                    </Native.View>
                    <GapView height={5} />
                    <Native.View>
                        <BeText
                            align="normal"
                            weight="Bold"
                            size={12}
                            color={currentPage === "/Prof" ? "#FFF" : "#8A8C8E"}
                        >
                            Profile
                        </BeText>
                    </Native.View>
                </Native.View>
            </Router.Link>
        </Native.View>
    );
}
