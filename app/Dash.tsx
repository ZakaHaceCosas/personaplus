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
export default function Dash() {
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

    let objectives: any;

    React.useEffect(() => {
        const fetchObjs = async () => {
            const objs: string | null = await AsyncStorage.getItem("objs");
            if (objs) {
                objectives = JSON.parse(objs);
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

    console.log("OBJS: " + objectives);
    const createObj = (): void => {};
    // TypeScript, supongo
    interface objEventProps {
        id: string;
    }
    function startSess({ id }: objEventProps) {
        console.log("START ID " + id);
    }
    function done({ id }: objEventProps) {
        console.log("START ID " + id);
    }

    let currentpage: string;
    currentpage = Router.usePathname();

    return (
        <Native.View style={styles.containerview}>
            <Native.ScrollView style={styles.mainview}>
                <BeText align="normal" weight="Bold" size={40}>
                    Dashboard
                </BeText>
                <BeText align="normal" weight="Regular" size={20}>
                    Lets set up your path to success
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
                                        kind="ACE"
                                        onclick={startSess(obj.id)}
                                        text="Let's do it!"
                                    />
                                    <Btn
                                        kind="GOD"
                                        onclick={done(obj.id)}
                                        text="Already done it!"
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
            <Foot page={currentpage}></Foot>
        </Native.View>
    );
}
