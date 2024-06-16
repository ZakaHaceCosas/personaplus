// Sess.tsx
// Página para sesiones

import * as React from "react";
import * as Native from "react-native";
import * as Router from "expo-router";
import BeText from "@/components/Text";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Obj {
    exercise: string;
    days: string[];
    duration: number;
    repetitions: number;
    rests: number;
    restDuration: number;
    id: string;
}

export default function Sess() {
    const params = Router.useGlobalSearchParams();
    const { id } = params;
    const [objs, setObjs] = React.useState<Obj | null>(null);

    React.useEffect(() => {
        const getObjs = async (): Promise<void> => {
            try {
                const storedObjs = await AsyncStorage.getItem("objs");
                if (storedObjs !== null) {
                    const parsedObjs = JSON.parse(storedObjs);
                    setObjs(
                        parsedObjs.find((obj: Obj) => obj.id === id) || null
                    );
                } else {
                    setObjs(null);
                }
            } catch (error) {
                console.error("Error fetching objects", error);
                setObjs(null);
            }
        };

        getObjs();
    }, [id]);

    return (
        <Native.View>
            <BeText weight="Regular" size={15}>
                currently selected obj: {id}
            </BeText>
            {objs ? (
                <Native.View>
                    <BeText weight="Regular" size={15}>
                        Exercise: {objs.exercise}
                    </BeText>
                    <BeText weight="Regular" size={15}>
                        Days: {objs.days.join(", ")}
                    </BeText>
                    <BeText weight="Regular" size={15}>
                        Duration: {objs.duration}
                    </BeText>
                    <BeText weight="Regular" size={15}>
                        Repetitions: {objs.repetitions}
                    </BeText>
                    <BeText weight="Regular" size={15}>
                        Rests: {objs.rests}
                    </BeText>
                    <BeText weight="Regular" size={15}>
                        Rest Duration: {objs.restDuration}
                    </BeText>
                    <BeText weight="Regular" size={15}>
                        ID: {objs.id}
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
