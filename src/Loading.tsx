// Loading.tsx
// Página de carga

import React from "react";
import BottomNav from "./BottomNav";
import { DimensionValue, View, ScrollView } from "react-native";
import BetterText from "./BetterText";
import { useTranslation } from "react-i18next";
import colors from "./toolkit/design/colors";

export default function Loading(currentpage: string, displayNav: boolean) {
    const { t } = useTranslation();

    return (
        <View
            style={{
                width: "100vw" as DimensionValue,
                height: "100vh" as DimensionValue,
            }}
        >
            {displayNav && <BottomNav currentLocation={currentpage} />}
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
