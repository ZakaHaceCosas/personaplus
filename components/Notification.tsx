// Notification.tsx
// Notificaciones, para alertar al usuario de cosas que pasan

import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";
import GapView from "@/components/GapView";

// TypeScript, supongo
interface NotificationProps {
    style: "ACE" | "GOD" | "WOR" | "HMM"; // Tipo (color)
    title: string; // Título de la notificación
    text: string; // Texto de la misma
    subtext?: string; // De haberlo, subtexto de la misma
    position?: string; // Posicionamiento
}

// Creamos la función
export default function Notification({
    style,
    title,
    text,
    position = "static",
    subtext,
}: NotificationProps) {
    let borderColor: string; // Color del borde
    let backgroundColor: string; // Color del fondo
    let textColor: string; // Color del texto

    switch (style) {
        case "ACE":
            borderColor = "#194080";
            backgroundColor = "#3280FF";
            textColor = "#FFFFFF";
            break;
        case "GOD":
            borderColor = "#198040";
            backgroundColor = "#32FF80";
            textColor = "#000000";
            break;
        case "WOR":
            borderColor = "#801919";
            backgroundColor = "#FF3232";
            textColor = "#FFFFFF";
            break;
        case "HMM":
            borderColor = "#806419";
            backgroundColor = "#FFC832";
            textColor = "#000000";
            break;
        default:
            borderColor = "#3E4146";
            backgroundColor = "#2A2D32";
            textColor = "#FFF";
            break;
    }

    // Usamos estilos en línea ya que tienen un efecto pequeño pero positivo en el rendimiento final
    return (
        <Native.View
            // @ts-expect-error: "Unnasignable types"
            style={{
                padding: 15,
                borderRadius: 10,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                borderWidth: 4,
                width: "100%" as Native.DimensionValue,
                position: position,
                bottom: position === "absolute" ? 100 : undefined,
                left: position === "absolute" ? 20 : undefined,
                right: position === "absolute" ? 20 : undefined,
                zIndex: 999,
            }}
        >
            <BetterText
                fontWeight="SemiBold"
                fontSize={12}
                textColor={textColor}
                textAlign="normal"
            >
                {String(title)}
            </BetterText>
            <GapView height={5} />
            <BetterText
                fontWeight="Bold"
                fontSize={22}
                textColor={textColor}
                textAlign="normal"
            >
                {String(text)}
            </BetterText>
            {subtext && <GapView height={5} />}
            {subtext && (
                <BetterText
                    fontWeight="Light"
                    fontSize={12}
                    textColor={textColor}
                    textAlign="normal"
                >
                    {String(subtext)}
                </BetterText>
            )}
        </Native.View>
    );
}
