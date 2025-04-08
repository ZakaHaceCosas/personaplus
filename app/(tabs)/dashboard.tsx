import React, { ReactElement } from "react";
import BetterButton from "@/components/interaction/better_button";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import Division from "@/components/ui/sections/division";
import Section from "@/components/ui/sections/section";
import { Routes } from "@/constants/routes";
import { ActiveObjective } from "@/types/active_objectives";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import TopBar from "@/components/navigation/top_bar";
import GapView from "@/components/ui/gap_view";
import {
    GenericDisplayHandler,
    GetAllObjectives,
} from "@/toolkit/objectives/common";
import { PassiveObjective } from "@/types/passive_objectives";
import { DisplayObjectivesThemselves } from "@/toolkit/objectives/common_ui";

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

    async function handler(
        id: number,
        act: "deleting" | "editing" | "launching",
        cat: "active" | "passive",
    ): Promise<void> {
        if (act === "launching") {
            console.error(
                "who passed 'launching' to the GenericDisplayHandler?",
            );
            return;
        }
        await GenericDisplayHandler(id, act, cat, t, {
            setActiveCallback: setActiveObjectives,
            activeToSet: activeObjectives,
            setPassiveCallback: setPassiveObjectives,
            passiveToSet: passiveObjectives,
        });
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
                {activeObjectives.length === 0 ? (
                    <Division
                        header={t("objectives.common.noObjectives.noneExists")}
                    />
                ) : (
                    <DisplayObjectivesThemselves
                        objectivesToRender={activeObjectives}
                        handler={{
                            act: "managing",
                            callback: handler,
                        }}
                    />
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
                {passiveObjectives.length === 0 ? (
                    <Division
                        header={t("objectives.common.noObjectives.noneExists")}
                    />
                ) : (
                    <DisplayObjectivesThemselves
                        objectivesToRender={passiveObjectives}
                        handler={{
                            act: "managing",
                            callback: handler,
                        }}
                    />
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
