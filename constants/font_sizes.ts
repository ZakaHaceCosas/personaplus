/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/constants/font_sizes.ts
 * Basically: An export of all font sizes, for consistency
 *
 * <=============================================================================>
 */

/**
 * Font Sizes object properties
 *
 * @interface FontSizesProps
 */
interface FontSizesProps {
    /**
     * A font size used for small texts.
     *
     * @type {number}
     */
    SMALL: number;
    /**
     * A font size used for texts that aren't "small" but aren't "big" either. Lower than REGULAR. Used for license texts.
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
     * A font size used for some texts. Between MEDIUM and REGULAR.
     *
     * @type {number}
     */
    ALMOST_REGULAR: number;
    /**
     * A font size used for large texts, like headings.
     *
     * @type {number}
     */
    LARGE: number;
    /**
     * A font size used for larger texts, like higher headings.
     *
     * @type {number}
     */
    LARGER: number;
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
    SMALL: 11,
    MEDIUM: 13,
    ALMOST_REGULAR: 14,
    REGULAR: 15,
    LARGE: 20,
    LARGER: 25,
    EXTRA_LARGE: 30,
};

export default FontSizes;
