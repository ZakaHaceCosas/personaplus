import React, { ReactElement, useEffect, useState } from "react";
import BetterButton from "@/components/interaction/better_button";
import PageEnd from "@/components/static/page_end";
import {
    BetterTextSmallText,
    BetterTextSubHeader,
} from "@/components/text/better_text_presets";
import BetterAlert from "@/components/ui/better_alert";
import GapView from "@/components/ui/gap_view";
import { Routes } from "@/constants/routes";
import StoredItemNames from "@/constants/stored_item_names";
import { getLogsFromStorage, logToConsole } from "@/toolkit/console";
import AsyncStorage from "expo-sqlite/kv-store";
import * as Device from "expo-device";
import { router } from "expo-router";
import TopBar from "@/components/navigation/top_bar";
import { ShowToast } from "@/toolkit/android";
import { Logs } from "@/types/logs";
import Loading from "@/components/static/loading";

export default function DevInterface(): ReactElement {
    const [loading, setLoading] = useState<boolean>(true);
    const [logs, setLogs] = useState<Logs>([]);

    useEffect((): void => {
        try {
            // logs
            setLogs(getLogsFromStorage());
        } catch (e) {
            const err = `Error fetching logs at DevInterface: ${e}`;
            logToConsole(err, "error");
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) return <Loading />;

    async function clearLogs(): Promise<void> {
        try {
            await AsyncStorage.setItem(StoredItemNames.consoleLogs, "");
            ShowToast("Clear!");
        } catch (e) {
            logToConsole(`Failed to clear logs: ${e}`, "error");
        }
    }

    return (
        <>
            <TopBar
                includeBackButton={true}
                header="Dev Interface"
                subHeader="Advanced toggles and stuff. English only."
            />
            <BetterAlert
                style="DEFAULT"
                preTitle="Generic info from your device"
                title={`Client details`}
                bodyText={`Manufacturer: ${Device.manufacturer}\nBrand: ${Device.brand}\nCodename: ${Device.designName}\nDevice name: ${Device.deviceName}\nYear: ${Device.deviceYearClass}\nModel name: ${Device.modelName}\nOS BUILD ID: ${Device.osBuildId}\nOS NAME + VERSION: ${Device.osName} ${Device.osVersion}\nANDROID API LEVEL: ${Device.platformApiLevel}\nProduct name: ${Device.productName}\nTotal memory: ${Device.totalMemory} (in bytes)`}
                layout="alert"
            />
            <GapView height={20} />
            <BetterTextSubHeader>Active objectives</BetterTextSubHeader>
            <GapView height={10} />
            <BetterButton
                buttonText="View all Active Objectives"
                buttonHint="Opens up a dedicated page for viewing all your active objectives."
                style="ACE"
                action={(): void =>
                    router.push(Routes.DEV_INTERFACE.VIEWER_ACTIVE_OBJECTIVES)
                }
            />
            <GapView height={20} />
            <BetterTextSubHeader>User data</BetterTextSubHeader>
            <GapView height={10} />
            <BetterButton
                buttonText="See all user data"
                buttonHint="Opens up a dedicated page for viewing all of your data."
                style="ACE"
                action={(): void =>
                    router.push(Routes.DEV_INTERFACE.VIEWER_USER_DATA)
                }
            />
            <GapView height={20} />
            <BetterTextSubHeader>Notifications</BetterTextSubHeader>
            <GapView height={10} />
            <BetterButton
                buttonText="See all scheduled notifications"
                buttonHint="Opens up a dedicated page for viewing all of your scheduled notification reminders."
                style="ACE"
                action={(): void =>
                    router.push(Routes.DEV_INTERFACE.VIEWER_NOTIFICATIONS)
                }
            />
            <GapView height={20} />
            <BetterTextSubHeader>Console logs</BetterTextSubHeader>
            <GapView height={10} />
            <BetterButton
                buttonText="See all logs"
                buttonHint="Opens up a dedicated page for viewing all console logs."
                style="ACE"
                action={(): void =>
                    router.push(Routes.DEV_INTERFACE.VIEWER_LOGS)
                }
            />
            <GapView height={10} />
            <BetterButton
                buttonText="See error logs only"
                buttonHint="Opens up a dedicated page for viewing warning and error console logs."
                style="DEFAULT"
                action={(): void =>
                    router.push(Routes.DEV_INTERFACE.VIEWER_ERROR_LOGS)
                }
            />
            <GapView height={10} />
            <BetterTextSmallText>
                If log viewers take too much to load or you simply want to
                reduce storage usage, you can directly flush them from here.
                Current amount of logs: {logs.length}.
            </BetterTextSmallText>
            <GapView height={10} />
            <BetterButton
                buttonText="Clear logs"
                buttonHint="Removes all saved console logs from storage."
                style="HMM"
                action={clearLogs}
            />
            <PageEnd includeText={true} size="tiny" />
        </>
    );
}
