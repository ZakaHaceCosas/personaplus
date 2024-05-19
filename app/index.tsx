// index.tsx
// Welcome to PersonaPlus, my friend!

import React from "react"
import { StrictMode } from "react";
import * as Native from 'react-native';
import BeText from "@/components/Text";
import Section from "@/components/section/Section";
import Foot from "@/components/Foot";
import { usePathname } from "expo-router"
import Division from "@/components/section/division/Division";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Btn from "@/components/Btns";
import GapView from "@/components/GapView";
import Noti from "@/components/Noti";
import Nomore from "@/components/Nomore";
import * as Animatable from 'react-native-animatable';

// Creamos los estilos
const styles = Native.StyleSheet.create({
    containerview: {
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue
    },
    mainview: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
    },
    notiview: {
        display: "flex",
        flexDirection: "column"
    }
})

// Creamos la función
export default function Home() {
    // Por defecto
    const [username, setUname] = React.useState<string>("Unknown");
    const [objs, fetchObjs] = React.useState();
    const [notiProps, setNotiProps] = React.useState<{ kind: string, title: string, text: string, post: string | null  } | null>(null);

    const showNotification = (kind: string, titl: string, text: any, post: string | null ) => {
        setNotiProps({
            kind: kind,
            title: titl,
            text: String(text),
            post: post
        });

        // Para que la notificación dure 7.5 segundos
        setTimeout(() => {
            setNotiProps(null);
        }, 7500);
    };

    React.useEffect(() => {
        const fetchUsername = async () => {
            try {
                const uname: string | null = await AsyncStorage.getItem('uname');
                if (uname) {
                    showNotification("GOD", "Everything ok!", "Username fetched!", "static")
                    setUname(uname);
                }
            } catch (e) {
                showNotification("WOR", "Dev error", e, "static")
            }
        };

        fetchUsername();
    }, []);

    React.useEffect(() => {
        const fetchObjs = async () => {
            try {
                const objs: string | null = await AsyncStorage.getItem('objs');
                if (objs) {
                    showNotification("GOD", "Everything ok!", "Objs fetched!", "static")
                }
            } catch (e) {
                showNotification("WOR", "Dev error", e, "static")
            }
        };

        fetchObjs();
    }, []);

    let currentpage: string;
    currentpage = usePathname();

    return (
        <StrictMode>
            <Native.View style={styles.containerview}>
                <Native.ScrollView style={styles.mainview}>
                    <BeText align="normal" weight="Bold" size={40}>
                        Hello, {username}!
                    </BeText>
                    <BeText align="normal" weight="Regular" size={20}>
                        This is your summary for today
                    </BeText>
                    <GapView height={20}/> {/* oye, ¿por qué no? */}
                    <Section kind="OBJS">
                        <Division preheader="OBJECTIVE" header="RUNNING" subheader="For 12 minutes" iconName={null} status="REGULAR">
                            <Btn text="Let's do it now!" kind="ACE" width="fill" onclick={() => {}}/>
                            <Btn text="Done it" kind="GOD" width="fill" onclick={() => {}}/>
                        </Division>
                    </Section>
                    <Nomore />
                </Native.ScrollView>
                <Native.View style={styles.notiview}>
                    {notiProps && (
                        <Noti kind={notiProps.kind} title={notiProps.title} text={notiProps.text} post={notiProps.post} />
                    )}
                </Native.View>
                <Foot page={currentpage}></Foot>
            </Native.View>
        </StrictMode>
    )
}