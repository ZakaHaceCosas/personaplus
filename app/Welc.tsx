// Welc.tsx
// Welcome page

import Btn from "@/components/Btns";
import GapView from "@/components/GapView";
import Input from "@/components/Input";
import BeText from "@/components/Text";
import React from "react"
import * as Native from "react-native";

// Definimos los estilos
const styles = Native.StyleSheet.create({
    defview: {
        width: "100vw", // Ignora el error, funciona correctamente. Cosas de TypeScript.
        height: "100vh", // Ignora el error, funciona correctamente. Cosas de TypeScript.
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
        width: "calc(50% - 5px)"
    }
})

// Definimos la función
export default function WelcomePage() {
    const [currentTab, setTab] = React.useState(1);
    const gonext = () => {
        setTab(prevPage => prevPage + 1);
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
                    <Btn kind="ACE" onclick={gonext} text="Let's go!" width="fill"/>
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
                    <Input kind="text" text="Input 1"></Input>
                    <Native.View style={styles.flexbtns}>
                        <Btn kind="UNKNOWN" onclick={goback} text="Go back" width="fill"/>
                        <Btn kind="ACE" onclick={gonext} text="Continue" width="fill"/>
                    </Native.View>
                </React.Fragment>
            )}
        </Native.View>
    )
}