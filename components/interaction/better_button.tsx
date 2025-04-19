/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/components/interaction/better_button.tsx
 * Basically: Buttons, botones, elementos presionables, ENTIDADES INTERACTIVAS UTILIZABLES POR MEDIO DE CLICS / TOCAMIENTOS DE LA PANTALLA xd
 *
 * <=============================================================================>
 */

import React, { ReactElement, useState } from "react";
import { DimensionValue, Pressable, StyleSheet } from "react-native";
import BetterText from "@/components/text/better_text";
import Colors from "@/constants/colors";
import FontSizes from "@/constants/font_sizes";
import { UniversalItemStyle } from "@/constants/ui/pressables";
import { HexColorString, PrimaryColorsType } from "@/types/color";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/components/ui/gap_view";

// TypeScript, supongo
interface BetterButtonIcon {
    /** Name of the icon. */
    name: "pause" | "play-arrow" | "exit-to-app";
    /** Size in px. */
    size: number;
    /** Icon color. */
    color: HexColorString;
}

/**
 * BetterButtonProperties
 *
 * @interface BetterButtonProps
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
    /** Optionally, add an icon to the button. */
    icon?: BetterButtonIcon;
}

const styles = StyleSheet.create({
    button: {
        padding: 5,
        borderRadius: UniversalItemStyle.borderRadius,
        borderWidth: UniversalItemStyle.borderWidth,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",
        height: UniversalItemStyle.height,
    },
});

/**
 * A UI button. Keep in mind it's self closed.
 *
 * @export
 * @param {BetterButtonProps} p
 * @param {PrimaryColorsType} [p.style="DEFAULT"] The color style of the button.
 * @param {string} p.buttonText The text of the button.
 * @param {() => any | Promise<any>} p.action A function. The action the button will perform.
 * @param {("normal" | "box")} [p.layout="normal"] Whether it's a normal button or a box (50x50) button.
 * @param {string} p.buttonHint A hint, explaining in detail what is the button supposed to do. Use it for accessibility purposes.
 * @param {BetterButtonIcon} p.icon An icon, in case you wanted to use one.
 * @returns {ReactElement} The button.
 */
export default function BetterButton({
    style = "DEFAULT",
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
    let flexValue: 0 | 1;

    switch (style) {
        case "ACE":
            borderColor = Colors.PRIMARIES.ACE.ACE_STROKE;
            backgroundColor = Colors.PRIMARIES.ACE.ACE;
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
            borderColor = Colors.MAIN.DEFAULT_ITEM.STROKE;
            backgroundColor = Colors.MAIN.DEFAULT_ITEM.BACKGROUND;
            textColor = Colors.BASIC.WHITE;
            break;
    }

    switch (layout) {
        case "box":
            buttonWidth = UniversalItemStyle.height;
            flexValue = 0;
            break;
        case "normal":
            buttonWidth = "100%";
            flexValue = 1;
            break;
    }

    // on press "animation" (Not animated, but at least gives visual feedback)
    const [opacityValue, setOpacityValue] = useState(1);

    return (
        <Pressable
            onPress={async (): Promise<void> => {
                try {
                    // always await, so we correctly handle both sync and async stuff
                    await Promise.resolve(action());
                } catch (e) {
                    console.error(`Error handling a button press: ${e}.`, {
                        location:
                            "Unknown. This happened on the 'onPress' prop of a <BetterButton /> you have somewhere. Use context to find out where it happened.",
                        function:
                            "Whatever you passed to some <BetterButton />",
                        isHandler: true,
                    });
                }
            }}
            onPressIn={(): void => {
                setOpacityValue(0.5);
            }}
            onPressOut={(): void => {
                setOpacityValue(1);
            }}
            style={[
                styles.button,
                {
                    opacity: opacityValue,
                    flexShrink: flexValue,
                    width: buttonWidth,
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
                <>
                    <Ionicons
                        name={icon.name}
                        size={icon.size}
                        color={icon.color}
                    />
                    <GapView width={1} />
                </>
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
