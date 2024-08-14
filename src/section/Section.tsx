// src/section/Section.tsx

import React, { ReactElement, ReactNode } from "react";
import { View } from "react-native";
import BetterText from "@/src/BetterText";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/src/GapView";
import { useTranslation } from "react-i18next";
import colors from "@/src/toolkit/design/colors";

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
     * Children that you can append to the section (one or more). While any `ReactNode` is valid, it's expected that you use a `<Division />` or more.
     *
     * @type {ReactNode}
     */
    children: ReactNode;
}

// We create the function
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

    return (
        <View
            style={{
                display: "flex",
                backgroundColor: colors.MAIN.SECTION,
                flexDirection: "column",
                borderRadius: 15,
                overflow: "hidden",
            }}
        >
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: 15,
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                <Ionicons name={headerIcon} size={15} color={colors.LBLS.SHL} />
                <GapView width={10} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Bold"
                    fontSize={12}
                    textColor={colors.LBLS.SHL}
                >
                    {String(label)}
                </BetterText>
            </View>
            {children}
        </View>
    );
}
