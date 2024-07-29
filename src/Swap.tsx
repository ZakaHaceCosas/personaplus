// src/Swap.tsx
// BetterSwitches (porque un "switch", en teoría hace "swap").

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import BetterText from "@/src/BetterText";
import colors from "./toolkit/design/colors";

// TypeScript, supongo
/**
 * Option interface
 *
 * @interface Option
 * @typedef {Option}
 */
interface Option {
    /**
     * The value of the option, a string that can be used by your code.
     *
     * @type {string}
     */
    value: string;
    /**
     * The label of the option, the text that will be shown the user.
     *
     * @type {string}
     */
    label: string;
    /**
     * Whether this option should be the default one of the Swap.
     *
     * @type {?boolean}
     */
    default?: boolean;
}

// TypeScript, supongo
/**
 * SwapProps interface
 *
 * @interface SwapProps
 * @typedef {SwapProps}
 */
interface SwapProps {
    /**
     * A custom `id` to differentiate this Swap from other Swaps.
     *
     * @type {string}
     */
    id: string; // Para identificar cada BeSwap
    /**
     * An object of options.
     *
     * @type {Option[]}
     */
    options: Option[]; // Opciones
    /**
     * The current selected value. Defaults to the `default` Option. It can be used to set the value progamatically.
     *
     * @type {?(string | number | null)}
     */
    value?: string | number | null; // Para establecer el valor programáticamente
    // (reemplazado tipo "any" con number y null para mas seguridad)
    /**
     * Whether the swap should display items horizontally (flex-row) or vertically (flex-column)
     *
     * @type {("horizontal" | "vertical")}
     */
    order: "horizontal" | "vertical"; // Basicamente, flex row o flex column? Orden horizontal o vertical?
    /**
     * A void function to interact with the event caused by the user chaning the option. Can be used to gather the currently selected value.
     *
     * @type {?(value: string) => void}
     */
    onValueChange?: (value: string) => void; // Para obtener el valor seleccionado
}

/**
 * Homemade swap component. Basically, it's pretty similar to a select component.
 *
 * @type {*}
 */
const styles = StyleSheet.create({
    optionButton: {
        paddingLeft: 10,
        paddingRight: 10,
        flexGrow: 1,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: colors.MAIN.BLANDITEM.STRK,
        backgroundColor: colors.MAIN.BLANDITEM.BACKGROUND,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 55,
    },
    selectedButton: {
        borderColor: colors.PRIMARIES.ACE.ACESTRK,
        backgroundColor: colors.PRIMARIES.ACE.ACE,
    },
});

/**
 * Homemade swap component. Basically, it's pretty similar to a select component.
 *
 * @export
 * @param {SwapProps} param0
 * @param {string} param0.id
 * @param {{}} param0.options
 * @param {(string | number)} param0.value
 * @param {("horizontal" | "vertical")} param0.order
 * @param {(value: string) => void} param0.onValueChange
 * @returns {*}
 */
export default function Swap({
    id,
    options,
    value,
    order,
    onValueChange,
}: SwapProps) {
    const defaultOption = options.find(option => option.default);
    const [selectedOption, setSelectedOption] = useState<Option | null>(
        value
            ? options.find(option => option.value === value) || null
            : defaultOption || null
    );

    useEffect(() => {
        if (value) {
            const newSelectedOption = options.find(
                option => option.value === value
            );
            if (newSelectedOption) {
                setSelectedOption(newSelectedOption);
            }
        }
    }, [value, options]);

    const handleOptionPress = (option: Option) => {
        if (selectedOption !== option) {
            setSelectedOption(option);
            if (onValueChange) {
                onValueChange(option.value);
            }
        }
    };

    const orderString: "row" | "column" | "row-reverse" | "column-reverse" =
        order === "horizontal" ? "column" : "row";

    return (
        <View
            style={{
                display: "flex",
                flexDirection: orderString,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                gap: 10,
            }}
        >
            {options.map((option, index) => (
                <Pressable
                    key={`${id}-${index}`}
                    style={[
                        styles.optionButton,
                        selectedOption === option && styles.selectedButton,
                    ]}
                    accessibilityLabel={option.label}
                    onPress={() => handleOptionPress(option)}
                >
                    <View
                        style={{
                            display: "flex",
                            flex: 1,
                            justifyContent: "center",
                            alignItems:
                                orderString === "row" ? "center" : "flex-start",
                        }}
                    >
                        <BetterText
                            fontSize={15}
                            textAlign={
                                orderString === "row" ? "center" : "normal"
                            }
                            fontWeight="SemiBold"
                        >
                            {option.label}
                        </BetterText>
                    </View>
                </Pressable>
            ))}
        </View>
    );
}
