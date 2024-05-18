// index.tsx
// Welcome to PersonaPlus, my friend!

import React, { StrictMode } from "react"
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
    }
})

// Creamos la función
export default function Home() {
    // Por defecto
    const [username, setUname] = React.useState<string>("Unknown");
    const [notiProps, setNotiProps] = React.useState<{ kind: string, title: string, text: string } | null>(null);

    const showNotification = (kind: string, titl: string, text: any) => {
      setNotiProps({
        kind: kind,
        title: titl,
        text: text
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
                    showNotification("GOD", "Everything ok!", "Username fetched!")
                    setUname(uname);
                }
            } catch (e) {
                //console.error(e)
                showNotification("WOR", "Dev error", e)
            }
        };

        fetchUsername();
    }, []);

    let currentpage: string;
    currentpage = usePathname();

    return (
        <Native.View style={styles.containerview}>
            {notiProps && <Noti kind={notiProps.kind} title={notiProps.title} text={notiProps.text} />}
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
                <Nomore />
            </Native.ScrollView>
            <Foot page={currentpage}></Foot>
        </Native.View>
    )
}