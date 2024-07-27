// colors.ts
// An export of all UI colors, for consistency

/**
 * All the colors used by PersonaPlus' interface
 *
 * @returns The selected color as a HEX string
 */

type Color = `#${string}`;

interface FooterColors {
    /** Background for the bottom navigation */
    BACKGROUND: Color;
    /** Non-selected footer items */
    FOOTERUNS: Color;
    /** Selected footer items */
    FOOTERSEL: Color;
}

interface BlandColors {
    /** Input background */
    BACKGROUND: Color;
    /** Input placeholder */
    PLACEHOLDER: Color;
    /** Input stroke / border */
    STRK: Color;
}

interface MainColors {
    /** The very background of the app */
    APP: Color;
    /** The background of sections */
    SECTION: Color;
    /** Default background of divisions */
    DIVISION: Color;
    /** Color for the bottom navigation */
    FOOTER: FooterColors;
    /** Colors for input elements */
    BLANDITEM: BlandColors;
}

interface LabelColors {
    /** Used for the title of sections */
    SHL: Color;
    /** Small labels giving extra details */
    SDD: Color;
    /** In a table, the row headers */
    TBLH: Color;
}

interface GodColors {
    /** Main color */
    GOD: Color;
    /** Stroke color for GOD */
    GODSTRK: Color;
}

interface AceColors {
    /** Main color */
    ACE: Color;
    /** Stroke color for ACE */
    ACESTRK: Color;
    /** Special color used for sliders */
    ACESCROLL: Color;
}

interface WorColors {
    /** Main color */
    WOR: Color;
    /** Stroke color for WOR */
    WORSTRK: Color;
}

interface HmmColors {
    /** Main color */
    HMM: Color;
    /** Stroke color for HMM */
    HMMSTRK: Color;
}

interface PrimaryColors {
    /** Accent color for branding, also used for positive elements and as an accent in some places */
    GOD: GodColors;
    /** Accent color of the app most of the time, also used in branding */
    ACE: AceColors;
    /** Color for bad / dangerous things */
    WOR: WorColors;
    /** Color for not bad, but not good things */
    HMM: HmmColors;
}

interface Colors {
    /** Main color palette */
    MAIN: MainColors;
    /** Colors for labels */
    LBLS: LabelColors;
    /** Primary colors */
    PRIMARIES: PrimaryColors;
}

const colors: Colors = {
    /** Main color palette */
    MAIN: {
        /** The very background of the app */
        APP: "#0E1013",
        /** The background of sections */
        SECTION: "#14171C",
        /** Default background of divisions */
        DIVISION: "#202328",
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

export default colors;
