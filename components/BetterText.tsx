// BetterText.tsx
// Text, con estilos apropiados y la tipografía Be Vietnam Pro

import * as React from "react";
import * as Native from "react-native";

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
    children: React.ReactNode; // Texto en sí, dentro del tag <BeText>
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
    let fontprefix: string = "BeVietnamPro-";
    if (isSerif === true) {
        fontprefix = "NotoSerif-";
    } else {
        fontprefix = "BeVietnamPro-";
    }
    const font: string = fontprefix + fontWeight;
    const lineheight: number = fontSize; // La altura de línea es igual al tamaño de letra
    const color: string = textColor || "#FFF"; // Si el color no se especifica, es blanco
    let textalignment: string = textAlign || "normal"; // Si el alineamiento no se especifica, es normal (izquierda)
    let textdecoration: string;

    switch (textAlign) {
        case "center":
            textalignment = "center";
            break;
        case "normal":
            textalignment = "left";
            break;
        case "left":
            textalignment = "left";
            break;
        case "right":
            textalignment = "right";
            break;
        default:
            textalignment = "left";
            break;
    }

    switch (url) {
        case true:
            textdecoration = "underline";
            break;
        case false:
            textdecoration = "none";
            break;
        default:
            textdecoration = "none";
            break;
    }

    const textStyle: Native.TextStyle = {
        fontFamily: font,
        fontSize: fontSize,
        lineHeight: lineheight,
        color: color,
        // @ts-expect-error: Type error
        textAlign: textalignment,
        // @ts-expect-error: Type error
        textDecorationLine: textdecoration,
        textDecorationColor: color,
        textDecorationStyle: "solid",
        padding: 1, // This fixes text not looking properly
    };

    return (
        <Native.Text style={textStyle} {...(onTap ? { onPress: onTap } : {})}>
            {children}
        </Native.Text>
    );
}
