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
import { testLog } from "./DeveloperInterface";

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
export default function Profile() {
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
                console.log(
                    "%cWOR%cDev error%c " + log,
                    "font-weight: bold; background: #FFD700; color: black; padding: 2px 4px; border-radius: 2px;",
                    "font-weight: bold; background: white; color: black; padding: 2px 4px; border-radius: 2px;",
                    "color: #FFD700;"
                );
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
            testLog("ENABLED DEV INTERFACE", "log");
            Router.router.navigate("/");
        } catch (e) {
            const log = "ERROR ENABLING DEV INTERFACE: " + e;
            testLog(log, "error");
            console.error(log);
            Router.router.navigate("/DeveloperInterface"); // lol. if cant enable, at least go to page with logs to see the error.
        }
    };

    const disableDevInterface = async function () {
        try {
            await AsyncStorage.setItem("useDevTools", "false");
            testLog("DISABLED DEV INTERFACE", "log");
            Router.router.navigate("/");
        } catch (e) {
            const log = "ERROR DISABLING DEV INTERFACE: " + e;
            testLog(log, "error");
            console.error(log);
            Router.router.navigate("/DeveloperInterface"); // lol. if cant disable, at least go to page with logs to see the error.
        }
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
                                    Soon you will see here all your data.
                                    {/* Gender: {gender} */}
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
                    <Section kind="Developer">
                        <Division
                            status="REGULAR"
                            iconName={null}
                            preheader="DEV INTERFACE"
                            header="Use Dev Interface?"
                            subheader="Dev Interface is an extra page: a menu with advanced info & options for developers. Very useful if you are testing this app for dev / contributing purposes."
                        >
                            <Native.View style={styles.flexyview}>
                                <BetterText
                                    textAlign="normal"
                                    fontWeight="Regular"
                                    fontSize={15}
                                >
                                    Dev interface is{" "}
                                    {wantsDev === true ? "enabled" : "disabled"}{" "}
                                    for this user.
                                </BetterText>
                                <GapView height={10} />
                                <BetterText
                                    textAlign="normal"
                                    fontWeight="Regular"
                                    textColor="#FFC832"
                                    fontSize={15}
                                >
                                    Note: If an error ocurred
                                    &quot;enabling&quot; or
                                    &quot;disabling&quot; it, you will actually
                                    be redirected there - this is because
                                    it&apos;s always enabled, but you don&apos;t
                                    have the button to access it to avoid
                                    messing up with you. If the button takes you
                                    to Dev Interface instead of Home, check the
                                    logs to see what happened, and if possible,
                                    open an issue on GitHub. Thanks!
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
                    </Section>
                    <Footer />
                </Native.View>
            </Native.ScrollView>
        </Native.View>
    );
}
