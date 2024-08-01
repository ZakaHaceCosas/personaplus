// Loading.tsx
// Página de carga

import React from "react";
import BottomNav from "./BottomNav";
import { Dimensions, ScrollView, View } from "react-native";
import BetterText from "./BetterText";
import { useTranslation } from "react-i18next";
import colors from "./toolkit/design/colors";
import GapView from "./GapView";

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
    /**
     * Whether to use the normal one (default, `false`), or the special one (`true`) used by Sessions page.
     *
     * @type {boolean}
     */
    useSpecial?: boolean;
}

/**
 * Homemade simple loading page.
 *
 * @export
 * @param {LoadingProps} param0
 * @param {string} param0.currentpage
 * @param {boolean} param0.displayNav
 * @param {boolean} param0.useSpecial
 * @returns {*}
 */
export default function Loading({
    currentpage,
    displayNav,
    useSpecial = false,
}: LoadingProps) {
    const { t } = useTranslation();

    if (useSpecial === true) {
        return (
            <View
                style={{
                    width: Dimensions.get("screen").width,
                    height: Dimensions.get("screen").height,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <GapView height={Dimensions.get("screen").height / 2} />
                <BetterText
                    textAlign="center"
                    fontSize={25}
                    textColor={colors.PRIMARIES.GOD.GOD}
                    fontWeight="Medium"
                >
                    {t("globals.loading")}
                </BetterText>
            </View>
        );
    }

    return (
        <View
            style={{
                width: Dimensions.get("screen").width,
                height: Dimensions.get("screen").height,
            }}
        >
            <ScrollView
                style={{
                    padding: 20,
                    paddingTop: 40,
                    display: "flex",
                    flexDirection: "column",
                    width: Dimensions.get("screen").width,
                    height: Dimensions.get("screen").height,
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
            </ScrollView>
            {displayNav && currentpage !== null && (
                <BottomNav currentLocation={currentpage} />
            )}
        </View>
    );
}
