/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/components/interaction/multi_select.tsx
 * Basically: A multiselect, to choose one or more options.
 *
 * <=============================================================================>
 */

import React, { ReactElement, useState } from "react";
import Colors from "@/constants/colors";
import { UniversalItemStyle } from "@/constants/ui/pressables";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { GetCommonScreenSize } from "@/constants/screen";
import BetterText from "../text/better_text";
import FontSizes from "@/constants/font_sizes";

/**
 * An option for a multiselect.
 *
 * @export
 * @interface MultiSelectOption
 * @typedef {MultiSelectOption}
 */
export interface MultiSelectOption {
    /**
     * The label the user sees.
     *
     * @type {string}
     */
    label: string;
    /**
     * The value the app works with. Make them unique, as they're used as the React `key` prop.
     *
     * @type {string}
     */
    value: string;
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: GetCommonScreenSize("width"),
    },
    option: {
        padding: UniversalItemStyle.padding,
        height: UniversalItemStyle.height,
        borderRadius: UniversalItemStyle.borderRadius,
        borderWidth: UniversalItemStyle.borderWidth,
        borderColor: Colors.MAIN.DEFAULT_ITEM.STROKE,
        backgroundColor: Colors.MAIN.DEFAULT_ITEM.BACKGROUND,
        width: "100%",
    },
    selectedOption: {
        backgroundColor: Colors.PRIMARIES.ACE.ACE,
        borderColor: Colors.PRIMARIES.ACE.ACE_STROKE,
    },
});

/**
 * A multiselect.
 *
 * @export
 * @param {{
 *     options: MultiSelectOption[];
 *     changeAction: (selectedValues: MultiSelectOption[]) => void;
 * }} p
 * @param {{}} p.options
 * @param {(selectedValues: {}) => void} p.changeAction
 * @returns {ReactElement}
 */
export default function MultiSelect({
    options,
    changeAction,
}: {
    options: MultiSelectOption[];
    changeAction: (selectedValues: MultiSelectOption[]) => void;
}): ReactElement {
    const [selected, setSelected] = useState<MultiSelectOption[]>([]);

    function toggleSelection(option: MultiSelectOption): void {
        const isSelected: boolean = selected.some(
            (item: MultiSelectOption): boolean => item.value === option.value,
        );

        let updatedSelection: MultiSelectOption[];
        if (isSelected) {
            updatedSelection = selected.filter(
                (item: MultiSelectOption): boolean =>
                    item.value !== option.value,
            );
        } else {
            updatedSelection = [...selected, option];
        }

        setSelected(updatedSelection);
        changeAction(updatedSelection);
    }

    return (
        <View style={styles.container}>
            {options.map((option: MultiSelectOption): ReactElement => {
                const isSelected: boolean = selected.some(
                    (item: MultiSelectOption): boolean =>
                        item.value === option.value,
                );
                return (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.option,
                            isSelected && styles.selectedOption,
                        ]}
                        onPress={(): void => toggleSelection(option)}
                    >
                        <BetterText
                            textAlign={"normal"}
                            fontSize={FontSizes.ALMOST_REGULAR}
                            fontWeight="SemiBold"
                            textColor={
                                isSelected
                                    ? Colors.BASIC.BLACK
                                    : Colors.BASIC.WHITE
                            }
                        >
                            {option.label}
                        </BetterText>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
