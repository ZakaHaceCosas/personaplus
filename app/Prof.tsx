// Dash.tsx
// Dashboard, where you setup your path to success.

import React, { useState } from "react";
import { StrictMode } from "react";
import * as Native from 'react-native';
import BeText from "@/components/Text";
import Foot from "@/components/Foot";
import { usePathname } from "expo-router";
import Section from "@/components/section/Section";
import Division from "@/components/section/division/Division";
import Btn from "@/components/Btns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Nomore from "@/components/Nomore";
import Noti from "@/components/Noti";

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
export default function Prof() {
    const [uname, setUname] = useState('');
    const handleUnameTxtChange = (txt: string) => {
        setUname(txt);
    };
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


    const handleUnameBtnClick = async () => {
        try {
            const olduname: any = AsyncStorage.getItem('uname');
            if (olduname !== uname) {
                await AsyncStorage.setItem('uname', uname);
                showNotification("GOD", "Everything ok!", `Changed your username to ${uname}`, "static")
            } else {
                showNotification("WOR", "Error!", `Your username is already ${uname}! Can't change it to that`, "static")
            }
        } catch (e) {
            showNotification("WOR", "Error!", e, "static")
        }
    };

    let currentpage: string;
    currentpage = usePathname();

    return (
        <StrictMode>
            <Native.View style={styles.containerview}>
                <Native.ScrollView>
                    <Native.View style={styles.mainview}>
                        <BeText align="normal" weight="Bold" size={40}>Profile</BeText>
                        <BeText align="normal" weight="Regular" size={20}>Nice to meet you</BeText>
                        <Section kind="REGULAR">
                            <Division status="REGULAR" iconName={null} preheader="PROFILE" header="Setup a username" subheader="You need a username, comrade">
                                <Native.TextInput
                                    readOnly={false}
                                    maxLength={40}
                                    placeholder="Your username here"
                                    placeholderTextColor="#C8C8C8"
                                    onChangeText={handleUnameTxtChange}
                                    value={uname}
                                    style={[{ backgroundColor: "white", borderRadius: 10, padding: 10, borderWidth: 2, borderColor: "#000" }]}
                                />
                                <Btn kind="ACE" onclick={handleUnameBtnClick} text="Save username"/>
                            </Division>
                        </Section>
                        <Nomore />
                    </Native.View>
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