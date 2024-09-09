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
import { getLogsFromStorage, logToConsole } from "@/toolkit/debug/Console";
import { GetAllObjectives } from "@/toolkit/objectives/ActiveObjectives";
import { ActiveObjective } from "@/types/ActiveObjectives";
import { Logs } from "@/types/Logs";
import { FullProfile } from "@/types/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

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
});

export default function HomeScreen() {
    const [loading, setLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<string | null>(null);
    const [objectives, setObjectives] = useState<string | null>(null);
    const [logs, setLogs] = useState<Logs>([]);
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

    function clearLogs() {
        async function actuallyClearLogs() {
            try {
                await AsyncStorage.setItem(StoredItemNames.consoleLogs, "");
            } catch (e) {
                throw e;
            }
        }

        actuallyClearLogs();
        router.replace("/DevInterface");
    }

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
                subtext={`Manufacturer: ${Device.manufacturer}\nBrand: ${Device.brand}\nCodename: ${Device.designName}\nDevice name: ${Device.deviceName}\nDevice type: ${Device.deviceType} - Expo's DeviceType Enum\nYear: ${Device.deviceYearClass}\nIs device or is emulator: ${Device.isDevice ? "is device" : "is emulator"}\nModel name: ${Device.modelName}\nOS BUILD ID: ${Device.osBuildId}\nOS NAME + VERSION: ${Device.osName} ${Device.osVersion}\nANDROID API LEVEL: ${Device.platformApiLevel}\nProduct name: ${Device.productName}\nTotal memory: ${Device.totalMemory} (in bytes)`}
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
            <BetterTextSubHeader>
                Logged errors and warnings
            </BetterTextSubHeader>
            <GapView height={5} />
            <BetterButton
                buttonText="Clear logs"
                style="HMM"
                action={clearLogs}
            />
            <GapView height={5} />
            <BetterButton
                buttonText="See all logs"
                style="DEFAULT"
                action={() => router.push("/LogView")}
            />
            <View style={styles.consoleView}>
                {error ? (
                    <BetterTextSmallText>{error}</BetterTextSmallText>
                ) : logs && logs.length > 0 && Array.isArray(logs) ? (
                    // Filtra los logs para mostrar solo los de tipo "warn" o "error"
                    logs.filter(
                        (log) => log.type === "warn" || log.type === "error",
                    ).length > 0 ? (
                        logs
                            .filter(
                                (log) =>
                                    log.type === "warn" || log.type === "error",
                            )
                            .map((log, index) => {
                                const logStyle = styles[log.type] || {};
                                const options = {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: false, // 24h format
                                };

                                // formats date in a more sense-making way than what R5 used to do
                                const formattedDate = new Date(log.timestamp)
                                    // @ts-expect-error some error idk why, but it works fine so yeah
                                    .toLocaleString("es-ES", options)
                                    .replace(",", "");

                                return (
                                    <Text
                                        key={index}
                                        style={[styles.logText, logStyle]}
                                    >
                                        [{formattedDate}] (
                                        {log.type.toUpperCase()}){" "}
                                        {String(log.message)}
                                    </Text>
                                );
                            })
                    ) : (
                        <BetterTextSmallText>
                            Great! There are no errors and no warnings! If you
                            want to see full logs, including regular and success
                            ones, tap "See all logs".
                        </BetterTextSmallText>
                    )
                ) : (
                    <BetterTextSmallText>
                        No logs. If you recently cleared them it's alright, if
                        not, this shouldn't be empty, so you might be facing a
                        bug.
                    </BetterTextSmallText>
                )}
            </View>
            <PageEnd includeText={true} />
        </>
    );
}
