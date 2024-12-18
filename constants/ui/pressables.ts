/**
 * A set of common, universal styles for different items, like buttons, swap elements, notification alerts, etc...
 *
 * @interface UniversalItemStyleProps
 */
interface UniversalItemStyleProps {
    /**
     * The height.
     *
     * @type {number}
     */
    height: number;
    /**
     * The border radius (AKA how round it is).
     *
     * @type {number}
     */
    borderRadius: number;
    /**
     * The border width (AKA how big the border is).
     *
     * @type {number}
     */
    borderWidth: number;
    /**
     * The padding (AKA how much inner-space in pixels exists from the actual content to the item's borders).
     *
     * @type {number}
     */
    padding: number;
}

/**
 * A set of common, universal styles for different items, like buttons, swap elements, notification alerts, etc...
 *
 * @type {UniversalItemStyleProps}
 */
export const UniversalItemStyle: UniversalItemStyleProps = {
    height: 55,
    borderRadius: 14,
    borderWidth: 4,
    padding: 15,
};
