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

// Creamos los estilos
const styles = Native.StyleSheet.create({
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
        <Native.ScrollView>
            <Native.View style={styles.mainview}>
                <BeText align="normal" weight="Bold" size={40}>Hello, {username}!</BeText>
                <BeText align="normal" weight="Regular" size={20}>
                    This is your summary for today
                </BeText>
                <Native.View style={styles.epicspacingdiv}></Native.View> {/* oye, ¿por qué no? */}
                <Section kind="OBJS">
                    <Division preheader="OBJECTIVE" header="RUNNING" subheader="For 12 minutes" iconName={null} status="REGULAR">
                        <BeText align="normal" weight="BoldItalic" size={12} color="#FF3232">Botones aquí</BeText>
                    </Division>
                </Section>
            </Native.View>
            <Foot page={currentpage}></Foot>
        </Native.ScrollView>
    )
}