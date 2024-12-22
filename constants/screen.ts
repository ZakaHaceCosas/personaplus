import { Dimensions } from "react-native";

/**
 * Returns the common screen size (width or height) for all pages. Uses RN's Dimensions API and automatically adds padding to ensure content is visible when using these values.
 *
 * @export
 * @param {("width" | "height")} request Whether you want the width or the height of the screen.
 * @returns {number} The common screen size
 */
export default function getCommonScreenSize(
    request: "width" | "height",
): number {
    const CommonWidth: number = Dimensions.get("screen").width - 40;
    const CommonHeight: number = Dimensions.get("screen").height - 40 - 20;
    /**
    explanation:
    Dimensions - 40 (because of the padding of 20 that's applied by _layout to all pages)
    then height has an additional - 20 to compensate the extra 20 of padding thats applied to the top
    */
    const returnWidth = request === "width" ? CommonWidth : CommonHeight;
    return returnWidth;
}
