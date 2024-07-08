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
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import Button from "@/components/Buttons";

// TypeScript, supongo.
interface Extra {
    amount?: number;
    time?: number;
    lifts?: number;
    liftWeight?: number;
    barWeight?: number;
    hands?: number;
    speed?: number;
}

interface Objective {
    exercise: string;
    days: boolean[];
    duration: number;
    repetitions: number;
    rests: number;
    restDuration: number;
    id: number;
    wasDone: boolean;
    extra: Extra;
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
                    "Could not get Objectives (OBJS) fetched due to error (1): " +
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

    const toggleTimerStatus = (manualTarget?: boolean) => {
        if (manualTarget) {
            setTimerStatus(manualTarget);
        } else {
            if (isTimerRunning) {
                setTimerStatus(false);
            } else {
                setTimerStatus(true);
            }
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

    const finish = async () => {
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
                    Router.router.navigate("/");
                } else {
                    termLog(
                        "Could not get objectives (OBJS) fetched!",
                        "error"
                    );
                }
            } catch (e) {
                const log =
                    "Could not update objectives (OBJS) due to error: " + e;
                termLog(log, "error");
            }
        };

        if (selectedObj) {
            updateObj(selectedObj.id);
        }
    };

    const [isUserCheckingHelp, toggleHelp] = React.useState(false);

    const toggleHelpMenu = () => {
        toggleHelp(prev => !prev);
        if (isUserCheckingHelp === false) {
            toggleTimerStatus(false);
        } else {
            toggleTimerStatus(true);
        }
    };

    let helpText: string = "Help!";

    switch (selectedObj?.exercise.toLowerCase()) {
        case "push up":
            helpText =
                "To do a regular push-up, begin in a plank position with your hands slightly wider than shoulder-width apart. Lower your body by bending your elbows until your chest nearly touches the floor, then push back up to the starting position. Keep your core engaged throughout for stability. Start with a comfortable number of repetitions and gradually increase as you build strength.\n\nTo do a one handed push-up, begin in a plank position with one hand centered beneath your shoulder and the other behind your back. Lower your body by bending your elbow until your chest nearly touches the floor, then push back up. Keep your core tight and maintain balance throughout the movement. Start with a few reps on each side and progress as your strength improves.";
            break;
        case "lifting":
            helpText =
                "Distribute evenly the weights between both hands. For example, if your objective is to lift 6kg, put 3kg to each weight (as you'll lift two weights, one for each hand).\n\nWithout dropping it, extend your arm vertically, and start moving it up and down, making your elbow go from a 90º angle to a 45º angle and then again to a 90º one (that would count as one lift).\n\nKeep going until you do all the lifts specified (or the timer runs out)!";
            break;
        case "running":
            helpText =
                "To start running, ensure you have comfortable running shoes and attire. Begin with a warm-up by walking briskly for 5-10 minutes to prepare your muscles. Start running at a pace that feels comfortable, and maintain a steady breathing pattern. Focus on keeping a good posture and staying relaxed. If you're a beginner, alternate between running and walking in intervals. Gradually increase your running time as your endurance improves. Cool down by walking for a few minutes and then stretching.";
            break;
        case "meditation":
            helpText =
                "Find a quiet and comfortable place to sit or lie down. Close your eyes and take a few deep breaths, focusing on the sensation of the air entering and leaving your body. Begin to observe your thoughts and feelings without judgment, letting them come and go naturally. You can focus on your breath, a mantra, or simply the present moment. If your mind wanders, gently bring your attention back to your focal point. Start with a few minutes and gradually extend your meditation time as you become more comfortable with the practice.";
            break;
        case "walking":
            helpText =
                "Wear comfortable shoes and clothing suitable for the weather. Begin by walking at a natural pace, allowing your arms to swing naturally at your sides. Focus on maintaining a good posture, with your back straight and your head up. You can vary your speed, incorporating brisk walking intervals to increase your heart rate. Walking can be done almost anywhere, so choose a route you enjoy. Aim for at least 30 minutes of walking per session, and gradually increase your duration and intensity as you build stamina.";
            break;
        default:
            helpText = "Error loading help text.";
            break;
    }

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
                overflow: "visible",
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
                        <Native.View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {selectedObj.exercise.toLowerCase() ===
                                "lifting" && (
                                <Native.View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginTop: 10,
                                    }}
                                >
                                    <Ionicons
                                        name="keyboard-double-arrow-down"
                                        size={15}
                                        color="#FFF"
                                    />
                                    <GapView width={5} />
                                    <BetterText
                                        fontWeight="Regular"
                                        textColor="#FFF"
                                        fontSize={15}
                                    >
                                        {selectedObj?.extra?.barWeight !==
                                            undefined &&
                                        selectedObj?.extra?.liftWeight !==
                                            undefined &&
                                        selectedObj.extra.hands !== undefined
                                            ? String(
                                                  selectedObj.extra.barWeight +
                                                      selectedObj.extra
                                                          .liftWeight *
                                                          selectedObj.extra
                                                              .hands
                                              )
                                            : "N/A"}
                                        kg
                                    </BetterText>
                                    <GapView width={10} />
                                    <Ionicons
                                        name="change-circle"
                                        size={15}
                                        color="#FFF"
                                    />
                                    <GapView width={5} />
                                    <BetterText
                                        fontWeight="Regular"
                                        textColor="#FFF"
                                        fontSize={15}
                                    >
                                        {selectedObj?.extra?.lifts !== undefined
                                            ? String(selectedObj.extra.lifts)
                                            : "N/A"}{" "}
                                        lifts
                                    </BetterText>{" "}
                                    <GapView width={10} />
                                    <Ionicons
                                        name="front-hand"
                                        size={15}
                                        color="#FFF"
                                    />
                                    <GapView width={5} />
                                    <BetterText
                                        fontWeight="Regular"
                                        textColor="#FFF"
                                        fontSize={15}
                                    >
                                        {selectedObj?.extra?.hands !== undefined
                                            ? String(selectedObj.extra.hands)
                                            : "N/A"}{" "}
                                        hand
                                    </BetterText>
                                </Native.View>
                            )}
                        </Native.View>
                    </Native.View>
                    <GapView height={20} />
                    <CountdownCircleTimer
                        duration={selectedObj?.duration * 60}
                        size={160}
                        isPlaying={isTimerRunning}
                        colors={["#32FF80", "#3280FF"]}
                        colorsTime={[15, 5]}
                        isSmoothColorTransition={false}
                        // onComplete={() => finish()}
                        // onPress={() => toggleTimerStatus()}
                        // ^^^^^^^ this doesnt exit here
                        isGrowing={true}
                        trailColor="#202328"
                        strokeLinecap="round"
                        trailStrokeWidth={10}
                        strokeWidth={15}
                    >
                        {({ remainingTime }) => (
                            <BetterText
                                fontSize={30}
                                fontWeight="Bold"
                                textAlign="center"
                                textColor={timerColor}
                            >
                                {remainingTime}
                            </BetterText>
                        )}
                    </CountdownCircleTimer>
                    <GapView height={20} />
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
                            buttonText="Help?"
                            action={() => toggleHelpMenu()}
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
                            Developer info: id: {id}, selectedObj exists:{" "}
                            {selectedObj && "true"}
                            {!selectedObj && "false"}, all objs: {idsString}
                        </BetterText>
                    </Native.View>
                </Native.View>
            )}
            {isUserCheckingHelp && (
                <Native.View
                    style={{
                        backgroundColor: "#14171C",
                        position: "absolute",
                        top: "20%",
                        left: 10,
                        right: 10,
                        bottom: 20,
                        overflow: "visible",
                        padding: 20,
                        borderRadius: 20,
                        shadowOpacity: 1,
                        shadowColor: "#000",
                        shadowOffset: { width: 15, height: 5 },
                        shadowRadius: 10,
                        elevation: 16,
                        borderColor: "#26282b",
                        borderWidth: 4,
                        zIndex: 999,
                    }}
                >
                    <BetterText fontSize={18} fontWeight="Regular">
                        Help with {selectedObj?.exercise}
                    </BetterText>
                    <BetterText fontSize={14} fontWeight="Light">
                        {helpText}
                    </BetterText>
                    <GapView height={10} />
                    <Button
                        layout="fixed"
                        height="default"
                        style="ACE"
                        buttonText="Got it"
                        action={toggleHelpMenu}
                    />
                    <GapView height={10} />
                    <BetterText
                        fontSize={10}
                        fontWeight="Light"
                        textColor="#C8C8C8"
                        textAlign="center"
                    >
                        Psst... Don&apos;t worry, the timer has been paused so
                        you can read!
                    </BetterText>
                </Native.View>
            )}
        </Native.View>
    );
}
