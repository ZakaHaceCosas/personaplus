import BetterButton from "@/components/interaction/better_button";
import Loading from "@/components/static/loading";
import PageEnd from "@/components/static/page_end";
import {
    BetterTextSmallerText,
    BetterTextSmallText,
} from "@/components/text/better_text_presets";
import GapView from "@/components/ui/gap_view";
import { Routes } from "@/constants/routes";
import StoredItemNames from "@/constants/stored_item_names";
import { getLogsFromStorage, logToConsole } from "@/toolkit/console";
import AsyncStorage from "expo-sqlite/kv-store";
import { router } from "expo-router";
import React, { ReactElement } from "react";
import { useEffect, useState } from "react";
import TopBar from "@/components/navigation/top_bar";
import Console from "@/components/ui/console";
import { Log } from "@/types/logs";

export default function Logger(): ReactElement {
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

    async function clearLogs(): Promise<void> {
        try {
            await AsyncStorage.setItem(StoredItemNames.consoleLogs, "");
            router.replace(Routes.DEV_INTERFACE.VIEWER_LOGS);
        } catch (e) {
            logToConsole(`Failed to clear logs: ${e}`, "error");
        }
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <TopBar
                includeBackButton={true}
                header="Full Console View"
                subHeader={null}
            />
            <BetterTextSmallerText>
                Note: Logs may grow large over time. It's a good idea to clear
                them regularly to save storage and keep the Dev Interface
                responsive (unless troubleshooting errors!).
            </BetterTextSmallerText>
            <GapView height={5} />
            <BetterTextSmallerText>
                Each log consists of two parts: the first entry is for type,
                timestamp, and traceback, while the second entry, contains the
                log's text. Both entries are color-coded.
            </BetterTextSmallerText>
            <GapView height={5} />
            <BetterButton
                buttonText="Clear logs"
                buttonHint="Removes all saved console logs from storage."
                style="HMM"
                action={clearLogs}
            />
            {error ? (
                <BetterTextSmallText>{error}</BetterTextSmallText>
            ) : (
                <Console logs={logs} errorOnly={false} />
            )}
            <PageEnd includeText={true} size="tiny" />
        </>
    );
}
