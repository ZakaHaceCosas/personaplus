import BetterButton from "@/components/interaction/BetterButton";
import Loading from "@/components/static/Loading";
import PageEnd from "@/components/static/PageEnd";
import {
    BetterTextSmallText,
    BetterTextSmallerText,
} from "@/components/text/BetterTextPresets";
import GapView from "@/components/ui/GapView";
import ROUTES from "@/constants/Routes";
import StoredItemNames from "@/constants/StoredItemNames";
import { getLogsFromStorage, logToConsole } from "@/toolkit/debug/Console";
import { Logs } from "@/types/Logs";
import AsyncStorage from "expo-sqlite/kv-store";
import { router } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import TopBar from "@/components/navigation/TopBar";
import Console from "@/components/ui/Console";

export default function HomeScreen() {
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

    async function clearLogs() {
        try {
            await AsyncStorage.setItem(StoredItemNames.consoleLogs, "");
            router.replace(ROUTES.DEV_INTERFACE.LOG_VIEW);
        } catch (e) {
            logToConsole("Failed to clear logs: " + e, "error");
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
                Note 2: Logs are SOMETIMES formatted as MM/DD/YYYY due to
                React's constraints. Apologies for the inconvenience.
            </BetterTextSmallerText>
            <GapView height={5} />
            <BetterTextSmallerText>
                Note 3: Each log consists of two parts: the first entry is for
                type, timestamp, and traceback, while the second entry, contains
                the log's text. Both entries are color-coded.
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
