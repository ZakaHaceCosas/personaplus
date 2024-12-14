import React from "react";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import {
    BetterTextNormalText,
    BetterTextSmallText,
} from "@/components/text/better_text_presets";
import BetterAlert from "@/components/ui/better_alert";
import GapView from "@/components/ui/gap_view";
import Division from "@/components/ui/sections/division";
import Section from "@/components/ui/sections/section";
import CoreLibrary from "@/core/core";
import { OrchestrateUserData } from "@/toolkit/user";
import { logToConsole } from "@/toolkit/debug/console";
import { useEffect, useState } from "react";
import TopBar from "@/components/navigation/top_bar";
import { useTranslation } from "react-i18next";
import { ActiveObjectiveDailyLog } from "@/types/active_objectives";
import { GetActiveObjectiveDailyLog } from "@/toolkit/objectives/active_objectives";
import { CoreLibraryResponse } from "@/core/types/core_library_response";
import { FullProfile } from "@/types/user";

export default function Report() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(true);
    const [report, setReport] = useState<any>();
    const [dailyLog, setDailyLog] = useState<ActiveObjectiveDailyLog | null>(
        null,
    );

    async function handler(): Promise<void> {
        try {
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

            const BMRSource: CoreLibraryResponse =
                CoreLibrary.physicalHealth.BasalMetabolicRate.calculate(
                    data.age,
                    data.gender,
                    data.weight,
                    data.height,
                    data.activeness,
                );
            const BMR: number = BMRSource.result;
            const BMRContext: string | undefined = BMRSource.context;

            setReport({
                BMI: {
                    value: BMI.toPrecision(3),
                    context: BMIContext,
                },
                BMR: {
                    value: BMR.toPrecision(4),
                    context: BMRContext,
                },
            });

            const dailyLog: ActiveObjectiveDailyLog | null =
                await GetActiveObjectiveDailyLog();
            setDailyLog(dailyLog);
        } catch (e) {
            logToConsole(`Error handling your report! ${e}`, "error", {
                location: "@/app/(tabs)/Report.tsx",
                function: "fetchUserData()",
                isHandler: true,
                handlerName: "handler()",
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect((): void => {
        handler();
    }, []);

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={false}
                header={t("pages.report.header")}
                subHeader={t("pages.report.subheader")}
            />
            <BetterAlert
                style="HMM"
                layout="alert"
                preTitle="Disclaimer"
                title={t("pages.report.disclaimer.header")}
                bodyText={t("pages.report.disclaimer.subheader")}
            />
            <GapView height={20} />
            <Section kind="HowYouAreDoing">
                {report ? (
                    <>
                        <Division
                            preHeader="BMI"
                            header={report.BMI.value}
                            subHeader={report.BMI.context}
                        />
                        <Division
                            preHeader="BMR"
                            header={report.BMR.value}
                            subHeader={report.BMR.context}
                        />
                    </>
                ) : (
                    <BetterTextSmallText>
                        Oh, wow. An error happened loading your report. Sorry!
                    </BetterTextSmallText>
                )}
            </Section>
            <GapView height={20} />
            <Section kind="ActiveObjectives">
                {dailyLog ? (
                    Object.entries(dailyLog).map(([date, entries]) => (
                        <Division header={date} key={date} direction="vertical">
                            {Object.entries(entries).map(([id, entry]) => (
                                <React.Fragment key={id}>
                                    <BetterTextNormalText>
                                        {entry.objective
                                            ? entry.objective.exercise
                                            : id}
                                    </BetterTextNormalText>
                                    <BetterTextSmallText>
                                        {entry.wasDone ? "Done" : "Missed!"}
                                    </BetterTextSmallText>
                                    <BetterTextSmallText>
                                        Performance:{" "}
                                        {entry.performance === 0
                                            ? "No data"
                                            : `${entry.performance.result.toFixed(2)} burnt calories`}
                                    </BetterTextSmallText>
                                </React.Fragment>
                            ))}
                        </Division>
                    ))
                ) : (
                    <Division
                        header="Here goes your daily log"
                        subHeader="We log your results each time you do a session. Here we store all the metadata of each session. As soon as you do something, you'll see results here."
                    />
                )}
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
