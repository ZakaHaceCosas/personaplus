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
    align?: string;
    children: React.ReactNode;
    url?: boolean;
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
    // weight (Bold, ExtraBold, Light, Regular, Medium)...
    // para itálica, añadir Italic (BoldItalic)
    const font: string = "BeVietnamPro-" + weight;
    // altura de línea = tamaño de fuente :]
    const thelineheight: number = size;
    // color del texto. si no especificas uno, por defecto es blanco (ya que la aplicación es de fondo negro)
    const txtcolor: string = color || "#FFF";
    let txtalgn: string = align || "normal";
    let txtdeco: string;

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
        // @ts-ignore
        textAlign: txtalgn,
        // @ts-ignore
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
