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
    const [objs, fetchObjs] = React.useState();
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

    let objectives: any;

    React.useEffect(() => {
        const fetchObjs = async () => {
            const objs: string | null = await AsyncStorage.getItem("objs");
            if (objs) {
                objectives = objs;
                showNotification(
                    "GOD",
                    "Everything ok!",
                    "Objs fetched!",
                    "static"
                );
                return objs;
            } else {
                await AsyncStorage.setItem("objs", "null");
                showNotification("WOR", "Dev error", "Error", "static");
                return 1;
            }
        };

        fetchObjs();
    }, []);

    let currentpage: string;
    currentpage = Router.usePathname();

    const createObj = (): void => {
        console.log("create obj");
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
                    {objectives ? (
                        Object.keys(objectives).map((key, index) => {
                            const obj = objectives[key];
                            return (
                                <Division
                                    key={index}
                                    status="REGULAR"
                                    preheader="ACTIVE OBJECTIVE"
                                    header={obj.name}
                                    subheader={obj.desc}
                                >
                                    <Btn
                                        kind="REGULAR"
                                        onclick={() => {}}
                                        text="HOLA"
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
                                text="Let's do it!"
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
