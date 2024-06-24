// index.tsx
// Welcome to PersonaPlus. Give yourself a plus!

import * as React from "react";
import * as Native from "react-native";
import BeText from "@/components/Text";
import Section from "@/components/section/Section";
import Foot from "@/components/Foot";
import * as Router from "expo-router";
import Division from "@/components/section/division/Division";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Btn from "@/components/Btns";
import GapView from "@/components/GapView";
import Nomore from "@/components/Nomore";
import { testLog } from "@/app/Dev";

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
                testLog("Username fetched!", "log");
                console.log(
                    "%cGOD%cAll is ok%c Username fetched!",
                    "font-weight: bold; background: #30FF97; color: black; padding: 2px 4px; border-radius: 2px;",
                    "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                    "color: #30FF97;"
                );
                setUname(uname);
            } else {
                testLog("Username error!", "error");
                console.log(
                    "%cWOR%cDev error%c Username error!",
                    "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                    "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                    "color: #FFD700;"
                );
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

    const currentpage: string = Router.usePathname();

    const createObj = (): void => {
        Router.router.navigate("Crea");
    };

    const startObj = (id: number): void => {
        Router.router.navigate("Sess?id=" + id);
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
                    console.log(
                        "%cGOD%cAll is ok%c Objectives (OBJS) updated and saved successfully!",
                        "font-weight: bold; background: #30FF97; color: black; padding: 2px 4px; border-radius: 2px;",
                        "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                        "color: #30FF97;"
                    );
                    Router.router.replace("/");
                } else {
                    console.log(
                        "%cWOR%cDev error%c Could not get objectives (OBJS) fetched!",
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

        updateObj(id);
    };

    const [isFirstLaunch, setIsFirstLaunch] = React.useState<boolean | null>(
        null
    );

    // Comprobación para ver si es la primera vez que abre la app - si lo es, redirige a /Welc
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
                console.log(
                    "%cWOR%cDev error%c " + log,
                    "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                    "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                    "color: #FFD700;"
                );
            }
        };
        checkFirstLaunch();
    }, []);

    if (isFirstLaunch === null) {
        return null;
    }

    if (isFirstLaunch) {
        Router.router.push("/Welc");
    }

    const randomDoneAllMsg: number = Math.floor(Math.random() * 4) + 1;

    // Today's date (since React for some reasons thinks it's funny to start weeks on Sunday, this needs to be done)
    const today = new Date().getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    // Adjust today index to match week start (Monday as 0)
    const adjustedToday = today === 0 ? 6 : today - 1; // Adjust Sunday to index 6, otherwise shift back by one

    return (
        <Native.View style={styles.containerview}>
            <Foot page={currentpage} />
            <Native.ScrollView style={styles.mainview}>
                <BeText align="normal" weight="Bold" size={40}>
                    Hello, {username}!
                </BeText>
                <BeText align="normal" weight="Regular" size={20}>
                    This is your summary for today
                </BeText>
                <GapView height={20} />
                <Section kind="OBJS">
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
                                <BeText
                                    align="center"
                                    size={30}
                                    color="#FFF"
                                    weight="Bold"
                                >
                                    You&apos;ve done everything!
                                </BeText>
                                <GapView height={10} />
                                {randomDoneAllMsg === 1 && (
                                    <BeText
                                        align="center"
                                        size={15}
                                        color="#FFF"
                                        weight="Regular"
                                    >
                                        Feel proud of yourself, don&apos;t you?
                                    </BeText>
                                )}
                                {randomDoneAllMsg === 2 && (
                                    <BeText
                                        align="center"
                                        size={15}
                                        color="#FFF"
                                        weight="Regular"
                                    >
                                        That is right, you have completed ALL of
                                        your objectives for today.
                                    </BeText>
                                )}
                                {randomDoneAllMsg === 3 && (
                                    <BeText
                                        align="center"
                                        size={15}
                                        color="#FFF"
                                        weight="Regular"
                                    >
                                        Now plan something else and make this
                                        day even more productive!
                                    </BeText>
                                )}
                                {randomDoneAllMsg === 4 && (
                                    <BeText
                                        align="center"
                                        size={15}
                                        color="#FFF"
                                        weight="Regular"
                                    >
                                        &quot;Giving yourself a PLUS&quot; seems
                                        to be worth it, right?
                                    </BeText>
                                )}
                            </Native.View>
                        ) : (
                            Object.keys(objs).map(key => {
                                const obj = objs[key];
                                console.log(
                                    `OBJ ${obj.id}, days[${adjustedToday}]: ${obj.days[adjustedToday]}`
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
                                            <Btn
                                                kind="ACE"
                                                onclick={() => startObj(obj.id)}
                                                text="Let's go!"
                                            />
                                            <Btn
                                                kind="GOD"
                                                onclick={() => doObj(obj.id)}
                                                text="Already done it"
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
                            <BeText
                                align="center"
                                size={30}
                                color="#FFF"
                                weight="Bold"
                            >
                                You don&apos;t have any objectives. Create one
                                now!
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
                </Section>
                <Nomore />
            </Native.ScrollView>
        </Native.View>
    );
}
