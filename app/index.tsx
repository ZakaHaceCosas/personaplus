// index.tsx
// Welcome to PersonaPlus. Give yourself a plus!

import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";
import Section from "@/components/section/Section";
import BottomNav from "@/components/BottomNav";
import * as Router from "expo-router";
import Division from "@/components/section/division/Division";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/Buttons";
import GapView from "@/components/GapView";
import Footer from "@/components/Footer";
import { termLog } from "@/app/DeveloperInterface";

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
export default function Home() {
    // Por defecto
    const [username, setUname] = React.useState<string>("Unknown");
    const [objs, setObjs] = React.useState<{ [key: string]: Objective } | null>(
        null
    );

    React.useEffect(() => {
        const fetchUsername = async () => {
            const uname: string | null = await AsyncStorage.getItem("uname");
            if (uname) {
                setUname(uname);
                termLog("Username fetched!", "success");
            } else {
                termLog("Username error!", "error");
            }
        };

        fetchUsername();
    }, []);

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

    const currentpage: string = Router.usePathname();

    const createObj = (): void => {
        Router.router.navigate("/CreateObjective");
    };

    const startObj = (id: number): void => {
        Router.router.navigate("/Sessions?id=" + id);
    };

    const doObj = (id: number): void => {
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

        updateObj(id);
    };

    const [isFirstLaunch, setIsFirstLaunch] = React.useState<boolean | null>(
        null
    );

    // Comprobación para ver si es la primera vez que abre la app - si lo es, redirige a /WelcomeScreen
    React.useEffect(() => {
        const checkFirstLaunch = async () => {
            try {
                const value = await AsyncStorage.getItem("hasLaunched");
                if (value === null || !value) {
                    await AsyncStorage.setItem("hasLaunched", "true");
                    await AsyncStorage.setItem("useDevTools", "false"); // primera vez, lo guarda
                    setIsFirstLaunch(true);
                } else {
                    setIsFirstLaunch(false);
                }
            } catch (e) {
                const log =
                    "Got an error checking if app launched before: " + e;
                termLog(log, "error");
            }
        };
        checkFirstLaunch();
    }, []);

    if (isFirstLaunch === null) {
        return null;
    }

    if (isFirstLaunch) {
        Router.router.push("/WelcomeScreen");
    }

    const randomDoneAllMsg: number = Math.floor(Math.random() * 4) + 1;

    // Today's date (since React for some reasons thinks it's funny to start weeks on Sunday, this needs to be done)
    const today = new Date().getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    // Adjust today index to match week start (Monday as 0)
    const adjustedToday = today === 0 ? 6 : today - 1; // Adjust Sunday to index 6, otherwise shift back by one

    return (
        <Native.View style={styles.containerview}>
            <BottomNav currentLocation={currentpage} />
            <Native.ScrollView style={styles.mainview}>
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={40}>
                    Hello, {username}!
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={20}
                >
                    This is your summary for today
                </BetterText>
                <GapView height={20} />
                <Section kind="Objectives">
                    {objs && Object.keys(objs).length > 0 ? (
                        Object.keys(objs).every(
                            key =>
                                objs[key].wasDone ||
                                !objs[key].days ||
                                !objs[key].days[adjustedToday]
                        ) ? (
                            <Native.View
                                style={{
                                    padding: 20,
                                    flex: 1,
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
                                    You&apos;ve done everything!
                                </BetterText>
                                <GapView height={10} />
                                {randomDoneAllMsg === 1 && (
                                    <BetterText
                                        textAlign="center"
                                        fontSize={15}
                                        textColor="#FFF"
                                        fontWeight="Regular"
                                    >
                                        Feel proud of yourself, don&apos;t you?
                                    </BetterText>
                                )}
                                {randomDoneAllMsg === 2 && (
                                    <BetterText
                                        textAlign="center"
                                        fontSize={15}
                                        textColor="#FFF"
                                        fontWeight="Regular"
                                    >
                                        That is right, you have completed ALL of
                                        your objectives for today.
                                    </BetterText>
                                )}
                                {randomDoneAllMsg === 3 && (
                                    <BetterText
                                        textAlign="center"
                                        fontSize={15}
                                        textColor="#FFF"
                                        fontWeight="Regular"
                                    >
                                        Now plan something else and make this
                                        day even more productive!
                                    </BetterText>
                                )}
                                {randomDoneAllMsg === 4 && (
                                    <BetterText
                                        textAlign="center"
                                        fontSize={15}
                                        textColor="#FFF"
                                        fontWeight="Regular"
                                    >
                                        &quot;Giving yourself a PLUS&quot; seems
                                        to be worth it, right?
                                    </BetterText>
                                )}
                            </Native.View>
                        ) : (
                            Object.keys(objs).map(key => {
                                const obj = objs[key];
                                termLog(
                                    `OBJ ${obj.id}, days[${adjustedToday}]: ${obj.days[adjustedToday]}`,
                                    "log"
                                );

                                if (
                                    obj &&
                                    !obj.wasDone &&
                                    obj.days[adjustedToday]
                                ) {
                                    return (
                                        <Division
                                            key={obj.id}
                                            status="REGULAR"
                                            preheader="ACTIVE OBJECTIVE"
                                            header={obj.exercise}
                                        >
                                            <Button
                                                style="ACE"
                                                action={() => startObj(obj.id)}
                                                buttonText="Let's go!"
                                            />
                                            <Button
                                                style="GOD"
                                                action={() => doObj(obj.id)}
                                                buttonText="Already done it"
                                            />
                                        </Division>
                                    );
                                }
                                return null;
                            })
                        )
                    ) : (
                        <Native.View
                            style={{
                                padding: 20,
                                flex: 1,
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
                </Section>
                <Footer />
            </Native.ScrollView>
        </Native.View>
    );
}
