// Btns.tsx
// Buttons, botones, elementos presionables, ENTIDADES INTERACTIVAS UTILIZABLES POR MEDIO DE CLICS / TOCAMIENTOS DE LA PANTALLA xd

import * as React from "react";
import * as Native from "react-native";
import BeText from "@/components/Text";

// TypeScript, supongo
interface BtnsProps {
    kind: string;
    text: string;
    onclick: any;
    width?: string;
    height?: string | number;
}

// Creamos la funcion
export default function Btn({ kind, text, onclick, width, height }: BtnsProps) {
    let strkclr: string; // StrokeColor / Color del borde
    let bkgrclr: string; // BackgroundColor / Color del fondo
    let textclr: string; // TextColor / Color del texto
    let btnwdth: string; // ButtonWidth / Tamaño horizontal del botón
    let btnhght: string | number; // ButtonHeight / Tamaño vertical del botón

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
        /*default:
            strkclr = "#999999";
            bkgrclr = "#CCCCCC";
            textclr = "#000000";
            break;*/
        // i think this will look better - if unknown, dark
        // codenamed "INPUT" in VAR-DSGN
        // note: using white instead of #949698 for text color since it's a button and should be legible
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

    return (
        // Usamos estilos en línea ya que tienen un efecto pequeño pero positivo en el rendimiento final
        <Native.Pressable
            onPress={onclick}
            style={{
                paddingTop: 14,
                paddingBottom: 14,
                paddingLeft: 28,
                paddingRight: 28,
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
            <BeText weight="Medium" size={14} color={textclr} align="cent">
                {text}
            </BeText>
        </Native.Pressable>
    );
}
