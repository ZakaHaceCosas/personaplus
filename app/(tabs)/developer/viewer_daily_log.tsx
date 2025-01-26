import TopBar from "@/components/navigation/top_bar";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import { BetterTextSmallText } from "@/components/text/better_text_presets";
import StoredItemNames from "@/constants/stored_item_names";
import { ActiveObjectiveDailyLog } from "@/types/active_objectives";
import AsyncStorage from "expo-sqlite/kv-store";
import React, { useEffect } from "react";
import { ReactElement, useState } from "react";

export default function ViewerDailyLog(): ReactElement {
    const [loading, setLoading] = useState<boolean>(true);
    const [dailyLog, setDailyLog] = useState<ActiveObjectiveDailyLog | null>(
        null,
    );

    useEffect((): void => {
        async function handler(): Promise<void> {
            try {
                const dailyLogString: string | null =
                    await AsyncStorage.getItem(StoredItemNames.dailyLog);

                if (dailyLogString) {
                    setDailyLog(JSON.parse(dailyLogString));
                }
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
            {dailyLog === null ? (
                <BetterTextSmallText>No daily log yet!</BetterTextSmallText>
            ) : (
                <BetterTextSmallText>
                    {JSON.stringify(dailyLog, undefined, 2)}
                </BetterTextSmallText>
            )}
            <PageEnd size="normal" includeText={false} />
        </>
    );
}
