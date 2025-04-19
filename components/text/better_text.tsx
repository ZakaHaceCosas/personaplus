/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/components/text/BetterText.tsx
 * Basically: `<Text>`, with preconfigured styling and fonts for usage within the app.
 *
 * <=============================================================================>
 */

import React, { ReactElement, ReactNode } from "react";
import { Text, TextStyle } from "react-native";
import Colors from "@/constants/colors";
import { FontFamily, FontWeight } from "@/types/font_weights";

// TypeScript, supongo
/**
 * BetterTextProps
 *
 * @interface BetterTextProps
 * @template {FontFamily} [T="BeVietnamPro"]
 */
interface BetterTextProps<T extends FontFamily = "BeVietnamPro"> {
    /**
     * Font family. Defaults to BeVietnamPro. Only BeVietnamPro and JetBrains Mono are supported.
     *
     * @type {?T}
     */
    fontFamily?: T;
    /**
     * Font size in px.
     *
     * @type {number}
     */
    fontSize: number;
    /**
     * Font weight. Can be "Regular", "Bold", etc...
     *
     * @type {FontWeight<T>}
     */
    fontWeight: FontWeight<T>;
    /**
     * Text color. Optional, defaults to pure white.
     *
     * @type {?string}
     */
    textColor?: string;
    /**
     * Optional, if passed, it will become the text's onTap.
     *
     * @type {?() => void}
     */
    onTap?: () => void;
    /**
     * Optional, aligns the text. Defaults to `"normal"`, which is equal to `"left"`.
     *
     * @type {?("center" | "normal" | "left" | "right")}
     */
    textAlign?: "center" | "normal" | "left" | "right";
    /**
     * The text itself, inside the `<BetterText>` tag. You can also pass other stuff, like another `<BetterText>` to act like a `<span>` would act like in HTML.
     *
     * @type {ReactNode}
     */
    children: ReactNode;
    /**
     * Optional, if true, text will be styled as if it was a clickable link.
     *
     * @type {?boolean}
     */
    isLink?: boolean;
}

/**
 * A homemade text component with all needed props preconfigured.
 *
 * @export
 * @template {FontFamily} [T="BeVietnamPro"]
 * @param {BetterTextProps<T>} p
 * @param {T} [p.fontFamily="BeVietnamPro" as T]
 * @param {number} p.fontSize
 * @param {FontWeight<T>} p.fontWeight
 * @param {ReactNode} p.children
 * @param {string} [p.textColor=Colors.BASIC.WHITE]
 * @param {("center" | "normal" | "left" | "right")} [p.textAlign="normal"]
 * @param {() => void} p.onTap
 * @param {boolean} [p.isLink=false]
 * @returns {ReactElement}
 */
export default function BetterText<T extends FontFamily = "BeVietnamPro">({
    fontFamily = "BeVietnamPro" as T,
    fontSize,
    fontWeight,
    children,
    textColor = Colors.BASIC.WHITE,
    textAlign = "normal",
    onTap,
    isLink = false,
}: BetterTextProps<T>): ReactElement {
    const fontFamilyName: string = `${fontFamily}-${fontWeight}`;
    const color: string = textColor || Colors.BASIC.WHITE;
    const alignment: "center" | "right" | "left" =
        textAlign === "center"
            ? "center"
            : textAlign === "right"
              ? "right"
              : textAlign === "normal" || textAlign === "left"
                ? "left"
                : "left";
    const decoration: "underline" | "none" = isLink ? "underline" : "none";

    const textStyle: TextStyle = {
        fontFamily: fontFamilyName,
        fontSize: fontSize,
        lineHeight: fontSize * 1.3,
        overflow: "visible",
        color: isLink ? Colors.PRIMARIES.ACE.ACE : color,
        textAlign: alignment,
        textDecorationLine: decoration,
        textDecorationColor: color,
        textDecorationStyle: "solid",
    };

    return (
        <Text style={textStyle} {...(onTap ? { onPress: onTap } : {})}>
            {children}
        </Text>
    );
}
