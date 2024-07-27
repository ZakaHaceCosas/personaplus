// src/Buttons.tsx
// Buttons, botones, elementos presionables, ENTIDADES INTERACTIVAS UTILIZABLES POR MEDIO DE CLICS / TOCAMIENTOS DE LA PANTALLA xd

import React, { ReactNode } from "react";
import { Pressable, DimensionValue } from "react-native";
import BetterText from "@/src/BetterText";
import colors from "@/src/toolkit/design/colors";

// TypeScript, supongo
/**
 * ButtonProps interface
 *
 * @interface BtnsProps
 * @typedef {BtnsProps}
 */
interface BtnsProps {
    /**
     * The style of the button. Use ACE (blue) for accent, GOD (green) for positive actions, WOR (red) for destructive actions, HMM (orange) for warning buttons, and DEFAULT (grey-black) for extra actions.
     *
     * @type {("ACE" | "GOD" | "WOR" | "DEFAULT" | "HMM")}
     */
    style: "ACE" | "GOD" | "WOR" | "DEFAULT" | "HMM";
    /**
     * The text of the button. Can also be passed as children (ReactNode), but if you prefer to use this property you can.
     *
     * @type {?string}
     */
    buttonText?: string;
    /**
     * A void function that the button will perform upon press.
     *
     * @type {() => void}
     */
    action: () => void;
    /**
     * Width of the button. Defaults to auto. Fill will use CSS "100%", while auto will use CSS "auto".
     *
     * @type {?("auto" | "fill")}
     */
    width?: "auto" | "fill";
    /**
     * Height of the button. Defaults to auto. Fill will use CSS "100%", while auto will use CSS "auto". Default will use a fixed number (55). You can also pass a custom fixed number if needed.
     *
     * @type {?("auto" | "fill" | "default" | number)}
     */
    height?: "auto" | "fill" | "default" | number;
    /**
     * The layout of the button. Defaults to normal. Box will override height & width, override CSS flex: 1 directive and make the button a 50x50 box. Fixed will also override height and flex, but not width.
     *
     * @type {?("normal" | "box" | "fixed")}
     */
    layout?: "normal" | "box" | "fixed";
    /**
     * The text of the button, as children.
     *
     * @type {?ReactNode}
     */
    children?: ReactNode;
}

// Creamos la funcion
/**
 * Homemade button component.
 *
 * @export
 * @param {BtnsProps} param0
 * @param {("ACE" | "GOD" | "WOR" | "DEFAULT" | "HMM")} param0.style The style of the button. Defaults to default. ACE = blue, GOD = green, WOR = red, HMM = orange, and DEFAULT = black.
 * @param {string} param0.buttonText The text of the button. Can be passed either here or as the children.
 * @param {() => void} param0.action What shall the button do upon press.
 * @param {("auto" | "fill")} param0.width The width of the button
 * @param {(number | "auto" | "fill" | "default")} param0.height The height of the button.
 * @param {("normal" | "box" | "fixed")} param0.layout The layout. Defaults to normal.
 * @param {ReactNode} param0.children The text of the button. Can be passed either here or as a parameter.
 * @returns {*}
 */
export default function Button({
    style,
    buttonText,
    action,
    width,
    height,
    layout,
    children,
}: BtnsProps) {
    let borderColor: string; // Color del borde
    let backgroundColor: string; // Color del fondo
    let textColor: string; // Color del texto
    let buttonWidth: string | number; // Tamaño horizontal del botón
    let buttonHeight: string | number; // Tamaño vertical del botón
    let buttonMinorPadding: number; // Relleno / espaciado interior vertical (pequeño) del botón
    let buttonMajorPadding: number; // Relleno / espaciado interior horizontal (grande) del botón
    let flexValue: 0 | 1; // Valor de flex, puede ser 0 o 1.

    switch (style) {
        case "ACE":
            borderColor = colors.PRIMARIES.ACE.ACESTRK;
            backgroundColor = colors.PRIMARIES.ACE.ACE;
            textColor = colors.BASIC.WHITE;
            break;
        case "GOD":
            borderColor = colors.PRIMARIES.GOD.GODSTRK;
            backgroundColor = colors.PRIMARIES.GOD.GOD;
            textColor = colors.BASIC.BLACK;
            break;
        case "WOR":
            borderColor = colors.PRIMARIES.WOR.WORSTRK;
            backgroundColor = colors.PRIMARIES.WOR.WOR;
            textColor = colors.BASIC.WHITE;
            break;
        case "HMM":
            borderColor = colors.PRIMARIES.HMM.HMMSTRK;
            backgroundColor = colors.PRIMARIES.HMM.HMM;
            textColor = colors.BASIC.BLACK;
            break;
        case "DEFAULT":
            borderColor = colors.MAIN.BLANDITEM.STRK;
            backgroundColor = colors.MAIN.BLANDITEM.BACKGROUND;
            textColor = colors.BASIC.WHITE;
            break;
        default:
            borderColor = colors.MAIN.BLANDITEM.STRK;
            backgroundColor = colors.MAIN.BLANDITEM.BACKGROUND;
            textColor = colors.BASIC.WHITE;
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
            buttonHeight = 50;
            flexValue = 1;
            break;
        case "box":
            buttonMinorPadding = 0;
            buttonMajorPadding = 0;
            buttonWidth = 50;
            buttonHeight = 50;
            flexValue = 0;
            break;
        case "fixed":
            buttonMinorPadding = 0;
            buttonMajorPadding = 0;
            buttonHeight = 50;
            flexValue = 0;
            break;
        default:
            buttonMinorPadding = 0;
            buttonMajorPadding = 0;
            flexValue = 1;
            break;
    }

    // Usamos estilos en línea ya que tienen un efecto pequeño pero positivo en el rendimiento final
    return (
        <Pressable
            onPress={action}
            style={{
                paddingTop: buttonMinorPadding as DimensionValue,
                paddingBottom: buttonMinorPadding as DimensionValue,
                paddingLeft: buttonMajorPadding as DimensionValue,
                paddingRight: buttonMajorPadding as DimensionValue,
                borderRadius: 10,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                borderWidth: 4,
                width: buttonWidth as DimensionValue,
                height: buttonHeight as DimensionValue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: flexValue,
            }}
        >
            {buttonText && (
                <BetterText
                    fontWeight="Medium"
                    fontSize={14}
                    textColor={textColor}
                    textAlign="center"
                >
                    {String(buttonText)}
                </BetterText>
            )}
            {children && children}
        </Pressable>
    );
}
