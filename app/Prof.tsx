// Prof.tsx
// Profile page.

import * as React from "react";
import * as Native from "react-native";
import BeText from "@/components/Text";
import Foot from "@/components/Foot";
import * as Router from "expo-router";
import Section from "@/components/section/Section";
import Division from "@/components/section/division/Division";
import Btn from "@/components/Btns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Nomore from "@/components/Nomore";
import GapView from "@/components/GapView";

// Creamos los estilos
const styles = Native.StyleSheet.create({
    containerview: {
        width: "100vw" as Native.DimensionValue,
        height: "100vw" as Native.DimensionValue,
    },
    mainview: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as Native.DimensionValue,
        height: "100vw" as Native.DimensionValue,
        overflow: "scroll",
    },
    flexyview: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
});

// Creamos la función
export default function Prof() {
    const [username, setUsername] = React.useState<string>("Unknown");
    const [uname, setUname] = React.useState("");
    const handleUnameTxtChange = (txt: string) => {
        setUname(txt);
    };

    const handleUnameBtnClick = async () => {
        try {
            const olduname: string | null = await AsyncStorage.getItem("uname");
            if (olduname !== uname) {
                await AsyncStorage.setItem("uname", uname);
                const log = `Changed your username to ${uname}`;
                console.log(
                    "%cGOD%cAll is ok%c " + log,
                    "font-weight: bold; background: #30FF97; color: black; padding: 2px 4px; border-radius: 2px;",
                    "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                    "color: #30FF97;"
                );
                setTimeout(() => {
                    Router.router.replace("/");
                }, 25);
            } else {
                const log = `Your username is already ${uname}! Can't change it to that`;
                console.log(
                    "%cWOR%cDev error%c " + log,
                    "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                    "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                    "color: #FFD700;"
                );
            }
        } catch (e) {
            const log = "Could not handleUnameBtnClick() due to error: " + e;
            console.log(
                "%cWOR%cDev error%c " + log,
                "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                "color: #FFD700;"
            );
        }
    };

    const currentpage: string = Router.usePathname();

    React.useEffect(() => {
        const fetchUsername = async () => {
            try {
                const uname: string | null =
                    await AsyncStorage.getItem("uname");
                if (uname) {
                    setUsername(uname);
                    console.log(
                        "%cGOD%cAll is ok%c Username (uname) fetched!",
                        "font-weight: bold; background: #30FF97; color: black; padding: 2px 4px; border-radius: 2px;",
                        "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                        "color: #30FF97;"
                    );
                } else {
                    console.log(
                        "%cWOR%cDev error%c Username could not be fetched due to an error!",
                        "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                        "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                        "color: #FFD700;"
                    );
                }
            } catch (e) {
                const log =
                    "Could not fetch username (uname) due to error: " + e;
                console.log(
                    "%cWOR%cDev error%c " + log,
                    "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                    "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                    "color: #FFD700;"
                );
            }
        };

        fetchUsername();
    }, []);

    const sh =
        "You can change your username whenever you want. Your current username is '" +
        username +
        "'";

    return (
        <Native.View style={styles.containerview}>
            <Foot page={currentpage}></Foot>
            <Native.ScrollView>
                <Native.View style={styles.mainview}>
                    <BeText align="normal" weight="Bold" size={40}>
                        Profile
                    </BeText>
                    <BeText align="normal" weight="Regular" size={20}>
                        Nice to meet you!
                    </BeText>
                    <GapView height={20} />
                    <Section kind="SETS">
                        <Division
                            status="REGULAR"
                            iconName={null}
                            preheader="PROFILE"
                            header="Set your username"
                            subheader={sh}
                        >
                            <Native.View style={styles.flexyview}>
                                <Native.TextInput
                                    placeholder="Enter a new username"
                                    readOnly={false}
                                    placeholderTextColor="#949698"
                                    style={[
                                        {
                                            backgroundColor: "#2A2D32",
                                            borderRadius: 10,
                                            padding: 10,
                                            paddingLeft: 20,
                                            paddingRight: 20,
                                            borderWidth: 4,
                                            borderColor: "#3E4146",
                                            width: "100%",
                                            color: "white",
                                            // @ts-expect-error: For some reason appears as "non supported property", but it does work properly.
                                            outline: "none",
                                            fontFamily: "BeVietnamPro-Regular",
                                        },
                                    ]}
                                    autoCorrect={false}
                                    multiline={false}
                                    maxLength={40}
                                    textAlign="left"
                                    fontFamily="BeVietnamPro-Regular"
                                    textContentType="none"
                                    inputMode="text"
                                    key="ageinput"
                                    enterKeyHint="done"
                                    onChangeText={handleUnameTxtChange}
                                />
                                <GapView height={10} />
                                <Btn
                                    kind="ACE"
                                    onclick={handleUnameBtnClick}
                                    text="Save username"
                                />
                            </Native.View>
                        </Division>
                    </Section>
                    <Nomore />
                </Native.View>
            </Native.ScrollView>
        </Native.View>
    );
}
