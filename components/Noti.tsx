// Noti.tsx
// Notificaciones, para alertar al usuario de cosas que pasan

import * as React from "react";
import * as Native from "react-native";
import BeText from "@/components/Text";
import GapView from "@/components/GapView";

// TypeScript, supongo
interface NotiProps {
    kind: string; // Tipo (color)
    title: string; // Título de la notificación
    text: string; // Texto de la misma
    stext?: string; // De haberlo, subtexto de la misma
    post?: string; // Posicionamiento
}

// Creamos la función
export default function Noti({
    kind,
    title,
    text,
    post = "static",
    stext,
}: NotiProps) {
    let strokeColor: string; // StrokeColor / Color del borde
    let backgroundColor: string; // BackgroundColor / Color del fondo
    let textColor: string; // TextColor / Color del texto

    switch (kind) {
        case "ACE":
            strokeColor = "#194080";
            backgroundColor = "#3280FF";
            textColor = "#FFFFFF";
            break;
        case "GOD":
            strokeColor = "#198040";
            backgroundColor = "#32FF80";
            textColor = "#000000";
            break;
        case "WOR":
            strokeColor = "#801919";
            backgroundColor = "#FF3232";
            textColor = "#FFFFFF";
            break;
        case "HMM":
            strokeColor = "#806419";
            backgroundColor = "#FFC832";
            textColor = "#000000";
            break;
        default:
            strokeColor = "#3E4146";
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
                borderColor: strokeColor,
                backgroundColor: backgroundColor,
                borderWidth: 4,
                width: "100%" as Native.DimensionValue,
                position: post,
                bottom: post === "absolute" ? 100 : undefined,
                left: post === "absolute" ? 20 : undefined,
                right: post === "absolute" ? 20 : undefined,
                zIndex: 999,
            }}
        >
            <BeText
                weight="SemiBold"
                size={12}
                color={textColor}
                align="normal"
            >
                {String(title)}
            </BeText>
            <GapView height={5} />
            <BeText weight="Bold" size={22} color={textColor} align="normal">
                {String(text)}
            </BeText>
            {stext && <GapView height={5} />}
            {stext && (
                <BeText
                    weight="Light"
                    size={12}
                    color={textColor}
                    align="normal"
                >
                    {String(stext)}
                </BeText>
            )}
        </Native.View>
    );
}
