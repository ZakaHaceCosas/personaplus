// Text.tsx
// Text, con estilos apropiados y la tipografía Be Vietnam Pro

import React from "react";
import * as Native from "react-native";

// TypeScript, supongo
interface BeTextProps {
    size: number;
    weight: string;
    color?: string;
    onTap?: any;
    align: string;
    children: React.ReactNode;
}

// Creamos la función
export default function BeText({ size, weight, children, color, align, onTap }: BeTextProps) {
    // weight (Bold, ExtraBold, Light, Regular, Medium)...
    // para itálica, añadir Italic (BoldItalic)
    const font: string = "BeVietnamPro-" + weight;
    // altura de línea = tamaño de fuente :]
    const thelineheight: number = size;
    // color del texto. si no especificas uno, por defecto es blanco (ya que la aplicación es de fondo negro)
    const txtcolor: string = color || "#FFF";
    let txtalgn: string | undefined;

    switch (align) {
        case "cent":
            txtalgn = "center";
            break;
        case "normal":
            txtalgn = "left";
            break;
        case "left":
            txtalgn = "left";
            break;
        case "rigt":
            txtalgn = "right";
            break;
        default:
            txtalgn = undefined;
            break;
    }

    const textStyle: Native.TextStyle = {
        fontFamily: font,
        fontSize: size,
        lineHeight: thelineheight,
        color: txtcolor,
        textAlign: txtalgn // Ignora el error, funciona correctamente. Será que VSCode no reconoce lo que pasa aquí (al menos en mi maquina marca error aquí).
    };

    if (onTap) {
        return (
            <Native.Text style={textStyle} onPress={onTap}>
                {children}
            </Native.Text>
        );
    } else {
        return (
            <Native.Text style={textStyle}>
                {children}
            </Native.Text>
        );
    }
}