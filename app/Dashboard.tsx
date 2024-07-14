// Dashboard.tsx
// Dashboard, where you setup your path to success.

import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";
import BottomNav from "@/components/BottomNav";
import * as Router from "expo-router";
import Section from "@/components/section/Section";
import Division from "@/components/section/division/Division";
import GapView from "@/components/GapView";
import Footer from "@/components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/Buttons";
import { termLog } from "./DeveloperInterface";
import * as ObjectiveToolkit from "@/components/toolkit/objectives";
import { useTranslation } from "react-i18next";

// TypeScript, supongo
import { Objective } from "@/components/types/Objective";

// Creamos los estilos
const styles = Native.StyleSheet.create({
    containerview: {
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
    },
    mainview: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
        overflow: "scroll",
    },
});

// Creamos la función
export default function Dashboard() {
    const { t } = useTranslation();
    const [loading, setLoading] = React.useState(true);
    const [objectives, setObjectives] = React.useState<{
        [key: string]: Objective;
    } | null>(null);

    React.useEffect(() => {
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
                const log =
                    "Could not get objectives fetched due to error: " + e;
                termLog(log, "error");
                if (Native.Platform.OS === "android") {
                    Native.ToastAndroid.show(
                        `${t("globals.react_error")} - ${e}`,
                        Native.ToastAndroid.LONG
                    );
                }
            }
        };

        fetchObjectives();
    }, [t]);

    const handleDeleteObjective = async (identifier: number) => {
        try {
            await ObjectiveToolkit.deleteObjective(identifier);
            const updatedObjectives =
                await ObjectiveToolkit.fetchObjectives("object");
            setObjectives(updatedObjectives);
            if (Native.Platform.OS === "android") {
                Native.ToastAndroid.show(
                    t("page_dashboard.item_deleted", { id: identifier }),
                    Native.ToastAndroid.SHORT
                );
            }
        } catch (e) {
            const log: string = "Got an error updating, " + e;
            termLog(log, "error");
            if (Native.Platform.OS === "android") {
                Native.ToastAndroid.show(
                    `${t("page_dashboard.specific_errors.react_error", { id: identifier })} - ${e}`,
                    Native.ToastAndroid.LONG
                );
            }
        }
    };

    const currentpage: string = Router.usePathname();

    if (loading) {
        return (
            <Native.View style={styles.containerview}>
                <BottomNav currentLocation={currentpage} />
                <Native.ScrollView>
                    <Native.View style={styles.mainview}>
                        <BetterText
                            fontWeight="Regular"
                            fontSize={15}
                            textAlign="center"
                            textColor="#C8C8C8"
                        >
                            {t("globals.loading")}{" "}
                        </BetterText>
                    </Native.View>
                </Native.ScrollView>
            </Native.View>
        );
    }

    return (
        <Native.View style={styles.containerview}>
            <BottomNav currentLocation={currentpage} />
            <Native.ScrollView style={styles.mainview}>
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
                                const log = `Data is undefined for objective with key: ${key}`;
                                termLog(log, "warn");
                                return null;
                            }

                            let descriptionDraft: string = t(
                                "page_dashboard.objective.description",
                                {
                                    duration: objective.duration,
                                    rests: objective.rests,
                                    repetitions: objective.repetitions,
                                }
                            );
                            if (objective?.rests > 0) {
                                descriptionDraft = t(
                                    "page_dashboard.objective.description_with_rests",
                                    {
                                        duration: objective.duration,
                                        rests: objective.rests,
                                        restDuration: objective.restDuration,
                                        repetitions: objective.repetitions,
                                    }
                                );
                            }

                            descriptionDraft =
                                descriptionDraft +
                                (objective?.wasDone === true
                                    ? t(
                                          "page_dashboard.objective.was_done.true"
                                      )
                                    : t(
                                          "page_dashboard.objective.was_done.false"
                                      ));

                            const description: string =
                                descriptionDraft +
                                "\nID: " +
                                String(objective.identifier) +
                                ".";

                            return (
                                <Native.View key={objective.identifier}>
                                    <Division
                                        status="REGULAR"
                                        preheader={t(
                                            "sections.divisions.active_objective"
                                        )}
                                        header={objective.exercise}
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
                                </Native.View>
                            );
                        })
                    ) : (
                        <Native.View
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
                                    Router.router.navigate("/CreateObjective")
                                }
                            />
                        </Native.View>
                    )}
                    {objectives && Object.keys(objectives).length > 0 && (
                        <Native.View
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
                                    Router.router.navigate("/CreateObjective")
                                }
                            />
                        </Native.View>
                    )}
                </Section>
                <Footer />
            </Native.ScrollView>
        </Native.View>
    );
}
