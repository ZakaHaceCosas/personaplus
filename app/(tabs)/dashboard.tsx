import React, { ReactElement } from "react";
import BetterButton from "@/components/interaction/better_button";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import Division from "@/components/ui/sections/division";
import Section from "@/components/ui/sections/section";
import { Routes } from "@/constants/routes";
import { logToConsole } from "@/toolkit/debug/console";
import {
    DeleteActiveObjective,
    GetActiveObjective,
    GetAllObjectives,
} from "@/toolkit/objectives/active_objectives";
import { ObjectiveDescriptiveIcons } from "@/toolkit/objectives/active_objectives_ui";
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
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function handler(): Promise<void> {
            try {
                const objectives: ActiveObjective[] | null =
                    await GetAllObjectives();
                setActiveObjectives(objectives);
            } catch (e) {
                logToConsole(`Error fetching Active Objectives: ${e}`, "error");
            } finally {
                setLoading(false);
            }
        }

        handler();
    }, []);

    const handleObjective = async (
        identifier: number,
        action: "delete" | "edit",
    ) => {
        try {
            if (action === "delete") {
                await DeleteActiveObjective(identifier);
                // update & redraw without re-fetching everything upon update.
                setActiveObjectives(
                    activeObjectives?.filter(
                        (obj) => obj.identifier !== identifier,
                    ) || null,
                );
                return;
            } else {
                const obj: ActiveObjective | null =
                    await GetActiveObjective(identifier);
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
                    pathname: Routes.ACTIVE_OBJECTIVES.CREATE,
                    params,
                });
            }
        } catch (e) {
            logToConsole(
                `Error deleting objective ${identifier}: ${e}`,
                "error",
            );
        }
    };

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
                    <Division
                        header={t("activeObjectives.noObjectives.noObjectives")}
                    />
                ) : (
                    activeObjectives.map((obj: ActiveObjective) => {
                        return (
                            <Division
                                key={obj.identifier}
                                header={t(
                                    `globals.supportedActiveObjectives.${obj.exercise}.name`,
                                )}
                                preHeader={t(
                                    "activeObjectives.allCapsSingular",
                                )}
                                direction="vertical"
                            >
                                <ObjectiveDescriptiveIcons obj={obj} />
                                <View style={styles.divButtons}>
                                    <BetterButton
                                        style="WOR"
                                        buttonText={t(
                                            "pages.dashboard.deleteObjective.text",
                                        )}
                                        buttonHint={t(
                                            "pages.dashboard.deleteObjective.hint",
                                        )}
                                        action={() =>
                                            handleObjective(
                                                obj.identifier,
                                                "delete",
                                            )
                                        }
                                    />
                                    <GapView width={10} />
                                    <BetterButton
                                        style="ACE"
                                        buttonText={t(
                                            "pages.dashboard.editObjective.text",
                                        )}
                                        buttonHint={t(
                                            "pages.dashboard.editObjective.hint",
                                        )}
                                        action={() =>
                                            handleObjective(
                                                obj.identifier,
                                                "edit",
                                            )
                                        }
                                    />
                                </View>
                            </Division>
                        );
                    })
                )}
                <View style={styles.buttonWrapper}>
                    <BetterButton
                        style="GOD"
                        action={(): void =>
                            router.push(Routes.ACTIVE_OBJECTIVES.CREATE)
                        }
                        buttonText={t("activeObjectives.createObjective.text")}
                        buttonHint={t("activeObjectives.createObjective.hint")}
                    />
                </View>
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
