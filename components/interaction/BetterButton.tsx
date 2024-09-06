// src/Buttons.tsx
// Buttons, botones, elementos presionables, ENTIDADES INTERACTIVAS UTILIZABLES POR MEDIO DE CLICS / TOCAMIENTOS DE LA PANTALLA xd

import React, { ReactElement, useState } from "react";
import { DimensionValue, Pressable, StyleSheet } from "react-native";
import BetterText from "@/components/text/BetterText";
import Colors from "@/constants/Colors";
import FontSizes from "@/constants/FontSizes";
import { PressableStyle } from "@/constants/ui/Pressables";

// TypeScript, supongo
interface ButtonProps {
    style: "ACE" | "GOD" | "WOR" | "HMM" | "DEFAULT";
    buttonText: string;
    action: () => void;
    layout?: "normal" | "box";
}

const styles = StyleSheet.create({
    button: {
        padding: 0,
        borderRadius: PressableStyle.borderRadius,
        borderWidth: PressableStyle.borderWidth,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",
    },
});

export default function BetterButton({
    style,
    buttonText,
    action,
    layout = "normal",
}: ButtonProps): ReactElement {
    let borderColor: string;
    let backgroundColor: string;
    let textColor: string;
    let buttonWidth: DimensionValue;
    let buttonHeight: DimensionValue;
    let flexValue: 0 | 1;

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
            buttonWidth = "100%";
            buttonHeight = PressableStyle.height;
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
            accessibilityRole="button"
            accessibilityLabel={buttonText}
            importantForAccessibility="yes"
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