import Colors from "@/constants/colors";
import { Picker } from "@react-native-picker/picker";
import { TFunction } from "i18next";
import { ReactElement } from "react";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    picker: {
        width: "100%",
        backgroundColor: Colors.MAIN.DEFAULT_ITEM.BACKGROUND,
        borderColor: Colors.MAIN.DEFAULT_ITEM.STROKE,
        borderWidth: 2,
        borderRadius: 10,
        color: Colors.BASIC.WHITE,
        fontFamily: "BeVietnamPro-Regular",
    },
    background: {
        backgroundColor: Colors.MAIN.DEFAULT_ITEM.BACKGROUND,
    },
});

/**
 * An option for a Select.
 *
 * @interface SelectOption
 */
export interface SelectOption {
    /**
     * Its label. It is what the user sees as the option.
     *
     * @type {string}
     */
    label: string;
    /**
     * Its value. It is what the code sees as the option. Do not set it to `""` for a default / null option, that's already done by default.
     *
     * @type {string | number}
     */
    value: string | number;
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
    dialogPrompt: string;
    /**
     * A `(value) => void` that will be called upon the user choosing an option. Should set it to the updater of a stateful value, so it can update the value using `currentValue`.
     *
     * @type {(itemValue: string | number) => void}
     */
    changeAction: (itemValue: string | number) => void;
    /**
     * The Select's current value. Should set it to a stateful value, so it can be updated using `changeAction`.
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
 * @param {SelectProps} p
 * @param {("dropdown" | "dialog")} p.mode
 * @param {string} p.dialogPrompt
 * @param {(itemValue: string | number) => void} p.changeAction
 * @param {(string | number)} p.currentValue
 * @param {SelectOption[]} p.selectOptions
 * @param {TFunction} p.t
 * @returns {ReactElement}
 */
export default function Select({
    mode,
    dialogPrompt,
    changeAction,
    currentValue,
    selectOptions,
    t,
}: SelectProps): ReactElement {
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
                key={"SELECT_EMPTY_ITEM"}
                label={t("globals.interaction.chooseAnOption")}
                value=""
                fontFamily="BeVietnamPro-Regular"
                enabled={true}
                color={Colors.MAIN.DEFAULT_ITEM.TEXT}
                style={styles.background}
            />
            {selectOptions.map(
                (option: SelectOption): ReactElement => (
                    <Picker.Item
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        fontFamily="BeVietnamPro-Regular"
                        enabled={option.enabled}
                        color={Colors.BASIC.WHITE}
                        style={styles.background}
                    />
                ),
            )}
        </Picker>
    );
}
