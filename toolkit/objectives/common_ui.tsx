import Division from "@/components/ui/sections/division";
import { ActiveObjective } from "@/types/active_objectives";
import { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ObjectiveDescriptiveIcons } from "@/toolkit/objectives/active_objectives_ui";
import BetterButton from "@/components/interaction/better_button";
import {
    GetActiveObjective,
    LaunchActiveObjective,
} from "@/toolkit/objectives/active_objectives";
import { View, StyleSheet } from "react-native";
import GapView from "@/components/ui/gap_view";
import { PassiveObjective } from "@/types/passive_objectives";
import {
    GetPassiveObjective,
    GetPassiveObjectiveStreak,
    SavePassiveObjectiveToDailyLog,
} from "@/toolkit/objectives/passive_objectives";
import { IsActiveObjective } from "@/types/common_objectives";
import { IsGenericObjectivePending, PendingReturn } from "./common";

const styles = StyleSheet.create({
    buttonWrapper: {
        padding: 20,
    },
    divButtons: {
        display: "flex",
        flexDirection: "row",
    },
});

type HandlerType = {
    act: "managing" | "launching";
    callback: (
        identifier: number,
        action: "deleting" | "editing" | "launching",
        category: "active" | "passive",
    ) => Promise<void>;
};

function DisplaySingleObjective({
    obj,
    handler,
    rerender,
}: {
    obj: ActiveObjective | PassiveObjective;
    handler: HandlerType;
    rerender: (x: number) => void;
}): ReactElement {
    const { t } = useTranslation();
    const [streak, setStreak] = useState<number | null>(null);

    async function launchHandler(
        obj: ActiveObjective | PassiveObjective,
    ): Promise<void> {
        if (IsActiveObjective(obj)) await LaunchActiveObjective(obj.identifier);
        else await SavePassiveObjectiveToDailyLog(obj.identifier, true);
        rerender(obj.identifier);
    }

    useEffect((): void => {
        if (!IsActiveObjective(obj)) {
            async function fetchStreak(): Promise<void> {
                const result: number = await GetPassiveObjectiveStreak(
                    obj.identifier,
                );
                setStreak(result);
            }
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
            {IsActiveObjective(obj) && <ObjectiveDescriptiveIcons obj={obj} />}
            {handler.act === "launching" ? (
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
                    action={async (): Promise<void> => await launchHandler(obj)}
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
                                    await handler.callback(
                                        obj.identifier,
                                        "editing",
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
                        buttonText={t("pages.dashboard.deleteObjective.text")}
                        buttonHint={t("pages.dashboard.deleteObjective.hint")}
                        action={async (): Promise<void> =>
                            await handler.callback(
                                obj.identifier,
                                "deleting",
                                IsActiveObjective(obj) ? "active" : "passive",
                            )
                        }
                    />
                </View>
            )}
        </Division>
    );
}

export function DisplayObjectivesThemselves({
    objectivesToRender,
    handler,
    rerender,
}: {
    objectivesToRender: ActiveObjective[] | PassiveObjective[];
    handler: HandlerType;
    rerender: (x: number) => void;
}): ReactElement {
    return (
        <>
            {objectivesToRender.map(
                (obj: ActiveObjective | PassiveObjective): ReactElement => (
                    <DisplaySingleObjective
                        obj={obj}
                        handler={handler}
                        key={`${obj.identifier}__SINGLE_OBJ_RENDER`}
                        rerender={rerender}
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
    handler,
    category,
    identifiers,
}: {
    handler: HandlerType;
    category: "active" | "passive";
    identifiers: PendingReturn;
}): ReactElement {
    const { t } = useTranslation();

    const [objectivesToRender, setObjectivesToRender] = useState<
        ActiveObjective[] | PassiveObjective[]
    >([]);
    const [render, rerender] = useState<number>(0);

    useEffect((): void => {
        async function handle(): Promise<void> {
            if (!Array.isArray(identifiers)) return;

            const arr: (ActiveObjective | PassiveObjective | null)[] =
                await Promise.all(
                    identifiers.map(
                        (
                            i: number,
                        ):
                            | Promise<ActiveObjective | null>
                            | Promise<PassiveObjective | null> =>
                            category === "active"
                                ? GetActiveObjective(i)
                                : GetPassiveObjective(i),
                    ),
                );

            const filteredArr: (ActiveObjective | PassiveObjective)[] = arr
                // filter out nulls
                .filter(
                    (
                        i: ActiveObjective | PassiveObjective | null,
                    ): i is ActiveObjective | PassiveObjective => i !== null,
                )
                // filter so it's EITHER active OR passive stuff
                .filter((o: ActiveObjective | PassiveObjective): boolean =>
                    category === "active"
                        ? IsActiveObjective(o)
                        : !IsActiveObjective(o),
                );

            // assure the type is consistent
            // without this TS thought we had an (ActiveObj | PassiveObj)[] which is not true
            if (category === "active") {
                if (handler.act === "managing") {
                    setObjectivesToRender(filteredArr as ActiveObjective[]);
                    return;
                } else if (handler.act === "launching") {
                    setObjectivesToRender(
                        filteredArr.filter(
                            async (
                                o: ActiveObjective | PassiveObjective,
                            ): Promise<boolean> =>
                                await IsGenericObjectivePending(o),
                        ) as ActiveObjective[],
                    );
                    return;
                }
            } else {
                if (handler.act === "managing") {
                    setObjectivesToRender(filteredArr as PassiveObjective[]);
                    return;
                } else if (handler.act === "launching") {
                    setObjectivesToRender(
                        filteredArr.filter(
                            async (
                                o: ActiveObjective | PassiveObjective,
                            ): Promise<boolean> =>
                                await IsGenericObjectivePending(o),
                        ) as PassiveObjective[],
                    );
                    return;
                }
            }
        }
        handle();
    }, [identifiers, category, render, handler.act]);

    if (!objectivesToRender || identifiers === "noneExists")
        return <NoObjectivesExist />;
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
            objectivesToRender={objectivesToRender}
            handler={handler}
            rerender={rerender}
        />
    );
}
