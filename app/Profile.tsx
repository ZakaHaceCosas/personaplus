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
import { version } from "@/package.json";

// TypeScript, supongo
interface Release {
    tag_name: string;
    prerelease: boolean;
    assets: { browser_download_url: string; name: string }[];
    html_url: string;
}

interface UserData {
    username: string;
    gender: string;
    age: string;
    height: string;
    weight: string;
}

// Versión actual de la aplicación
const currentVersion = version;

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
                    `A new version (${latestVersion}) is available. Please update PersonaPlus to the latest version.\n\n"Update" will redirect you to the download page of the latest APK.\n\n"See changelog" will take you to the GitHub release page to see a summary of what's new.`,
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
                if (Native.Platform.OS === "android") {
                    Native.ToastAndroid.show(
                        "You are up to date!",
                        Native.ToastAndroid.SHORT
                    );
                }
            }
        } else {
            if (Native.Platform.OS === "android") {
                Native.ToastAndroid.show(
                    "Couldn't check for updates. You're (probably) up to date.",
                    Native.ToastAndroid.SHORT
                );
            }
        }
    } catch (error) {
        console.error("Error checking for update:", error);
        if (Native.Platform.OS === "android") {
            Native.ToastAndroid.show(
                "Failed to check for updates. Please try again later (or manually check the repo).",
                Native.ToastAndroid.SHORT
            );
        }
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
    // Loading state
    const [loading, setLoading] = React.useState<boolean>(true);

    const [username, setUsername] = React.useState<string>("Unknown");
    const [gender, setGender] = React.useState<string>("Unknown");
    const [age, setAge] = React.useState<string>("Unknown");
    const [height, setHeight] = React.useState<string>("Unknown");
    const [weight, setWeight] = React.useState<string>("Unknown");

    const getMultiple = async (): Promise<UserData> => {
        try {
            const values = await AsyncStorage.multiGet([
                "username",
                "gender",
                "age",
                "height",
                "weight",
            ]);

            const data: UserData = {
                username: values[0][1] || "Unknown",
                gender: values[1][1] || "Unknown",
                age: values[2][1] || "Unknown",
                height: values[3][1] || "Unknown",
                weight: values[4][1] || "Unknown",
            };
            return data;
        } catch (e) {
            console.error(e);
            return {
                username: "Unknown",
                gender: "Unknown",
                age: "Unknown",
                height: "Unknown",
                weight: "Unknown",
            };
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            const userData = await getMultiple();
            setUsername(userData.username);
            setGender(userData.gender);
            setAge(userData.age);
            setHeight(userData.height);
            setWeight(userData.weight);
            setLoading(false);
        };

        fetchData();
    }, []);

    const [wantsDev, setWantsDev] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        const checkForDev = async () => {
            try {
                const useDev = await AsyncStorage.getItem("useDevTools");
                setWantsDev(useDev === "true");
            } catch (e) {
                termLog(
                    `Got an error checking if the user wants to use Dev interface: ${e}`,
                    "warn"
                );
            }
        };
        checkForDev();
    }, []);

    const enableDevInterface = async () => {
        try {
            await AsyncStorage.setItem("useDevTools", "true");
            Router.router.navigate("/DeveloperInterface");
        } catch (e) {
            termLog(`ERROR ENABLING DEV INTERFACE: ${e}`, "error");
        }
    };

    const disableDevInterface = async () => {
        try {
            await AsyncStorage.setItem("useDevTools", "false");
            Router.router.navigate("/");
        } catch (e) {
            termLog(`ERROR DISABLING DEV INTERFACE: ${e}`, "error");
        }
    };

    const deleteAll = async () => {
        try {
            await AsyncStorage.multiRemove([
                "age",
                "weight",
                "height",
                "username",
                "useDevTools",
                "hasLaunched",
                "sleep",
                "pushupTime",
                "gender",
                "focuspoint",
                "activness",
            ]);
            await AsyncStorage.setItem("objectives", JSON.stringify([]));
            Router.router.navigate("/");
            termLog("DEV CLEARED ALL", "log");
        } catch (e) {
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

    const currentpage: string = Router.usePathname();

    if (loading) {
        return (
            <Native.View style={styles.containerview}>
                <BottomNav currentLocation={currentpage} />
                <Native.ScrollView>
                    <Native.View style={styles.mainview}>
                        <BetterText
                            fontWeight="Regular"
                            fontSize={15}
                            textAlign="center"
                            textColor="#C8C8C8"
                        >
                            Loading...
                        </BetterText>
                    </Native.View>
                </Native.ScrollView>
            </Native.View>
        );
    }

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
                                <Button
                                    style="ACE"
                                    action={() =>
                                        Router.router.navigate("/UpdateProfile")
                                    }
                                    buttonText="Update my profile"
                                />
                            </Native.View>
                        </Division>
                    </Section>
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
                        {Native.Platform.OS === "android" && (
                            <Division
                                status="REGULAR"
                                iconName={null}
                                header="Check for updates"
                                subheader="You are currently using 0.0.1-R5-b21."
                            >
                                <Button
                                    style="ACE"
                                    action={checkForUpdates}
                                    buttonText="Check for updates"
                                />
                            </Division>
                        )}
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
                                        buttonText="Enable Dev Interface"
                                    />
                                ) : (
                                    <Native.View
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <Button
                                            style="HMM"
                                            action={disableDevInterface}
                                            buttonText="Disable Dev Interface"
                                        />
                                        <GapView width={10} />
                                        <Button
                                            style="DEFAULT"
                                            action={() =>
                                                Router.router.navigate(
                                                    "/DeveloperInterface"
                                                )
                                            }
                                            buttonText="Navigate to Dev Interface"
                                        />
                                    </Native.View>
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
