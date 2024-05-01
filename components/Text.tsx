// Text.tsx
// Text, con estilos apropiados y la tipografía Be Vietnam Pro

import React from "react";
import { Text, TextStyle } from "react-native";

// TypeScript, supongo
interface BeTextProps {
    size: number;
    weight: string;
    color?: string;
    children: React.ReactNode;
}

// Creamos la función
export default function BeText({ size, weight, children, color }: BeTextProps) {
    // weight (Bold, ExtraBold, Light, Regular, Medium)...
    // para itálica, añadir Italic (BoldItalic)
    const font: string = "BeVietnamPro-" + weight;
    // altura de línea = tamaño de fuente :]
    const thelineheight: number = size;
    // color del texto. si no especificas uno, por defecto es blanco (ya que la aplicación es de fondo negro)
    const txtcolor: string = color || "#FFF";

    const textStyle: TextStyle = {
        fontFamily: font,
        fontSize: size,
        lineHeight: thelineheight,
        color: txtcolor
    };

    return (
        <Text style={textStyle}>
            {children}
        </Text>
    );
}