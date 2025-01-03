import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Colors from "@/constants/colors";
import getCommonScreenSize from "@/constants/screen";

interface IslandDivisionProps {
    alignment: "center" | "start";
    direction: "horizontal" | "vertical";
    children: ReactNode;
}

const styles = StyleSheet.create({
    island: {
        display: "flex",
        flexDirection: "row",
        padding: 15,
        backgroundColor: Colors.MAIN.SECTION,
        borderRadius: 15,
        alignItems: "center",
        width: getCommonScreenSize("width"),
    },
});

export default function IslandDivision({
    children,
    alignment,
    direction,
}: IslandDivisionProps) {
    return (
        <View
            style={[
                styles.island,
                {
                    justifyContent:
                        alignment === "center" ? "center" : "flex-start",
                    flexDirection:
                        direction === "horizontal" ? "row" : "column",
                },
            ]}
        >
            {children}
        </View>
    );
}
