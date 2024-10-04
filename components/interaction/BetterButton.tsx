// src/Buttons.tsx
// Buttons, botones, elementos presionables, ENTIDADES INTERACTIVAS UTILIZABLES POR MEDIO DE CLICS / TOCAMIENTOS DE LA PANTALLA xd

import React, { ReactElement, useState } from "react";
import { DimensionValue, Pressable, StyleSheet } from "react-native";
import BetterText from "@/components/text/BetterText";
import Colors from "@/constants/Colors";
import FontSizes from "@/constants/FontSizes";
import { UniversalPressableStyle } from "@/constants/ui/Pressables";

// TypeScript, supongo
/**
 * BetterButtonProperties
 *
 * @interface BetterButtonProps
 * @typedef {BetterButtonProps}
 */
interface BetterButtonProps {
    /**
     * The color style of the button.
     *
     * @type {("ACE" | "GOD" | "WOR" | "HMM" | "DEFAULT")}
     */
    style: "ACE" | "GOD" | "WOR" | "HMM" | "DEFAULT";
    /**
     * The text of the button.
     *
     * @type {string}
     */
    buttonText: string;
    /**
     * A hint, explaining in detail what is the button supposed to do. Use it for accessibility purposes.
     *
     * @type {string}
     */
    buttonHint: string;
    /**
     * A function. The action the button will perform.
     *
     * @type {() => void}
     */
    action: () => void;
    /**
     * Whether it's a normal button or a box (50x50) button.
     *
     * @type {?("normal" | "box")}
     */
    layout?: "normal" | "box";
}

const styles = StyleSheet.create({
    button: {
        padding: 0,
        borderRadius: UniversalPressableStyle.borderRadius,
        borderWidth: UniversalPressableStyle.borderWidth,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",
    },
});

/**
 * A UI button. Keep in mind it's self closed.
 *
 * @export
 * @param {BetterButtonProps} p
 * @param {("ACE" | "GOD" | "WOR" | "HMM" | "DEFAULT")} p.style The color style of the button.
 * @param {string} p.buttonText The text of the button.
 * @param {() => void} p.action A function. The action the button will perform.
 * @param {("normal" | "box")} [p.layout="normal"] Whether it's a normal button or a box (50x50) button.
 * @param {string} p.buttonHint A hint, explaining in detail what is the button supposed to do. Use it for accessibility purposes.
 * @returns {ReactElement} The button.
 */
export default function BetterButton({
    style,
    buttonText,
    action,
    layout = "normal",
    buttonHint,
}: BetterButtonProps): ReactElement {
    let borderColor: string;
    let backgroundColor: string;
    let textColor: string;
    let buttonWidth: DimensionValue;
    let buttonHeight: DimensionValue;
    let flexValue: 0 | 1;

    switch (style) {
        case "ACE":
            borderColor = Colors.PRIMARIES.ACE.ACE_STROKE;
            backgroundColor = Colors.PRIMARIES.ACE.ACE;
            textColor = Colors.BASIC.WHITE;
            break;
        case "GOD":
            borderColor = Colors.PRIMARIES.GOD.GOD_STROKE;
            backgroundColor = Colors.PRIMARIES.GOD.GOD;
            textColor = Colors.BASIC.BLACK;
            break;
        case "WOR":
            borderColor = Colors.PRIMARIES.WOR.WOR_STROKE;
            backgroundColor = Colors.PRIMARIES.WOR.WOR;
            textColor = Colors.BASIC.WHITE;
            break;
        case "HMM":
            borderColor = Colors.PRIMARIES.HMM.HMM_STROKE;
            backgroundColor = Colors.PRIMARIES.HMM.HMM;
            textColor = Colors.BASIC.BLACK;
            break;
        case "DEFAULT":
        default:
            borderColor = Colors.MAIN.DEFAULT_ITEM.STROKE;
            backgroundColor = Colors.MAIN.DEFAULT_ITEM.BACKGROUND;
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
            buttonWidth = "100%";
            buttonHeight = UniversalPressableStyle.height;
            flexValue = 1;
            break;
    }

    // on press "animation" (Not animated, but at least gives visual feedback)
    const [opacityValue, setOpacityValue] = useState(1);

    return (
        <Pressable
            onPress={action}
            onPressIn={() => setOpacityValue(0.75)}
            onPressOut={() => setOpacityValue(1)}
            style={[
                styles.button,
                {
                    opacity: opacityValue,
                    flexShrink: flexValue,
                    width: buttonWidth,
                    height: buttonHeight,
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                },
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={buttonText}
            accessibilityHint={buttonHint}
            importantForAccessibility="yes"
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
            <BetterText
                fontWeight="Medium"
                fontSize={FontSizes.ALMOST_REGULAR}
                textColor={textColor}
                textAlign="center"
            >
                {buttonText}
            </BetterText>
        </Pressable>
    );
}
