// src/section/Section.tsx

import React, { ReactElement, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import BetterText from "@/components/text/better_text";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/components/ui/gap_view";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/colors";
import FontSizes from "@/constants/font_sizes";
import { GetCommonScreenSize } from "@/constants/screen";

// TypeScript, supongo
/**
 * SectionProps Interface
 *
 * @interface SectionProps
 */
interface SectionProps {
    /**
     * The kind of section. Depending on this, the section will display a title and icon, or another one.
     */
    kind:
        | "ActiveObjectives"
        | "PassiveObjectives"
        | "HowYouAreDoing"
        | "Unknown"
        | "Settings"
        | "Profile"
        | "About"
        | "Developer"
        | "Danger"
        | "Experiments"
        | "YourHealth";
    /**
     * Whether the width should be `"total"` (full screen) or `"parent"` (width of 100% to fill it's parent).
     *
     * @type {?("total" | "parent")}
     */
    width?: "total" | "parent";
    /**
     * Children that you can append to the section (one or more). While any `ReactNode` is valid, it's expected that you use a `<Division />` or more.
     *
     * @type {ReactNode}
     */
    children: ReactNode;
}

const styles = StyleSheet.create({
    section: {
        display: "flex",
        flexDirection: "column",
        borderRadius: 20,
        overflow: "hidden",
    },
    sectionChild: {
        display: "flex",
        flexDirection: "row",
        padding: 15,
        alignItems: "center",
        justifyContent: "flex-start",
    },
});

/**
 * A PersonaPlus section.
 *
 * The PersonaPlus UI operates on a Section-Division basis, with Sections containing Divisions, being each Section of a different "kind", so it groups stuff by topics.
 *
 * @export
 * @param {SectionProps} p
 * @param {("Objectives" | "PassiveObjectives" | "HowYouAreDoing" | "Unknown" | "Settings" | "Profile" | "About" | "Developer" | "Danger" | "Experiments")} p.kind The kind of section. Depending on this, the section will display a title and icon, or another one.
 * @param {ReactElement} p.children Children that you can append to the section (one or more). While any `ReactElement` is valid, it's expected that you use a `<Division />` or more.
 * @returns {ReactElement}
 */
export default function Section({
    kind,
    width,
    children,
}: SectionProps): ReactElement {
    const { t } = useTranslation();
    let label: string;
    let headerIcon:
        | "timer"
        | "calendar-today"
        | "space-dashboard"
        | "person"
        | "info"
        | "settings"
        | "code"
        | "question-mark"
        | "warning"
        | "science"
        | "favorite"; // If you add a new icon, add it here
    let sectionWidth: number | `${number}%`;
    let backgroundColor = Colors.MAIN.SECTION;
    let foregroundColor = Colors.LABELS.SHL;

    switch (kind) {
        case "ActiveObjectives":
            label = t("globals.objectives.active");
            headerIcon = "timer";
            break;
        case "PassiveObjectives":
            label = t("globals.objectives.passive");
            headerIcon = "calendar-today";
            break;
        case "HowYouAreDoing":
            label = t("globals.howYouAreDoing");
            headerIcon = "space-dashboard";
            break;
        case "Unknown":
            label = t("globals.somethingIsWrong");
            headerIcon = "question-mark";
            break;
        case "Settings":
            label = t("globals.settings");
            headerIcon = "settings";
            break;
        case "Developer":
            label = t("globals.developers");
            headerIcon = "code";
            break;
        case "Profile":
            label = t("pages.profile.header");
            headerIcon = "person";
            break;
        case "About":
            label = t("globals.about");
            headerIcon = "info";
            break;
        case "Danger":
            label = t("globals.danger");
            headerIcon = "warning";
            backgroundColor = Colors.PRIMARIES.WOR.WOR;
            foregroundColor = Colors.MAIN.APP;
            break;
        case "Experiments":
            label = t("globals.experiments");
            headerIcon = "science";
            backgroundColor = Colors.PRIMARIES.HMM.HMM;
            foregroundColor = Colors.MAIN.APP;
            break;
        case "YourHealth":
            label = t("globals.yourHealth");
            headerIcon = "favorite";
            break;
        default:
            label = "UNKNOWN";
            headerIcon = "question-mark";
            break;
    }

    switch (width) {
        case "parent":
            sectionWidth = "100%";
            break;
        case "total":
        default:
            sectionWidth = GetCommonScreenSize("width");
            break;
    }

    return (
        <View
            style={[
                styles.section,
                {
                    width: sectionWidth,
                    backgroundColor: backgroundColor,
                },
            ]}
        >
            <View style={styles.sectionChild}>
                <Ionicons name={headerIcon} size={15} color={foregroundColor} />
                <GapView width={10} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Bold"
                    fontSize={FontSizes.SMALL}
                    textColor={foregroundColor}
                >
                    {label.toUpperCase()}
                </BetterText>
            </View>
            {children}
        </View>
    );
}
