// Swap.tsx
// BetterSwitches (porque un "switch", en teoría hace "swap").

import * as React from "react";
import * as Native from "react-native";
import BeText from "./Text";
import GapView from "./GapView";

// TypeScript, supongo
interface Option {
    value: string;
    label: string;
    default?: boolean;
}

// TypeScript, supongo
interface BeSwapProps {
    id: string; // Para identificar cada BeSwap
    options: Option[]; // Opciones
    value?: string | any; // Para establecer el valor programáticamente (tipo "any" porque puede ser una variable)
    onValueChange?: (value: string) => void; // Para obtener el valor seleccionado
}

const styles = Native.StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    sub: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "calc(50% + 2.5px)" as Native.DimensionValue,
    },
    optionButton: {
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 28,
        paddingRight: 28,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: "#3E4146",
        backgroundColor: "#2A2D32",
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    selectedButton: {
        borderColor: "#194080",
        backgroundColor: "#3280FF",
    },
});

export default function BeSwap({
    id,
    options,
    value,
    onValueChange,
}: BeSwapProps) {
    const defaultOption = options.find((option) => option.default);
    const [selectedOption, setSelectedOption] = React.useState<Option | null>(
        value
            ? options.find((option) => option.value === value) || null
            : defaultOption || null
    );

    React.useEffect(() => {
        if (value) {
            const newSelectedOption = options.find(
                (option) => option.value === value
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

    return (
        <Native.View style={styles.container} key={id}>
            {options.map((option, index) => (
                <Native.View style={styles.sub} key={`${id}-${index}`}>
                    <Native.Pressable
                        style={[
                            styles.optionButton,
                            selectedOption === option && styles.selectedButton,
                        ]}
                        onPress={() => handleOptionPress(option)}
                    >
                        <BeText size={14} align="center" weight="Bold">
                            {option.label}
                        </BeText>
                    </Native.Pressable>
                    <GapView key={`${id}-${index}-gap`} width={10} />
                </Native.View>
            ))}
        </Native.View>
    );
}
