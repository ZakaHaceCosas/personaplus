/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/constants/screen.ts
 * Basically: A simple function to ensure the app stays responsive to all mobile screens.
 *
 * <=============================================================================>
 */

import { Dimensions } from "react-native";

/**
 * Returns the common screen size (width or height) for all pages. Uses RN's Dimensions API and automatically adds padding to ensure content is visible when using these values.
 *
 * @export
 * @param {("width" | "height")} request Whether you want the width or the height of the screen.
 * @returns {number} The common screen size
 */
export function GetCommonScreenSize(request: "width" | "height"): number {
    const CommonWidth: number = Dimensions.get("screen").width - 40;
    const CommonHeight: number = Dimensions.get("screen").height - 40 - 25;
    /**
    explanation:
    Dimensions - 40 (because of the padding of 20 that's applied by _layout to all pages)
    then height has an additional - 25 to compensate the extra 25 of padding thats applied to the top
    */
    const returnWidth = request === "width" ? CommonWidth : CommonHeight;
    return returnWidth;
}
