import React from "react";
import Loading from "@/components/static/Loading";
import {
    BetterTextSmallText,
    BetterTextSmallerText,
} from "@/components/text/BetterTextPresets";
import { getLogsFromStorage, logToConsole } from "@/toolkit/debug/Console";
import { Logs } from "@/types/Logs";
import { useEffect, useState } from "react";
import GapView from "@/components/ui/GapView";
import PageEnd from "@/components/static/PageEnd";
import TopBar from "@/components/navigation/TopBar";
import Console from "@/components/ui/Console";

export default function ErrorLogger() {
    const [loading, setLoading] = useState<boolean>(true);
    const [logs, setLogs] = useState<Logs>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function handler() {
            try {
                // logs
                const bareLogs = await getLogsFromStorage();
                if (!bareLogs) {
                    throw new Error("HOW CAN LOGS BE NULL?");
                }
                setLogs(bareLogs);
            } catch (e) {
                const err = "Error fetching data at DevInterface: " + e;
                logToConsole(err, "error");
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        handler();
    }, []);

    if (loading) {
        return <Loading />;
    }

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
