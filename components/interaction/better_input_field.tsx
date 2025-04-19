/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/components/interaction/better_input_field.tsx
 * Basically: Better TextInput fields.
 *
 * <=============================================================================>
 */

import React, { ReactNode } from "react";
import { StyleSheet, TextInput } from "react-native";
import Colors from "@/constants/colors";
import { BetterTextSmallText } from "@/components/text/better_text_presets";
import { UniversalItemStyle } from "@/constants/ui/pressables";
import GapView from "@/components/ui/gap_view";
import BetterText from "../text/better_text";
import FontSizes from "@/constants/font_sizes";

const styles = StyleSheet.create({
    textInput: {
        borderRadius: UniversalItemStyle.borderRadius,
        padding: UniversalItemStyle.padding,
        borderWidth: UniversalItemStyle.borderWidth,
        width: "100%",
        color: Colors.BASIC.WHITE,
        fontFamily: "BeVietnamPro-Regular",
    },
});

/**
 * BetterInputFieldProps
 *
 * @interface BetterInputFieldProps
 */
interface BetterInputFieldProps {
    /** A short text to show before the input to give indications. */
    label: string;
    /** The placeholder of the input. */
    placeholder: string;
    /** The value of the input. Set it to a stateful value, e.g. `formData.username`. */
    value: string | number;
    /** The name of the input field. */
    name: string;
    /** The index of the input field, if you're using refs. Yes, you have to keep an incremental index. Set it to whatever (e.g. `0 `) if not using refs. */
    refIndex: number;
    /** Whether to use the normal keyboard or a numeric pad. */
    keyboardType: "default" | "numeric";
    /** Max length of the inputted text. */
    length: number;
    /** A void function that will call upon the text is changed. Current text value is accessible from here. */
    changeAction: (text: string) => void;
    /** If true the input field will be read only (non-editable). */
    readOnly: boolean;
    /** Used to auto-advance to the next input field in a screen upon submitting. */
    refParams: {
        /** Your useRef */
        inputRefs: { current: TextInput[] };
        /** Total amount of inputs. If you have 4 input fields, pass 4 here. **Don't do like JS (starting at 0 instead of 1).** */
        totalRefs: number;
    };
    /** Whether the value is valid or not. */
    isValid: boolean;
    /** A message to be shown for invalid values. */
    validatorMessage: string;
}

/**
 * Spawns an input field with the given parameters.
 *
 * @export
 * @param {BetterInputFieldProps} p
 * @param {string} p.label A short text to show before the input to give indications.
 * @param {string} p.placeholder The placeholder of the input.
 * @param {(string | number)} p.value The value of the input. Set it to a stateful value, e.g. `formData.username`.
 * @param {string} p.name The name of the input field.
 * @param {number} p.refIndex The index of the input field, if you're using refs. Yes, you have to keep an incremental index. Set it to whatever (e.g. `0 `) if not using refs.
 * @param {("default" | "numeric")} [p.keyboardType="default"] Whether to use the normal keyboard or a numeric pad.
 * @param {number} p.length Max length of the inputted text.
 * @param {(text: string) => void} p.changeAction A void function that will call upon the text is changed. Current text value is accessible from here.
 * @param {boolean} [p.readOnly=false] If true the input field will be read only (non-editable).
 * @param {{ inputRefs: { current: {}; }; totalRefs: number; }} p.refParams
 * @param {boolean} p.isValid Whether the value is valid or not.
 * @param {boolean} p.validatorMessage A message to be shown for invalid values.
 * @returns {ReactNode} Returns a Fragment with a `<BetterText>` (label), `<TextInput />`, and a `<GapView />` between them.
 */
export default function BetterInputField({
    label,
    placeholder,
    value,
    name,
    refIndex,
    keyboardType = "default",
    length,
    changeAction,
    readOnly = false,
    refParams,
    isValid = true,
    validatorMessage,
}: BetterInputFieldProps): ReactNode {
    /**
     * Focuses the next `<TextInput>` when the user presses the arrow / continue / next button on mobile keyboard.
     *
     * @param {number} index The **target** index - if your input has a `refIndex` of **2**, the *target* (this value) would be **3**. For `refIndex` see `spawnInputField()`.
     */
    function focusNextField(index: number): void {
        const inputRef: TextInput | undefined =
            refParams.inputRefs.current[index];
        if (!inputRef) return; // if no inputRef exists, we're at the point the returnKeyType should be "done", so the user won't be surprised to see the keyboard gone after this.
        inputRef.focus();
    }

    const nextFieldIndex: number = refIndex + 1;
    const returnKeyType: "done" | "next" =
        nextFieldIndex === refParams.totalRefs ? "done" : "next";

    return (
        <>
            <BetterTextSmallText>{label}</BetterTextSmallText>
            <GapView height={5} />
            <TextInput
                placeholder={placeholder}
                value={typeof value === "string" ? value : String(value)}
                placeholderTextColor={
                    isValid
                        ? Colors.MAIN.DEFAULT_ITEM.TEXT
                        : Colors.PRIMARIES.WOR.WOR
                }
                style={[
                    styles.textInput,
                    isValid
                        ? {
                              backgroundColor:
                                  Colors.MAIN.DEFAULT_ITEM.BACKGROUND,
                              borderColor: Colors.MAIN.DEFAULT_ITEM.STROKE,
                          }
                        : {
                              backgroundColor: Colors.PRIMARIES.WOR.WOR_STROKE,
                              borderColor: Colors.PRIMARIES.WOR.WOR,
                          },
                ]}
                autoCorrect={false}
                multiline={false}
                maxLength={length}
                textAlign="left"
                keyboardType={keyboardType}
                inputMode={keyboardType === "default" ? "text" : "numeric"}
                key={name}
                returnKeyType={returnKeyType}
                enterKeyHint={returnKeyType}
                onChangeText={(text: string): void => {
                    changeAction(text);
                }}
                onSubmitEditing={(): void => focusNextField(nextFieldIndex)}
                readOnly={readOnly}
                textContentType="none"
                ref={(ref: TextInput | null): TextInput | null =>
                    ref && (refParams.inputRefs.current[refIndex] = ref)
                }
            />
            {isValid === false && (
                <>
                    <GapView height={5} />
                    <BetterText
                        fontWeight="Regular"
                        textColor={Colors.PRIMARIES.WOR.WOR}
                        fontSize={FontSizes.SMALL}
                    >
                        {validatorMessage}
                    </BetterText>
                </>
            )}
        </>
    );
}
