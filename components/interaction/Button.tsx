// src/Buttons.tsx
// Buttons, botones, elementos presionables, ENTIDADES INTERACTIVAS UTILIZABLES POR MEDIO DE CLICS / TOCAMIENTOS DE LA PANTALLA xd

import React, { ReactElement, ReactNode, useState } from "react";
import { Pressable, DimensionValue } from "react-native";
import BetterText from "@/components/text/BetterText";
import Colors from "@/constants/Colors";

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
    layout?: "normal" | "box";
    /**
     * The text of the button, as children.
     *
     * @type {?ReactNode}
     */
    children?: ReactNode;
}

// Creamos la funcion
/**
 * Homemade button component. **Deprecated!**. Use BetterButton instead, which is better, but has one breaking change: `children` support is removed, forcing to use self-closing buttons with the `buttonText` property.
 *
 * @export
 * @param {BtnsProps} param0
 * @param {("ACE" | "GOD" | "WOR" | "DEFAULT" | "HMM")} param0.style The style of the button. Defaults to default. ACE = blue, GOD = green, WOR = red, HMM = orange, and DEFAULT = black.
 * @param {string} param0.buttonText The text of the button. Can be passed either here or as the children.
 * @param {() => void} param0.action What shall the button do upon press.
 * @param {("normal" | "box")} param0.layout The layout. Defaults to normal.
 * @param {ReactNode} param0.children The text of the button. Can be passed either here or as a parameter.
 * @deprecated
 * @returns {ReactElement}
 */
export default function Button({
    style,
    buttonText,
    action,
    layout = "normal",
    children,
}: BtnsProps): ReactElement {
    let borderColor: string; // Color del borde
    let backgroundColor: string; // Color del fondo
    let textColor: string; // Color del texto
    let buttonWidth: DimensionValue; // Tamaño horizontal del botón
    let buttonHeight: DimensionValue; // Tamaño vertical del botón
    let flexValue: 0 | 1; // Valor de flex, puede ser 0 o 1.

    switch (style) {
        case "ACE":
            borderColor = Colors.PRIMARIES.ACE.ACESTRK;
            backgroundColor = Colors.PRIMARIES.ACE.ACE;
            textColor = Colors.BASIC.WHITE;
            break;
        case "GOD":
            borderColor = Colors.PRIMARIES.GOD.GODSTRK;
            backgroundColor = Colors.PRIMARIES.GOD.GOD;
            textColor = Colors.BASIC.BLACK;
            break;
        case "WOR":
            borderColor = Colors.PRIMARIES.WOR.WORSTRK;
            backgroundColor = Colors.PRIMARIES.WOR.WOR;
            textColor = Colors.BASIC.WHITE;
            break;
        case "HMM":
            borderColor = Colors.PRIMARIES.HMM.HMMSTRK;
            backgroundColor = Colors.PRIMARIES.HMM.HMM;
            textColor = Colors.BASIC.BLACK;
            break;
        case "DEFAULT":
            borderColor = Colors.MAIN.BLANDITEM.STRK;
            backgroundColor = Colors.MAIN.BLANDITEM.BACKGROUND;
            textColor = Colors.BASIC.WHITE;
            break;
        default:
            borderColor = Colors.MAIN.BLANDITEM.STRK;
            backgroundColor = Colors.MAIN.BLANDITEM.BACKGROUND;
            textColor = Colors.BASIC.WHITE;
            break;
    }

    switch (layout) {
        case "box":
            buttonWidth = 50;
            buttonHeight = 50;
            flexValue = 0;
            break;
        default:
        case "normal":
            flexValue = 1;
            break;
    }

    // on press "animation" (Not animated, but at least gives visual feedback)
    const [opacityVal, setOpacityVal] = useState(1);

    // Usamos estilos en línea ya que tienen un efecto pequeño pero positivo en el rendimiento final
    return (
        <Pressable
            onPress={action}
            onPressIn={() => setOpacityVal(0.8)}
            onPressOut={() => setOpacityVal(1)}
            style={{
                padding: 0,
                borderRadius: 10,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                borderWidth: 4,
                width: layout === "box" ? 55 : "100%",
                height: 55,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: flexValue,
                alignSelf: "stretch",
                opacity: opacityVal,
            }}
        >
            {children ? (
                <BetterText
                    fontWeight="Medium"
                    fontSize={14}
                    textColor={textColor}
                    textAlign="center"
                >
                    {String(children)}
                </BetterText>
            ) : (
                buttonText && (
                    <BetterText
                        fontWeight="Medium"
                        fontSize={14}
                        textColor={textColor}
                        textAlign="center"
                    >
                        {String(buttonText)}
                    </BetterText>
                )
            )}
        </Pressable>
    );
}
