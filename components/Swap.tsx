// Swap.tsx
// BetterSwitches (porque un "switch", en teoría hace "swap").

import * as React from "react";
import * as Native from "react-native";
import BeText from "@/components/Text";
import GapView from "@/components/GapView";

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
    value?: string | number | null; // Para establecer el valor programáticamente
    // (reemplazado tipo "any" con number y null para mas seguridad)
    order: "horizontal" | "vertical"; // Basicamente, flex row o flex column? Orden horizontal o vertical?
    onValueChange?: (value: string) => void; // Para obtener el valor seleccionado
}

const styles = Native.StyleSheet.create({
    optionButton: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 15,
        paddingLeft: 15,
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
    order,
    onValueChange,
}: BeSwapProps) {
    const defaultOption = options.find(option => option.default);
    const [selectedOption, setSelectedOption] = React.useState<Option | null>(
        value
            ? options.find(option => option.value === value) || null
            : defaultOption || null
    );

    React.useEffect(() => {
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

    let orderString: "row" | "column" | "row-reverse" | "column-reverse" =
        "row";

    if (order === "horizontal") {
        orderString = "column";
    } else if (order === "vertical") {
        orderString = "row";
    }

    return (
        <Native.View
            style={{
                flexDirection: orderString,
                justifyContent: "space-between",
                width: "100%",
            }}
            key={id}
        >
            {options.map((option, index) => (
                <Native.View
                    key={`${id}-${index}`}
                    style={{
                        width:
                            orderString === "row"
                                ? ("calc(50% + 2.5px)" as Native.DimensionValue)
                                : ("calc(100% + 2.5px)" as Native.DimensionValue),
                    }}
                >
                    <Native.View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Native.Pressable
                            style={[
                                styles.optionButton,
                                selectedOption === option &&
                                    styles.selectedButton,
                            ]}
                            onPress={() => handleOptionPress(option)}
                        >
                            <Native.View
                                style={{
                                    display: "flex",
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems:
                                        orderString === "row"
                                            ? "center"
                                            : "flex-start",
                                }}
                            >
                                <BeText
                                    size={15}
                                    align={
                                        orderString === "row"
                                            ? "center"
                                            : "normal"
                                    }
                                    weight="SemiBold"
                                >
                                    {option.label}
                                </BeText>
                            </Native.View>
                        </Native.Pressable>
                        {orderString === "row" && (
                            <GapView key={`${id}-${index}-gap`} width={10} />
                        )}
                    </Native.View>
                    {orderString === "column" && (
                        <GapView key={`${id}-${index}-gap`} height={10} />
                    )}
                </Native.View>
            ))}
        </Native.View>
    );
}
