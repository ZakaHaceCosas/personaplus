// Btns.tsx
// Buttons, botones, elementos presionables, ENTIDADES INTERACTIVAS UTILIZABLES POR MEDIO DE CLICS / TOCAMIENTOS DE LA PANTALLA xd

import * as React from "react";
import * as Native from "react-native";
import BeText from "@/components/Text";

// TypeScript, supongo
interface BtnsProps {
    kind: "ACE" | "GOD" | "WOR" | "DEFAULT" | "HMM";
    text: string;
    onclick: () => void;
    width?: string;
    height?: string | number;
    style?: string;
}

// Creamos la funcion
export default function Btn({
    kind,
    text,
    onclick,
    width,
    height,
    style,
}: BtnsProps) {
    let strkclr: string; // StrokeColor / Color del borde
    let bkgrclr: string; // BackgroundColor / Color del fondo
    let textclr: string; // TextColor / Color del texto
    let btnwdth: string | number; // ButtonWidth / Tamaño horizontal del botón
    let btnhght: string | number; // ButtonHeight / Tamaño vertical del botón
    let btnpdsm: number; // ButtonPaddingSmall / Relleno / espaciado interior vertical (pequeño) del botón
    let btnpdbg: number; // ButtonPaddingBig / Relleno / espaciado interior horizontal (grande) del botón

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
            // no se si tengo esquizofrenia, pero te juro que esto lo corregi antes
            strkclr = "#806419";
            bkgrclr = "#FFC832";
            textclr = "#000000";
            break;
        default:
            strkclr = "#3E4146";
            bkgrclr = "#2A2D32";
            textclr = "#FFF";
            break;
    }

    switch (width) {
        case "auto":
            btnwdth = "auto";
            break;
        case "fill":
            btnwdth = "100%";
            break;
        default:
            btnwdth = "auto";
            break;
    }

    switch (height) {
        case "auto":
            btnhght = "auto";
            break;
        case "fill":
            btnhght = "100%";
            break;
        case "default": // Por si acaso
            btnhght = 55;
            break;
        default:
            btnhght = 55;
            break;
    }

    switch (style) {
        case "normal":
            /*
            btnpdsm = 14;
            btnpdbg = 28;
            */
            btnpdsm = 0;
            btnpdbg = 0;
            break;
        case "box":
            btnpdsm = 0;
            btnpdbg = 15;
            btnwdth = 50;
            btnhght = 50;
            break;
        default:
            /*
            btnpdsm = 14;
            btnpdbg = 28;
            */
            btnpdsm = 0;
            btnpdbg = 0;
            break;
    }

    // Usamos estilos en línea ya que tienen un efecto pequeño pero positivo en el rendimiento final
    return (
        <Native.Pressable
            onPress={onclick}
            style={{
                paddingTop: btnpdsm as Native.DimensionValue,
                paddingBottom: btnpdsm as Native.DimensionValue,
                paddingLeft: btnpdbg as Native.DimensionValue,
                paddingRight: btnpdbg as Native.DimensionValue,
                borderRadius: 10,
                borderColor: strkclr,
                backgroundColor: bkgrclr,
                borderWidth: 4,
                width: btnwdth as Native.DimensionValue,
                height: btnhght as Native.DimensionValue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
            }}
        >
            <BeText weight="Medium" size={14} color={textclr} align="center">
                {String(text)}
            </BeText>
        </Native.Pressable>
    );
}
