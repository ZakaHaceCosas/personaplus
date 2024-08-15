// src/toolkit/design/fontSizes.ts
// An export of all font sizes, for consistency

/**
 * Font Sizes object properties
 *
 * @interface FontSizesProps
 * @typedef {FontSizesProps}
 */
interface FontSizesProps {
    /**
     * A font size used for small texts.
     *
     * @type {number}
     */
    SMALL: number;
    /**
     * A font size used for texts that aren't "small" but aren't "big" either. Lower than regular. Used for license texts.
     *
     * @type {number}
     */
    MEDIUM: number;
    /**
     * A font size used for most texts.
     *
     * @type {number}
     */
    REGULAR: number;
    /**
     * A font size used for large texts, like headings.
     *
     * @type {number}
     */
    LARGE: number;
    /**
     * A font size used for the largest heading of a page.
     *
     * @type {number}
     */
    EXTRA_LARGE: number;
}

/**
 * A universal object with font size values (as plain numbers) for keeping consistent font sizes.
 *
 * @type {FontSizesProps}
 */
const FontSizes: FontSizesProps = {
    SMALL: 12,
    MEDIUM: 13,
    REGULAR: 15,
    LARGE: 20,
    EXTRA_LARGE: 30,
};

export default FontSizes
