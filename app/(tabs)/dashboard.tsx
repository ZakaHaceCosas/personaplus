import React, { ReactElement } from "react";
import BetterButton from "@/components/interaction/better_button";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import Section from "@/components/ui/sections/section";
import { Routes } from "@/constants/routes";
import { ActiveObjective } from "@/types/active_objectives";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import TopBar from "@/components/navigation/top_bar";
import GapView from "@/components/ui/gap_view";
import { DeleteObjective, GetAllObjectives } from "@/toolkit/objectives/common";
import { PassiveObjective } from "@/types/passive_objectives";
import { ShowToast } from "@/toolkit/android";
import Division from "@/components/ui/sections/division";
import { HandlePendingReturn } from "@/toolkit/objectives/common_ui";
import { ObjectiveDescriptiveIcons } from "@/toolkit/objectives/active_objectives_ui";

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

    const [activeObjectives, setActiveObjectives] = useState<ActiveObjective[]>(
        [],
    );
    const [passiveObjectives, setPassiveObjectives] = useState<
        PassiveObjective[]
    >([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect((): void => {
        async function handler(): Promise<void> {
            try {
                setActiveObjectives((await GetAllObjectives("active")) ?? []);
                setPassiveObjectives((await GetAllObjectives("passive")) ?? []);
            } catch (e) {
                console.error(`Error fetching Active Objectives: ${e}`);
            } finally {
                setLoading(false);
            }
        }

        handler();
    }, []);

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={false}
                header={t("pages.dashboard.header")}
                subHeader={t("pages.dashboard.subheader")}
            />
            <Section kind="ActiveObjectives">
                {activeObjectives.length === 0 && (
                    <HandlePendingReturn renderer={"noneExists"} />
                )}
                {activeObjectives.map(
                    (obj: ActiveObjective): ReactElement => (
                        <Division
                            key={obj.identifier}
                            header={t(
                                `globals.supportedActiveObjectives.${obj.exercise}.name`,
                            )}
                            preHeader={t(`objectives.active.allCapsSingular`)}
                            direction="vertical"
                        >
                            <ObjectiveDescriptiveIcons obj={obj} />
                            <View style={styles.divButtons}>
                                <BetterButton
                                    buttonText={t(
                                        `pages.dashboard.editObjective.text`,
                                    )}
                                    buttonHint={t(
                                        `pages.dashboard.editObjective.hint`,
                                    )}
                                    style="ACE"
                                    action={(): void => {
                                        router.push({
                                            pathname:
                                                Routes.OBJECTIVES.CREATE_ACTIVE,
                                            params: {
                                                edit: "true",
                                                objective: JSON.stringify(obj),
                                            },
                                        });
                                    }}
                                />
                                <GapView width={10} />
                                <BetterButton
                                    buttonText={t(
                                        `pages.dashboard.deleteObjective.text`,
                                    )}
                                    buttonHint={t(
                                        `pages.dashboard.deleteObjective.hint`,
                                    )}
                                    style="WOR"
                                    action={async (): Promise<void> => {
                                        await DeleteObjective(
                                            obj.identifier,
                                            "active",
                                        );
                                        setActiveObjectives(
                                            activeObjectives.filter(
                                                (
                                                    obj2: ActiveObjective,
                                                ): boolean =>
                                                    obj2.identifier !==
                                                    obj.identifier,
                                            ),
                                        );
                                        ShowToast(
                                            t(
                                                `objectives.common.feedback.deleted`,
                                                { id: obj.identifier },
                                            ),
                                        );
                                    }}
                                />
                            </View>
                        </Division>
                    ),
                )}
                <View style={styles.buttonWrapper}>
                    <BetterButton
                        style="ACE"
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
                {passiveObjectives.length === 0 && (
                    <HandlePendingReturn renderer={"noneExists"} />
                )}
                {passiveObjectives.map(
                    (obj: PassiveObjective): ReactElement => (
                        <Division
                            key={obj.identifier}
                            header={`${obj.goal}`}
                            preHeader={t(`objectives.passive.allCapsSingular`)}
                            direction="vertical"
                        >
                            <View style={styles.divButtons}>
                                <BetterButton
                                    buttonText={t(
                                        `pages.dashboard.editObjective.text`,
                                    )}
                                    buttonHint={t(
                                        `pages.dashboard.editObjective.hint`,
                                    )}
                                    style="ACE"
                                    action={(): void => {
                                        router.push({
                                            pathname:
                                                Routes.OBJECTIVES
                                                    .CREATE_PASSIVE,
                                            params: {
                                                edit: "true",
                                                objective: JSON.stringify(obj),
                                            },
                                        });
                                    }}
                                />
                                <GapView width={10} />
                                <BetterButton
                                    buttonText={t(
                                        `pages.dashboard.deleteObjective.text`,
                                    )}
                                    buttonHint={t(
                                        `pages.dashboard.deleteObjective.hint`,
                                    )}
                                    style="WOR"
                                    action={async (): Promise<void> => {
                                        await DeleteObjective(
                                            obj.identifier,
                                            "passive",
                                        );
                                        setPassiveObjectives(
                                            passiveObjectives.filter(
                                                (
                                                    obj2: PassiveObjective,
                                                ): boolean =>
                                                    obj2.identifier !==
                                                    obj.identifier,
                                            ),
                                        );
                                        ShowToast(
                                            t(
                                                `objectives.common.feedback.deleted`,
                                                { id: obj.identifier },
                                            ),
                                        );
                                    }}
                                />
                            </View>
                        </Division>
                    ),
                )}
                <View style={styles.buttonWrapper}>
                    <BetterButton
                        style="ACE"
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
