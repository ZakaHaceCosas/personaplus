import Colors from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { TFunction } from "i18next";
import { StyleSheet, TextStyle } from "react-native";

const styles = StyleSheet.create({
    picker: {
        padding: 10,
        width: "100%",
        backgroundColor: Colors.MAIN.BLANDITEM.BACKGROUND,
        borderColor: Colors.MAIN.BLANDITEM.STRK,
        borderWidth: 2,
        borderRadius: 10,
        color: Colors.BASIC.WHITE,
        fontFamily: "BeVietnamPro-Regular",
    } as TextStyle,
});

/**
 * An option for a Select.
 *
 * @interface SelectOption
 * @typedef {SelectOption}
 */
interface SelectOption {
    /**
     * Its label. It is what the user sees as the option.
     *
     * @type {string}
     */
    label: string;
    /**
     * Its value. It is what the code sees as the option. Do not set it to `""` for a default / null option, that's already done by default.
     *
     * @type {string}
     */
    value: string;
    /**
     * Whether it is enabled or not. Defaults to `true`.
     *
     * @type {boolean}
     */
    enabled: boolean;
}

/**
 * SelectProps
 *
 * @interface SelectProps
 * @typedef {SelectProps}
 */
interface SelectProps {
    /**
     * Whether it's a regular dropdown or a modal dialog.
     *
     * @type {("dropdown" | "dialog")}
     */
    mode: "dropdown" | "dialog";
    /**
     * In case of `mode` being `"dialog"`, the title of the modal.
     *
     * @type {string}
     */
    dialogPrompt?: string;
    /**
     * A `void` that will be called upon the user choosing an option.
     *
     * @type {(itemValue: string | number) => void}
     */
    changeAction: (itemValue: string | number) => void;
    /**
     * The Select's current value. Recommended to set it to a stateful value, so it can be updated using `changeAction`.
     *
     * @type {(number | string)}
     */
    currentValue: number | string;
    /**
     * An array of options.
     *
     * @type {SelectOption[]}
     */
    selectOptions: SelectOption[];
    /**
     * Pass the translate function here, please.
     *
     * @type {TFunction}
     */
    t: TFunction;
}

/**
 * A homemade Select component (AKA dropdown / modal with options to choose). In the end it's just `@react-native-picker` with everything setup to avoid code duplication (and a name that in my opinion makes more sense). *Due to React's Rules of Hooks, you need to manually pass the `t`(translate) function as a param.*
 *
 * @export
 * @param {SelectProps} param0
 * @param {("dropdown" | "dialog")} param0.mode
 * @param {string} param0.dialogPrompt
 * @param {(itemValue: string | number) => void} param0.changeAction
 * @param {(string | number)} param0.currentValue
 * @param {{}} param0.selectOptions
 * @param {TFunction} param0.t
 * @returns {*}
 */
export default function Select({
    mode,
    dialogPrompt,
    changeAction,
    currentValue,
    selectOptions,
    t,
}: SelectProps) {
    return (
        <Picker
            enabled={true}
            mode={mode}
            dropdownIconColor={Colors.BASIC.WHITE}
            dropdownIconRippleColor={Colors.BASIC.WHITE}
            prompt={dialogPrompt}
            numberOfLines={2}
            onValueChange={changeAction}
            selectedValue={currentValue}
            style={styles.picker}
        >
            <Picker.Item
                key={
                    "__PERSONAPLUS_SELECT__EMPTY_VALUE__DO_NOT_REMOVE_OR_YOU_WILL_BE_FIRED"
                } // learning from react, heh~
                label={t("globals.interaction.chooseAnOption")}
                value=""
                fontFamily="BeVietnamPro-Regular"
                enabled={true}
                color={Colors.MAIN.BLANDITEM.PLACEHOLDER}
                style={{
                    backgroundColor: Colors.MAIN.BLANDITEM.BACKGROUND,
                }}
            />
            {selectOptions.map((option) => (
                <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    fontFamily="BeVietnamPro-Regular"
                    enabled={option.enabled}
                    color={Colors.BASIC.WHITE}
                    style={{
                        backgroundColor: Colors.MAIN.BLANDITEM.BACKGROUND,
                    }}
                />
            ))}
        </Picker>
    );
}
