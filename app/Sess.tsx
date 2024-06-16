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

    return (
        <Native.View>
            <BeText weight="Regular" size={15}>
                currently selected obj: {id}
            </BeText>
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
                <BeText weight="Regular" size={15}>
                    No object found
                </BeText>
            )}
        </Native.View>
    );
}
