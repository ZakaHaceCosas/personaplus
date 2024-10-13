/**
 * A set of common, universal styles for pressable items, like buttons, swap elements, etc... Some "non-pressables" may use these styles as well, such as notification alerts.
 *
 * @interface UniversalPressableStyleProps
 * @typedef {UniversalPressableStyleProps}
 */
interface UniversalPressableStyleProps {
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
 * A set of common, universal styles for pressable items, like buttons, swap elements, etc... Some "non-pressables" may use these styles as well, such as notification alerts.
 *
 * @type {UniversalPressableStyleProps}
 */
export const UniversalPressableStyle: UniversalPressableStyleProps = {
    height: 55,
    borderRadius: 14,
    borderWidth: 4,
    padding: 15,
};
