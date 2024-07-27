// section/Division.tsx
// División

import React, { ReactNode } from "react";
import { View } from "react-native";
import BetterText from "@/src/BetterText";
import GapView from "@/src/GapView";
import colors from "../toolkit/design/colors";

// TypeScript, supongo
interface DivisionProps {
    status?: string; // Estado. No se usa por ahora. Definiría el color de fondo.
    hasIcon?: boolean; // ¿Tiene un icono?
    iconName?: string | null; // Si lo tiene, ¿Cuál es?
    preheader?: string; // Título
    header: string; // Texto grande
    subheader?: string; // El texto pequeño, de haberlo
    children: ReactNode; // Los hijos (botones, básicamente)
}

// Creamos la función
export default function Division({
    status,
    iconName,
    preheader,
    header,
    subheader,
    children,
}: DivisionProps) {
    switch (status) {
        case "REGULAR":
            // El color de fondo es el de siempre (#202328)
            break;
        default:
            // Por defecto
            break;
    }

    return (
        <View
            style={{
                display: "flex",
                backgroundColor: colors.MAIN.DIVISION,
                flexDirection: "row",
                padding: 20,
                width: "100%",
            }}
        >
            <View style={{ width: "100%" }}>
                <View style={{ width: "100%" }}>
                    <View>
                        {preheader && (
                            <BetterText
                                textAlign="normal"
                                fontWeight="Bold"
                                fontSize={10}
                                textColor={colors.BASIC.WHITE}
                            >
                                {preheader}
                            </BetterText>
                        )}
                        {preheader && <GapView height={10} />}
                        <BetterText
                            textAlign="normal"
                            fontWeight="Bold"
                            fontSize={25}
                            textColor={colors.BASIC.WHITE}
                        >
                            {header}
                        </BetterText>
                        {subheader && <GapView height={10} />}
                        {subheader && (
                            <BetterText
                                textAlign="normal"
                                fontWeight="Regular"
                                fontSize={12}
                                textColor={colors.LBLS.SDD}
                            >
                                {subheader}
                            </BetterText>
                        )}
                        <GapView height={10} />
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                flex: 1,
                                width: "100%",
                                gap: 15,
                            }}
                        >
                            {children}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
