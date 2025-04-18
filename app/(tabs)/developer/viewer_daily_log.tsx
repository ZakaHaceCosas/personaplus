import TopBar from "@/components/navigation/top_bar";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import { BetterTextSmallText } from "@/components/text/better_text_presets";
import { GetActiveObjectiveDailyLog } from "@/toolkit/objectives/active_objectives";
import { GetPassiveObjectiveDailyLog } from "@/toolkit/objectives/passive_objectives";
import { ActiveObjectiveDailyLog } from "@/types/active_objectives";
import { PassiveObjectiveDailyLog } from "@/types/passive_objectives";
import React, { useEffect } from "react";
import { ReactElement, useState } from "react";

function render(
    dailyLog: ActiveObjectiveDailyLog | PassiveObjectiveDailyLog,
): ReactElement {
    return (
        <>
            {Object.entries(dailyLog).map((i) => {
                return (
                    <>
                        <BetterTextSmallText key={i[0]}>
                            {i[0]}
                            {"\n"}
                        </BetterTextSmallText>
                        {Object.entries(i[1]).map((i) => {
                            return (
                                <>
                                    <BetterTextSmallText key={i[0]}>
                                        {"  > "}
                                        {i[0]}
                                        {"\n"}
                                    </BetterTextSmallText>
                                    {/* @ts-expect-error (idk why it shows an error, it works) */}
                                    {Object.entries(i[1]).map((i) => (
                                        <BetterTextSmallText key={i[0]}>
                                            {"    > "}
                                            {JSON.stringify(i[1])
                                                .split(',"')[0]
                                                ?.trim()}
                                            {"\n"}
                                        </BetterTextSmallText>
                                    ))}
                                </>
                            );
                        })}
                    </>
                );
            })}
        </>
    );
}

export default function ViewerDailyLog(): ReactElement {
    const [loading, setLoading] = useState<boolean>(true);
    const [activeDailyLog, setActiveDailyLog] =
        useState<ActiveObjectiveDailyLog | null>(null);
    const [passiveDailyLog, setPassiveDailyLog] =
        useState<PassiveObjectiveDailyLog | null>(null);

    useEffect((): void => {
        async function handler(): Promise<void> {
            try {
                const active: ActiveObjectiveDailyLog =
                    await GetActiveObjectiveDailyLog();
                const passive: PassiveObjectiveDailyLog =
                    await GetPassiveObjectiveDailyLog();
                setActiveDailyLog(
                    Object.keys(active).length === 0 ? null : active,
                );
                setPassiveDailyLog(
                    Object.keys(passive).length === 0 ? null : passive,
                );
            } finally {
                setLoading(false);
            }
        }
        handler();
    }, []);

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={true}
                header="Daily log"
                subHeader="View all your progress."
            />
            {!activeDailyLog ? (
                <BetterTextSmallText>
                    No active daily log yet!
                </BetterTextSmallText>
            ) : (
                <BetterTextSmallText>
                    {render(activeDailyLog)}
                </BetterTextSmallText>
            )}
            {!passiveDailyLog ? (
                <BetterTextSmallText>
                    No passive daily log yet!
                </BetterTextSmallText>
            ) : (
                <BetterTextSmallText>
                    {render(passiveDailyLog)}
                </BetterTextSmallText>
            )}
            <PageEnd size="normal" includeText={false} />
        </>
    );
}
