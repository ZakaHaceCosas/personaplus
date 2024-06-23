// Text.tsx
// Text, con estilos apropiados y la tipografía Be Vietnam Pro

import React from "react";
import * as Native from "react-native";

// TypeScript, supongo
interface BeTextProps {
    size: number; // Tamaño de letra en px
    weight: string; // Intensidad de la tipografía (Regular, Bold, ExtraBold, Light, Regular, Medium), etc...
    // para itálica, añadir Italic (p ej. "BoldItalic") al weight.
    color?: string; // Color del texto - default: blanco (ya que el fondo es negro)
    onTap?: () => void; // Si se proporciona, el texto actuará como un botón / enlace y hará algo
    align?: string; // Alineación del texto
    children: React.ReactNode; // Texto en sí, dentro del tag <BeText>
    url?: boolean; // Si es verdadero el texto se estilizará como un enlace externo - default: false
}

// Creamos la función
export default function BeText({
    size,
    weight,
    children,
    color,
    align,
    onTap,
    url,
}: BeTextProps) {
    const font: string = "BeVietnamPro-" + weight;
    // La altura de línea es igual al tamaño de letra
    const thelineheight: number = size;
    const txtcolor: string = color || "#FFF";
    let txtalgn: string = align || "normal";
    let txtdeco: string;

    switch (align) {
        case "center":
            txtalgn = "center";
            break;
        case "normal":
            txtalgn = "left";
            break;
        case "left":
            txtalgn = "left";
            break;
        case "right":
            txtalgn = "right";
            break;
        default:
            txtalgn = "left";
            break;
    }

    switch (url) {
        case true:
            txtdeco = "underline";
            break;
        case false:
            txtdeco = "none";
            break;
        default:
            txtdeco = "none";
            break;
    }

    const textStyle: Native.TextStyle = {
        fontFamily: font,
        fontSize: size,
        lineHeight: thelineheight,
        color: txtcolor,
        // @ts-expect-error: Type error
        textAlign: txtalgn,
        // @ts-expect-error: Type error
        textDecorationLine: txtdeco,
        textDecorationColor: txtcolor,
        textDecorationStyle: "solid",
    };

    if (onTap) {
        return (
            <Native.Text style={textStyle} onPress={onTap}>
                {children}
            </Native.Text>
        );
    } else {
        return <Native.Text style={textStyle}>{children}</Native.Text>;
    }
}
