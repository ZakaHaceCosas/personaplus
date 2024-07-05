// Sessions.tsx
// Página para sesiones

import * as React from "react";
import * as Native from "react-native";
import * as Router from "expo-router";
import BetterText from "@/components/BetterText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/components/GapView";
import { termLog } from "./DeveloperInterface";
// @ts-expect-error: Wants a ".d.ts" file for this:
import CountDown from "react-native-countdown-component";
import Button from "@/components/Buttons";

// TypeScript, supongo.
interface Objective {
    exercise: string;
    days: boolean[];
    duration: number;
    repetitions: number;
    rests: number;
    restDuration: number;
    id: number;
    wasDone: boolean;
}

export default function Sessions() {
    const params = Router.useGlobalSearchParams();
    const { id } = params as { id: string };
    const [objs, setObjs] = React.useState<Objective[] | null>(null);

    React.useEffect(() => {
        const fetchObjectives = async () => {
            try {
                const storedObjs = await AsyncStorage.getItem("objs");
                if (storedObjs) {
                    const parsedObjs: Objective[] = JSON.parse(storedObjs);
                    setObjs(parsedObjs);
                    termLog("Objectives (OBJS) fetched", "success");
                } else {
                    await AsyncStorage.setItem("objs", JSON.stringify([]));
                    termLog(
                        "Could not get Objectives (OBJS) fetched. Setting them to an empty object.",
                        "error"
                    );
                    setObjs([]);
                }
            } catch (e) {
                const log =
                    "Could not get Objectives (OBJS) fetched due to error: " +
                    e +
                    ". Setting them to an empty object.";
                termLog(log, "warn");
                setObjs([]);
            }
        };

        fetchObjectives();
    }, []);

    const selectedObj = objs
        ? objs.find(obj => obj.id.toString() === id)
        : null;

    const idsString = objs
        ? objs
              .filter(item => typeof item.id === "number") // buscar ids
              .map(item => item.id.toString()) // array-ing ids
              .join(", ") // unir ids
        : "no ids found (developers: see Sessions.tsx:63-68 (or close to that point))";

    let selectedObjSustantivizedName: string = "Unknown";

    if (selectedObj) {
        switch (selectedObj.exercise) {
            case "Meditation":
                selectedObjSustantivizedName = "Meditating";
                break;
            case "Push Up":
                selectedObjSustantivizedName = "Doing push ups";
                break;
            case "Lifting":
                selectedObjSustantivizedName = "Lifting weights";
                break;
            case "Running":
                selectedObjSustantivizedName = "Running";
                break;
            case "Walking":
                selectedObjSustantivizedName = "Walking";
                break;
            default:
                selectedObjSustantivizedName = "Doing something"; // instead of just throwing "Unknown" or "null" or an empty string... DO SOMETHING :]
                break;
        }
    }

    const [isTimerRunning, setTimerStatus] = React.useState(true);

    const toggleTimerStatus = () => {
        if (isTimerRunning) {
            setTimerStatus(false);
        } else {
            setTimerStatus(true);
        }
    };

    let timerColor;
    if (isTimerRunning) {
        timerColor = "#32FF80";
    } else {
        timerColor = "#FFC832";
    }

    const cancel = () => {
        Native.Alert.alert(
            "Are you sure?",
            "You are doing GREAT! Are you sure you want to give up? Your progress will be lost! (You can always start over if you change your mind)",
            [
                {
                    text: "Nevermind",
                    style: "cancel",
                },
                {
                    text: "Yes, I give up",
                    style: "destructive",
                    onPress: () => {
                        Router.router.navigate("/"); // basically goes home without saving, easy.
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const finish = () => {
        const updateObj = async (id: number) => {
            try {
                const storedObjs = await AsyncStorage.getItem("objs");
                if (storedObjs) {
                    const parsedObjs = JSON.parse(storedObjs);
                    const updatedObjs = parsedObjs.map((obj: Objective) => {
                        if (obj.id === id) {
                            return { ...obj, wasDone: true };
                        }
                        return obj;
                    });
                    await AsyncStorage.setItem(
                        "objs",
                        JSON.stringify(updatedObjs)
                    );
                    termLog(
                        "Objectives (OBJS) updated and saved successfully!",
                        "success"
                    );
                    Router.router.replace("/");
                } else {
                    termLog(
                        "Could not get objectives (OBJS) fetched!",
                        "error"
                    );
                }
            } catch (e) {
                const log =
                    "Could not get objectives (OBJS) fetched due to error: " +
                    e;
                termLog(log, "error");
            }
        };

        if (selectedObj) {
            updateObj(selectedObj.id);
        }

        Router.router.navigate("/");
    };

    return (
        <Native.View
            style={{
                width: "100vw" as Native.DimensionValue,
                height: "100vh" as Native.DimensionValue,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: 20,
                flex: 1,
                backgroundColor: "#0E1013",
            }}
        >
            {selectedObj ? (
                <Native.View
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "50%",
                    }}
                >
                    <Native.View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            padding: 20,
                            backgroundColor: "#14171C",
                            borderRadius: 15,
                            alignItems: "center",
                            justifyContent: "flex-start",
                            width: "100%",
                        }}
                    >
                        <Ionicons name="play-arrow" size={20} color="#DDDDDD" />
                        <GapView width={10} />
                        <BetterText
                            fontSize={15}
                            fontWeight="Bold"
                            textColor="#DDDDDD"
                        >
                            IN A SESSION!
                        </BetterText>
                    </Native.View>
                    <GapView height={20} />
                    <Native.View
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: 20,
                            backgroundColor: "#14171C",
                            borderRadius: 15,
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <BetterText
                            fontWeight="Regular"
                            fontSize={12}
                            textAlign="center"
                        >
                            CURRENT OBJECTIVE
                        </BetterText>
                        <GapView height={10} />
                        <BetterText
                            fontWeight="Bold"
                            fontSize={25}
                            textAlign="center"
                        >
                            {selectedObjSustantivizedName} for{" "}
                            {selectedObj.duration} minute
                            {selectedObj.duration > 1 && "s"}
                        </BetterText>
                        <GapView height={10} />
                        <Native.View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Ionicons name="loop" size={15} color="#FFF" />
                            <GapView width={5} />
                            <BetterText fontWeight="Regular" fontSize={15}>
                                {selectedObj.repetitions === 0
                                    ? "None"
                                    : selectedObj.repetitions === 1
                                      ? `${selectedObj.repetitions} repetition`
                                      : `${selectedObj.repetitions} repetitions`}
                            </BetterText>
                            <GapView width={15} />
                            <Ionicons name="snooze" size={15} color="#FFF" />
                            <GapView width={5} />
                            <BetterText fontWeight="Regular" fontSize={15}>
                                {selectedObj.rests === 0
                                    ? "None"
                                    : selectedObj.rests === 1
                                      ? `${selectedObj.rests} rest of ${selectedObj.restDuration} minutes`
                                      : `${selectedObj.rests} rests (${selectedObj.restDuration} minutes each)`}
                            </BetterText>
                        </Native.View>
                    </Native.View>
                    <CountDown
                        id="mainCountdown"
                        until={selectedObj?.duration * 60}
                        size={45}
                        timeToShow={["M", "S"]}
                        running={isTimerRunning}
                        style={{ backgroundColor: "transparent" }}
                        digitStyle={{ backgroundColor: "transparent" }}
                        digitTxtStyle={{ color: timerColor }}
                        timeLabelStyle={{ display: "none" }}
                        onFinish={() => finish()}
                        onPress={() => toggleTimerStatus()}
                    />
                    <Native.View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            padding: 20,
                            backgroundColor: "#14171C",
                            borderRadius: 15,
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <Button
                            style={isTimerRunning ? "ACE" : "HMM"}
                            action={toggleTimerStatus}
                            layout="box"
                        >
                            <Ionicons
                                name={isTimerRunning ? "pause" : "play-arrow"}
                                size={16}
                                color={isTimerRunning ? "#FFF" : "#000"}
                            />
                        </Button>
                        <GapView width={10} />
                        <Button style="GOD" action={finish} layout="box">
                            <Ionicons name="check" size={16} color="#000" />
                        </Button>
                        <GapView width={10} />
                        <Button
                            style="HMM"
                            buttonText="Need help?"
                            action={() => {}}
                            layout="normal"
                            height="default"
                            width="fill"
                        />
                        <GapView width={10} />
                        <Button
                            style="WOR"
                            buttonText="Give up"
                            action={cancel}
                            layout="normal"
                            height="default"
                            width="fill"
                        />
                    </Native.View>
                </Native.View>
            ) : (
                <Native.View>
                    <BetterText
                        textAlign="center"
                        fontWeight="BlackItalic"
                        fontSize={45}
                        textColor="#FF0000"
                    >
                        ERROR
                    </BetterText>
                    <BetterText
                        textAlign="center"
                        fontWeight="Bold"
                        fontSize={25}
                    >
                        Did not find the selected objective in the database.
                    </BetterText>
                    <Native.View
                        style={{
                            margin: 10,
                            borderRadius: 10,
                            padding: 10,
                            backgroundColor: "#FFC832",
                        }}
                    >
                        <BetterText
                            fontWeight="Regular"
                            fontSize={12}
                            textColor="#000"
                        >
                            Developer info: id: {id}, objs were fetched:{" "}
                            {objs && "true"}
                            {!objs && "false"}, selectedObj exists:{" "}
                            {selectedObj && "true"}
                            {!selectedObj && "false"}, all objs: {idsString}
                        </BetterText>
                    </Native.View>
                </Native.View>
            )}
        </Native.View>
    );
}
