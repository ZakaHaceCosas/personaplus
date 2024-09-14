/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/constants/Colors.ts
 * Basically: An export of all UI colors, for consistency
 *
 * <=============================================================================>
 */

import { ColorsObject } from "@/types/Color";

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
        WHITE: "#FFFFFF"
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
        DIVISIONBORDER: "#26282B",
        FOOTER: {
            /** Background for the bottom navigation */
            BACKGROUND: "#16191E",
            /** Non-selected footer items */
            FOOTERUNS: "#8A8C8E",
            /** Selected footer items */
            FOOTERSEL: "#FFFFFF"
        },
        BLANDITEM: {
            /** Input background */
            BACKGROUND: "#2A2D32",
            /** Input placeholder */
            PLACEHOLDER: "#949698",
            /** Input stroke / border */
            STRK: "#3E4146"
        }
    },
    /** Colors for labels */
    LBLS: {
        /** Used for the title of sections */
        SHL: "#DDDDDD",
        /** Small labels giving extra details */
        SDD: "#C8C8C8",
        /** In a table, the row headers */
        TBLH: "#8D8E91"
    },
    /** Primary colors */
    PRIMARIES: {
        GOD: {
            /** Main color */
            GOD: "#32FF80",
            /** Stroke color for GOD */
            GODSTRK: "#198040"
        },
        ACE: {
            /** Main color */
            ACE: "#3280FF",
            /** Stroke color for ACE */
            ACESTRK: "#194080",
            /** Special color used for sliders */
            ACESCROLL: "#2A61BB"
        },
        WOR: {
            /** Main color */
            WOR: "#FF3232",
            /** Stroke color for WOR */
            WORSTRK: "#801919"
        },
        HMM: {
            /** Main color */
            HMM: "#FFC832",
            /** Stroke color for HMM */
            HMMSTRK: "#806419"
        }
    }
};

export default Colors
