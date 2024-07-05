// Dashboard.tsx
// Dashboard, where you setup your path to success.

import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";
import BottomNav from "@/components/BottomNav";
import * as Router from "expo-router";
import Section from "@/components/section/Section";
import Division from "@/components/section/division/Division";
import GapView from "@/components/GapView";
import Footer from "@/components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/Buttons";
import { termLog } from "./DeveloperInterface";

// TypeScript, supongo
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

// Creamos los estilos
const styles = Native.StyleSheet.create({
    containerview: {
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
    },
    mainview: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
        overflow: "scroll",
    },
});

// Creamos la función
export default function Dashboard() {
    const [objs, setObjs] = React.useState<{ [key: string]: Objective } | null>(
        null
    );

    React.useEffect(() => {
        const fetchObjectives = async () => {
            try {
                const storedObjs = await AsyncStorage.getItem("objs");
                if (storedObjs) {
                    setObjs(JSON.parse(storedObjs));
                    termLog("Objectives (OBJS) fetched and parsed!", "success");
                } else {
                    await AsyncStorage.setItem("objs", JSON.stringify({}));
                    setObjs({});
                    termLog(
                        "Could not get objectives (OBJS) fetched! Setting them to an empty array ( {} )",
                        "warn"
                    );
                }
            } catch (e) {
                const log =
                    "Could not get objectives (OBJS) fetched due to error: " +
                    e;
                termLog(log, "error");
            }
        };

        fetchObjectives();
    }, []);

    const createObjective = (): void => {
        Router.router.navigate("/CreateObjective");
    };

    //const editObjective = (id: number): void => {console.log(id);};

    const deleteObjective = async (id: number): Promise<void> => {
        try {
            const jsonValue = await AsyncStorage.getItem("objs");
            if (jsonValue != null) {
                let objs: Objective[] = JSON.parse(jsonValue);

                objs = objs.filter(entry => entry.id !== id);

                await AsyncStorage.setItem("objs", JSON.stringify(objs));
                const log: string = `OBJ (Objective) with ID ${id} has been removed.`;
                termLog(log, "success");
                Router.router.replace("/");
            } else {
                const log: string = `No OBJS found - no way to delete.`;
                termLog(log, "warn");
            }
        } catch (e) {
            const log: string = `Error removing OBJ, got the following: ${e}`;
            termLog(log, "error");
        }
    };

    const currentpage: string = Router.usePathname();

    return (
        <Native.View style={styles.containerview}>
            <BottomNav currentLocation={currentpage} />
            <Native.ScrollView style={styles.mainview}>
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={40}>
                    Dashboard
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={20}
                >
                    Let&apos;s set up your path to success
                </BetterText>
                <GapView height={20} />
                <Section kind="Objectives">
                    {objs && Object.keys(objs).length > 0 ? (
                        Object.keys(objs).map(key => {
                            const obj = objs[key];
                            if (!obj) {
                                const log = `Data is undefined for objective with key: ${key}`;
                                termLog(log, "warn");
                                return null;
                            }

                            const desc: string =
                                "Rests: " +
                                String(obj.rests) +
                                ", Repeats: " +
                                String(obj.repetitions) +
                                ", Rest duration: " +
                                String(obj.restDuration) +
                                " minutes.";
                            return (
                                <Native.View key={obj.id}>
                                    <Division
                                        status="REGULAR"
                                        preheader="ACTIVE OBJECTIVE"
                                        header={obj.exercise}
                                        subheader={desc}
                                    >
                                        {/* <Button
                                            style="ACE"
                                            action={() => editObjective(obj.id)}
                                            buttonText="Edit"
                                        />*/}
                                        <Button
                                            style="WOR"
                                            action={() =>
                                                deleteObjective(obj.id)
                                            }
                                            buttonText="Remove"
                                        />
                                    </Division>
                                </Native.View>
                            );
                        })
                    ) : (
                        <Native.View
                            style={{
                                padding: 20,
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <BetterText
                                textAlign="center"
                                fontSize={30}
                                textColor="#FFF"
                                fontWeight="Bold"
                            >
                                You don&apos;t have any objectives. Create one
                                now!
                            </BetterText>
                            <GapView height={15} />
                            <Button
                                width="fill"
                                style="ACE"
                                buttonText="Let's go!"
                                action={createObjective}
                            />
                        </Native.View>
                    )}
                    {objs && Object.keys(objs).length > 0 && (
                        <Native.View
                            style={{
                                padding: 20,
                            }}
                        >
                            <Button
                                width="fill"
                                style="GOD"
                                buttonText="Create active objective"
                                action={createObjective}
                            />
                        </Native.View>
                    )}
                </Section>
                <Footer />
            </Native.ScrollView>
        </Native.View>
    );
}
