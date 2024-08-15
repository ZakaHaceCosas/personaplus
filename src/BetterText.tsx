// src/BetterText.tsx
// Text, con estilos apropiados y la tipografía Be Vietnam Pro

import React, { ReactNode, ReactElement } from "react";
import { TextStyle, Text } from "react-native";
import colors from "@/src/toolkit/design/colors";
import FontSizes from "@/src/toolkit/design/fontSizes";
import { FontWeights } from "@/src/types/FontWeights";

// TypeScript, supongo
/**
 * BetterTextProps interface
 *
 * @interface BetterTextProps
 * @typedef {BetterTextProps}
 */
interface BetterTextProps {
    /**
     * The size of the text in px. No default, required.
     *
     * @type {number}
     */
    fontSize: number; // Tamaño de letra en px
    /**
     * The weight of the text. No default, required. Some of them won't be supported in the case of `isSerif` being true.
     *
     * @type {(| "Light"
     *         | "LightItalic"
     *         | "ExtraLight"
     *         | "ExtraLightItalic"
     *         | "Thin"
     *         | "ThinItalic"
     *         | "Regular"
     *         | "Italic"
     *         | "Medium"
     *         | "MediumItalic"
     *         | "SemiBold"
     *         | "SemiBoldItalic"
     *         | "Bold"
     *         | "BoldItalic"
     *         | "ExtraBold"
     *         | "ExtraBoldItalic"
     *         | "Black"
     *         | "BlackItalic")}
     */
    fontWeight: FontWeights; // Intensidad de la tipografía
    /**
     * The color of the text, as a HEX string (e.g. colors.BASIC.WHITE, "#C8C8C8"). Defaults to white.
     *
     * @type {?string}
     */
    textColor?: string; // Color del texto - default: blanco (ya que el fondo es negro)
    /**
     * Whether to use the Noto Serif serif font. Defaults to false. Beware, as if you use `isSerif` with an incompatible `fontWeight` value you might stumble onto text not rendering properly.
     *
     * @type {?boolean}
     */
    isSerif?: boolean; // Whether to use Serif font or not
    /**
     * A void function that will be executed upon touching the text. Useful for URL links.
     *
     * @type {?() => void}
     */
    onTap?: () => void; // Si se proporciona, el texto actuará como un botón / enlace y hará algo
    /**
     * How to align the text. Defaults to "left". "left" and "center" are equivalent.
     *
     * @type {?("center" | "normal" | "left" | "right")}
     */
    textAlign?: "center" | "normal" | "left" | "right"; // Alineación del texto
    /**
     * The text to be rendered. You can also pass other `<BetterText>` to act as "spans" with separate styles, kinda like `<span>` in HTML5.
     *
     * @type {ReactNode}
     */
    children: ReactNode; // Texto en sí, dentro del tag <BeText>
    /**
     * If true, the text will be styled as a URL (underline and color, basically).
     *
     * @type {?boolean}
     */
    url?: boolean; // Si es verdadero el texto se estilizará como un enlace externo - default: false
}

// We create the function
/**
 * Homemade text component
 *
 * @export
 * @param {BetterTextProps} param0
 * @param {number} param0.fontSize
 * @param {("Light" | "LightItalic" | "ExtraLight" | "ExtraLightItalic" | "Thin" | "ThinItalic" | "Regular" | "Italic" | "Medium" | "MediumItalic" | "SemiBold" | "SemiBoldItalic" | "Bold" | ... 4 more ... | "BlackItalic")} param0.fontWeight
 * @param {ReactNode} param0.children
 * @param {string} param0.textColor
 * @param {("center" | "normal" | "left" | "right")} param0.textAlign
 * @param {() => void} param0.onTap
 * @param {boolean} param0.isSerif
 * @param {boolean} param0.url
 * @returns {ReactElement}
 */
export default function BetterText({
    fontSize,
    fontWeight,
    children,
    textColor = colors.BASIC.WHITE,
    textAlign = "normal",
    onTap,
    isSerif = false,
    url = false,
}: BetterTextProps): ReactElement {
    const fontprefix: string = isSerif ? "NotoSerif-" : "BeVietnamPro-";
    const font: string = `${fontprefix}${fontWeight}`;
    const lineheight: number = fontSize + 0.5; // La altura de línea es igual al tamaño de letra (+ 0.5 para arreglar el texto viendose "recortado")
    const color: string = textColor || colors.BASIC.WHITE; // Si el color no se especifica, es blanco
    const textalignment: "center" | "right" | "left" =
        textAlign === "center"
            ? "center"
            : textAlign === "right"
              ? "right"
              : textAlign === "normal" || textAlign === "left"
                ? "left"
                : "left";
    const textdecoration: "underline" | "none" = url ? "underline" : "none";

    const textStyle: TextStyle = {
        fontFamily: font,
        fontSize: fontSize,
        lineHeight: lineheight,
        color: color,
        textAlign: textalignment,
        textDecorationLine: textdecoration,
        textDecorationColor: color,
        textDecorationStyle: "solid",
        padding: 1.25, // This fixes text not looking properly
    };

    return (
        <Text style={textStyle} {...(onTap ? { onPress: onTap } : {})}>
            {children}
        </Text>
    );
}

/**
 * A pre-made **header**, based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered header component.
 */
export function BetterTextHeader({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            textAlign="normal"
            fontWeight="Bold"
            fontSize={FontSizes.EXTRA_LARGE}
        >
            {children}
        </BetterText>
    );
}

/**
 * A pre-made **subheader**, based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered subheader component.
 */
export function BetterTextSubHeader({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            textAlign="normal"
            fontWeight="Medium"
            fontSize={FontSizes.LARGE}
        >
            {children}
        </BetterText>
    );
}

/**
 * A pre-made **extra** (larger than `SubHeader` but smaller than `Header`), based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered `ExtraHeader` component.
 */
export function BetterTextExtraHeader({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            textAlign="normal"
            fontWeight="Medium"
            fontSize={FontSizes.LARGER}
        >
            {children}
        </BetterText>
    );
}

/**
 * A pre-made **small text** (or **small header**), based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered subheader component.
 */
export function BetterTextSmallText({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            textAlign="normal"
            fontWeight="Regular"
            fontSize={12}
            textColor={colors.LBLS.SDD}
        >
            {children}
        </BetterText>
    );
}

/**
 * A pre-made **text** (for the **license page ONLY**), based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered subheader component.
 */
export function BetterTextLicenseText({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            textAlign="normal"
            fontWeight="Regular"
            isSerif={true}
            fontSize={FontSizes.MEDIUM}
        >
            {children}
        </BetterText>
    );
}

/**
 * A pre-made **header** (for the **license page ONLY**), based on `<BetterText>` and with default styles for design consistency.
 *
 * @export
 * @param {{ children: ReactNode }} props - The props object.
 * @param {ReactNode} props.children - The text you want to display. You can also pass other `<BetterText>` components to act as "spans" with separate styles, similar to `<span>` in HTML5.
 * @returns {ReactElement} The rendered subheader component.
 */
export function BetterTextLicenseHeader({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <BetterText
            textAlign="normal"
            fontWeight="Regular"
            isSerif={true}
            fontSize={FontSizes.REGULAR}
        >
            {children}
        </BetterText>
    );
}
