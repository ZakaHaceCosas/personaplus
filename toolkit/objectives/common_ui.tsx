import Division from "@/components/ui/sections/division";
import { ActiveObjective } from "@/types/active_objectives";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ObjectiveDescriptiveIcons } from "./active_objectives_ui";
import BetterButton from "@/components/interaction/better_button";
import { LaunchActiveObjective } from "./active_objectives";
import { View, StyleSheet } from "react-native";
import GapView from "@/components/ui/gap_view";
import { PassiveObjective } from "@/types/passive_objectives";

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

    /** Since only `ActiveObjective`s have the `exercise` key, this type guard checks for it, so TS knows what are you working with, instead of throwing type errors all the time. */
    const isActive: (
        obj: ActiveObjective | PassiveObjective,
    ) => obj is ActiveObjective = (
        obj: ActiveObjective | PassiveObjective,
    ): obj is ActiveObjective => {
        if (
            (obj as ActiveObjective).exercise &&
            (obj as ActiveObjective).exercise !== null
        )
            return true;
        return false;
    };

    return (
        <>
            {objectivesToRender.map(
                (obj: ActiveObjective | PassiveObjective): ReactElement => (
                    <Division
                        key={obj.identifier}
                        header={
                            isActive(obj)
                                ? t(
                                      `globals.supportedActiveObjectives.${obj.exercise}.name`,
                                  )
                                : obj.goal
                        }
                        preHeader={t(
                            `objectives.${isActive(obj) ? "active" : "passive"}.allCapsSingular`,
                        )}
                        direction="vertical"
                    >
                        {isActive(obj) && (
                            <ObjectiveDescriptiveIcons obj={obj} />
                        )}
                        {handler === "launch" ? (
                            <BetterButton
                                buttonText={t(
                                    isActive(obj)
                                        ? "globals.interaction.goAheadGood"
                                        : "objectives.passive.log.text",
                                )}
                                buttonHint={t(
                                    `objectives.${isActive(obj) ? "active.start.hint" : "passive.log.hint"}`,
                                )}
                                style="ACE"
                                action={async (): Promise<void> =>
                                    await LaunchActiveObjective(obj.identifier)
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
                                {isActive(obj) && (
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
