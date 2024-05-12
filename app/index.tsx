// index.tsx
// Welcome to PersonaPlus, my friend!

import React from "react"
import * as Native from 'react-native';
import BeText from "@/components/Text";
import Section from "@/components/section/Section";
import Foot from "@/components/Foot";
import { usePathname } from "expo-router"
import Division from "@/components/section/division/Division";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Btn from "@/components/Btns";
import GapView from "@/components/GapView";

// Creamos los estilos
const styles = Native.StyleSheet.create({
    containerview: {
        width: "100vw",
        height: "100vh"
    },
    mainview: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
    },
    epicspacingdiv: {
        height: 20,
        width: 1
    }
})

// Creamos la función
export default function Home() {
    // Por defecto
    const [username, setUname] = React.useState<string>("Unknown");
    React.useEffect(() => {
        const fetchUsername = async () => {
            try {
                const uname: any = await AsyncStorage.getItem('uname');
                if (uname) {
                    setUname(uname);
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchUsername();
    }, []);

    let currentpage: string;
    currentpage = usePathname();

    return (
        <Native.View style={styles.containerview}>
            <Native.ScrollView style={styles.mainview}>
                <BeText align="normal" weight="Bold" size={40}>Hello, {username}!</BeText>
                <BeText align="normal" weight="Regular" size={20}>
                    This is your summary for today
                </BeText>
                <GapView height={20}/> {/* oye, ¿por qué no? */}
                <Section kind="OBJS">
                    <Division preheader="OBJECTIVE" header="RUNNING" subheader="For 12 minutes" iconName={null} status="REGULAR">
                        <Btn text="Let's do it now!" kind="ACE" width="fill" onclick={null}/>
                        <Btn text="Done it" kind="GOD" width="fill" onclick={null}/>
                    </Division>
                </Section>
                <GapView height={20}/>
                <Section kind="OBJS">
                    <Division preheader="OBJECTIVE" header="RUNNING" subheader="For 12 minutes" iconName={null} status="REGULAR">
                        <Btn text="Let's do it now!" kind="ACE" width="fill" onclick={null}/>
                        <Btn text="Done it" kind="GOD" width="fill" onclick={null}/>
                    </Division>
                </Section>
                <GapView height={20}/>
                <Section kind="OBJS">
                    <Division preheader="OBJECTIVE" header="RUNNING" subheader="For 12 minutes" iconName={null} status="REGULAR">
                        <Btn text="Let's do it now!" kind="ACE" width="fill" onclick={null}/>
                        <Btn text="Done it" kind="GOD" width="fill" onclick={null}/>
                    </Division>
                </Section>
                <GapView height={20}/>
                <Section kind="OBJS">
                    <Division preheader="OBJECTIVE" header="RUNNING" subheader="For 12 minutes" iconName={null} status="REGULAR">
                        <Btn text="Let's do it now!" kind="ACE" width="fill" onclick={null}/>
                        <Btn text="Done it" kind="GOD" width="fill" onclick={null}/>
                    </Division>
                </Section>
            </Native.ScrollView>
            <Foot page={currentpage}></Foot>
        </Native.View>
    )
}