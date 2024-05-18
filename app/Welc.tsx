// Welc.tsx
// Welcome page

import Btn from "@/components/Btns";
import GapView from "@/components/GapView";
import BeText from "@/components/Text";
import React from "react"
import * as Native from "react-native";
import * as Router from "expo-router";

// Definimos los estilos
const styles = Native.StyleSheet.create({
    defview: {
        width: "100vw" as Native.DimensionValue, // Ignora el error, funciona correctamente. Cosas de TypeScript.
        height: "100vh" as Native.DimensionValue, // Ignora el error, funciona correctamente. Cosas de TypeScript.
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 40
    },
    flexbtns: {
        display: "flex",
        flexDirection: "row",
        gap: 15,
        width: "calc(100% - 5px)" as Native.DimensionValue
    }
})

// Definimos la función
export default function WelcomePage() {
    const [currentTab, setTab] = React.useState(1);

    const gonext = () => {
        if (currentTab > 0 && currentTab < 2) { // Update number whenever you add a new tab.
            setTab(prevPage => prevPage + 1);
        } else {
            Router.router.replace('/');
        }
    };
    const goback = () => {
        setTab(prevPage => prevPage - 1);
    };

    const learnMore = async () => {
        const url = 'https://personaplus.vercel.app/#privacy';
        const sup = await Native.Linking.canOpenURL(url);
    
        if (sup) {
            try {
                await Native.Linking.openURL(url);
            } catch (e) {
                console.error(e)
            }
        }
    };

    return (
        <Native.View style={styles.defview}>
            {currentTab === 1 && (
                <React.Fragment>
                    <BeText align="normal" weight="Bold" size={40}>
                        Welcome to <BeText align="normal" weight="ExtraBold" size={40} color="#32FF80">PersonaPlus</BeText>!
                    </BeText>
                    <GapView height={10} />
                    <BeText align="normal" weight="Regular" size={20}>
                        We're proud to see you want to give yourself a plus.
                    </BeText>
                    <GapView height={20} />
                    <Native.View style={styles.flexbtns}>
                        <Btn kind="ACE" onclick={gonext} text="Let's go!" width="fill" height={500}/>
                    </Native.View>
                </React.Fragment>
            )}

            {currentTab === 2 && (
                <React.Fragment>
                    <BeText align="normal" weight="Bold" size={40}>
                        Tell us a bit about yourself
                    </BeText>
                    <GapView height={10} />
                    <BeText align="normal" weight="Regular" size={20}>
                        We only ask for the data we do need for the app to function. No data is sent outside of this device, ever. <BeText align="normal" weight="Regular" size={20} color="#3280FF" onTap={learnMore}>Learn more</BeText>.
                    </BeText>
                    <GapView height={20} />
                    <Native.TextInput
                        placeholder = "Input 1"
                        readOnly = {false}
                        placeholderTextColor="#C8C8C8"
                        style={[{ backgroundColor: "white", borderRadius: 10, padding: 10, borderWidth: 2, borderColor: "#000", width: "100%" }]}
                    />
                    <Native.View style={styles.flexbtns}>
                        <Btn kind="UNKNOWN" onclick={goback} text="Go back" width="fill"/>
                        <Btn kind="ACE" onclick={gonext} text="Continue" width="fill"/>
                    </Native.View>
                </React.Fragment>
            )}
        </Native.View>
    )
}