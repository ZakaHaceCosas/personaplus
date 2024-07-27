// Loading.tsx
// Página de carga

import React from "react";
import BottomNav from "./BottomNav";
import { DimensionValue, View, ScrollView } from "react-native";
import BetterText from "./BetterText";
import { useTranslation } from "react-i18next";
import colors from "./toolkit/design/colors";

// TypeScript, supongo
/**
 * LoadingProps Interface
 *
 * @interface LoadingProps
 * @typedef {LoadingProps}
 */
interface LoadingProps {
    /**
     * The /page the user is currently at. Use null for pages that do not require the navbar.
     *
     * @type {string | null}
     */
    currentpage: string | null;
    /**
     * Whether to display the nav bar or not.
     *
     * @type {boolean}
     */
    displayNav: boolean;
}

/**
 * Homemade simple loading page.
 *
 * @export
 * @param {LoadingProps} param0
 * @param {string} param0.currentpage
 * @param {boolean} param0.displayNav
 * @returns {*}
 */
export default function Loading({ currentpage, displayNav }: LoadingProps) {
    const { t } = useTranslation();

    return (
        <View
            style={{
                width: "100vw" as DimensionValue,
                height: "100vh" as DimensionValue,
            }}
        >
            {displayNav && currentpage !== null && (
                <BottomNav currentLocation={currentpage} />
            )}
            <ScrollView>
                <View
                    style={{
                        padding: 20,
                        display: "flex",
                        flexDirection: "column",
                        width: "100vw" as DimensionValue,
                        height: "100vh" as DimensionValue,
                        overflow: "scroll",
                    }}
                >
                    <BetterText
                        fontWeight="Regular"
                        fontSize={15}
                        textAlign="center"
                        textColor={colors.LBLS.SDD}
                    >
                        {t("globals.loading")}
                    </BetterText>
                </View>
            </ScrollView>
        </View>
    );
}
