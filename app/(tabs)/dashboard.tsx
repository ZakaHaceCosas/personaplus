import React, { ReactElement } from "react";
import BetterButton from "@/components/interaction/better_button";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import Division from "@/components/ui/sections/division";
import Section from "@/components/ui/sections/section";
import { Routes } from "@/constants/routes";
import { logToConsole } from "@/toolkit/console";
import {
    ActiveObjective,
    EditObjectiveParams,
} from "@/types/active_objectives";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import TopBar from "@/components/navigation/top_bar";
import GapView from "@/components/ui/gap_view";
import { ShowToast } from "@/toolkit/android";
import {
    DeleteObjective,
    GetAllObjectives,
    GetObjective,
} from "@/toolkit/objectives/common";
import { PassiveObjective } from "@/types/passive_objectives";
import { DisplayObjectives } from "@/toolkit/objectives/common_ui";

const styles = StyleSheet.create({
    buttonWrapper: {
        padding: 20,
    },
    divButtons: {
        display: "flex",
        flexDirection: "row",
    },
});

export default function Dashboard(): ReactElement {
    const { t } = useTranslation();

    const [activeObjectives, setActiveObjectives] = useState<
        ActiveObjective[] | null
    >(null);
    const [passiveObjectives, setPassiveObjectives] = useState<
        PassiveObjective[] | null
    >(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect((): void => {
        async function handler(): Promise<void> {
            try {
                setActiveObjectives(await GetAllObjectives("active"));
                setPassiveObjectives(await GetAllObjectives("passive"));
            } catch (e) {
                logToConsole(`Error fetching Active Objectives: ${e}`, "error");
            } finally {
                setLoading(false);
            }
        }

        handler();
    }, []);

    async function handleObjective(
        identifier: number,
        action: "delete" | "edit",
        category: "active" | "passive",
    ): Promise<void> {
        try {
            if (action === "delete") {
                await DeleteObjective(identifier, category);
                // update & redraw without re-fetching everything upon update.
                setActiveObjectives(
                    activeObjectives?.filter(
                        (obj: ActiveObjective): boolean =>
                            obj.identifier !== identifier,
                    ) || null,
                );
                setPassiveObjectives(
                    passiveObjectives?.filter(
                        (obj: PassiveObjective): boolean =>
                            obj.identifier !== identifier,
                    ) || null,
                );
                return;
            } else if (action === "edit") {
                // TODO - support editing passive objectives
                const obj: ActiveObjective | null = await GetObjective(
                    identifier,
                    "active",
                );
                if (!obj) {
                    ShowToast(
                        t("errors.objectiveNotExists", { id: identifier }),
                    );
                    return;
                }
                const params: EditObjectiveParams = {
                    edit: "true",
                    objective: JSON.stringify(obj),
                };
                router.push({
                    pathname: Routes.OBJECTIVES.CREATE_ACTIVE,
                    params,
                });
            }
        } catch (e) {
            logToConsole(
                `Error deleting objective ${identifier}: ${e}`,
                "error",
            );
        }
    }

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={false}
                header={t("pages.dashboard.header")}
                subHeader={t("pages.dashboard.subheader")}
            />
            <Section kind="ActiveObjectives">
                {activeObjectives === null || activeObjectives.length === 0 ? (
                    <Division header={t("objectives.common.noObjectives")} />
                ) : (
                    <DisplayObjectives
                        objectivesToRender={activeObjectives}
                        handler={handleObjective}
                    />
                )}
                <View style={styles.buttonWrapper}>
                    <BetterButton
                        style="GOD"
                        action={(): void =>
                            router.push(Routes.OBJECTIVES.CREATE_ACTIVE)
                        }
                        buttonText={t("objectives.active.create.text")}
                        buttonHint={t("objectives.active.create.hint")}
                    />
                </View>
            </Section>
            <GapView height={20} />
            <Section kind="PassiveObjectives">
                {passiveObjectives === null ||
                passiveObjectives.length === 0 ? (
                    <Division header={t("objectives.common.noObjectives")} />
                ) : (
                    <DisplayObjectives
                        objectivesToRender={passiveObjectives}
                        handler={handleObjective}
                    />
                    /* passiveObjectives.map(
                        (obj: PassiveObjective): ReactElement => {
                            return (
                                <Division
                                    key={obj.identifier}
                                    header={obj.goal}
                                    preHeader={t(
                                        "objectives.passive.allCapsSingular",
                                    )}
                                    direction="vertical"
                                >
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
                                                await handleObjective(
                                                    obj.identifier,
                                                    "delete",
                                                    "passive",
                                                )
                                            }
                                        />
                                    </View>
                                </Division>
                            );
                        },
                    ) */
                )}
                <View style={styles.buttonWrapper}>
                    <BetterButton
                        style="GOD"
                        action={(): void =>
                            router.push(Routes.OBJECTIVES.CREATE_PASSIVE)
                        }
                        buttonText={t("objectives.passive.create.text")}
                        buttonHint={t("objectives.passive.create.hint")}
                    />
                </View>
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
