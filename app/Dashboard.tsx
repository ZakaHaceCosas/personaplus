// Dashboard.tsx
// Dashboard, where you setup your path to success.

import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Dimensions,
    Platform,
    ToastAndroid,
    View,
    ScrollView,
} from "react-native";
import BetterText from "@/src/BetterText";
import BottomNav from "@/src/BottomNav";
import Section from "@/src/section/Section";
import Division from "@/src/section/Division";
import GapView from "@/src/GapView";
import Footer from "@/src/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/src/Buttons";
import { termLog } from "@/src/toolkit/debug/console";
import {
    getObjectives,
    deleteObjective,
    defineObjectiveDescription,
    objectiveArrayToObject,
} from "@/src/toolkit/objectives";
import { router, usePathname } from "expo-router";
import colors from "@/src/toolkit/design/colors";
import { useTranslation } from "react-i18next";
import Loading from "@/src/Loading";

// TypeScript, supongo
import { Objective } from "@/src/types/Objective";

// uh, interface to fix weird "implicit any" error with descriptions
interface Descriptions {
    [identifier: string]: string | undefined;
}

// We define the styles
const styles = StyleSheet.create({
    containerview: {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
    },
    mainview: {
        padding: 20,
        paddingTop: 40,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
});

// We create the function
export default function Dashboard() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [objectives, setObjectives] = useState<{
        [key: string]: Objective;
    } | null>(null);
    const [descriptions, setDescriptions] = useState<Descriptions>({}); // this is for descriptions of the objectives in the dashboard

    useEffect(() => {
        // fetches objectives
        const fetchObjectives = async () => {
            try {
                // this looks a bit weird, but it actually works
                const storedObjectives = await getObjectives();
                if (storedObjectives || storedObjectives !== null) {
                    const finalObjectives =
                        objectiveArrayToObject(storedObjectives);
                    setObjectives(finalObjectives);
                    termLog(
                        "(DASHBOARD.TSX) Objectives fetched and parsed!",
                        "success"
                    );
                    setLoading(false);
                } else if (objectives === null) {
                    // no objectives
                    await AsyncStorage.setItem(
                        "objectives",
                        JSON.stringify([])
                    );
                    setObjectives(JSON.parse("[]"));
                    termLog(
                        "Could not get objectives fetched! Setting them to an empty array ( [] )",
                        "warn"
                    );
                } else {
                    // no objectives (fallback behaviour)
                    await AsyncStorage.setItem(
                        "objectives",
                        JSON.stringify([])
                    );
                    setObjectives(JSON.parse("[]"));
                    termLog(
                        "Could not get objectives fetched! Setting them to an empty array ( [] )",
                        "warn"
                    );
                }
            } catch (e) {
                // handle errors
                termLog(
                    "Could not get objectives fetched due to error: " + e,
                    "error"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchObjectives();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // objective deletion - pretty simple
    const handleDeleteObjective = async (identifier: number) => {
        try {
            await deleteObjective(identifier); // actually this line itself does the entire thing, thanks to the objective toolkit
            // the rest just updates the state to refresh the page
            const updatedObjectives = await getObjectives();
            if (updatedObjectives) {
                const objectivesObject =
                    objectiveArrayToObject(updatedObjectives);

                setObjectives(objectivesObject);
                if (Platform.OS === "android") {
                    ToastAndroid.show(
                        t("page_dashboard.item_deleted", { id: identifier }),
                        ToastAndroid.SHORT
                    );
                }
            }
        } catch (e) {
            termLog(
                t("page_dashboard.specific_errors.react_error", {
                    id: identifier,
                }) + e,
                "error"
            );
        }
    };

    useEffect(() => {
        const fetchDescriptions = async () => {
            try {
                if (objectives) {
                    const newDescriptions: Descriptions = {};
                    for (const key of Object.keys(objectives)) {
                        const objective = objectives[key];
                        if (objective) {
                            newDescriptions[objective.identifier] =
                                await defineObjectiveDescription(t, objective);
                        }
                    }
                    setDescriptions(newDescriptions);
                }
            } catch (e) {
                termLog("Error getting descriptions: " + e, "error");
            }
        };

        if (objectives) {
            fetchDescriptions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objectives]);

    const currentpage: string = usePathname(); // current page ("/Dashboard"). for the nav component.

    if (loading) {
        return <Loading currentpage={currentpage} displayNav={true} />;
    }

    return (
        <View style={styles.containerview}>
            <ScrollView style={styles.mainview}>
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={35}>
                    {t("page_dashboard.header.label")}
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={20}
                >
                    {t("page_dashboard.header.sublabel")}
                </BetterText>
                <GapView height={20} />
                <Section kind="Objectives">
                    {objectives && Object.keys(objectives).length > 0 ? (
                        Object.keys(objectives).map(key => {
                            const objective = objectives[key];
                            if (!objective) {
                                termLog(
                                    `Data is undefined for objective with key: ${key}`,
                                    "warn"
                                );
                                return null;
                            }

                            const description =
                                descriptions[objective.identifier];

                            return (
                                <View key={objective.identifier}>
                                    <Division
                                        status="REGULAR"
                                        preheader={t(
                                            "sections.divisions.active_objective"
                                        )}
                                        header={t(
                                            `globals.supported_active_objectives.${objective.exercise}`
                                        )}
                                        subheader={
                                            description || t("globals.loading")
                                        }
                                    >
                                        <Button
                                            style="WOR"
                                            action={() =>
                                                handleDeleteObjective(
                                                    objective.identifier
                                                )
                                            }
                                            buttonText={t("globals.remove")}
                                        />
                                    </Division>
                                </View>
                            );
                        })
                    ) : (
                        <View
                            style={{
                                padding: 20,
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <BetterText
                                textAlign="center"
                                fontSize={30}
                                textColor={colors.BASIC.WHITE}
                                fontWeight="Bold"
                            >
                                {t("page_dashboard.not_any_objective")}
                            </BetterText>
                            <GapView height={15} />
                            <Button
                                width="fill"
                                style="ACE"
                                buttonText={t("globals.lets_go")}
                                action={() =>
                                    router.navigate("/CreateObjective")
                                }
                            />
                        </View>
                    )}
                    {objectives && Object.keys(objectives).length > 0 && (
                        <View
                            style={{
                                padding: 20,
                            }}
                        >
                            <Button
                                width="fill"
                                style="GOD"
                                buttonText={t(
                                    "page_dashboard.create_active_objective"
                                )}
                                action={() =>
                                    router.navigate("/CreateObjective")
                                }
                            />
                        </View>
                    )}
                </Section>
                <Footer />
            </ScrollView>
            <BottomNav currentLocation={currentpage} />
        </View>
    );
}
