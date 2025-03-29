/**
 * A type for colors. A string preceded with a `#` (HEX color).
 *
 * @export
 */
export type HexColorString = `#${string}`;

/**
 * Colors for the bottom navigation.
 *
 * @interface FooterColors
 */
interface FooterColors {
    /** Background for the bottom navigation */
    BACKGROUND: HexColorString;
    /** Non-selected footer items */
    FOOTER_UNS: HexColorString;
    /** Selected footer items */
    FOOTER_SEL: HexColorString;
}

/**
 * Bland, dimmed colors.
 *
 * @interface DefaultColors
 */
interface DefaultColors {
    /** Item background */
    BACKGROUND: HexColorString;
    /** Item text / placeholder */
    TEXT: HexColorString;
    /** Item stroke / border */
    STROKE: HexColorString;
}

/**
 * Core, brand colors.
 *
 * @interface MainColors
 */
interface MainColors {
    /** The very background of the app */
    APP: HexColorString;
    /** The background of sections */
    SECTION: HexColorString;
    /** Default background of divisions */
    DIVISION: HexColorString;
    /** In case of a floating division, the color of its border */
    DIVISION_BORDER: HexColorString;
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
    SHL: HexColorString;
    /** Small labels giving extra details */
    SDD: HexColorString;
    /** In a table, the row headers */
    TABLE_HEADER: HexColorString;
}

/**
 * ACE type core colors.
 *
 * @interface AceColors
 */
interface AceColors {
    /** Main color */
    ACE: HexColorString;
    /** Stroke color for ACE */
    ACE_STROKE: HexColorString;
    /** Special color used for sliders */
    // ACE_SCROLL: HexColorString;
}

/**
 * WOR type core colors.
 *
 * @interface WorColors
 */
interface WorColors {
    /** Main color */
    WOR: HexColorString;
    /** Stroke color for WOR */
    WOR_STROKE: HexColorString;
}

/**
 * HMM type core colors.
 *
 * @interface HmmColors
 */
interface HmmColors {
    /** Main color */
    HMM: HexColorString;
    /** Stroke color for HMM */
    HMM_STROKE: HexColorString;
}

/**
 * Primary colors.
 *
 * @interface PrimaryColors
 */
interface PrimaryColors {
    /** Accent color of the app and its branding. */
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
    BLACK: HexColorString;
    /** Pure white */
    WHITE: HexColorString;
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
export type PrimaryColorsType = "DEFAULT" | "ACE" | "WOR" | "HMM";

/**
 * All primary colors (their code-name) as a type. Omits `"DEFAULT"`.
 *
 * @export
 */
export type PrimaryColorsTypeBasic = Omit<PrimaryColorsType, "DEFAULT">;
