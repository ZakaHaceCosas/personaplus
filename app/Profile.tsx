// Profile.tsx
// Profile page.

import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";
import Footer from "@/components/Footer";
import * as Router from "expo-router";
import Section from "@/components/section/Section";
import Division from "@/components/section/division/Division";
import Button from "@/components/Buttons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from "@/components/BottomNav";
import GapView from "@/components/GapView";
import { termLog } from "./DeveloperInterface";

// TypeScript interface para el release
interface Release {
    tag_name: string;
    prerelease: boolean;
    assets: { browser_download_url: string; name: string }[];
    html_url: string;
}

// Versión actual de la aplicación
const currentVersion = "0.0.1-R5-b20";

// Función asincrónica para comprobar actualizaciones
const checkForUpdates = async () => {
    try {
        const response = await fetch(
            "https://api.github.com/repos/ZakaHaceCosas/personaplus/releases"
        );
        if (!response.ok) {
            throw new Error(
                `Failed to fetch releases (status ${response.status})`
            );
        }
        const releases: Release[] = await response.json();

        // Ordenar releases por fecha descendente y obtener la más reciente
        const latestRelease = releases.sort(
            (a, b) =>
                new Date(b.tag_name).getTime() - new Date(a.tag_name).getTime()
        )[0];

        if (latestRelease) {
            const latestVersion = latestRelease.tag_name;
            console.log(`Latest version: ${latestVersion}`);

            if (latestVersion !== currentVersion) {
                Native.Alert.alert(
                    "Update Available",
                    `A new version (${latestVersion}) is available. Please update PersonaPlus to the latest version.\n\n"Update" will redirect you to the download page of the latest APK.\n\n"See changelog" will take you to the GitHub release page.`,
                    [
                        {
                            text: "Update",
                            style: "default",
                            onPress: () =>
                                Native.Linking.openURL(
                                    latestRelease.assets.length > 0
                                        ? latestRelease.assets[0]
                                              .browser_download_url
                                        : ""
                                ),
                        },
                        {
                            text: "See changelog",
                            onPress: () =>
                                Native.Linking.openURL(
                                    latestRelease.html_url || ""
                                ),
                        },
                        {
                            text: "Cancel",
                            onPress: () => {},
                        },
                    ]
                );
            } else {
                Native.ToastAndroid.show(
                    "You are up to date!",
                    Native.ToastAndroid.SHORT
                );
            }
        } else {
            Native.ToastAndroid.show(
                "Couldn't check for updates. You're (probably) up to date.",
                Native.ToastAndroid.SHORT
            );
        }
    } catch (error) {
        console.error("Error checking for update:", error);
        Native.ToastAndroid.show(
            "Failed to check for updates. Please try again later.",
            Native.ToastAndroid.SHORT
        );
    }
};

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
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
        overflow: "scroll",
    },
    flexyview: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
});

// Creamos la función
export default function Profile() {
    const [username, setUsername] = React.useState<string>("Unknown");
    const [gender, setGender] = React.useState<string>("Unknown");
    const [age, setAge] = React.useState<string>("Unknown");
    const [height, setHeight] = React.useState<string>("Unknown");
    const [weight, setWeight] = React.useState<string>("Unknown");
    const [uname, setUname] = React.useState("");
    const handleUnameTxtChange = (txt: string) => {
        setUname(txt);
    };

    const handleUnameBtnClick = async () => {
        try {
            const olduname: string | null =
                await AsyncStorage.getItem("username");
            if (olduname !== uname) {
                await AsyncStorage.setItem("username", uname);
                const log = `Changed your username to ${uname}`;
                termLog(log, "success");
                setTimeout(() => {
                    Router.router.replace("/");
                }, 25);
            } else {
                const log = `Your username is already ${uname}! Can't change it to that`;
                termLog(log, "error");
            }
        } catch (e) {
            const log = "Could not handleUnameBtnClick() due to error: " + e;
            termLog(log, "error");
        }
    };

    const currentpage: string = Router.usePathname();

    React.useEffect(() => {
        const fetchUsername = async () => {
            try {
                const uname: string | null =
                    await AsyncStorage.getItem("username");
                if (uname) {
                    setUsername(uname);
                    termLog("Username (uname) fetched!", "success");
                } else {
                    termLog(
                        "Username could not be fetched due to an error!",
                        "error"
                    );
                }
            } catch (e) {
                const log =
                    "Could not fetch username (uname) due to error: " + e;
                termLog(log, "error");
            }
        };

        fetchUsername();
    }, []);

    React.useEffect(() => {
        const fetchGender = async () => {
            try {
                const gender: string | null =
                    await AsyncStorage.getItem("gender");
                if (gender) {
                    setGender(gender);
                    termLog("Gender fetched!", "success");
                } else {
                    termLog(
                        "Gender could not be fetched due to an error!",
                        "error"
                    );
                }
            } catch (e) {
                const log = "Could not fetch gender due to error: " + e;
                termLog(log, "error");
            }
        };

        fetchGender();
    }, []);

    React.useEffect(() => {
        const fetchAge = async () => {
            try {
                const age: string | null = await AsyncStorage.getItem("age");
                if (age) {
                    setAge(age);
                    termLog("Age fetched!", "success");
                } else {
                    termLog(
                        "Age could not be fetched due to an error!",
                        "error"
                    );
                }
            } catch (e) {
                const log = "Could not fetch age due to error: " + e;
                termLog(log, "error");
            }
        };

        fetchAge();
    }, []);

    React.useEffect(() => {
        const fetchHeight = async () => {
            try {
                const height: string | null =
                    await AsyncStorage.getItem("height");
                if (height) {
                    setHeight(height);
                    termLog("height fetched!", "success");
                } else {
                    termLog(
                        "height could not be fetched due to an error!",
                        "error"
                    );
                }
            } catch (e) {
                const log = "Could not fetch height due to error: " + e;
                termLog(log, "error");
            }
        };

        fetchHeight();
    }, []);

    React.useEffect(() => {
        const fetchWeight = async () => {
            try {
                const weight: string | null =
                    await AsyncStorage.getItem("weight");
                if (weight) {
                    setWeight(weight);
                    termLog("weight fetched!", "success");
                } else {
                    termLog(
                        "weight could not be fetched due to an error!",
                        "error"
                    );
                }
            } catch (e) {
                const log = "Could not fetch weight due to error: " + e;
                termLog(log, "error");
            }
        };

        fetchWeight();
    }, []);

    const [wantsDev, setWantsDev] = React.useState<boolean | null>(null);

    // Busca si quiere usar Dev interface
    React.useEffect(() => {
        const checkForDev = async () => {
            try {
                const useDev = await AsyncStorage.getItem("useDevTools");
                if (useDev === "true") {
                    setWantsDev(true);
                } else {
                    setWantsDev(false);
                }
            } catch (e) {
                const log =
                    "Got an error checking if the user wants to use Dev interface: " +
                    e;
                termLog(log, "warn");
            }
        };
        checkForDev();
    }, []);

    const [isUnamechangeVisible, setIsUnamechangeVisible] =
        React.useState<boolean>(false);

    const toggleUnamechangeVisibility = () => {
        setIsUnamechangeVisible(!isUnamechangeVisible);
    };

    const enableDevInterface = async function () {
        try {
            await AsyncStorage.setItem("useDevTools", "true");
            Router.router.navigate("/DeveloperInterface");
        } catch (e) {
            const log = "ERROR ENABLING DEV INTERFACE: " + e;
            termLog(log, "error");
        }
    };

    const disableDevInterface = async function () {
        try {
            await AsyncStorage.setItem("useDevTools", "false");
            Router.router.navigate("/");
        } catch (e) {
            const log = "ERROR DISABLING DEV INTERFACE: " + e;
            termLog(log, "error");
        }
    };

    const deleteAll = async () => {
        try {
            await AsyncStorage.multiRemove([
                "useDevTools",
                "hasLaunched",
                "age",
                "gender",
                "height",
                "weight",
                "focuspoint",
                "objs",
                "username",
                "sleep",
            ]);
            Router.router.navigate("/WelcomeScreen");
            console.log("DEV CLEARED ALL");
            termLog("DEV CLEARED ALL", "log");
        } catch (e) {
            console.error(e);
            termLog(String(e), "error");
        }
    };

    const startOver = () => {
        Native.Alert.alert(
            "Are you sure?",
            "Again: THERE - IS - NO - WAY - BACK.",
            [
                { text: "Go ahead", style: "destructive", onPress: deleteAll },
                { text: "Nevermind", style: "default", onPress: () => {} },
            ]
        );
    };

    return (
        <Native.View style={styles.containerview}>
            <BottomNav currentLocation={currentpage} />
            <Native.ScrollView>
                <Native.View style={styles.mainview}>
                    <BetterText
                        textAlign="normal"
                        fontWeight="Bold"
                        fontSize={40}
                    >
                        Profile
                    </BetterText>
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={20}
                    >
                        Nice to meet you, {username}!
                    </BetterText>
                    <GapView height={20} />
                    <Section kind="Profile">
                        <Division header={username}>
                            <Native.View style={styles.flexyview}>
                                <BetterText
                                    textAlign="normal"
                                    textColor="#FFF"
                                    fontWeight="Regular"
                                    fontSize={15}
                                >
                                    Gender: {String(gender)}
                                </BetterText>
                                <BetterText
                                    textAlign="normal"
                                    textColor="#FFF"
                                    fontWeight="Regular"
                                    fontSize={15}
                                >
                                    Age: {String(age)} years old
                                </BetterText>
                                <BetterText
                                    textAlign="normal"
                                    textColor="#FFF"
                                    fontWeight="Regular"
                                    fontSize={15}
                                >
                                    Height: {String(height)} cm
                                </BetterText>

                                <BetterText
                                    textAlign="normal"
                                    textColor="#FFF"
                                    fontWeight="Regular"
                                    fontSize={15}
                                >
                                    Weight: {String(weight)} kg
                                </BetterText>
                                <GapView height={10} />
                                {!isUnamechangeVisible && (
                                    <Button
                                        style="ACE"
                                        action={toggleUnamechangeVisibility}
                                        buttonText="Change my username"
                                    />
                                )}
                            </Native.View>
                        </Division>
                    </Section>
                    <GapView height={20} />
                    {isUnamechangeVisible && (
                        <Section kind="Settings">
                            <Division
                                status="REGULAR"
                                iconName={null}
                                preheader="PROFILE"
                                header="Set your username"
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
                                                fontFamily:
                                                    "BeVietnamPro-Regular",
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
                                    <Native.View
                                        style={{
                                            display: "flex",
                                            flex: 1,
                                            flexDirection: "row",
                                        }}
                                    >
                                        <Button
                                            style="ACE"
                                            action={handleUnameBtnClick}
                                            buttonText="Save username"
                                            width="fill"
                                        />
                                        <GapView width={10} />
                                        <Button
                                            style="DEFAULT"
                                            action={toggleUnamechangeVisibility}
                                            buttonText="Cancel"
                                        />
                                    </Native.View>
                                </Native.View>
                            </Division>
                        </Section>
                    )}
                    <GapView height={20} />
                    <Section kind="About">
                        <Division
                            status="REGULAR"
                            iconName={null}
                            header="About"
                            subheader="License, credits, and more info about the app."
                        >
                            <Button
                                style="ACE"
                                action={() => Router.router.navigate("/About")}
                                buttonText="See about"
                            />
                        </Division>
                        <Division
                            status="REGULAR"
                            iconName={null}
                            header="Check for updates"
                            subheader="You are currently using 0.0.1-R5-b20."
                        >
                            <Button
                                style="ACE"
                                action={checkForUpdates}
                                buttonText="Check for updates"
                            />
                        </Division>
                    </Section>
                    <GapView height={20} />
                    <Section kind="Developer">
                        <Division
                            status="REGULAR"
                            iconName={null}
                            preheader="DEV INTERFACE"
                            header="Use Dev Interface?"
                            subheader="Enables advanced developer info for testing and contributions."
                        >
                            <Native.View style={styles.flexyview}>
                                <BetterText
                                    textAlign="normal"
                                    fontWeight="Regular"
                                    fontSize={15}
                                >
                                    Dev interface is{" "}
                                    <BetterText
                                        textAlign="normal"
                                        fontWeight="Bold"
                                        fontSize={15}
                                    >
                                        {wantsDev === true
                                            ? "enabled"
                                            : "disabled"}
                                    </BetterText>
                                    .
                                </BetterText>
                                <GapView height={10} />
                                {wantsDev === false ? (
                                    <Button
                                        style="HMM"
                                        action={enableDevInterface}
                                        buttonText="Enable Dev interface"
                                    />
                                ) : (
                                    <Button
                                        style="HMM"
                                        action={disableDevInterface}
                                        buttonText="Disable Dev interface"
                                    />
                                )}
                            </Native.View>
                        </Division>
                        <Division
                            status="REGULAR"
                            iconName={null}
                            preheader="DANGER ZONE"
                            header="Start over"
                            subheader="Deletes ALL data (profile, objectives, stats...) from the app. There's no way to undo this or to recover your data. Not recommended, unless you're using PersonaPlus for testing purposes."
                        >
                            <Button
                                style="WOR"
                                action={startOver}
                                buttonText="Start over"
                            />
                        </Division>
                    </Section>
                    <Footer />
                </Native.View>
            </Native.ScrollView>
        </Native.View>
    );
}
