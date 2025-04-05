import React, { ReactElement, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import BetterText from "@/components/text/better_text";
import Colors from "@/constants/colors";
import { GetCommonScreenSize } from "@/constants/screen";
import FontSizes from "@/constants/font_sizes";
import { UniversalItemStyle } from "@/constants/ui/pressables";

/**
 * SwapOption
 *
 * @export
 * @interface SwapOption
 */
export interface SwapOption {
    /**
     * The value of the option.
     *
     * @type {(string | null)}
     */
    value: string | null;
    /**
     * The text it will display.
     *
     * @type {string}
     */
    label: string;
    /**
     * Whether it's the default option. We recommend having one. Having more than one will break stuff.
     *
     * @type {boolean}
     */
    default: boolean;
}

/**
 * SwapProps
 *
 * @interface SwapProps
 */
interface SwapProps {
    /**
     * An array of `SwapOption`s.
     *
     * @type {SwapOption[]}
     */
    options: SwapOption[];
    /**
     * Currently selected value (`options.WHATEVER_IS_SELECTED.value` to be precise).
     *
     * @type {(string | null)}
     */
    value: string | null;
    /**
     * On what order it should be displayed.
     *
     * @type {("horizontal" | "vertical")}
     */
    order: "horizontal" | "vertical";
    /**
     * A function that will be called upon changing the value. Passes the value that has been selected so you can use it.
     *
     * @type {(value: string | null) => void}
     */
    onValueChange: (value: string | null) => void;
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: GetCommonScreenSize("width"),
        gap: 10,
    },
    swapOption: {
        flexShrink: 1,
        width: "100%",
        borderRadius: UniversalItemStyle.borderRadius,
        borderWidth: UniversalItemStyle.borderWidth,
        borderColor: Colors.MAIN.DEFAULT_ITEM.STROKE,
        backgroundColor: Colors.MAIN.DEFAULT_ITEM.BACKGROUND,
        display: "flex",
        justifyContent: "center",
        alignSelf: "stretch",
        paddingTop: 0,
        paddingBottom: 0,
    },
});

/**
 * A swap / select / multiple options / whatever you want to call it.
 *
 * @export
 * @param {SwapProps} p
 * @param {SwapOption[]} p.options
 * @param {string} p.value
 * @param {("horizontal" | "vertical")} p.order
 * @param {(value: string) => void} p.onValueChange
 * @returns {ReactElement}
 */
export default function Swap({
    options,
    value,
    order,
    onValueChange,
}: SwapProps): ReactElement {
    const defaultOption: SwapOption | undefined = options.find(
        (option: SwapOption): boolean => option.default,
    );

    const [selectedOption, setSelectedOption] = useState<SwapOption | null>(
        value
            ? options.find(
                  (option: SwapOption): boolean => option.value === value,
              ) || null
            : defaultOption || null,
    );

    useEffect((): void => {
        if (value && selectedOption?.value !== value) {
            const newSelectedOption: SwapOption | undefined = options.find(
                (option: SwapOption): boolean => option.value === value,
            );
            if (newSelectedOption) {
                setSelectedOption(newSelectedOption);
            }
        }
    }, [value, options, selectedOption]);

    const handleOptionPress: (option: SwapOption) => void = (
        option: SwapOption,
    ): void => {
        if (selectedOption !== option) {
            setSelectedOption(option);
            if (onValueChange) {
                onValueChange(option.value);
            }
        }
    };

    const orderString: "row" | "column" =
        order === "horizontal" ? "row" : "column";

    return (
        <View style={[styles.container, { flexDirection: orderString }]}>
            {options.map(
                (option: SwapOption): ReactElement => (
                    <Pressable
                        key={option.value}
                        style={[
                            styles.swapOption,
                            {
                                height: order === "vertical" ? 65 : 55,
                                paddingRight: order === "vertical" ? 10 : 0,
                                paddingLeft: order === "vertical" ? 10 : 0,
                                alignItems:
                                    order === "horizontal"
                                        ? "center"
                                        : "flex-start",
                                backgroundColor:
                                    selectedOption?.value === option.value
                                        ? Colors.PRIMARIES.ACE.ACE
                                        : Colors.MAIN.DEFAULT_ITEM.BACKGROUND,
                                borderColor:
                                    selectedOption?.value === option.value
                                        ? Colors.PRIMARIES.ACE.ACE_STROKE
                                        : Colors.MAIN.DEFAULT_ITEM.STROKE,
                            },
                        ]}
                        accessibilityLabel={option.label}
                        onPress={(): void => handleOptionPress(option)}
                    >
                        <BetterText
                            textAlign={
                                order === "horizontal" ? "center" : "left"
                            }
                            fontSize={FontSizes.ALMOST_REGULAR}
                            fontWeight="SemiBold"
                            textColor={
                                selectedOption?.value === option.value
                                    ? Colors.BASIC.BLACK
                                    : Colors.BASIC.WHITE
                            }
                        >
                            {option.label}
                        </BetterText>
                    </Pressable>
                ),
            )}
        </View>
    );
}
