// Buttons.tsx
// Buttons, botones, elementos presionables, ENTIDADES INTERACTIVAS UTILIZABLES POR MEDIO DE CLICS / TOCAMIENTOS DE LA PANTALLA xd

import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";

// TypeScript, supongo
interface BtnsProps {
    style: "ACE" | "GOD" | "WOR" | "DEFAULT" | "HMM";
    buttonText: string;
    action: () => void;
    width?: "auto" | "fill";
    height?: "auto" | "fill" | "default" | number;
    layout?: string;
}

// Creamos la funcion
export default function Button({
    style,
    buttonText,
    action,
    width,
    height,
    layout,
}: BtnsProps) {
    let borderColor: string; // Color del borde
    let backgroundColor: string; // Color del fondo
    let textColor: string; // Color del texto
    let buttonWidth: string | number; // Tamaño horizontal del botón
    let buttonHeight: string | number; // Tamaño vertical del botón
    let buttonMinorPadding: number; // Relleno / espaciado interior vertical (pequeño) del botón
    let buttonMajorPadding: number; // Relleno / espaciado interior horizontal (grande) del botón

    switch (style) {
        case "ACE":
            borderColor = "#194080";
            backgroundColor = "#3280FF";
            textColor = "#FFFFFF";
            break;
        case "GOD":
            borderColor = "#198040";
            backgroundColor = "#32FF80";
            textColor = "#000000";
            break;
        case "WOR":
            borderColor = "#801919";
            backgroundColor = "#FF3232";
            textColor = "#FFFFFF";
            break;
        case "HMM":
            borderColor = "#806419";
            backgroundColor = "#FFC832";
            textColor = "#000000";
            break;
        case "DEFAULT":
            borderColor = "#3E4146";
            backgroundColor = "#2A2D32";
            textColor = "#FFF";
            break;
        default:
            borderColor = "#3E4146";
            backgroundColor = "#2A2D32";
            textColor = "#FFF";
            break;
    }

    switch (width) {
        case "auto":
            buttonWidth = "auto";
            break;
        case "fill":
            buttonWidth = "100%";
            break;
        default:
            buttonWidth = "auto";
            break;
    }

    switch (height) {
        case "auto":
            buttonHeight = "auto";
            break;
        case "fill":
            buttonHeight = "100%";
            break;
        case "default":
            buttonHeight = 55;
            break;
        default:
            buttonHeight = 55;
            break;
    }

    switch (layout) {
        case "normal":
            buttonMinorPadding = 0;
            buttonMajorPadding = 0;
            break;
        case "box":
            buttonMinorPadding = 0;
            buttonMajorPadding = 15;
            buttonWidth = 50;
            buttonHeight = 50;
            break;
        default:
            buttonMinorPadding = 0;
            buttonMajorPadding = 0;
            break;
    }

    // Usamos estilos en línea ya que tienen un efecto pequeño pero positivo en el rendimiento final
    return (
        <Native.Pressable
            onPress={action}
            style={{
                paddingTop: buttonMinorPadding as Native.DimensionValue,
                paddingBottom: buttonMinorPadding as Native.DimensionValue,
                paddingLeft: buttonMajorPadding as Native.DimensionValue,
                paddingRight: buttonMajorPadding as Native.DimensionValue,
                borderRadius: 10,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                borderWidth: 4,
                width: buttonWidth as Native.DimensionValue,
                height: buttonHeight as Native.DimensionValue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
            }}
        >
            <BetterText
                fontWeight="Medium"
                fontSize={14}
                textColor={textColor}
                textAlign="center"
            >
                {String(buttonText)}
            </BetterText>
        </Native.Pressable>
    );
}
