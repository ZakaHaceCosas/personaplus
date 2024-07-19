// src/BetterText.tsx
// Text, con estilos apropiados y la tipografía Be Vietnam Pro

import React, { ReactNode } from "react";
import { TextStyle, Text } from "react-native";

// TypeScript, supongo
interface BetterTextProps {
    fontSize: number; // Tamaño de letra en px
    fontWeight:
        | "Light"
        | "LightItalic"
        | "ExtraLight"
        | "ExtraLightItalic"
        | "Thin"
        | "ThinItalic"
        | "Regular"
        | "Italic"
        | "Medium"
        | "MediumItalic"
        | "SemiBold"
        | "SemiBoldItalic"
        | "Bold"
        | "BoldItalic"
        | "ExtraBold"
        | "ExtraBoldItalic"
        | "Black"
        | "BlackItalic"; // Intensidad de la tipografía
    textColor?: string; // Color del texto - default: blanco (ya que el fondo es negro)
    isSerif?: boolean; // Wether to use Serif font or not
    onTap?: () => void; // Si se proporciona, el texto actuará como un botón / enlace y hará algo
    textAlign?: "center" | "normal" | "left" | "right"; // Alineación del texto
    children: ReactNode; // Texto en sí, dentro del tag <BeText>
    url?: boolean; // Si es verdadero el texto se estilizará como un enlace externo - default: false
}

// Creamos la función
export default function BetterText({
    fontSize,
    fontWeight,
    children,
    textColor,
    textAlign,
    onTap,
    isSerif,
    url,
}: BetterTextProps) {
    const fontprefix: string = isSerif ? "NotoSerif-" : "BeVietnamPro-";
    const font: string = `${fontprefix}${fontWeight}`;
    const lineheight: number = fontSize + 0.5; // La altura de línea es igual al tamaño de letra (+ 0.5 para arreglar el texto viendose "recortado")
    const color: string = textColor || "#FFF"; // Si el color no se especifica, es blanco
    const textalignment: "center" | "right" | "left" =
        textAlign === "center" || textAlign === "normal"
            ? "center"
            : textAlign === "right"
              ? "right"
              : "left";
    const textdecoration: "underline" | "none" = url ? "underline" : "none";

    const textStyle: TextStyle = {
        fontFamily: font,
        fontSize: fontSize,
        lineHeight: lineheight,
        color: color,
        textAlign: textalignment,
        textDecorationLine: textdecoration,
        textDecorationColor: color,
        textDecorationStyle: "solid",
        padding: 1.25, // This fixes text not looking properly
    };

    return (
        <Text style={textStyle} {...(onTap ? { onPress: onTap } : {})}>
            {children}
        </Text>
    );
}
