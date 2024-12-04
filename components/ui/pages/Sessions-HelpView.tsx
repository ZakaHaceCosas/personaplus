import React, { ReactElement } from "react";
import { View, StyleSheet } from "react-native";
import BetterText from "@/components/text/BetterText";
import GapView from "@/components/ui/GapView";
import { TFunction } from "i18next";
import BetterButton from "@/components/interaction/BetterButton";
import { ActiveObjective } from "@/types/ActiveObjectives";
import Colors from "@/constants/Colors";

/**
 * HelpViewProps
 *
 * @interface HelpViewProps
 * @typedef {HelpViewProps}
 */
interface HelpViewProps {
    /**
     * The ActiveObjective you want help with.
     *
     * @type {ActiveObjective}
     */
    objective: ActiveObjective;
    /**
     * The stateful function you'll use to close / toggle this menu.
     *
     * @type {() => void}
     */
    toggleHelpMenu: () => void;
    /**
     * Pass here the `t` function, please.
     *
     * @type {TFunction}
     */
    t: TFunction;
}

const styles = StyleSheet.create({
    helpContainer: {
        backgroundColor: Colors.MAIN.SECTION,
        position: "absolute",
        top: "30%",
        left: 10,
        right: 10,
        bottom: 40,
        overflow: "visible",
        padding: 20,
        borderRadius: 20,
        elevation: 16,
        shadowColor: Colors.PRIMARIES.ACE.ACE,
        shadowOpacity: 1,
        borderColor: Colors.MAIN.DIVISION_BORDER,
        borderWidth: 4,
        zIndex: 999,
    },
});

/**
 * A view with helpful info for the user during a session.
 *
 * @export
 * @param {HelpViewProps} p HelpViewProps
 * @param {ActiveObjective} p.objective The ActiveObjective you want help with.
 * @param {() => void} p.toggleHelpMenu The stateful function you'll use to close / toggle this menu.
 * @param {TFunction} p.t Pass here the `t` function, please.
 * @returns {ReactElement}
 */
export default function SessionsPageHelpView({
    objective,
    toggleHelpMenu,
    t,
}: HelpViewProps): ReactElement {
    return (
        <View style={styles.helpContainer}>
            <BetterText fontSize={18} fontWeight="Regular">
                {t("globals.help_with_item", {
                    item: t(
                        `globals.supported_active_objectives.${objective.exercise}`,
                    ).toLowerCase(),
                })}
            </BetterText>
            <BetterText fontSize={14} fontWeight="Light">
                {objective?.exercise
                    ? t(`page_sessions.help_section.${objective.exercise}`)
                    : t("globals.error_loading_content")}
            </BetterText>
            <GapView height={10} />
            <BetterButton
                style="ACE"
                buttonText={t("globals.got_it")}
                buttonHint="Closes the help menu"
                action={toggleHelpMenu}
            />
            <GapView height={10} />
            <BetterText
                fontSize={10}
                fontWeight="Light"
                textColor={Colors.LABELS.SDD}
                textAlign="center"
            >
                {t("page_sessions.timer_paused_help")}
            </BetterText>
        </View>
    );
}
