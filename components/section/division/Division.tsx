// section/division/Division.tsx
// División

import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";
import GapView from "@/components/GapView";

// TypeScript, supongo
interface DivisionProps {
    status?: string; // Estado. No se usa por ahora. Definiría el color de fondo.
    hasIcon?: boolean; // ¿Tiene un icono?
    iconName?: string | null; // Si lo tiene, ¿Cuál es?
    preheader?: string; // Título
    header: string; // Texto grande
    subheader?: string; // El texto pequeño, de haberlo
    children: React.ReactNode; // Los hijos (botones, básicamente)
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
        <Native.View
            style={{
                display: "flex",
                backgroundColor: "#202328",
                flexDirection: "row",
                padding: 20,
                width: "100%",
            }}
        >
            <Native.View style={{ width: "100%" }}>
                <Native.View style={{ width: "100%" }}>
                    <Native.View>
                        {preheader && (
                            <BetterText
                                textAlign="normal"
                                fontWeight="Bold"
                                fontSize={10}
                                textColor="#FFF"
                            >
                                {preheader}
                            </BetterText>
                        )}
                        {preheader && <GapView height={10} />}
                        <BetterText
                            textAlign="normal"
                            fontWeight="Bold"
                            fontSize={25}
                            textColor="#FFF"
                        >
                            {header}
                        </BetterText>
                        {subheader && <GapView height={10} />}
                        {subheader && (
                            <BetterText
                                textAlign="normal"
                                fontWeight="Regular"
                                fontSize={12}
                                textColor="#C8C8C8"
                            >
                                {subheader}
                            </BetterText>
                        )}
                        <GapView height={10} />
                        <Native.View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                flex: 1,
                                width: "100%",
                                gap: 15,
                            }}
                        >
                            {children}
                        </Native.View>
                    </Native.View>
                </Native.View>
            </Native.View>
        </Native.View>
    );
}
