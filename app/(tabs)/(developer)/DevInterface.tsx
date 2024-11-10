import BetterButton from "@/components/interaction/BetterButton";
import BackButton from "@/components/navigation/GoBack";
import Loading from "@/components/static/Loading";
import PageEnd from "@/components/static/PageEnd";
import {
    BetterTextHeader,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ToastAndroid } from "react-native";

export default function HomeScreen() {
    const [loading, setLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<string | null>(null);
    const [objectives, setObjectives] = useState<string | null>(null);
    const [dailyLog, setDailyLog] = useState<string | null>(null);
    const [allObjectivesForTable, setAllObjectivesForTable] = useState<
        BetterTableItem[]
    >([]);
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
                setUserData(JSON.stringify(readyData));

                // objectives
                const bareObjectives: ActiveObjective[] | null =
                    await GetAllObjectives();
                if (!bareObjectives) {
                    setObjectives("No objectives (null)");
                }
                setObjectives(
                    bareObjectives ? JSON.stringify(bareObjectives) : null,
                );

                // dailyLog
                const bareDailyLog: ActiveObjectiveDailyLog | null =
                    await GetActiveObjectiveDailyLog();
                if (!bareDailyLog) {
                    setObjectives("No daily log (null)");
                }
                setDailyLog(bareDailyLog ? JSON.stringify(bareDailyLog) : null);

                // objectives for table
                const allObjectives: ActiveObjective[] | null =
                    await GetAllObjectives();
                if (allObjectives) {
                    const objectivesForTable: BetterTableItem[] =
                        await Promise.all(
                            allObjectives.map(
                                async (
                                    obj: ActiveObjective,
                                ): Promise<BetterTableItem> => ({
                                    name: obj.exercise,
                                    value: String(obj.identifier),
                                }),
                            ),
                        );
                    setAllObjectivesForTable(objectivesForTable);
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
    }, []);

    // no i am not translating dev interface. it is just for BackButton to work.
    const { t } = useTranslation();

    async function clearLogs() {
        try {
            await AsyncStorage.setItem(StoredItemNames.consoleLogs, "");
            if (Platform.OS === "android") {
                ToastAndroid.show("Clear!", ToastAndroid.LONG);
            }
        } catch (e) {
            logToConsole("Failed to clear logs: " + e, "error");
        }
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <BackButton t={t} />
            <BetterTextHeader>Dev Interface</BetterTextHeader>
            <BetterTextSubHeader>
                NOTE: This is ENGLISH only.
            </BetterTextSubHeader>
            <GapView height={15} />
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
            <BetterAlert
                style="DEFAULT"
                preTitle={"AsyncStorage item: " + StoredItemNames.userData}
                title={error ? "An error happened:" : "User data (raw JSON)"}
                bodyText={error ? error : userData ? userData : "null"}
                layout="alert"
            />
            <GapView height={10} />
            <BetterAlert
                style="DEFAULT"
                preTitle={"AsyncStorage item: " + StoredItemNames.objectives}
                title={error ? "An error happened:" : "Objectives (raw JSON)"}
                bodyText={error ? error : objectives ? objectives : "null"}
                layout="alert"
            />
            <GapView height={10} />
            <BetterTable
                headers={["Objective", "ID"]}
                items={allObjectivesForTable}
            />
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
            <GapView height={20} />
            <BetterTextSubHeader>WIP Pages</BetterTextSubHeader>
            <BetterTextSmallText>
                Pages / features that are still WIP, and hence hidden behind a
                test wall.
            </BetterTextSmallText>
            <GapView height={10} />
            <BetterButton
                buttonText="_TRACKER"
                buttonHint="Opens up a page for testing the TRACKER feature."
                style="DEFAULT"
                action={() => router.push(ROUTES.EXPERIMENTS.TRACKER)}
            />
            <BetterTextSmallText>
                The tracker feature turns this app into an actual sport app by
                tracking the user's movement during certain sessions, e.g.
                running, to get reliable stats.
            </BetterTextSmallText>
            <PageEnd includeText={true} size="tiny" />
        </>
    );
}
