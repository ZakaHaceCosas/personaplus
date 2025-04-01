import Division from "@/components/ui/sections/division";
import { ActiveObjective } from "@/types/active_objectives";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ObjectiveDescriptiveIcons } from "@/toolkit/objectives/active_objectives_ui";
import BetterButton from "@/components/interaction/better_button";
import { LaunchActiveObjective } from "@/toolkit/objectives/active_objectives";
import { View, StyleSheet } from "react-native";
import GapView from "@/components/ui/gap_view";
import { PassiveObjective } from "@/types/passive_objectives";
import { MarkPassiveObjectiveAsDoneToday } from "@/toolkit/objectives/passive_objectives";
import { IsActiveObjective } from "@/types/common_objectives";
import { PendingReturn } from "./common";

const styles = StyleSheet.create({
    buttonWrapper: {
        padding: 20,
    },
    divButtons: {
        display: "flex",
        flexDirection: "row",
    },
});

export function DisplayObjectivesThemselves({
    objectivesToRender,
    handler,
}: {
    objectivesToRender: ActiveObjective[] | PassiveObjective[];
    handler:
    | "launch"
    | ((
        identifier: number,
        action: "delete" | "edit",
        category: "active" | "passive",
    ) => Promise<void>);
}): ReactElement {
    const { t } = useTranslation();

    return (
        <>
            {objectivesToRender.map(
                (obj: ActiveObjective | PassiveObjective): ReactElement => (
                    <Division
                        key={obj.identifier}
                        header={
                            IsActiveObjective(obj)
                                ? t(
                                    `globals.supportedActiveObjectives.${obj.exercise}.name`,
                                )
                                : obj.goal
                        }
                        preHeader={t(
                            `objectives.${IsActiveObjective(obj) ? "active" : "passive"}.allCapsSingular`,
                        )}
                        direction="vertical"
                    >
                        {IsActiveObjective(obj) && (
                            <ObjectiveDescriptiveIcons obj={obj} />
                        )}
                        {handler === "launch" ? (
                            <BetterButton
                                buttonText={t(
                                    IsActiveObjective(obj)
                                        ? "globals.interaction.goAheadGood"
                                        : "objectives.passive.log.text",
                                )}
                                buttonHint={t(
                                    `objectives.${IsActiveObjective(obj) ? "active.start.hint" : "passive.log.hint"}`,
                                )}
                                style="ACE"
                                action={async (): Promise<void> =>
                                    IsActiveObjective(obj)
                                        ? await LaunchActiveObjective(
                                            obj.identifier,
                                        )
                                        : await MarkPassiveObjectiveAsDoneToday(
                                            obj.identifier,
                                        )
                                }
                            />
                        ) : (
                            <View style={styles.divButtons}>
                                {IsActiveObjective(obj) && (
                                    <>
                                        <BetterButton
                                            style="DEFAULT"
                                            buttonText={t(
                                                "pages.dashboard.editObjective.text",
                                            )}
                                            buttonHint={t(
                                                "pages.dashboard.editObjective.hint",
                                            )}
                                            action={async (): Promise<void> =>
                                                await handler(
                                                    obj.identifier,
                                                    "edit",
                                                    "active",
                                                )
                                            }
                                        />
                                        <GapView width={10} />
                                    </>
                                )}
                                <BetterButton
                                    style="WOR"
                                    buttonText={t(
                                        "pages.dashboard.deleteObjective.text",
                                    )}
                                    buttonHint={t(
                                        "pages.dashboard.deleteObjective.hint",
                                    )}
                                    action={async (): Promise<void> =>
                                        await handler(
                                            obj.identifier,
                                            "delete",
                                            "active",
                                        )
                                    }
                                />
                            </View>
                        )}
                    </Division>
                ),
            )}
        </>
    );
}

// extracted this one because it's used twice from the same DisplayObjectives function
// so no need to duplicate code
function NoObjectivesExist(): ReactElement {
    const { t } = useTranslation();

    return (
        <Division header={t("objectives.common.noObjectives.noneExists")} />
    )
}

export function DisplayObjectives({
    identifiers,
    objectives
}: {
    identifiers: PendingReturn,
    objectives: ActiveObjective[] | PassiveObjective[]
}): ReactElement {
    const { t } = useTranslation();

    if (!objectives) return <NoObjectivesExist />
    if (identifiers === "noneExists") return <NoObjectivesExist />
    if (identifiers === "allDone") return <Division
        header={t("objectives.common.noObjectives.allDone")}
    />
    if (identifiers === "noneDueToday") return <Division
        header={t(
            "objectives.common.noObjectives.todayFree",
        )}
    />
    return <DisplayObjectivesThemselves
        objectivesToRender={objectives}
        handler="launch"
    />
}
