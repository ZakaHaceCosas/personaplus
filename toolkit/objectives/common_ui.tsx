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

const styles = StyleSheet.create({
    buttonWrapper: {
        padding: 20,
    },
    divButtons: {
        display: "flex",
        flexDirection: "row",
    },
});

export function DisplayObjectives({
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
                                {IsActiveObjective(obj) && (
                                    <>
                                        <GapView width={10} />
                                        <BetterButton
                                            style="ACE"
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
                                    </>
                                )}
                            </View>
                        )}
                    </Division>
                ),
            )}
        </>
    );
}
