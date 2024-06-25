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
import { calculateBodyMassIndex } from "@/core/phisicalHealth/bodymassindex";

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
export default function Dashboard() {
    const bmi = calculateBodyMassIndex(14, "male", 45, 170, true, true);
    termLog(JSON.stringify(bmi), "log");

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

    const createObj = (): void => {
        Router.router.navigate("/CreateObjective");
    };

    const editObj = (id: number): void => {
        console.log(id);
    };

    const deleteObj = async (id: number): Promise<void> => {
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
                                        <Button
                                            style="ACE"
                                            action={() => editObj(obj.id)}
                                            buttonText="Edit"
                                        />
                                        <Button
                                            style="WOR"
                                            action={() => deleteObj(obj.id)}
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
                                action={createObj}
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
                                action={createObj}
                            />
                        </Native.View>
                    )}
                </Section>
                <Native.View
                    style={{
                        padding: 20,
                        backgroundColor: "#FFF",
                        borderTopColor: "#F00",
                        borderTopWidth: 10,
                    }}
                >
                    {bmi.subject && (
                        <BetterText
                            fontSize={30}
                            textAlign="center"
                            fontWeight="Regular"
                            textColor="#000"
                        >
                            calculo indice de masa corporal: {bmi.result}
                            {"\n"}edad {bmi.subject.age}
                            {"\n"}sexo {bmi.subject.gender}
                            {"\n"}peso en kg {bmi.subject.weight}
                            {"\n"}alto en cm {bmi.subject.height}
                            {"\n"}resultado: {bmi.context}
                        </BetterText>
                    )}
                    <BetterText
                        fontSize={20}
                        textAlign="center"
                        fontWeight="Regular"
                        textColor="#000"
                    >
                        {"\n"}explicacion: {bmi.explanation}
                    </BetterText>
                </Native.View>
                <Footer />
            </Native.ScrollView>
        </Native.View>
    );
}
