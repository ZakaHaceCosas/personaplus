import React from "react";
import Loading from "@/components/static/loading";
import {
    BetterTextSmallText,
    BetterTextSmallerText,
} from "@/components/text/better_text_presets";
import { getLogsFromStorage, logToConsole } from "@/toolkit/debug/console";
import { Logs } from "@/types/logs";
import { useEffect, useState } from "react";
import GapView from "@/components/ui/gap_view";
import PageEnd from "@/components/static/page_end";
import TopBar from "@/components/navigation/top_bar";
import Console from "@/components/ui/console";

export default function ErrorLogger() {
    const [loading, setLoading] = useState<boolean>(true);
    const [logs, setLogs] = useState<Logs>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        function handler() {
            try {
                // logs
                const bareLogs: Logs = getLogsFromStorage();
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
        }

        handler();
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
                Note: Logs are SOMETIMES formatted as MM/DD/YYYY due to React's
                constraints. Apologies for the inconvenience.
            </BetterTextSmallerText>
            <GapView height={5} />
            <BetterTextSmallerText>
                Note 2: Each log consists of two parts: the first entry is for
                type, timestamp, and traceback, while the second entry, contains
                the log's text. Both entries are color-coded.
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
