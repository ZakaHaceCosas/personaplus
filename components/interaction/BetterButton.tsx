/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/components/interaction/BetterButton.tsx
 * Basically: Buttons, botones, elementos presionables, ENTIDADES INTERACTIVAS UTILIZABLES POR MEDIO DE CLICS / TOCAMIENTOS DE LA PANTALLA xd
 *
 * <=============================================================================>
 */

import React, { ReactElement, useState } from "react";
import { DimensionValue, Pressable, StyleSheet } from "react-native";
import BetterText from "@/components/text/BetterText";
import Colors from "@/constants/Colors";
import FontSizes from "@/constants/FontSizes";
import { UniversalItemStyle } from "@/constants/ui/Pressables";
import { Color, PrimaryColorsType } from "@/types/Color";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import { logToConsole } from "@/toolkit/debug/Console";

// TypeScript, supongo
interface BetterButtonIcon {
    name: string;
    size: number;
    color: Color;
}

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
     * @type {PrimaryColorsType}
     */
    style: PrimaryColorsType;
    /**
     * The text of the button.
     *
     * @type {string | null}
     */
    buttonText: string | null;
    /**
     * A hint, explaining in detail what is the button supposed to do. Use it for accessibility purposes.
     *
     * @type {string}
     */
    buttonHint: string;
    /**
     * A function. The action the button will perform.
     *
     * @type {() => any | Promise<any>}
     */
    action: () => any | Promise<any>;
    /**
     * Whether it's a normal button or a box (50x50) button.
     *
     * @type {?("normal" | "box")}
     */
    layout?: "normal" | "box";
    icon?: BetterButtonIcon;
}

const styles = StyleSheet.create({
    button: {
        padding: 0,
        borderRadius: UniversalItemStyle.borderRadius,
        borderWidth: UniversalItemStyle.borderWidth,
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
 * @param {PrimaryColorsType} p.style The color style of the button.
 * @param {string | null} p.buttonText The text of the button.
 * @param {() => void | Promise<void>} p.action A function. The action the button will perform.
 * @param {("normal" | "box")} [p.layout="normal"] Whether it's a normal button or a box (50x50) button.
 * @param {BetterButtonIcon} p.icon An icon, in case you wanted to use one.
 * @param {string} p.buttonHint A hint, explaining in detail what is the button supposed to do. Use it for accessibility purposes.
 * @returns {ReactElement} The button.
 */
export default function BetterButton({
    style,
    buttonText,
    action,
    layout = "normal",
    buttonHint,
    icon,
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
            buttonHeight = UniversalItemStyle.height;
            flexValue = 1;
            break;
    }

    // on press "animation" (Not animated, but at least gives visual feedback)
    const [opacityValue, setOpacityValue] = useState(1);

    return (
        <Pressable
            onPress={async () => {
                try {
                    // always await, so we correctly handle both sync and async stuff
                    await Promise.resolve(action());
                } catch (e) {
                    await logToConsole(
                        `Error handling a button press: ${e}.`,
                        "error",
                        {
                            location:
                                "Unknown. This happened on the 'onPress' prop of a <BetterButton /> you have somewhere. Use context to find out where it happened.",
                            function:
                                "Whatever you passed to some <BetterButton />",
                            isHandler: true,
                        },
                    );
                }
            }}
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
            accessibilityLabel={buttonText ?? icon?.name ?? buttonHint}
            accessibilityHint={buttonHint}
            importantForAccessibility="yes"
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
            {icon && (
                <Ionicons
                    // @ts-expect-error It's because of a simple type error. Nothing's actually wrong.
                    name={icon.name}
                    size={icon.size}
                    color={icon.color}
                />
            )}
            {buttonText && (
                <BetterText
                    fontWeight="Medium"
                    fontSize={FontSizes.ALMOST_REGULAR}
                    textColor={textColor}
                    textAlign="center"
                >
                    {buttonText}
                </BetterText>
            )}
        </Pressable>
    );
}
