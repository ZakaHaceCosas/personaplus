import React, { ReactElement } from "react";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import {
    BetterTextNormalText,
    BetterTextSmallText,
} from "@/components/text/better_text_presets";
import GapView from "@/components/ui/gap_view";
import Division from "@/components/ui/sections/division";
import Section from "@/components/ui/sections/section";
import CoreLibrary from "@/core/core";
import { OrchestrateUserData } from "@/toolkit/user";
import { useEffect, useState } from "react";
import TopBar from "@/components/navigation/top_bar";
import { useTranslation } from "react-i18next";
import {
    ActiveObjectiveDailyLog,
    ActiveObjectiveDailyLogEntry,
} from "@/types/active_objectives";
import { GetActiveObjectiveDailyLog } from "@/toolkit/objectives/active_objectives";
import { CoreLibraryResponse } from "@/core/types/core_library_response";
import { FullProfile } from "@/types/user";
import { StyleSheet, View } from "react-native";
import Colors from "@/constants/colors";
import { PassiveObjective } from "@/types/passive_objectives";
import {
    GetAllPassiveObjectives,
    GetPassiveObjectiveStreak,
} from "@/toolkit/objectives/passive_objectives";

/**
 * Returns a view that represents the BMI context in a traffic light-like style.
 *
 * @param {("severely underweight" | "underweight" | "healthy weight" | "overweight" | "obesity")} context The BMI context
 * @returns {ReactElement}
 */
function BMIView({
    context,
}: {
    context:
        | "severely underweight"
        | "underweight"
        | "healthy weight"
        | "overweight"
        | "obesity";
}): ReactElement {
    const styles = StyleSheet.create({
        wrapper: {
            height: 10,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            borderRadius: 10,
            overflow: "hidden",
            gap: 5,
        },
        cell: {
            flex: 1,
            borderRadius: 2,
        },
    });

    const getColorForFragment = (index: number, totalFragments: number) => {
        if (context === "severely underweight") {
            return index < totalFragments / 5
                ? Colors.PRIMARIES.WOR.WOR
                : Colors.MAIN.DEFAULT_ITEM.BACKGROUND;
        }

        if (context === "underweight") {
            return index < totalFragments / 3
                ? Colors.PRIMARIES.HMM.HMM
                : Colors.MAIN.DEFAULT_ITEM.BACKGROUND;
        }

        if (context === "healthy weight") {
            return index < totalFragments / 2
                ? Colors.PRIMARIES.ACE.ACE
                : Colors.MAIN.DEFAULT_ITEM.BACKGROUND;
        }

        if (context === "overweight") {
            return index < totalFragments / 1.5
                ? Colors.PRIMARIES.HMM.HMM
                : Colors.MAIN.DEFAULT_ITEM.BACKGROUND;
        }

        if (context === "obesity") {
            return Colors.PRIMARIES.WOR.WOR; // all bad all red
        }

        // default background color for stuff we haven't reached
        return Colors.MAIN.DEFAULT_ITEM.BACKGROUND;
    };

    return (
        <View style={styles.wrapper}>
            {Array.from({ length: 5 }).map(
                (_: unknown, index: number): ReactElement => (
                    <View
                        key={index}
                        style={[
                            styles.cell,
                            {
                                backgroundColor: getColorForFragment(index, 5),
                            },
                        ]}
                    />
                ),
            )}
        </View>
    );
}

export default function Report(): ReactElement {
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(true);
    const [report, setReport] = useState<{
        BMI: { value: string; context: string };
    }>();
    const [dailyLog, setDailyLog] = useState<ActiveObjectiveDailyLog | null>(
        null,
    );

    const [streaks, setStreaks] = useState<
        { obj: PassiveObjective; streak: number }[]
    >([]);

    const hasDailyLog: boolean =
        dailyLog !== null && Object.values(dailyLog).length > 0;

    useEffect((): void => {
        async function handler(): Promise<void> {
            try {
                // BMI data
                const data: FullProfile = await OrchestrateUserData();
                const BMISource: CoreLibraryResponse =
                    CoreLibrary.physicalHealth.BodyMassIndex.calculate(
                        data.age,
                        data.gender,
                        data.weight,
                        data.height,
                    );
                const BMI: number = BMISource.result;
                const BMIContext: string | undefined = BMISource.context;

                setReport({
                    BMI: {
                        value: BMI.toPrecision(4),
                        context: BMIContext,
                    },
                });

                const dailyLog: ActiveObjectiveDailyLog | null =
                    await GetActiveObjectiveDailyLog();
                setDailyLog(dailyLog);

                const passiveObjs = await GetAllPassiveObjectives();
                if (Array.isArray(passiveObjs)) {
                    const objectivesWithStreak = await Promise.all(
                        passiveObjs.map(async (o) => ({
                            obj: o,
                            streak: await GetPassiveObjectiveStreak(
                                o.identifier,
                            ),
                        })),
                    );

                    setStreaks(objectivesWithStreak);
                }
                // streak data
            } catch (e) {
                console.error(`Error handling your report! ${e}`, {
                    location: "@/app/(tabs)/Report.tsx",
                    function: "fetchUserData()",
                    isHandler: true,
                    handlerName: "handler()",
                });
            } finally {
                setLoading(false);
            }
        }
        handler();
    }, []);

    /** yeah naming stuff ain't easy */
    type dateComparisonType = [
        string,
        {
            [identifier: number]: ActiveObjectiveDailyLogEntry;
        },
    ];

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={false}
                header={t("pages.report.header")}
                subHeader={t("pages.report.subheader")}
            />
            <Section kind="YourHealth">
                {report ? (
                    <Division
                        preHeader="BMI"
                        header={report.BMI.value}
                        subHeader={t(
                            `pages.report.yourHealth.BMI.${report.BMI.context}`,
                        )}
                    >
                        {/* @ts-expect-error TypeError */}
                        <BMIView context={report.BMI.context} />
                    </Division>
                ) : (
                    <BetterTextSmallText>
                        Oh, wow. An error happened loading your report. Sorry!
                    </BetterTextSmallText>
                )}
            </Section>
            <GapView height={20} />
            {streaks.length > 0 && (
                <>
                    <Section kind="HowYouAreDoing">
                        {streaks.map((i) => (
                            <Division
                                key={i.obj.identifier}
                                header={`${i.obj.goal} · ${i.streak}d`}
                                subHeader={`Created ${i.obj.createdAt}`}
                            />
                        ))}
                    </Section>
                    <GapView height={20} />
                </>
            )}
            <Section kind="HowYouAreDoing">
                {!hasDailyLog && (
                    <Division
                        header={t("pages.report.dailyLog.header")}
                        subHeader={t("pages.report.dailyLog.subheader")}
                    />
                )}
                {hasDailyLog &&
                    Object.entries(dailyLog!)
                        .slice(0, 7) // get the latest 7
                        .map(
                            ([
                                date,
                                entries,
                            ]: dateComparisonType): ReactElement => (
                                <Division
                                    header={date}
                                    key={date}
                                    direction="vertical"
                                >
                                    {Object.entries(entries).map(
                                        ([id, entry]: [
                                            string,
                                            ActiveObjectiveDailyLogEntry,
                                        ]): ReactElement => (
                                            <React.Fragment key={id}>
                                                <BetterTextNormalText>
                                                    {entry.objective
                                                        ? t(
                                                              `globals.supportedActiveObjectives.${
                                                                  entry
                                                                      .objective
                                                                      .exercise
                                                              }.name`,
                                                          )
                                                        : id}
                                                </BetterTextNormalText>
                                                <BetterTextSmallText>
                                                    {entry.wasDone
                                                        ? t(
                                                              "globals.interaction.done",
                                                          )
                                                        : t(
                                                              "globals.interaction.missed",
                                                          )}
                                                </BetterTextSmallText>
                                                <BetterTextSmallText>
                                                    Performance:{" "}
                                                    {entry.performance === 0
                                                        ? "N/A"
                                                        : `${entry.performance.result.toFixed(
                                                              2,
                                                          )}cal`}
                                                </BetterTextSmallText>
                                            </React.Fragment>
                                        ),
                                    )}
                                </Division>
                            ),
                        )}
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
