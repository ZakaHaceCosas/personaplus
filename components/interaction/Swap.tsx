import React, { useState, useEffect, ReactElement } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import BetterText from "@/components/text/BetterText";
import Colors from "@/constants/Colors";
import getCommonScreenSize from "@/constants/Screen";
import FontSizes from "@/constants/FontSizes";
import { UniversalPressableStyle } from "@/constants/ui/Pressables";

interface Option {
    value: string;
    label: string;
    default: boolean;
}

interface SwapProps {
    options: Option[];
    value: string | null;
    order: "horizontal" | "vertical";
    onValueChange: (value: string) => void;
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
        borderRadius: UniversalPressableStyle.borderRadius,
        borderWidth: UniversalPressableStyle.borderWidth,
        borderColor: Colors.MAIN.BLANDITEM.STRK,
        backgroundColor: Colors.MAIN.BLANDITEM.BACKGROUND,
        display: "flex",
        justifyContent: "center",
        alignSelf: "stretch",
        paddingTop: 0,
        paddingBottom: 0,
    },
    selectedSwapOption: {
        borderColor: Colors.PRIMARIES.ACE.ACESTRK,
        backgroundColor: Colors.PRIMARIES.ACE.ACE,
    },
});

export default function Swap({
    options,
    value,
    order,
    onValueChange,
}: SwapProps): ReactElement {
    const defaultOption = options.find((option) => option.default);

    const [selectedOption, setSelectedOption] = useState<Option | null>(
        value
            ? options.find((option) => option.value === value) || null
            : defaultOption || null
    );

    useEffect(() => {
        if (value && selectedOption?.value !== value) {
            const newSelectedOption = options.find(
                (option) => option.value === value
            );
            if (newSelectedOption) {
                setSelectedOption(newSelectedOption);
            }
        }
    }, [value, options, selectedOption]);

    const handleOptionPress = (option: Option) => {
        if (selectedOption !== option) {
            setSelectedOption(option);
            if (onValueChange) {
                onValueChange(option.value);
            }
        }
    };

    const orderString = order === "horizontal" ? "row" : "column";

    return (
        <View style={[styles.container, { flexDirection: orderString }]}>
            {options.map((option) => (
                <Pressable
                    key={option.value}
                    style={[
                        {
                            ...styles.swapOption,
                            height: order === "vertical" ? 65 : 55,
                            paddingRight: order === "vertical" ? 10 : 0,
                            paddingLeft: order === "vertical" ? 10 : 0,
                            alignItems:
                                order === "horizontal"
                                    ? "center"
                                    : "flex-start",
                        },
                        selectedOption?.value === option.value &&
                            styles.selectedSwapOption,
                    ]}
                    accessibilityLabel={option.label}
                    onPress={() => handleOptionPress(option)}
                >
                    <BetterText
                        textAlign={order === "horizontal" ? "center" : "left"}
                        fontSize={FontSizes.ALMOST_REGULAR}
                        fontWeight="SemiBold"
                    >
                        {option.label}
                    </BetterText>
                </Pressable>
            ))}
        </View>
    );
}
