import React, { useState, useEffect, ReactElement } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import BetterText from "@/components/text/BetterText";
import Colors from "@/constants/Colors";
import getCommonScreenSize from "@/constants/Screen";
import FontSizes from "@/constants/FontSizes";
import { UniversalItemStyle } from "@/constants/ui/Pressables";
import { logToConsole } from "@/toolkit/debug/Console";

interface Option {
    value: string | null; // null for invalid values
    label: string;
    default: boolean;
}

interface SwapProps {
    options: Option[];
    value: string | null;
    order: "horizontal" | "vertical";
    onValueChange: (value: string | null) => void;
    style?: "ACE" | "GOD";
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: getCommonScreenSize("width"),
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

export default function Swap({
    options,
    value,
    order,
    onValueChange,
    style = "ACE",
}: SwapProps): ReactElement {
    const defaultOption: Option | undefined = options.find(
        (option): boolean => option.default,
    );

    if (!defaultOption) {
        logToConsole(
            "A default option for Swap elements is highly recommended. Bugs can happen otherwise.",
            "warn",
        );
    }

    const [selectedOption, setSelectedOption] = useState<Option | null>(
        value
            ? options.find((option) => option.value === value) || null
            : defaultOption || null,
    );

    useEffect((): void => {
        if (value && selectedOption?.value !== value) {
            const newSelectedOption = options.find(
                (option) => option.value === value,
            );
            if (newSelectedOption) {
                setSelectedOption(newSelectedOption);
            }
        }
    }, [value, options, selectedOption]);

    const handleOptionPress: (option: Option) => void = (
        option: Option,
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
            {options.map((option: Option) => (
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
                                    ? style === "ACE"
                                        ? Colors.PRIMARIES.ACE.ACE
                                        : Colors.PRIMARIES.GOD.GOD
                                    : Colors.MAIN.DEFAULT_ITEM.BACKGROUND,
                            borderColor:
                                selectedOption?.value === option.value
                                    ? style === "ACE"
                                        ? Colors.PRIMARIES.ACE.ACE_STROKE
                                        : Colors.PRIMARIES.GOD.GOD_STROKE
                                    : Colors.MAIN.DEFAULT_ITEM.STROKE,
                        },
                    ]}
                    accessibilityLabel={option.label}
                    onPress={(): void => handleOptionPress(option)}
                >
                    <BetterText
                        textAlign={order === "horizontal" ? "center" : "left"}
                        fontSize={FontSizes.ALMOST_REGULAR}
                        fontWeight="SemiBold"
                        textColor={
                            style === "ACE"
                                ? Colors.BASIC.WHITE
                                : selectedOption?.value === option.value
                                  ? Colors.BASIC.BLACK
                                  : Colors.BASIC.WHITE
                        }
                    >
                        {option.label}
                    </BetterText>
                </Pressable>
            ))}
        </View>
    );
}
