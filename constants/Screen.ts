import { Dimensions } from "react-native";

export default function getCommonScreenSize(
    request: "width" | "height",
): number {
    const CommonWidth = Dimensions.get("screen").width - 40;
    const CommonHeight = Dimensions.get("screen").height - 40 - 20;
    /*
    explanation:
    Dimensions - 40 (because of the padding of 20 that's applied by _layout to all pages)
    then height has an additional - 20 to compensate the extra 20 of padding thats applied to the top
    */

    return request === "width" ? CommonWidth : CommonHeight;
}
