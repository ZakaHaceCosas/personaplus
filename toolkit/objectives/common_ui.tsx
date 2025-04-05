import Division from "@/components/ui/sections/division";
import { ActiveObjective } from "@/types/active_objectives";
import { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ObjectiveDescriptiveIcons } from "@/toolkit/objectives/active_objectives_ui";
import BetterButton from "@/components/interaction/better_button";
import { LaunchActiveObjective } from "@/toolkit/objectives/active_objectives";
import { View, StyleSheet } from "react-native";
import GapView from "@/components/ui/gap_view";
import { PassiveObjective } from "@/types/passive_objectives";
import { GetPassiveObjectiveStreak, MarkPassiveObjectiveAsDoneToday } from "@/toolkit/objectives/passive_objectives";
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

type HandlerType =
    | "launch"
    | ((
        identifier: number,
        action: "delete" | "edit",
        category: "active" | "passive",
    ) => Promise<void>)

function DisplaySingleObjective({
    obj,
    handler
}: {
    obj: ActiveObjective | PassiveObjective,
    handler: HandlerType
}): ReactElement {
    const { t } = useTranslation();
    const [streak, setStreak] = useState<number | null>(null);

    useEffect((): void => {
        if (!IsActiveObjective(obj)) {
            async function fetchStreak(): Promise<void> {
                const result: number = await GetPassiveObjectiveStreak(obj.identifier);
                setStreak(result);
            };
            fetchStreak();
        }
    }, [obj]);

    return (
        <Division
            key={obj.identifier}
            header={
                IsActiveObjective(obj)
                    ? t(
                        `globals.supportedActiveObjectives.${obj.exercise}.name`,
                    )
                    : `${obj.goal} · ${streak && streak}`
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
                                        IsActiveObjective(obj)
                                            ? "active"
                                            : "passive",
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
                                IsActiveObjective(obj)
                                    ? "active"
                                    : "passive",
                            )
                        }
                    />
                </View>
            )}
        </Division>
    )
}

export function DisplayObjectivesThemselves({
    objectivesToRender,
    handler,
}: {
    objectivesToRender: ActiveObjective[] | PassiveObjective[];
    handler:
    HandlerType;
}): ReactElement {
    return (
        <>
            {objectivesToRender.map(
                (obj: ActiveObjective | PassiveObjective): ReactElement => (
                    <DisplaySingleObjective
                        obj={obj}
                        handler={handler}
                        key={`${obj.identifier}__SINGLE_OBJ_RENDER`}
                    />
                ),
            )}
        </>
    );
}

// extracted this one because it's used twice from the same DisplayObjectives function
// so no need to duplicate code
function NoObjectivesExist(): ReactElement {
    const { t } = useTranslation();

    return <Division header={t("objectives.common.noObjectives.noneExists")} />;
}

export function DisplayObjectives({
    identifiers,
    objectives,
}: {
    identifiers: PendingReturn;
    objectives: ActiveObjective[] | PassiveObjective[];
}): ReactElement {
    const { t } = useTranslation();

    if (!objectives) return <NoObjectivesExist />;
    if (identifiers === "noneExists") return <NoObjectivesExist />;
    if (identifiers === "allDone")
        return (
            <Division header={t("objectives.common.noObjectives.allDone")} />
        );
    if (identifiers === "noneDueToday")
        return (
            <Division header={t("objectives.common.noObjectives.todayFree")} />
        );
    return (
        <DisplayObjectivesThemselves
            objectivesToRender={objectives}
            handler="launch"
        />
    );
}
