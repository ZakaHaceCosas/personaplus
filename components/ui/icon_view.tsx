import React, { ComponentProps, ReactElement } from "react";
import FontSizes from "@/constants/font_sizes";
import GapView from "./gap_view";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import { HexColorString } from "@/types/color";
import BetterText from "../text/better_text";

/**
 * Spawns an icon followed by a text.
 *
 * @export
 * @param {{
 *     name: ComponentProps<typeof Ionicons>["name"];
 *     size: number;
 *     color: HexColorString;
 *     text: string;
 * }} p
 * @param {ComponentProps<any>} p.name
 * @param {number} [p.size=FontSizes.REGULAR]
 * @param {HexColorString} [p.color="#FFF"]
 * @param {string} p.text
 * @returns {ReactElement}
 */
export default function IconView({
    name,
    size = FontSizes.REGULAR,
    color = "#FFF",
    text,
}: {
    name: ComponentProps<typeof Ionicons>["name"];
    size: number;
    color: HexColorString;
    text: string;
}): ReactElement {
    return (
        <>
            <Ionicons name={name} size={size} color={color} />
            <GapView width={5} />
            <BetterText
                fontSize={size}
                fontWeight="Regular"
                fontFamily="BeVietnamPro"
                textColor={color}
            >
                {text}
            </BetterText>
        </>
    );
}
