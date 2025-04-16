import { ActiveObjective } from "@/types/active_objectives";
import React, { ReactElement, ReactNode } from "react";
import FontSizes from "@/constants/font_sizes";
import { BetterTextSmallText } from "@/components/text/better_text_presets";
import { StyleSheet, View } from "react-native";
import GapView from "@/components/ui/gap_view";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/colors";
import IconView from "@/components/ui/icon_view";

const styles = StyleSheet.create({
    view: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
});

/**
 * Generates an array of icons that describe properties of an objective.
 *
 * @param {ActiveObjective} obj The objective.
 * @returns {ReactNode} A set of icons representing the objective.
 */
function ObjectiveDescriptiveIcons({
    obj,
}: {
    obj: ActiveObjective;
}): ReactNode {
    let icons: ReactElement;

    const { t } = useTranslation();

    /**
     * @deprecated Only use until the tracker experiment fully rolls out.
     */
    const speedOptions: [string, string][] = [
        [t("Brisk Walk"), t("1.6 - 3.2 km/h")],
        [t("Light Jog"), t("3.2 - 4.0 km/h")],
        [t("Moderate Run"), t("4.0 - 4.8 km/h")],
        [t("Fast Run"), t("4.8 - 5.5 km/h")],
        [t("Sprint"), t("5.5 - 6.4 km/h")],
        [t("Fast Sprint"), t("6.4 - 8.0 km/h")],
        [t("Running Fast"), t("8.0 - 9.6 km/h")],
        [t("Very Fast Run"), t("9.6 - 11.3 km/h")],
        [t("Sprinting"), t("11.3 - 12.9 km/h")],
        [t("Fast Sprinting"), t("12.9 - 14.5 km/h")],
        [t("Full Speed Sprinting"), t("14.5 - 16.1 km/h")],
        [t("Maximum Speed"), t("+16.1 km/h")],
    ];

    switch (obj.exercise) {
        case "Lifting":
            icons = (
                <>
                    <IconView
                        name="scale"
                        size={FontSizes.REGULAR}
                        color={Colors.LABELS.SDD}
                        text={`${obj.specificData.dumbbellWeight} kg`}
                    />
                    <GapView width={10} />
                    <IconView
                        name="loop"
                        size={FontSizes.REGULAR}
                        color={Colors.LABELS.SDD}
                        text={String(obj.specificData.reps)}
                    />
                    <GapView width={10} />
                    <IconView
                        name="front-hand"
                        size={FontSizes.REGULAR}
                        color={Colors.LABELS.SDD}
                        text={String(obj.specificData.amountOfHands)}
                    />
                </>
            );
            break;
        case "Running":
            icons = (
                <>
                    <IconView
                        name="speed"
                        size={FontSizes.REGULAR}
                        color={Colors.LABELS.SDD}
                        text={speedOptions[obj.specificData.estimateSpeed]![1]}
                    />
                </>
            );
            break;
        case "Push Ups":
            icons = (
                <>
                    <IconView
                        name="repeat"
                        size={FontSizes.REGULAR}
                        color={Colors.LABELS.SDD}
                        text={String(obj.specificData.amountOfPushUps)}
                    />
                    <GapView width={10} />
                    <IconView
                        name="front-hand"
                        size={FontSizes.REGULAR}
                        color={Colors.LABELS.SDD}
                        text={String(obj.specificData.amountOfHands)}
                    />
                </>
            );
            break;
        default:
            icons = (
                <>
                    <BetterTextSmallText>
                        Error reading properties of this objective.
                    </BetterTextSmallText>
                </>
            );
    }

    return <View style={styles.view}>{icons}</View>;
}

export { ObjectiveDescriptiveIcons };
