// src/toolkit/design/spacing.ts
// An export of all spacing measures, for consistency

/**
 * Spacing object properties
 *
 * @interface SpacingProps
 * @typedef {SpacingProps}
 */
interface SpacingProps {
    /**
     * The small variant of the spacing unit.
     *
     * @type {number}
     */
    SMALL: number;
    /**
     * The regular variant of the spacing unit.
     *
     * @type {number}
     */
    REGULAR: number;
    /**
     * The large variant of the spacing unit.
     *
     * @type {number}
     */
    LARGE: number;
}

/**
 * A universal object with spacing values (as plain numbers) for keeping consistent spacing values.
 *
 * @type {SpacingProps}
 */
const spacing: SpacingProps = {
    SMALL: 5,
    REGULAR: 10,
    LARGE: 20,
};

export default spacing
