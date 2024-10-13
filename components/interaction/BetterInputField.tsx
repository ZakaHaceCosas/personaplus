import GapView from "@/components/ui/GapView";
import { TextInput, StyleSheet } from "react-native";
import { ReactNode } from "react";
import Colors from "@/constants/Colors";
import { BetterTextSmallText } from "@/components/text/BetterTextPresets";
import { UniversalPressableStyle } from "@/constants/ui/Pressables";
import { logToConsole } from "@/toolkit/debug/Console";

const styles = StyleSheet.create({
    textInput: {
        backgroundColor: Colors.MAIN.DEFAULT_ITEM.BACKGROUND,
        borderRadius: UniversalPressableStyle.borderRadius,
        padding: UniversalPressableStyle.padding,
        borderWidth: UniversalPressableStyle.borderWidth,
        borderColor: Colors.MAIN.DEFAULT_ITEM.STROKE,
        width: "100%",
        color: Colors.BASIC.WHITE,
        fontFamily: "BeVietnamPro-Regular",
    },
});

interface BetterInputFieldProps {
    label: string;
    placeholder: string;
    value: string | number;
    name: string;
    refIndex: number;
    nextFieldIndex: number;
    keyboardType?: "default" | "numeric";
    length: number;
    changeAction: (text: string) => void;
    inputRefs: { current: TextInput[] };
}

/**
 * Spawns an input field with the given parameters.
 *
 * @param {string} label A short text to show before the input to give indications.
 * @param {string} placeholder The placeholder of the input.
 * @param {string | number} value The value of the input. Set it to a stateful value, e.g. `formData.username`.
 * @param {string} name The name of the property / stateful value it's linked to, e.g. `username` for `formData.username`.
 * @param {number} refIndex It's index. _yes, you have to count all the calls the `spawnInputField` can keep an incremental index_.
 * @param {number} nextFieldIndex `refIndex` + 1, basically.
 * @param {("default" | "numeric")} [keyboardType="default"] Whether to use the normal keyboard or a numeric pad.
 * @param {number} length Max length of the input.
 * @returns {ReactNode} Returns a Fragment with a `<BetterText>` (label), `<TextInput />`, and a `<GapView />` between them.
 */
export default function BetterInputField({
    label,
    placeholder,
    value,
    name,
    refIndex,
    nextFieldIndex,
    keyboardType = "default",
    length,
    changeAction,
    inputRefs,
}: BetterInputFieldProps): ReactNode {
    /**
     * Focuses the next `<TextInput>` when the user presses the arrow / continue / next button on mobile keyboard.
     *
     * @param {number} index The **target** index - if your input has a `refIndex` of **2**, the *target* (this value) would be **3**. For `refIndex` see `spawnInputField()`.
     */
    function focusNextField(index: number): void {
        const inputRef = inputRefs.current[index];
        if (inputRef) {
            inputRef.focus();
        } else {
            logToConsole("No inputRef.", "warn");
        }
    }

    return (
        <>
            <BetterTextSmallText>{label}</BetterTextSmallText>
            <GapView height={5} />
            <TextInput
                placeholder={placeholder}
                value={typeof value === "string" ? value : String(value)}
                placeholderTextColor={Colors.MAIN.DEFAULT_ITEM.TEXT}
                style={styles.textInput}
                autoCorrect={false}
                multiline={false}
                maxLength={length}
                textAlign="left"
                keyboardType={keyboardType}
                key={`${name}input`}
                returnKeyType={nextFieldIndex === 4 ? "done" : "next"}
                onChangeText={changeAction}
                onSubmitEditing={() => focusNextField(nextFieldIndex)}
                ref={(ref) => ref && (inputRefs.current[refIndex] = ref)}
            />
        </>
    );
}
