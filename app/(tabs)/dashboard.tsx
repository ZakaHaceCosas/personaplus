import React from "react";
import BetterButton from "@/components/interaction/better_button";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import Division from "@/components/ui/sections/division";
import Section from "@/components/ui/sections/section";
import ROUTES from "@/constants/routes";
import { logToConsole } from "@/toolkit/debug/console";
import {
    DeleteActiveObjective,
    GetAllObjectives,
} from "@/toolkit/objectives/active_objectives";
import { ObjectiveDescriptiveIcons } from "@/toolkit/objectives/active_objectives_ui";
import { ActiveObjective } from "@/types/active_objectives";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import TopBar from "@/components/navigation/top_bar";

const styles = StyleSheet.create({
    buttonWrapper: {
        padding: 20,
    },
});

export default function Dashboard() {
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

    const handleDeleteObjective = (identifier: number) => {
        try {
            DeleteActiveObjective(identifier);
            // update & redraw without re-fetching everything upon update.
            setActiveObjectives(
                activeObjectives?.filter(
                    (obj) => obj.identifier !== identifier,
                ) || null,
            );
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
                                <BetterButton
                                    style="WOR"
                                    buttonText={t(
                                        "pages.dashboard.deleteObjective.text",
                                    )}
                                    buttonHint={t(
                                        "pages.dashboard.deleteObjective.hint",
                                    )}
                                    action={() =>
                                        handleDeleteObjective(obj.identifier)
                                    }
                                />
                            </Division>
                        );
                    })
                )}
                <View style={styles.buttonWrapper}>
                    <BetterButton
                        style="GOD"
                        action={(): void =>
                            router.push(ROUTES.ACTIVE_OBJECTIVES.CREATE)
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
