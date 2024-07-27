// Dashboard.tsx
// Dashboard, where you setup your path to success.

import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    DimensionValue,
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
import { useTranslation } from "react-i18next";

// TypeScript, supongo
import { Objective } from "@/src/types/Objective";

// Creamos los estilos
const styles = StyleSheet.create({
    containerview: {
        width: "100vw" as DimensionValue,
        height: "100vh" as DimensionValue,
    },
    mainview: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as DimensionValue,
        height: "100vh" as DimensionValue,
        overflow: "scroll",
    },
});

// Creamos la función
export default function Dashboard() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [objectives, setObjectives] = useState<{
        [key: string]: Objective;
    } | null>(null);

    useEffect(() => {
        const fetchObjectives = async () => {
            try {
                const storedObjectives =
                    await AsyncStorage.getItem("objectives");
                if (storedObjectives) {
                    setObjectives(JSON.parse(storedObjectives));
                    termLog(
                        "(DASHBOARD.TSX) Objectives fetched and parsed!",
                        "success"
                    );
                    setLoading(false);
                } else {
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
                termLog(
                    "Could not get objectives fetched due to error: " + e,
                    "error"
                );
            }
        };

        fetchObjectives();
    }, [t]);

    const handleDeleteObjective = async (identifier: number) => {
        try {
            await deleteObjective(identifier);
            const updatedObjectives = await getObjectives("object");
            if (Array.isArray(updatedObjectives)) {
                const objectivesObject =
                    objectiveArrayToObject(updatedObjectives);

                setObjectives(objectivesObject);
                if (Platform.OS === "android") {
                    ToastAndroid.show(
                        t("page_dashboard.item_deleted", { id: identifier }),
                        ToastAndroid.SHORT
                    );
                }
            } else {
                termLog("Expected an array and got a string instead", "error");
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

    const currentpage: string = usePathname();

    if (loading) {
        return (
            <View style={styles.containerview}>
                <BottomNav currentLocation={currentpage} />
                <ScrollView>
                    <View style={styles.mainview}>
                        <BetterText
                            fontWeight="Regular"
                            fontSize={15}
                            textAlign="center"
                            textColor="#C8C8C8"
                        >
                            {t("globals.loading")}{" "}
                        </BetterText>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.containerview}>
            <BottomNav currentLocation={currentpage} />
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

                            const description = defineObjectiveDescription(
                                t,
                                objective
                            );

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
                                        subheader={description}
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
                                textColor="#FFF"
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
        </View>
    );
}
