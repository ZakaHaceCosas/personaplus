import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import BetterText from "@/components/text/better_text";
import GapView from "@/components/ui/gap_view";
import BetterButton from "@/components/interaction/better_button";
import { ActiveObjective } from "@/types/active_objectives";
import Colors from "@/constants/colors";
import { useTranslation } from "react-i18next";
import {
    BetterTextSmallHeader,
    BetterTextSmallText,
} from "@/components/text/better_text_presets";

/**
 * HelpViewProps
 *
 * @interface HelpViewProps
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
}

const styles = StyleSheet.create({
    helpContainer: {
        backgroundColor: Colors.MAIN.SECTION,
        position: "absolute",
        top: "40%",
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "visible",
        padding: 20,
        borderRadius: 20,
        borderColor: Colors.MAIN.DIVISION_BORDER,
        borderWidth: 4,
    },
});

/**
 * A view with helpful info for the user during a session.
 *
 * @export
 * @param {HelpViewProps} p HelpViewProps
 * @param {ActiveObjective} p.objective The ActiveObjective you want help with.
 * @param {() => void} p.toggleHelpMenu The stateful function you'll use to close / toggle this menu.
 * @returns {ReactElement}
 */
export default function SessionsPageHelpView({
    objective,
    toggleHelpMenu,
}: HelpViewProps): ReactElement {
    const { t } = useTranslation();

    return (
        <View style={styles.helpContainer}>
            <BetterTextSmallHeader>
                {t("globals.interaction.help")}
            </BetterTextSmallHeader>
            <BetterTextSmallText>
                {t(
                    `globals.supportedActiveObjectives.${objective.exercise}.name`,
                )}
            </BetterTextSmallText>
            <GapView height={10} />
            <BetterTextSmallText>
                {t(
                    `globals.supportedActiveObjectives.${objective.exercise}.help`,
                )}
            </BetterTextSmallText>
            <GapView height={10} />
            <BetterButton
                style="ACE"
                buttonText={t("globals.interaction.gotIt")}
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
                {t("pages.sessions.helpTimerPaused")}
            </BetterText>
        </View>
    );
}
