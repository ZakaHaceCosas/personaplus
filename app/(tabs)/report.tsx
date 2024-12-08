import React from "react";
import Loading from "@/components/static/loading_re";
import PageEnd from "@/components/static/page_end";
import { BetterTextSmallText } from "@/components/text/better_text_presets";
import BetterAlert from "@/components/ui/better_alert";
import GapView from "@/components/ui/gap_view";
import Division from "@/components/ui/sections/division_re";
import Section from "@/components/ui/sections/section_re";
import CoreLibrary from "@/core/core";
import { OrchestrateUserData } from "@/toolkit/user_re";
import { logToConsole } from "@/toolkit/debug/console_re";
import { useEffect, useState } from "react";
import TopBar from "@/components/navigation/top_bar";
import { useTranslation } from "react-i18next";

export default function Report() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(true);
    const [report, setReport] = useState<any>();

    async function handler(): Promise<void> {
        try {
            const data = await OrchestrateUserData();

            const BMISource =
                CoreLibrary.physicalHealth.BodyMassIndex.calculate(
                    data.age,
                    data.gender,
                    data.weight,
                    data.height,
                );
            const BMI: number = BMISource.result;
            const BMIContext: string | undefined = BMISource.context;

            const BMRSource =
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
        } catch (e) {
            logToConsole("Error handling your report! " + e, "error", {
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
            <PageEnd includeText={true} />
        </>
    );
}
