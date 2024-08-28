/**
 * Universal styles for pressable items like Buttons, Swaps, etc...
 *
 * @interface UniversalPressableStyle
 * @typedef {UniversalPressableStyle}
 */
interface UniversalPressableStyle {
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
    borderRadius: 10,
    /**
     * The border width (AKA how big the border is). `4`.
     *
     * @type {4}
     */
    borderWidth: 4
}

/**
 * Description placeholder
 *
 * @type {UniversalPressableStyle}
 */
export const PressableStyle: UniversalPressableStyle = {
    height: 55,
    borderRadius: 10,
    borderWidth: 4,
}
