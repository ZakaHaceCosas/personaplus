import React, { ReactElement } from "react";
import Loading from "@/components/static/loading";
import {
    BetterTextSmallerText,
    BetterTextSmallText,
} from "@/components/text/better_text_presets";
import { getLogsFromStorage, logToConsole } from "@/toolkit/console";
import { Log } from "@/types/logs";
import { useEffect, useState } from "react";
import PageEnd from "@/components/static/page_end";
import TopBar from "@/components/navigation/top_bar";
import Console from "@/components/ui/console";

export default function ErrorLogger(): ReactElement {
    const [loading, setLoading] = useState<boolean>(true);
    const [logs, setLogs] = useState<Log[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect((): void => {
        try {
            // logs
            const bareLogs: Log[] = getLogsFromStorage();
            if (!bareLogs) {
                throw new Error("HOW CAN LOGS BE NULL?");
            }
            setLogs(bareLogs);
        } catch (e) {
            const err = `Error fetching data at DevInterface: ${e}`;
            logToConsole(err, "error");
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={true}
                header="Error Console View"
                subHeader={null}
            />
            <BetterTextSmallerText>
                Each log consists of two parts: the first entry is for type,
                timestamp, and traceback, while the second entry, contains the
                log's text. Both entries are color-coded.
            </BetterTextSmallerText>
            {error ? (
                <BetterTextSmallText>{error}</BetterTextSmallText>
            ) : (
                <Console errorOnly={true} logs={logs} />
            )}
            <PageEnd includeText={true} size="tiny" />
        </>
    );
}
