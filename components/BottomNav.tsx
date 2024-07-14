import * as React from "react";
import * as Native from "react-native";
import * as Router from "expo-router";
import BetterText from "@/components/BetterText";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/components/GapView";
import { useTranslation } from "react-i18next";

// TypeScript, supongo
interface SectionProps {
    currentLocation: string; // en que página ( /WelcomeScreen, /Profile...) está ahora
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
export default function BottomNav({ currentLocation }: SectionProps) {
    const [currentPage, setCurrentPage] =
        React.useState<string>(currentLocation);
    // Define la función para manejar el cambio de página
    const handlePageChange = (newPage: string) => {
        setCurrentPage(newPage);
    };
    const { t } = useTranslation();

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
                        <BetterText
                            textAlign="normal"
                            fontWeight="Bold"
                            fontSize={12}
                            textColor={currentPage === "/" ? "#FFF" : "#8A8C8E"}
                        >
                            {t("navbar.home")}
                        </BetterText>
                    </Native.View>
                </Native.View>
            </Router.Link>
            <Router.Link
                href="/Dashboard"
                onPress={() => handlePageChange("/Dashboard")}
            >
                <Native.View style={styles.touchme}>
                    <Native.View>
                        <Ionicons
                            name="dashboard"
                            size={25}
                            color={
                                currentPage === "/Dashboard"
                                    ? "#FFF"
                                    : "#8A8C8E"
                            }
                        />
                    </Native.View>
                    <GapView height={5} />
                    <Native.View>
                        <BetterText
                            textAlign="normal"
                            fontWeight="Bold"
                            fontSize={12}
                            textColor={
                                currentPage === "/Dashboard"
                                    ? "#FFF"
                                    : "#8A8C8E"
                            }
                        >
                            {t("navbar.dashboard")}
                        </BetterText>
                    </Native.View>
                </Native.View>
            </Router.Link>
            <Router.Link
                href="/Profile"
                onPress={() => handlePageChange("/Profile")}
            >
                <Native.View style={styles.touchme}>
                    <Native.View>
                        <Ionicons
                            name="person"
                            size={25}
                            color={
                                currentPage === "/Profile" ? "#FFF" : "#8A8C8E"
                            }
                        />
                    </Native.View>
                    <GapView height={5} />
                    <Native.View>
                        <BetterText
                            textAlign="normal"
                            fontWeight="Bold"
                            fontSize={12}
                            textColor={
                                currentPage === "/Profile" ? "#FFF" : "#8A8C8E"
                            }
                        >
                            {t("navbar.profile")}
                        </BetterText>
                    </Native.View>
                </Native.View>
            </Router.Link>
        </Native.View>
    );
}
