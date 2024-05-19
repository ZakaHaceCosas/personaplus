// Noti.tsx
// Notificaciones, para alertar al usuario de cosas que pasan

import React from "react";
import * as Native from "react-native";
import BeText from "./Text";
import GapView from "./GapView";



// TypeScript, supongo
interface NotiProps {
    kind: string; // Tipo (color)
    title: string; // Título de la notificación
    text: string; // Texto de la misma
    post?: any; // Posicionamiento
}

// Creamos la funcion
export default function Noti({kind, title, text, post}: NotiProps) {
    let strkclr: string; // StrokeColor / Color del borde
    let bkgrclr: string; // BackgroundColor / Color del fondo
    let textclr: string; // TextColor / Color del texto
    let ntipost: string; // NotiPosition / Posicionamiento CSS

    switch (kind) {
        case "ACE":
            strkclr = "#194080";
            bkgrclr = "#3280FF";
            textclr = "#FFFFFF";
            break;
        case "GOD":
            strkclr = "#198040";
            bkgrclr = "#32FF80";
            textclr = "#000000";
            break;
        case "WOR":
            strkclr = "#801919";
            bkgrclr = "#FF3232";
            textclr = "#FFFFFF";
            break;
        case "HMM":
            strkclr = "#FFC832";
            bkgrclr = "#806419";
            textclr = "#000000";
            break;
        // if unknown, gray
        default:
            strkclr = "#999999";
            bkgrclr = "#CCCCCC";
            textclr = "#000000";
            break;
    }

    switch (post) {
        case "default":
            ntipost = "relative";
            break;
        case "fixed":
            ntipost = "fixed";
            break;
        case "absolute":
            ntipost = "absolute";
            break;
        case "static":
            ntipost = "statitc";
            break;
        default:
            ntipost = "static";
            break;
    }

    return (
        // Usamos estilos en línea ya que tienen un efecto pequeño pero positivo en el rendimiento final
            // @ts-ignore
            <Native.View style={{
                padding: 14,
                borderRadius: 10,
                borderColor: strkclr,
                backgroundColor: bkgrclr,
                borderWidth: 4,
                width: "calc(100vw - 80px)" as Native.DimensionValue,
                flex: 1,
                position: ntipost,
                zIndex: 999,
                bottom: 100,
                left: 20,
                right: 20
            }}>
            <BeText weight="SemiBold" size={12} color={textclr} align="normal">{title}</BeText>
            <GapView height={2}/>
            <BeText weight="Bold" size={22} color={textclr} align="normal">{text}</BeText>
        </Native.View>
    )
}