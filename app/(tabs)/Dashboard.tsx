import React from "react";
import BetterButton from "@/components/interaction/BetterButton";
import Loading from "@/components/static/Loading";
import PageEnd from "@/components/static/PageEnd";
import Division from "@/components/ui/sections/Division";
import Section from "@/components/ui/sections/Section";
import ROUTES from "@/constants/Routes";
import { logToConsole } from "@/toolkit/debug/Console";
import {
    DeleteActiveObjective,
    GenerateDescriptionOfObjective,
    GetAllObjectives,
} from "@/toolkit/objectives/ActiveObjectives";
import { ActiveObjective } from "@/types/ActiveObjectives";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import TopBar from "@/components/navigation/TopBar";

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
                logToConsole("Error fetching Active Objectives: " + e, "error");
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
                "Error deleting objective " + identifier + ": " + e,
                "error",
            );
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={false}
                header="Dashboard"
                subHeader="Setup here your path to success!"
            />
            <Section kind="ActiveObjectives">
                {activeObjectives === null || activeObjectives.length === 0 ? (
                    <Division header="You don't have any objectives... Let's create one!" />
                ) : (
                    activeObjectives.map((obj: ActiveObjective) => {
                        return (
                            <Division
                                key={obj.identifier}
                                preHeader="ACTIVE OBJECTIVE"
                                header={obj.exercise}
                                subHeader={GenerateDescriptionOfObjective(
                                    obj,
                                    t,
                                )}
                            >
                                <BetterButton
                                    style="WOR"
                                    buttonText="Delete"
                                    buttonHint="Permanently removes an active objective (the one this button is tied to)"
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
                        buttonText="Create active objective"
                        buttonHint="Redirects the user to a page where he can create an active objective"
                        style="GOD"
                        action={() =>
                            router.push(ROUTES.ACTIVE_OBJECTIVES.CREATE)
                        }
                    />
                </View>
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
