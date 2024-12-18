import React, { ReactElement, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import BetterText from "@/components/text/better_text";
import {
    BetterTextExtraHeader,
    BetterTextSmallText,
} from "@/components/text/better_text_presets";
import GapView from "@/components/ui/gap_view";
import Colors from "@/constants/colors";
import FontSizes from "@/constants/font_sizes";
import Ionicons from "@expo/vector-icons/MaterialIcons";

// TypeScript, supongo

/**
 * All icons that can be used for Divisions.
 */
type icon = "fastfood" | "sports-score" | "trending-down" | "trending-up";

/**
 * DivisionProps
 *
 * @interface DivisionProps
 */
interface DivisionProps {
    /**
     * Name of the big icon. Unused for now.
     *
     * @type {?(icon | null)}
     */
    iconName?: icon | null;
    /**
     * An optional smaller text before the header.
     *
     * @type {?string}
     */
    preHeader?: string;
    /**
     * The big, main text of the division.
     *
     * @type {string}
     */
    header: string;
    /**
     * An optional small text below the header.
     *
     * @type {?string}
     */
    subHeader?: string;
    /**
     * A JSX element you can add inside of the division. Optional.
     *
     * @type {?ReactNode}
     */
    children?: ReactNode;
    /**
     * Direction the children of the Division will follow.
     *
     * @type {?("horizontal" | "vertical")}
     */
    direction?: "horizontal" | "vertical";
    /**
     * The gap between the children of the Division.
     *
     * @type {?number}
     */
    gap?: number;
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
        backgroundColor: Colors.MAIN.DIVISION,
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
        width: "100%",
    },
});

/**
 * **A PersonaPlus division.**
 *
 * The PersonaPlus UI operates on a Section-Division basis, with Divisions containing most of the actions and features.
 *
 * @export
 * @param {DivisionProps} p
 * @param {icon} p.iconName An optional smaller text before the header.
 * @param {string} p.preHeader An optional smaller text before the header.
 * @param {string} p.header The big, main text of the Division.
 * @param {string} p.subHeader An optional small text below the header.
 * @param {ReactNode} p.children Optional children for the Division.
 * @param {"horizontal" | "vertical"} p.direction Direction the children of the Division will follow.
 * @param {number} p.gap The gap between the children of the Division.
 * @returns {ReactElement}
 */
export default function Division({
    iconName,
    preHeader,
    header,
    subHeader,
    children,
    direction,
    gap,
}: DivisionProps): ReactElement {
    return (
        <View style={styles.division}>
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
                        <>
                            <BetterText
                                textAlign="normal"
                                fontWeight="Bold"
                                fontSize={FontSizes.SMALL}
                                textColor={Colors.BASIC.WHITE}
                            >
                                {preHeader}
                            </BetterText>
                            <GapView height={10} />
                        </>
                    )}
                    <BetterTextExtraHeader>{header}</BetterTextExtraHeader>
                    {subHeader && (
                        <>
                            <GapView height={10} />
                            <BetterTextSmallText>
                                {subHeader}
                            </BetterTextSmallText>
                        </>
                    )}
                    {children && (
                        <>
                            <GapView height={10} />
                            <View
                                style={[
                                    styles.childView,
                                    {
                                        flexDirection: direction
                                            ? direction === "vertical"
                                                ? "column"
                                                : "row"
                                            : "row",
                                        gap: gap ?? 10,
                                    },
                                ]}
                            >
                                {children}
                            </View>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
}
