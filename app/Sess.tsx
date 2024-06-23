// Sess.tsx
// Página para sesiones

import * as React from "react";
import * as Native from "react-native";
import * as Router from "expo-router";
import BeText from "@/components/Text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import GapView from "@/components/GapView";

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

export default function Sess() {
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
                    console.log("OBJS fetched");
                } else {
                    await AsyncStorage.setItem("objs", JSON.stringify([]));
                    console.error("Could not get OBJS fetched");
                    setObjs([]);
                }
            } catch (e) {
                console.error("Could not get OBJS fetched: " + e);
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
        : "no ids found (see Sess.tsx:52-57)";

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

    return (
        <Native.View
            style={{
                backgroundColor: "#0E1013",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100vw" as Native.DimensionValue,
                height: "100vh" as Native.DimensionValue,
            }}
        >
            {/*<BeText weight="Regular" size={15}>
                currently selected obj: {id}
            </BeText>*/}
            {selectedObj ? (
                <Native.View
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "calc(100vw - 40px)" as Native.DimensionValue,
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
                        {
                            // deberia ser otro icono, pero no hay manera de que funcionen los MS Fluent Icons con React al parecer :[
                        }
                        <Ionicons name="play-arrow" size={20} color="#DDDDDD" />
                        <GapView width={10} />
                        <BeText size={15} weight="Bold" color="#DDDDDD">
                            IN A SESSION!
                        </BeText>
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
                        <BeText weight="Regular" size={12} align="center">
                            CURRENT OBJECTIVE
                        </BeText>
                        <GapView height={10} />
                        <BeText weight="Bold" size={25} align="center">
                            {selectedObjSustantivizedName} for{" "}
                            {selectedObj.duration} minute
                            {selectedObj.duration > 1 && "s"}
                        </BeText>
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
                            <BeText weight="Regular" size={15}>
                                {selectedObj.repetitions === 0
                                    ? "None"
                                    : `${selectedObj.repetitions} repetitions`}
                            </BeText>
                            <GapView width={15} />
                            <Ionicons name="snooze" size={15} color="#FFF" />
                            <GapView width={5} />
                            <BeText weight="Regular" size={15}>
                                {selectedObj.rests === 0
                                    ? "None"
                                    : `${selectedObj.rests} rests (${selectedObj.restDuration} minutes each)`}
                            </BeText>
                        </Native.View>
                    </Native.View>
                    <BeText weight="Regular" size={15}>
                        Days:{" "}
                        {selectedObj.days
                            .map((day, index) =>
                                day ? `Day ${index + 1}` : null
                            )
                            .filter(Boolean)
                            .join(", ")}
                    </BeText>
                    <BeText weight="Regular" size={15}>
                        Duration: {selectedObj.duration}
                    </BeText>
                    <BeText weight="Regular" size={15}>
                        Repetitions: {selectedObj.repetitions}
                    </BeText>
                    <BeText weight="Regular" size={15}>
                        Rests: {selectedObj.rests}
                    </BeText>
                    <BeText weight="Regular" size={15}>
                        Rest Duration: {selectedObj.restDuration}
                    </BeText>
                    <BeText weight="Regular" size={15}>
                        ID: {selectedObj.id}
                    </BeText>
                </Native.View>
            ) : (
                <Native.View>
                    <BeText
                        align="center"
                        weight="BlackItalic"
                        size={45}
                        color="#FF0000"
                    >
                        ERROR
                    </BeText>
                    <BeText align="center" weight="Bold" size={25}>
                        Did not find the selected objective in the database.
                    </BeText>
                    <Native.View
                        style={{
                            margin: 10,
                            borderRadius: 10,
                            padding: 10,
                            backgroundColor: "#FFC832",
                        }}
                    >
                        <BeText weight="Regular" size={12} color="#000">
                            Developer info: id: {id}, objs were fetched:{" "}
                            {objs && "true"}
                            {!objs && "false"}, selectedObj exists:{" "}
                            {selectedObj && "true"}
                            {!selectedObj && "false"}, all objs: {idsString}
                        </BeText>
                    </Native.View>
                </Native.View>
            )}
        </Native.View>
    );
}
