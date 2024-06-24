// Dash.tsx
// Dashboard, where you setup your path to success.

import * as React from "react";
import * as Native from "react-native";
import BeText from "@/components/Text";
import Foot from "@/components/Foot";
import * as Router from "expo-router";
import Section from "@/components/section/Section";
import Division from "@/components/section/division/Division";
import GapView from "@/components/GapView";
import Nomore from "@/components/Nomore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Btn from "@/components/Btns";
import { testLog } from "./Dev";

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
        height: "100vw" as Native.DimensionValue,
    },
    mainview: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as Native.DimensionValue,
        height: "100vw" as Native.DimensionValue,
        overflow: "scroll",
    },
});

// Creamos la función
export default function Dash() {
    const [objs, setObjs] = React.useState<{ [key: string]: Objective } | null>(
        null
    );

    React.useEffect(() => {
        const fetchObjectives = async () => {
            try {
                const storedObjs = await AsyncStorage.getItem("objs");
                if (storedObjs) {
                    setObjs(JSON.parse(storedObjs));
                    console.log(
                        "%cGOD%cAll is ok%c Objectives (OBJS) fetched and parsed!",
                        "font-weight: bold; background: #30FF97; color: black; padding: 2px 4px; border-radius: 2px;",
                        "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                        "color: #30FF97;"
                    );
                } else {
                    await AsyncStorage.setItem("objs", JSON.stringify({}));
                    setObjs({});
                    console.log(
                        "%cWOR%cDev error%c Could not get objectives (OBJS) fetched! Setting them to an empty array ( {} )",
                        "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                        "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                        "color: #FFD700;"
                    );
                }
            } catch (e) {
                const log =
                    "Could not get objectives (OBJS) fetched due to error: " +
                    e;
                console.log(
                    "%cWOR%cDev error%c " + log,
                    "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                    "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                    "color: #FFD700;"
                );
            }
        };

        fetchObjectives();
    }, []);

    const createObj = (): void => {
        Router.router.navigate("Crea");
    };

    const editObj = (id: number): void => {
        console.log(id);
    };

    const deleteObj = async (id: number): Promise<void> => {
        console.log(id);
        console.log(objs);
        try {
            const jsonValue = await AsyncStorage.getItem("objs");
            if (jsonValue != null) {
                let objs: Objective[] = JSON.parse(jsonValue);

                objs = objs.filter(entry => entry.id !== id);

                await AsyncStorage.setItem("objs", JSON.stringify(objs));
                const log: string = `OBJ (Objective) with ID ${id} has been removed.`;
                testLog(
                    `OBJ (Objective) with ID ${id} has been removed.`,
                    "log"
                );
                console.log(
                    "%cGOD%cAll is ok%c " + log,
                    "font-weight: bold; background: #30FF97; color: black; padding: 2px 4px; border-radius: 2px;",
                    "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                    "color: #30FF97;"
                );
            } else {
                const log: string = `No OBJS found - no way to delete.`;
                testLog(`No OBJS found - no way to delete.`, "warn");
                console.log(
                    "%cHMM%cDev warning%c " + log,
                    "font-weight: bold; background: #FFC832; color: black; padding: 2px 4px; border-radius: 2px;",
                    "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                    "color: #FFC832;"
                );
            }
        } catch (e) {
            const log: string = `Error removing OBJ, got the following: ${e}`;
            testLog(`Error removing OBJ, got the following: ${e}`, "warn");
            console.log(
                "%cWOR%cDev error%c " + log,
                "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                "color: #FFD700;"
            );
        }
        Router.router.replace("/Dash");
    };

    const currentpage: string = Router.usePathname();

    return (
        <Native.View style={styles.containerview}>
            <Foot page={currentpage}></Foot>
            <Native.ScrollView style={styles.mainview}>
                <BeText align="normal" weight="Bold" size={40}>
                    Dashboard
                </BeText>
                <BeText align="normal" weight="Regular" size={20}>
                    Lets set up your path to success
                </BeText>
                <GapView height={20} />
                <Section kind="OBJS">
                    {objs && Object.keys(objs).length > 0 ? (
                        Object.keys(objs).map(key => {
                            const obj = objs[key];
                            if (!obj) {
                                const log = `Data is undefined for objective with key: ${key}`;
                                console.log(
                                    "%cWOR%cDev error%c " + log,
                                    "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                                    "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                                    "color: #FFD700;"
                                );
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
                                        <Btn
                                            kind="ACE"
                                            onclick={() => editObj(obj.id)}
                                            text="Edit"
                                        />
                                        <Btn
                                            kind="WOR"
                                            onclick={() => deleteObj(obj.id)}
                                            text="Remove"
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
                            <BeText
                                align="center"
                                size={30}
                                color="#FFF"
                                weight="Bold"
                            >
                                You dont have any objective. Create one now!
                            </BeText>
                            <GapView height={15} />
                            <Btn
                                width="fill"
                                kind="ACE"
                                text="Let's go!"
                                onclick={createObj}
                            />
                        </Native.View>
                    )}
                    {objs && Object.keys(objs).length > 0 && (
                        <Native.View
                            style={{
                                padding: 20,
                            }}
                        >
                            <Btn
                                width="fill"
                                kind="GOD"
                                text="Create active objective"
                                onclick={createObj}
                            />
                        </Native.View>
                    )}
                </Section>
                <Nomore />
            </Native.ScrollView>
        </Native.View>
    );
}
