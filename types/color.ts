/**
 * A type for colors. A string preceded with a `#` (HEX color).
 *
 * @export
 */
export type Color = `#${string}`;

/**
 * Colors for the bottom navigation.
 *
 * @interface FooterColors
 */
interface FooterColors {
    /** Background for the bottom navigation */
    BACKGROUND: Color;
    /** Non-selected footer items */
    FOOTER_UNS: Color;
    /** Selected footer items */
    FOOTER_SEL: Color;
}

/**
 * Bland, dimmed colors.
 *
 * @interface DefaultColors
 */
interface DefaultColors {
    /** Item background */
    BACKGROUND: Color;
    /** Item text / placeholder */
    TEXT: Color;
    /** Item stroke / border */
    STROKE: Color;
}

/**
 * Core, brand colors.
 *
 * @interface MainColors
 */
interface MainColors {
    /** The very background of the app */
    APP: Color;
    /** The background of sections */
    SECTION: Color;
    /** Default background of divisions */
    DIVISION: Color;
    /** In case of a floating division, the color of its border */
    DIVISION_BORDER: Color;
    /** Color for the bottom navigation */
    FOOTER: FooterColors;
    /** Colors for "default" elements, like inputs, secondary buttons, etc... */
    DEFAULT_ITEM: DefaultColors;
}

/**
 * Colors for labels and texts that aren't white.
 *
 * @interface LabelColors
 */
interface LabelColors {
    /** Used for the title of sections */
    SHL: Color;
    /** Small labels giving extra details */
    SDD: Color;
    /** In a table, the row headers */
    TABLE_HEADER: Color;
}

/**
 * GOD type core colors.
 *
 * @interface GodColors
 */
interface GodColors {
    /** Main color */
    GOD: Color;
    /** Stroke color for GOD */
    GOD_STROKE: Color;
}

/**
 * ACE type core colors.
 *
 * @interface AceColors
 */
interface AceColors {
    /** Main color */
    ACE: Color;
    /** Stroke color for ACE */
    ACE_STROKE: Color;
    /** Special color used for sliders */
    ACE_SCROLL: Color;
}

/**
 * WOR type core colors.
 *
 * @interface WorColors
 */
interface WorColors {
    /** Main color */
    WOR: Color;
    /** Stroke color for WOR */
    WOR_STROKE: Color;
}

/**
 * HMM type core colors.
 *
 * @interface HmmColors
 */
interface HmmColors {
    /** Main color */
    HMM: Color;
    /** Stroke color for HMM */
    HMM_STROKE: Color;
}

/**
 * Primary colors.
 *
 * @interface PrimaryColors
 */
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

/**
 * Basic black and white.
 *
 * @interface BasicColors
 */
interface BasicColors {
    /** Pure black */
    BLACK: Color;
    /** Pure white */
    WHITE: Color;
}

/**
 * All the colors used by PersonaPlus.
 *
 * @interface ColorsObject
 * @returns The selected color as a HEX string
 */
export interface ColorsObject {
    /** Main color palette */
    MAIN: MainColors;
    /** Colors for labels */
    LABELS: LabelColors;
    /** Primary colors */
    PRIMARIES: PrimaryColors;
    /** Black & white. Use them as a variable, as the app plans to add theming. */
    BASIC: BasicColors;
}

/**
 * All primary colors (their code-name) as a type.
 *
 * @export
 */
export type PrimaryColorsType = "DEFAULT" | "ACE" | "GOD" | "WOR" | "HMM";

/**
 * All primary colors (their code-name) as a type. Omits `"DEFAULT"`.
 *
 * @export
 */
export type PrimaryColorsTypeBasic = Omit<PrimaryColorsType, "DEFAULT">;
