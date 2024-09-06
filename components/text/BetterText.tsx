// src/BetterText.tsx
// Text, con estilos apropiados y la tipografía Be Vietnam Pro

import React, { ReactNode, ReactElement } from "react";
import { TextStyle, Text } from "react-native";
import Colors from "@/constants/Colors";
import { FontFamily, FontWeight } from "@/types/FontWeights";

// TypeScript, supongo
interface BetterTextProps<T extends FontFamily = "BeVietnamPro"> {
    fontFamily?: T; // Font family
    fontSize: number; // Tamaño de letra en px
    fontWeight: FontWeight<T>; // Intensidad de la tipografía dependiente de fontFamily
    textColor?: string; // Color del texto - default: blanco (ya que el fondo es negro)
    onTap?: () => void; // Si se proporciona, el texto actuará como un botón / enlace y hará algo
    textAlign?: "center" | "normal" | "left" | "right"; // Alineación del texto
    children: ReactNode; // Texto en sí, dentro del tag <BeText>
    isLink?: boolean; // Si es verdadero el texto se estilizará como un enlace externo - default: false
}

export default function BetterText<T extends FontFamily = "BeVietnamPro">({
    fontFamily = "BeVietnamPro" as T,
    fontSize,
    fontWeight,
    children,
    textColor = Colors.BASIC.WHITE,
    textAlign = "normal",
    onTap,
    isLink = false,
}: BetterTextProps<T>): ReactElement {
    const fontFamilyName: string = `${fontFamily}-${fontWeight}`;
    const color: string = textColor || Colors.BASIC.WHITE; // Si el color no se especifica, es blanco
    const alignment: "center" | "right" | "left" =
        textAlign === "center"
            ? "center"
            : textAlign === "right"
            ? "right"
            : textAlign === "normal" || textAlign === "left"
            ? "left"
            : "left";
    const decoration: "underline" | "none" = isLink ? "underline" : "none";

    const textStyle: TextStyle = {
        fontFamily: fontFamilyName,
        fontSize: fontSize,
        lineHeight:
            fontSize +
            0.25 /* La altura de línea es igual al tamaño de letra (+ 0.5 para arreglar el texto viendose "recortado") */,
        color: isLink ? Colors.PRIMARIES.ACE.ACE : color,
        textAlign: alignment,
        textDecorationLine: decoration,
        textDecorationColor: color,
        textDecorationStyle: "solid",
        paddingTop: 1.15, // This fixes text not looking properly
        paddingBottom: 1.15,
    };

    return (
        <Text style={textStyle} {...(onTap ? { onPress: onTap } : {})}>
            {children}
        </Text>
    );
}