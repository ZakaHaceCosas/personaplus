import React from "react";
import BetterButton from "@/components/interaction/BetterButton";
import Loading from "@/components/static/Loading";
import PageEnd from "@/components/static/PageEnd";
import {
    BetterTextSmallText,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import BetterAlert from "@/components/ui/BetterAlert";
import BetterTable, { BetterTableItem } from "@/components/ui/BetterTable";
import GapView from "@/components/ui/GapView";
import ROUTES from "@/constants/Routes";
import StoredItemNames from "@/constants/StoredItemNames";
import { logToConsole } from "@/toolkit/debug/Console";
import {
    GetActiveObjectiveDailyLog,
    GetAllObjectives,
} from "@/toolkit/objectives/ActiveObjectives";
import {
    ActiveObjective,
    ActiveObjectiveDailyLog,
} from "@/types/ActiveObjectives";
import { FullProfile } from "@/types/User";
import AsyncStorage from "expo-sqlite/kv-store";
import * as Device from "expo-device";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import TopBar from "@/components/navigation/TopBar";
import { ShowToast } from "@/toolkit/Android";

export default function HomeScreen() {
    const [loading, setLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<BetterTableItem[]>([]);
    const [objectives, setObjectives] = useState<BetterTableItem[]>([]);
    const [dailyLog, setDailyLog] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function handler() {
            try {
                // user data
                const bareUserData: string | null = await AsyncStorage.getItem(
                    StoredItemNames.userData,
                );
                if (!bareUserData) {
                    throw new Error("userData is null!");
                }
                const readyData: FullProfile = JSON.parse(bareUserData);
                const mappedArray = Object.entries(readyData).map(
                    ([key, value]) =>
                        ({
                            name: key,
                            value: String(value),
                        }) as BetterTableItem,
                );
                setUserData(mappedArray);

                // dailyLog
                const bareDailyLog: ActiveObjectiveDailyLog | null =
                    await GetActiveObjectiveDailyLog();
                if (!bareDailyLog) {
                    setDailyLog("No daily log (null)");
                }
                setDailyLog(bareDailyLog ? JSON.stringify(bareDailyLog) : null);

                // objectives
                const objectives: ActiveObjective[] | null =
                    await GetAllObjectives();

                if (objectives) {
                    setObjectives(
                        objectives.map((obj) => ({
                            name: obj.exercise,
                            value: String(obj.identifier),
                        })),
                    );
                }
            } catch (e) {
                const err = "Error fetching data at DevInterface: " + e;
                logToConsole(err, "error");
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        handler();
    }, [objectives]);

    async function clearLogs() {
        try {
            await AsyncStorage.setItem(StoredItemNames.consoleLogs, "");
            ShowToast("Clear!");
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
                header="Dev Interface"
                subHeader="Advanced toggles and stuff. English only."
            />
            <BetterAlert
                style="DEFAULT"
                preTitle="Generic info from your device"
                title={`Client details`}
                bodyText={`Manufacturer: ${Device.manufacturer}\nBrand: ${
                    Device.brand
                }\nCodename: ${Device.designName}\nDevice name: ${
                    Device.deviceName
                }\nDevice type: ${
                    Device.deviceType
                } - Expo's DeviceType Enum\nYear: ${
                    Device.deviceYearClass
                }\nIs device or is emulator: ${
                    Device.isDevice ? "is device" : "is emulator"
                }\nModel name: ${Device.modelName}\nOS BUILD ID: ${
                    Device.osBuildId
                }\nOS NAME + VERSION: ${Device.osName} ${
                    Device.osVersion
                }\nANDROID API LEVEL: ${
                    Device.platformApiLevel
                }\nProduct name: ${Device.productName}\nTotal memory: ${
                    Device.totalMemory
                } (in bytes)`}
                layout="alert"
            />
            <GapView height={10} />
            {userData.length > 0 && (
                <>
                    <BetterTextSmallText>
                        Your user data object. Some data is only used internally
                        and nowhere else shown to you.
                    </BetterTextSmallText>
                    <GapView height={5} />
                    <BetterTable headers={["Key", "Value"]} items={userData} />
                </>
            )}
            <GapView height={10} />
            {objectives.length > 0 && (
                <>
                    <BetterTextSmallText>
                        All your objectives. The ID is just used by the app, to
                        differentiate objectives.
                    </BetterTextSmallText>
                    <GapView height={5} />
                    <BetterTable
                        headers={["Objective", "ID"]}
                        items={objectives}
                    />
                </>
            )}
            <GapView height={10} />
            <BetterAlert
                style="DEFAULT"
                preTitle={"AsyncStorage item: " + StoredItemNames.dailyLog}
                title={error ? "An error happened:" : "Daily log (raw JSON)"}
                bodyText={error ? error : dailyLog ? dailyLog : "null"}
                layout="alert"
            />
            <GapView height={20} />
            <BetterTextSubHeader>Console logs</BetterTextSubHeader>
            <GapView height={10} />
            <BetterButton
                buttonText="See all logs"
                buttonHint="Opens up a dedicated page for viewing all console logs."
                style="ACE"
                action={() => router.push(ROUTES.DEV_INTERFACE.LOG_VIEW)}
            />
            <GapView height={10} />
            <BetterButton
                buttonText="See error logs only"
                buttonHint="Opens up a dedicated page for viewing warning and error console logs."
                style="DEFAULT"
                action={() => router.push(ROUTES.DEV_INTERFACE.ERROR_LOG_VIEW)}
            />
            <GapView height={10} />
            <BetterTextSmallText>
                If log viewers take too much to load or you simply want to
                reduce storage usage, you can directly flush them from here.
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
