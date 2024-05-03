// Btns.tsx
// Buttons, botones, elementos presionables, ENTIDADES INTERACTIVAS UTILIZABLES POR MEDIO DE CLICS / TOCAMIENTOS DE LA PANTALLA xd

import React from "react";
import * as Native from "react-native";
import BeText from "./Text";

// TypeScript, supongo
interface BtnsProps {
    kind: string;
    text: string;
    onclick: any;
}

// Creamos la funcion
export default function Btn({kind, text, onclick}: BtnsProps) {
    let strkclr: string; // StrokeColor / Color del borde
    let bkgrclr: string; // BackgroundColor / Color del fondo
    let textclr: string; // TextColor / Color del texto

    switch (kind) {
        case "ACE":
            strkclr = "#194080";
            bkgrclr = "#3280FF";
            textclr = "#FFFFFF";
            break;
        case "GOD":
            strkclr = "#32FF80";
            bkgrclr = "#198040";
            textclr = "#000000";
            break;
        case "WOR":
            strkclr = "#FF3232";
            bkgrclr = "#801919";
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
    
    return (
        <Native.Pressable onPress={onclick} style={{ paddingTop: 14, paddingBottom: 14, paddingLeft: 28, paddingRight: 28, borderRadius: 10, borderColor: strkclr, backgroundColor: bkgrclr, borderWidth: 4 }}>
            <BeText weight="Bold" size={14} color={textclr} align="cent">{text}</BeText>
        </Native.Pressable>
    )
}