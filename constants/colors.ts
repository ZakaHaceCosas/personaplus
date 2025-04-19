/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/constants/colors.ts
 * Basically: An export of all UI colors, for consistency
 *
 * <=============================================================================>
 */

import { ColorsObject } from "@/types/color";

/**
 * All the colors used by PersonaPlus, in a HEX (`#123456`) format. They are grouped by categories and theme aware.
 *
 * @type {ColorsObject}
 * @returns The selected color as a HEX string
 */
const Colors: ColorsObject = {
    /** Black & white. Use them as a variable, as the app plans to add theming. */
    BASIC: {
        /** Pure black */
        BLACK: "#000000",
        /** Pure white */
        WHITE: "#FFFFFF",
    },
    /** Main color palette */
    MAIN: {
        /** The very background of the app */
        APP: "#0E1013",
        /** The background of sections */
        SECTION: "#14171C",
        /** Default background of divisions */
        DIVISION: "#202328",
        /** In case of a floating division, the color of its border */
        DIVISION_BORDER: "#26282B",
        FOOTER: {
            /** Background for the bottom navigation */
            BACKGROUND: "#16191E",
            /** Non-selected footer items */
            FOOTER_UNS: "#7A7C7E",
            /** Selected footer items */
            FOOTER_SEL: "#FFFFFF",
        },
        DEFAULT_ITEM: {
            /** Item background */
            BACKGROUND: "#2A2D32",
            /** Item text / placeholder */
            TEXT: "#949698",
            /** Item stroke / border */
            STROKE: "#3E4146",
        },
    },
    /** Colors for labels */
    LABELS: {
        /** Used for the title of sections */
        SHL: "#DDDDDD",
        /** Small labels giving extra details */
        SDD: "#C8C8C8",
        /** In a table, the row headers */
        TABLE_HEADER: "#8D8E91",
    },
    /** Primary colors */
    PRIMARIES: {
        ACE: {
            // I'm testing full blue & full green. GREEN:
            /** Main color */
            ACE: "#32FF80",
            /** Stroke color for ACE */
            ACE_STROKE: "#198040",
            /** Main color */
            // ACE: "#3280FF",
            /** Stroke color for ACE */
            // ACE_STROKE: "#194080",
            /** Special color used for sliders */
            // ACE_SCROLL: "#2A61BB",
        },
        WOR: {
            /** Main color */
            WOR: "#FF3232",
            /** Stroke color for WOR */
            WOR_STROKE: "#801919",
        },
        HMM: {
            /** Main color */
            HMM: "#FFC832",
            /** Stroke color for HMM */
            HMM_STROKE: "#806419",
        },
    },
};

export default Colors;
