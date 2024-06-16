// Sess.tsx
// Página para sesiones

import * as React from "react";
import * as Native from "react-native";
import * as Router from "expo-router";
import BeText from "@/components/Text";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TypeScript, supongo.
interface Objective {
    exercise: string;
    days: boolean[];
    duration: number;
    repetitions: number;
    rests: number;
    restDuration: number;
    id: number;
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
        ? objs.find((obj) => obj.id.toString() === id)
        : null;

    const idsString = objs
        ? objs
              .filter((item) => typeof item.id === "number") // buscar ids
              .map((item) => item.id.toString()) // array-ing ids
              .join(", ") // unir ids
        : "no ids found (see Sess.tsx:52-59)";

    console.log(idsString);

    const start = () => {
        console.log("start");
    };

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
                <Native.View>
                    <BeText weight="Regular" size={15}>
                        Exercise: {selectedObj.exercise}
                    </BeText>
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
                        align="cent"
                        weight="BlackItalic"
                        size={45}
                        color="#FF0000"
                    >
                        ERROR
                    </BeText>
                    <BeText align="cent" weight="Bold" size={25}>
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
