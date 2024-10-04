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
import GapView from "@/components/ui/GapView";
import Colors from "@/constants/Colors";
import getCommonScreenSize from "@/constants/Screen";
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
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
    consoleView: {
        backgroundColor: Colors.BASIC.BLACK,
        padding: 10,
        width: getCommonScreenSize("width"),
    },
    logText: {
        marginBottom: 5,
        fontFamily: "monospace",
        fontSize: 11,
        borderLeftWidth: 2,
        paddingLeft: 10,
    },
    log: {
        color: Colors.BASIC.WHITE,
        borderLeftColor: Colors.BASIC.WHITE,
    },
    success: {
        color: Colors.PRIMARIES.GOD.GOD,
        borderLeftColor: Colors.PRIMARIES.GOD.GOD,
    },
    warn: {
        color: Colors.PRIMARIES.HMM.HMM,
        borderLeftColor: Colors.PRIMARIES.HMM.HMM,
    },
    error: {
        color: Colors.PRIMARIES.WOR.WOR,
        borderLeftColor: Colors.PRIMARIES.WOR.WOR,
    },
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        flexDirection: "row",
        backgroundColor: Colors.MAIN.DEFAULT_ITEM.BACKGROUND,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.MAIN.DEFAULT_ITEM.TEXT,
    },
    row: {
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.MAIN.DEFAULT_ITEM.TEXT,
    },
    cell: {
        flex: 1,
        textAlign: "center",
    },
});

export default function HomeScreen() {
    const [loading, setLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<string | null>(null);
    const [objectives, setObjectives] = useState<string | null>(null);
    const [dailyLog, setDailyLog] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function handler() {
            try {
                // user data
                const bareUserData: string | null = await AsyncStorage.getItem(
                    StoredItemNames.userData
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
                    bareObjectives ? JSON.stringify(bareObjectives) : null
                );

                // dailyLog
                const bareDailyLog: ActiveObjectiveDailyLog | null =
                    await GetActiveObjectiveDailyLog();
                if (!bareDailyLog) {
                    setObjectives("No daily log (null)");
                }
                setDailyLog(bareDailyLog ? JSON.stringify(bareDailyLog) : null);
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
                title="Generic info from your device"
                text={`Client details`}
                subtext={`Manufacturer: ${Device.manufacturer}\nBrand: ${
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
                title={"AsyncStorage item: " + StoredItemNames.userData}
                text={error ? "An error happened:" : "User data (raw JSON)"}
                subtext={error ? error : userData ? userData : "null"}
                layout="alert"
            />
            <GapView height={10} />
            <BetterAlert
                style="DEFAULT"
                title={"AsyncStorage item: " + StoredItemNames.objectives}
                text={error ? "An error happened:" : "Objectives (raw JSON)"}
                subtext={error ? error : objectives ? objectives : "null"}
                layout="alert"
            />
            <GapView height={10} />
            <BetterAlert
                style="DEFAULT"
                title={"AsyncStorage item: " + StoredItemNames.dailyLog}
                text={error ? "An error happened:" : "Daily log (raw JSON)"}
                subtext={error ? error : dailyLog ? dailyLog : "null"}
                layout="alert"
            />
            <GapView height={10} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <BetterTextSmallText>Exercise{"  "}</BetterTextSmallText>
                    <BetterTextSmallText>ID{"  "}</BetterTextSmallText>
                </View>
                {(objectives
                    ? (JSON.parse(objectives) as ActiveObjective[])
                    : []
                ).map((objective) => (
                    <View key={objective.identifier} style={styles.row}>
                        <BetterTextSmallText>
                            {objective.exercise}
                            {"  "}
                        </BetterTextSmallText>
                        <BetterTextSmallText>
                            {objective.identifier}
                            {"  "}
                        </BetterTextSmallText>
                    </View>
                ))}
            </View>
            <GapView height={10} />
            <BetterTextSubHeader>
                Logged errors and warnings
            </BetterTextSubHeader>
            <GapView height={5} />
            <BetterButton
                buttonText="See all logs"
                style="DEFAULT"
                action={() => router.push("/LogView")}
            />

            <PageEnd includeText={true} />
        </>
    );
}
