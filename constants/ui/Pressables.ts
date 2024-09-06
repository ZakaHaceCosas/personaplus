/**
 * A set of common, universal styles for pressable items, like buttons, swap elements, etc... Some "non-pressables" may use these styles as well, such as notification alerts.
 *
 * @interface UniversalPressableStyleProps
 * @typedef {UniversalPressableStyleProps}
 */
interface UniversalPressableStyleProps {
    /**
     * The height. `55`.
     *
     * @type {55}
     */
    height: 55,
    /**
     * The border radius (AKA how round it is). `10`.
     *
     * @type {10}
     */
    borderRadius: 14,
    /**
     * The border width (AKA how big the border is). `4`.
     *
     * @type {4}
     */
    borderWidth: 4
    padding: 15
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
}
