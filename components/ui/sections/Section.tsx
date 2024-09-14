// src/section/Section.tsx

import React, { ReactElement, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import BetterText from "@/components/text/BetterText";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/components/ui/GapView";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import FontSizes from "@/constants/FontSizes";
import getCommonScreenSize from "@/constants/Screen";

// TypeScript, supongo
/**
 * SectionProps Interface
 *
 * @interface SectionProps
 * @typedef {SectionProps}
 */
interface SectionProps {
    /**
     * The kind of section. Depending on this, the section will display a title and icon, or another one.
     *
     * @type {(| "Objectives"
     *         | "PassiveObjs"
     *         | "HowYouAreDoing"
     *         | "Unknown"
     *         | "Settings"
     *         | "Profile"
     *         | "About"
     *         | "Developer")}
     */
    kind:
        | "Objectives"
        | "PassiveObjs"
        | "HowYouAreDoing"
        | "Unknown"
        | "Settings"
        | "Profile"
        | "About"
        | "Developer";
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
        backgroundColor: Colors.MAIN.SECTION,
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
 * @param {SectionProps} param0
 * @param {("Objectives" | "PassiveObjs" | "HowYouAreDoing" | "Unknown" | "Settings" | "Profile" | "About" | "Developer")} param0.kind The kind of section. Depending on this, the section will display a title and icon, or another one.
 * @param {ReactElement} param0.children Children that you can append to the section (one or more). While any `ReactElement` is valid, it's expected that you use a `<Division />` or more.
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
        | "question-mark"; // If you add a new icon, add it here
    let sectionWidth: number | `${number}%`;

    switch (kind) {
        case "Objectives":
            label = t("sections.headers.your_active_objectives");
            headerIcon = "timer";
            break;
        case "PassiveObjs":
            label = t("sections.headers.your_passive_objectives");
            headerIcon = "calendar-today";
            break;
        case "HowYouAreDoing":
            label = t("sections.headers.how_you_are_doing");
            headerIcon = "space-dashboard";
            break;
        case "Unknown":
            label = t("sections.headers.unknown");
            headerIcon = "question-mark";
            break;
        case "Settings":
            label = t("sections.headers.settings");
            headerIcon = "settings";
            break;
        case "Developer":
            label = t("sections.headers.developer");
            headerIcon = "code";
            break;
        case "Profile":
            label = t("sections.headers.your_profile");
            headerIcon = "person";
            break;
        case "About":
            label = t("sections.headers.about");
            headerIcon = "info";
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
            sectionWidth = getCommonScreenSize("width");
            break;
    }

    return (
        <View
            style={[
                styles.section,
                {
                    width: sectionWidth,
                },
            ]}
        >
            <View style={styles.sectionChild}>
                <Ionicons name={headerIcon} size={15} color={Colors.LBLS.SHL} />
                <GapView width={10} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Bold"
                    fontSize={FontSizes.SMALL}
                    textColor={Colors.LBLS.SHL}
                >
                    {String(label)}
                </BetterText>
            </View>
            {children}
        </View>
    );
}
