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
import Noti from "@/components/Noti";
import GapView from "@/components/GapView";

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

    const handleUnameBtnClick = async () => {
        try {
            const olduname: string | null = await AsyncStorage.getItem("uname");
            if (olduname !== uname) {
                await AsyncStorage.setItem("uname", uname);
                showNotification(
                    "GOD",
                    "Everything ok!",
                    `Changed your username to ${uname}`,
                    "static"
                );
                setTimeout(() => {
                    Router.router.replace("/");
                }, 1000);
            } else {
                showNotification(
                    "WOR",
                    "Error!",
                    `Your username is already ${uname}! Can't change it to that`,
                    "static"
                );
            }
        } catch (e) {
            showNotification("WOR", "Error!", e, "static");
        }
    };

    let currentpage: string;
    currentpage = Router.usePathname();

    React.useEffect(() => {
        const fetchUsername = async () => {
            try {
                const uname: string | null = await AsyncStorage.getItem(
                    "uname"
                );
                if (uname) {
                    showNotification(
                        "GOD",
                        "Everything ok!",
                        "Username fetched!",
                        "static"
                    );
                    setUsername(uname);
                } else {
                    showNotification(
                        "WOR",
                        "Dev error",
                        "Username error!",
                        "static"
                    );
                }
            } catch (e) {
                showNotification("WOR", "Error!", e, "static");
            }
        };

        fetchUsername();
    }, []);

    let sh =
        "You need a good username, comrade. You can change it whenever you want. Your current username is '" +
        username +
        "'";

    return (
        <Native.View style={styles.containerview}>
            <Native.ScrollView>
                <Native.View style={styles.mainview}>
                    <BeText align="normal" weight="Bold" size={40}>
                        Profile
                    </BeText>
                    <BeText align="normal" weight="Regular" size={20}>
                        Nice to meet you
                    </BeText>
                    <GapView height={20} />
                    <Section kind="SETS">
                        <Division
                            status="REGULAR"
                            iconName={null}
                            preheader="PROFILE"
                            header="Change your username"
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
                                            padding: 15,
                                            borderWidth: 4,
                                            borderColor: "#3E4146",
                                            width: "100%",
                                            color: "white",
                                            // @ts-ignore
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
                                    inputMode="numeric"
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
            <Foot page={currentpage}></Foot>
        </Native.View>
    );
}
