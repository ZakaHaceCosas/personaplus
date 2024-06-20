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
        paddingTop: 20,
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
    },
    mainview: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
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
                console.log(
                    "%cGOD%cAll is ok%c Username fetched!",
                    "font-weight: bold; background: #30FF97; color: black; padding: 2px 4px; border-radius: 2px;",
                    "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                    "color: #30FF97;"
                );
                setUname(uname);
            } else {
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
                let log =
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

    let currentpage: string;
    currentpage = Router.usePathname();

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
                    const updatedObjs = parsedObjs.map((obj: any) => {
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
                } else {
                    console.log(
                        "%cWOR%cDev error%c Could not get objectives (OBJS) fetched!",
                        "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                        "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                        "color: #FFD700;"
                    );
                }
            } catch (e) {
                let log =
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
        Router.router.navigate("/");
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
                    setIsFirstLaunch(true);
                } else {
                    setIsFirstLaunch(false);
                }
            } catch (e) {
                let log = "Got an error checking if app launched before: " + e;
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

    const randomDoneAllMsg: number = Math.floor(Math.random() * 3) + 1;

    return (
        <Native.View style={styles.containerview}>
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
                        Object.keys(objs).every((key) => objs[key].wasDone) ? (
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
                                    You've done everything!
                                </BeText>
                                <GapView height={10} />
                                {randomDoneAllMsg === 1 && (
                                    <BeText
                                        align="center"
                                        size={15}
                                        color="#FFF"
                                        weight="Regular"
                                    >
                                        Feel proud of yourself, don't you?
                                    </BeText>
                                )}
                                {randomDoneAllMsg === 2 && (
                                    <BeText
                                        align="center"
                                        size={15}
                                        color="#FFF"
                                        weight="Regular"
                                    >
                                        That's right, you've completed ALL of
                                        your objectives for today. "Giving
                                        yourself a PLUS" seems to be worth it,
                                        right?
                                    </BeText>
                                )}
                                {randomDoneAllMsg === 3 && (
                                    <BeText
                                        align="center"
                                        size={15}
                                        color="#FFF"
                                        weight="Regular"
                                    >
                                        You did all what you planned on
                                        PersonaPlus for today. Now plan
                                        something else and make this day even
                                        more worth it!
                                    </BeText>
                                )}
                            </Native.View>
                        ) : (
                            Object.keys(objs).map((key) => {
                                const obj = objs[key];
                                if (!obj.wasDone) {
                                    return (
                                        <Division
                                            key={obj.id}
                                            status="REGULAR"
                                            preheader="ACTIVE OBJECTIVE"
                                            header={obj.exercise}
                                            subheader=""
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
                            })
                        )
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
                                You don't have any objective. Create one now!
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
            <Foot page={currentpage} />
        </Native.View>
    );
}
