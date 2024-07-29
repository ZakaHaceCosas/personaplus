// src/BottomNav.tsx
// Navegación "de abajo" (está arriba, pero bueno)

import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import BetterText from "@/src/BetterText";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/src/GapView";
import { useTranslation } from "react-i18next";
import colors from "./toolkit/design/colors";

// TypeScript, supongo
interface SectionProps {
    currentLocation: string; // en que página ( /WelcomeScreen, /Profile...) está ahora
}

// Definimos los estilos
const styles = StyleSheet.create({
    touchme: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
});

// Creamos la función del componente
export default function BottomNav({ currentLocation }: SectionProps) {
    const [currentPage, setCurrentPage] = useState<string>(currentLocation);
    // Define la función para manejar el cambio de página
    const handlePageChange = (newPage: string) => {
        setCurrentPage(newPage);
    };
    const { t } = useTranslation();

    return (
        // Usamos estilos en línea ya que tienen un efecto pequeño pero positivo en el rendimiento final, salvo en "touchme" ya que este se repite varias veces.
        <View
            style={{
                backgroundColor: colors.MAIN.FOOTER.BACKGROUND,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 30,
                zIndex: 99,
                height: 100,
                left: 0,
                right: 0,
                bottom: 0,
            }}
        >
            <Link href="/" onPress={() => handlePageChange("/")}>
                <View style={styles.touchme}>
                    <View>
                        <Ionicons
                            name="home"
                            size={25}
                            color={
                                currentPage === "/"
                                    ? colors.MAIN.FOOTER.FOOTERSEL
                                    : colors.MAIN.FOOTER.FOOTERUNS
                            }
                        />
                    </View>
                    <GapView height={5} />
                    <View>
                        <BetterText
                            textAlign="normal"
                            fontWeight="Bold"
                            fontSize={12}
                            textColor={
                                currentPage === "/"
                                    ? colors.MAIN.FOOTER.FOOTERSEL
                                    : colors.MAIN.FOOTER.FOOTERUNS
                            }
                        >
                            {t("navbar.home")}
                        </BetterText>
                    </View>
                </View>
            </Link>
            <Link
                href="/Dashboard"
                onPress={() => handlePageChange("/Dashboard")}
            >
                <View style={styles.touchme}>
                    <View>
                        <Ionicons
                            name="dashboard"
                            size={25}
                            color={
                                currentPage === "/Dashboard"
                                    ? colors.MAIN.FOOTER.FOOTERSEL
                                    : colors.MAIN.FOOTER.FOOTERUNS
                            }
                        />
                    </View>
                    <GapView height={5} />
                    <View>
                        <BetterText
                            textAlign="normal"
                            fontWeight="Bold"
                            fontSize={12}
                            textColor={
                                currentPage === "/Dashboard"
                                    ? colors.MAIN.FOOTER.FOOTERSEL
                                    : colors.MAIN.FOOTER.FOOTERUNS
                            }
                        >
                            {t("navbar.dashboard")}
                        </BetterText>
                    </View>
                </View>
            </Link>
            <Link href="/Profile" onPress={() => handlePageChange("/Profile")}>
                <View style={styles.touchme}>
                    <View>
                        <Ionicons
                            name="person"
                            size={25}
                            color={
                                currentPage === "/Profile"
                                    ? colors.MAIN.FOOTER.FOOTERSEL
                                    : colors.MAIN.FOOTER.FOOTERUNS
                            }
                        />
                    </View>
                    <GapView height={5} />
                    <View>
                        <BetterText
                            textAlign="normal"
                            fontWeight="Bold"
                            fontSize={12}
                            textColor={
                                currentPage === "/Profile"
                                    ? colors.MAIN.FOOTER.FOOTERSEL
                                    : colors.MAIN.FOOTER.FOOTERUNS
                            }
                        >
                            {t("navbar.profile")}
                        </BetterText>
                    </View>
                </View>
            </Link>
        </View>
    );
}
