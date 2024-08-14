import React from "react";
import { View, StyleSheet } from "react-native";
import BetterText from "@/src/BetterText";
import GapView from "@/src/GapView";
import { TFunction } from "i18next";
import Button from "@/src/Buttons";
import colors from "@/src/toolkit/design/colors";
import { Objective } from "@/src/types/Objective";

const styles = StyleSheet.create({
    helpcontainer: {
        backgroundColor: colors.MAIN.SECTION,
        position: "absolute",
        top: "20%",
        left: 10,
        right: 10,
        bottom: 20,
        overflow: "visible",
        padding: 20,
        borderRadius: 20,
        elevation: 16,
        borderColor: colors.MAIN.DIVISIONBORDER,
        borderWidth: 4,
        zIndex: 999,
    },
});

export default function HelpView(
    t: TFunction,
    objective: Objective,
    toggleHelpMenu: () => void
) {
    return (
        <View style={styles.helpcontainer}>
            <BetterText fontSize={18} fontWeight="Regular">
                {t("globals.help_with_item", {
                    item: t(
                        `globals.supported_active_objectives.${objective.exercise}`
                    ).toLowerCase(),
                })}
            </BetterText>
            <BetterText fontSize={14} fontWeight="Light">
                {objective?.exercise
                    ? t(`page_sessions.help_section.${objective.exercise}`)
                    : t("globals.error_loading_content")}
            </BetterText>
            <GapView height={10} />
            <Button
                layout="fixed"
                height="default"
                style="ACE"
                buttonText={t("globals.got_it")}
                action={toggleHelpMenu}
            />
            <GapView height={10} />
            <BetterText
                fontSize={10}
                fontWeight="Light"
                textColor={colors.LBLS.SDD}
                textAlign="center"
            >
                {t("page_sessions.timer_paused_help")}
            </BetterText>
        </View>
    );
}
