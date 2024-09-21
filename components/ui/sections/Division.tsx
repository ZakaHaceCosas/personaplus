import React, { ReactElement, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import BetterText from "@/components/text/BetterText";
import {
    BetterTextExtraHeader,
    BetterTextSmallText,
} from "@/components/text/BetterTextPresets";
import GapView from "@/components/ui/GapView";
import Colors from "@/constants/Colors";
import FontSizes from "@/constants/FontSizes";
import Ionicons from "@expo/vector-icons/MaterialIcons";

// TypeScript, supongo

/**
 * All icons that can be used for Divisions.
 *
 * @typedef {icon}
 */
type icon = "fastfood" | "sports-score" | "trending-down" | "trending-up";

/**
 * DivisionProps
 *
 * @interface DivisionProps
 * @typedef {DivisionProps}
 */
interface DivisionProps {
    /**
     * Name of the big icon. Unused for now.
     *
     * @type {?(icon | null)}
     */
    iconName?: icon | null; // Si lo tiene, ¿Cuál es?
    /**
     * An optional smaller text before the header.
     *
     * @type {?string}
     */
    preHeader?: string; // Título
    /**
     * The big, main text of the division.
     *
     * @type {string}
     */
    header: string; // Texto grande
    /**
     * An optional small text below the header.
     *
     * @type {?string}
     */
    subHeader?: string; // El texto pequeño, de haberlo
    /**
     * A JSX element you can add inside of the division. Optional.
     *
     * @type {?ReactNode}
     */
    children?: ReactNode; // Los hijos (botones, básicamente)
}

const styles = StyleSheet.create({
    division: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        width: "100%",
        maxWidth: "100%", // borderRadius fix.
    },
    filledView: {
        width: "100%",
    },
    iconContainer: {
        width: 50,
        height: 50,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: 0,
    },
    childView: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        gap: 10,
    },
});

// We create the function

/**
 * **A PersonaPlus division.**
 *
 * The PersonaPlus UI operates on a Section-Division basis, with Divisions containing most of the actions and features.
 *
 * @export
 * @see [Docs](https://github.com/ZakaHaceCosas/personaplus/blob/main/DOCS.md)
 * @param {DivisionProps} p
 * @param {icon} p.iconName An optional smaller text before the header.
 * @param {string} p.preHeader An optional smaller text before the header.
 * @param {string} p.header The big, main text of the Division.
 * @param {string} p.subHeader An optional small text below the header.
 * @param {ReactNode} p.children Optional children for the Division.
 * @returns {ReactElement}
 */
export default function Division({
    iconName,
    preHeader,
    header,
    subHeader,
    children,
}: DivisionProps): ReactElement {
    return (
        <View
            style={[
                styles.division,
                {
                    backgroundColor: Colors.MAIN.DIVISION,
                },
            ]}
        >
            {iconName && (
                <View style={styles.iconContainer}>
                    <Ionicons
                        name={iconName}
                        size={40}
                        color={Colors.BASIC.WHITE}
                    />
                </View>
            )}
            <View style={styles.filledView}>
                <View>
                    {preHeader && (
                        <BetterText
                            textAlign="normal"
                            fontWeight="Bold"
                            fontSize={FontSizes.SMALL}
                            textColor={Colors.BASIC.WHITE}
                        >
                            {preHeader}
                        </BetterText>
                    )}
                    {preHeader && <GapView height={10} />}
                    <BetterTextExtraHeader>{header}</BetterTextExtraHeader>
                    {subHeader && <GapView height={10} />}
                    {subHeader && (
                        <BetterTextSmallText>{subHeader}</BetterTextSmallText>
                    )}
                    {children && <GapView height={10} />}
                    {children && (
                        <View style={styles.childView}>{children}</View>
                    )}
                </View>
            </View>
        </View>
    );
}
