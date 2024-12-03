import Loading from "@/components/static/Loading";
import PageEnd from "@/components/static/PageEnd";
import {
    BetterTextHeader,
    BetterTextSmallText,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import BetterAlert from "@/components/ui/BetterAlert";
import GapView from "@/components/ui/GapView";
import Division from "@/components/ui/sections/Division";
import Section from "@/components/ui/sections/Section";
import CoreLibrary from "@/core/CoreLibrary";
import { OrchestrateUserData } from "@/toolkit/User";
import { logToConsole } from "@/toolkit/debug/Console";
import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

export default function Report() {
    // const { t } = useTranslation();
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
            <BetterTextHeader>Your report</BetterTextHeader>
            <BetterTextSubHeader>This is how you're doing</BetterTextSubHeader>
            <GapView height={10} />
            <BetterAlert
                style="HMM"
                preTitle="Disclaimer"
                title="This page is an experiment"
                layout="alert"
                bodyText="This page is expected to change a lot. Until this warning is removed, please consider the values shown above imprecise and don't trust them."
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
