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
import Noti from "@/components/Noti";
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
    },
    notiview: {
        display: "flex",
        flexDirection: "column",
    },
});

// Creamos la función
export default function Home() {
    // Por defecto
    const [username, setUname] = React.useState<string>("Unknown");
    const [objs, setObjs] = React.useState<{ [key: string]: Objective } | null>(
        null
    );
    const [notiProps, setNotiProps] = React.useState<{
        kind: string;
        title: string;
        text: string;
        post: string | null;
    } | null>(null);

    const showNotification = (
        kind: string,
        titl: string,
        text: any,
        post: string | null
    ) => {
        setNotiProps({
            kind: kind,
            title: titl,
            text: String(text),
            post: post,
        });

        // Para que la notificación dure 7.5 segundos
        setTimeout(() => {
            setNotiProps(null);
        }, 7500);
    };

    React.useEffect(() => {
        const fetchUsername = async () => {
            const uname: string | null = await AsyncStorage.getItem("uname");
            if (uname) {
                showNotification(
                    "GOD",
                    "Everything ok!",
                    "Username fetched!",
                    "static"
                );
                setUname(uname);
            } else {
                showNotification(
                    "WOR",
                    "Dev error",
                    "Username error!",
                    "static"
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
                    console.log("OBJS fetched");
                } else {
                    await AsyncStorage.setItem("objs", JSON.stringify({}));
                    console.error("Could not get OBJS fetched");
                    setObjs({});
                }
            } catch (e) {
                console.error("Could not get OBJS fetched: " + e);
            }
        };

        fetchObjectives();
    }, []);

    let currentpage: string;
    currentpage = Router.usePathname();

    const createObj = (): void => {
        Router.router.navigate("Crea");
    };

    return (
        <Native.View style={styles.containerview}>
            <Native.ScrollView style={styles.mainview}>
                <BeText align="normal" weight="Bold" size={40}>
                    Hello, {username}!
                </BeText>
                <BeText align="normal" weight="Regular" size={20}>
                    This is your summary for today
                </BeText>
                <GapView height={20} /> {/* oye, ¿por qué no?*/}
                <Section kind="OBJS">
                    {objs && Object.keys(objs).length > 0 ? (
                        Object.keys(objs).map((key) => {
                            const obj = objs[key];
                            return (
                                <Division
                                    key={obj.id}
                                    status="REGULAR"
                                    preheader="ACTIVE OBJECTIVE"
                                    header={obj.exercise}
                                    subheader=""
                                    // subheader={obj.description}
                                >
                                    <Btn
                                        kind="ACE"
                                        onclick={() => {}}
                                        text="Let's go!"
                                    />
                                    <Btn
                                        kind="GOD"
                                        onclick={() => {}}
                                        text="Already done it"
                                    />
                                </Division>
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
                                align="cent"
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
            <Native.View style={styles.notiview}>
                {notiProps && (
                    <Noti
                        kind={notiProps.kind}
                        title={notiProps.title}
                        text={notiProps.text}
                        post={notiProps.post}
                    />
                )}
            </Native.View>
            <Foot page={currentpage} />
        </Native.View>
    );
}
