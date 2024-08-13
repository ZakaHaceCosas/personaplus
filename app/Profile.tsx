// Profile.tsx
// Profile page. Nice to meet ya!

import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Dimensions,
    Alert,
    Linking,
    Platform,
    ToastAndroid,
    View,
    ScrollView,
} from "react-native";
import { router, usePathname } from "expo-router";
import BetterText, {
    BetterTextHeader,
    BetterTextSubheader,
} from "@/src/BetterText";
import Footer from "@/src/Footer";
import Section from "@/src/section/Section";
import Division from "@/src/section/Division";
import Button from "@/src/Buttons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from "@/src/BottomNav";
import GapView from "@/src/GapView";
import { termLog } from "@/src/toolkit/debug/console";
import { version } from "@/package.json";
import { changeLanguage } from "i18next";
import { useTranslation } from "react-i18next";
import colors from "@/src/toolkit/design/colors";
import Loading from "@/src/Loading";

// TypeScript, supongo
import { UserData, UserSettings } from "@/src/toolkit/userData";
interface Release {
    tag_name: string;
    prerelease: boolean;
    assets: { browser_download_url: string; name: string }[];
    html_url: string;
}

type ProfileData = UserData & UserSettings;

// We define the styles
const styles = StyleSheet.create({
    containerview: {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
    },
    mainview: {
        padding: 20,
        paddingTop: 40,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
    flexyview: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
});

// We create the function
export default function Profile() {
    // Current app version
    const currentVersion = version;
    // FORMAT: X.X.X-R5-bX
    // e.g. 0.0.1-R5-b25

    // Async check for updates
    const checkForUpdates = async () => {
        try {
            const response = await fetch(
                "https://api.github.com/repos/ZakaHaceCosas/personaplus/releases"
            ); // checks github
            if (!response.ok) {
                termLog(
                    `Failed to fetch releases (status ${response.status})`,
                    "error"
                );
                throw new Error(
                    `Failed to fetch releases (status ${response.status})`
                );
            }
            const releases: Release[] = await response.json(); // gets releases

            // sorts releases by date and gets the most recent
            const latestRelease = releases.sort(
                (a, b) =>
                    new Date(b.tag_name).getTime() -
                    new Date(a.tag_name).getTime()
            )[0];

            if (latestRelease) {
                const latestVersion = latestRelease.tag_name; // gets the tagname
                termLog(`Latest version: ${latestVersion}`, "log");

                if (latestVersion !== currentVersion) {
                    // if it's not the same as your current version, you're not up to date!
                    Alert.alert(
                        t("page_profile.updates.update_flow.update_available"),
                        t(
                            "page_profile.updates.update_flow.update_available_text",
                            { latestVersion: latestVersion }
                        ),
                        [
                            {
                                text: t(
                                    "page_profile.updates.update_flow.buttons.update"
                                ),
                                style: "default",
                                onPress: () =>
                                    Linking.openURL(
                                        latestRelease.assets.length > 0
                                            ? latestRelease.assets[0]
                                                  .browser_download_url
                                            : ""
                                    ), // update will download the APK from the browser
                            },
                            {
                                text: t(
                                    "page_profile.updates.update_flow.buttons.changelog"
                                ),
                                onPress: () =>
                                    Linking.openURL(
                                        latestRelease.html_url || ""
                                    ), // changelog will just open the page so you see whats new
                            },
                            {
                                text: t("globals.nevermind"),
                                style: "destructive",
                                onPress: () => {}, // closes
                            },
                        ]
                    );
                } else {
                    if (Platform.OS === "android") {
                        ToastAndroid.show(
                            t(
                                "page_profile.updates.update_flow.youre_up_to_date"
                            ),
                            ToastAndroid.SHORT
                        );
                    }
                }
            } else {
                if (Platform.OS === "android") {
                    ToastAndroid.show(
                        t(
                            "page_profile.updates.update_flow.youre_maybe_up_to_date"
                        ),
                        ToastAndroid.SHORT
                    );
                }
            }
        } catch (e) {
            termLog("Error checking for update: " + e, "error");
            if (Platform.OS === "android") {
                ToastAndroid.show(
                    t("page_profile.updates.update_flow.failed_to_check"),
                    ToastAndroid.SHORT
                );
            }
        }
    };

    const { t } = useTranslation();
    // Loading state
    const [loading, setLoading] = useState<boolean>(true);
    // user data
    const [language, setLanguage] = useState<"en" | "es">("en");
    const [username, setUsername] = useState<string>("Unknown");
    const [gender, setGender] = useState<"male" | "female" | null>(null);
    const [age, setAge] = useState<number | null>(null);
    const [height, setHeight] = useState<number | null>(null);
    const [weight, setWeight] = useState<number | null>(null);

    const getMultiple = async (): Promise<ProfileData> => {
        // fetch all user data
        try {
            const values = await AsyncStorage.multiGet([
                "username",
                "gender",
                "age",
                "height",
                "weight",
                "language",
            ]);

            const data: ProfileData = {
                username: values[0][1] || "Unknown",
                gender: (values[1][1] as "male" | "female" | null) || null, // validate if value is male or female
                age: values[2][1] ? parseFloat(values[2][1]) : null,
                height: values[3][1] ? parseFloat(values[3][1]) : null,
                weight: values[4][1] ? parseFloat(values[4][1]) : null,
                language: (values[5][1] as "en" | "es") || "en",
            };
            return data;
        } catch (e) {
            termLog(String(e), "error");
            return {
                username: "Unknown",
                gender: null, // default all to null. which makes no sense, but this is a catch, so this can only happen if an error happens, and no errors should happen, so it's okay.
                age: null,
                height: null,
                weight: null,
                language: "en",
            };
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const userData = await getMultiple();
            // fetches all and then
            // set the states to all user data, or else, defaults
            setUsername(userData.username);
            setGender(userData.gender);
            setAge(userData.age);
            setHeight(userData.height);
            setWeight(userData.weight);
            setLanguage(userData.language);
            setLoading(false);
        };

        fetchData();
    }, []);

    // function to start over, deleting all data
    // not recommended!
    const deleteAll = async () => {
        try {
            await AsyncStorage.multiRemove([
                "age",
                "weight",
                "height",
                "username",
                "hasLaunched",
                "sleep",
                "pushupTime",
                "gender",
                "focuspoint",
                "activness",
            ]);
            await AsyncStorage.setItem("objectives", JSON.stringify([]));
            router.navigate("/");
            termLog("DEV CLEARED ALL", "log");
        } catch (e) {
            termLog(String(e), "error");
        }
    };

    // deleteAll handler
    const startOver = () => {
        Alert.alert(
            t("page_profile.danger_zone.danger_zone_flow.title"),
            t("page_profile.danger_zone.danger_zone_flow.subtitle"),
            [
                {
                    text: t(
                        "page_profile.danger_zone.danger_zone_flow.go_button"
                    ),
                    style: "destructive",
                    onPress: deleteAll,
                },
                {
                    text: t(
                        "page_profile.danger_zone.danger_zone_flow.cancel_button"
                    ),
                    style: "default",
                    onPress: () => {},
                },
            ]
        );
    };

    const currentpage: string = usePathname(); // current page

    // this changes the language. basically english or spanish.
    // i dont think ill add anything else.
    const handleChangeLanguaage = async (targetLang: "en" | "es") => {
        try {
            await AsyncStorage.setItem("language", targetLang);
            changeLanguage(targetLang);
            setLanguage(targetLang);
            router.navigate("/");
        } catch (e) {
            termLog("Error changing language! " + e, "error");
        }
    };

    if (loading) {
        return <Loading currentpage={currentpage} displayNav={true} />;
    }

    return (
        <View style={styles.containerview}>
            <ScrollView
                style={styles.mainview}
                contentContainerStyle={{ flexGrow: 1 }}
                horizontal={false}
            >
                <BetterTextHeader>
                    {t("page_profile.header.label")}
                </BetterTextHeader>
                <BetterTextSubheader>
                    {t("page_profile.header.sublabel")}
                    {username}!
                </BetterTextSubheader>
                <GapView height={20} />
                <Section kind="Profile">
                    <Division header={username}>
                        <View style={styles.flexyview}>
                            <BetterText
                                textAlign="normal"
                                textColor={colors.BASIC.WHITE}
                                fontWeight="Regular"
                                fontSize={15}
                            >
                                {t("page_profile.your_profile_division.gender")}
                                :{" "}
                                {String(gender) === "male"
                                    ? t(
                                          "page_profile.your_profile_division.gender_male"
                                      )
                                    : t(
                                          "page_profile.your_profile_division.gender_female"
                                      )}
                            </BetterText>
                            <BetterText
                                textAlign="normal"
                                textColor={colors.BASIC.WHITE}
                                fontWeight="Regular"
                                fontSize={15}
                            >
                                {t("page_profile.your_profile_division.age")}:{" "}
                                {String(age)}
                                {t(
                                    "page_profile.your_profile_division.age_suffix"
                                )}
                            </BetterText>
                            <BetterText
                                textAlign="normal"
                                textColor={colors.BASIC.WHITE}
                                fontWeight="Regular"
                                fontSize={15}
                            >
                                {t("page_profile.your_profile_division.height")}
                                : {String(height)} cm
                            </BetterText>

                            <BetterText
                                textAlign="normal"
                                textColor={colors.BASIC.WHITE}
                                fontWeight="Regular"
                                fontSize={15}
                            >
                                {t("page_profile.your_profile_division.weight")}
                                : {String(weight)} kg
                            </BetterText>
                            <GapView height={10} />
                            <Button
                                style="ACE"
                                action={() => router.navigate("/UpdateProfile")}
                                buttonText={t(
                                    "page_profile.your_profile_division.update_button"
                                )}
                            />
                        </View>
                    </Division>
                </Section>
                <GapView height={20} />
                <Section kind="Settings">
                    <Division header={t("page_profile.change_your_language")}>
                        <Button
                            buttonText={
                                language === "en"
                                    ? "Change to Spanish"
                                    : "Change to English"
                            }
                            style="ACE"
                            action={() =>
                                language === "es"
                                    ? handleChangeLanguaage("en")
                                    : handleChangeLanguaage("es")
                            }
                        />
                    </Division>
                </Section>
                <GapView height={20} />
                <Section kind="About">
                    <Division
                        status="REGULAR"
                        iconName={null}
                        header={t("page_profile.about_division.header")}
                        subheader={t("page_profile.about_division.subheader")}
                    >
                        <Button
                            style="ACE"
                            action={() => router.navigate("/About")}
                            buttonText={t("page_profile.about_division.button")}
                        />
                    </Division>
                    {Platform.OS === "android" && (
                        <Division
                            status="REGULAR"
                            iconName={null}
                            header={t("page_profile.updates.header")}
                            subheader={t("page_profile.updates.subheader", {
                                version: version,
                            })}
                        >
                            <Button
                                style="ACE"
                                action={checkForUpdates}
                                buttonText={t("page_profile.updates.button")}
                            />
                        </Division>
                    )}
                </Section>
                <GapView height={20} />
                <Section kind="Developer">
                    <Division
                        status="REGULAR"
                        preheader="DEV INTERFACE"
                        header={t("page_profile.developer.use_dev_interface")}
                        subheader={t("page_profile.developer.description")}
                    >
                        <View style={styles.flexyview}>
                            <Button
                                style="HMM"
                                action={() =>
                                    router.navigate("/DeveloperInterface")
                                }
                                buttonText={t("page_profile.developer.button")}
                            />
                        </View>
                    </Division>
                    <Division
                        status="REGULAR"
                        iconName={null}
                        preheader={t("page_profile.danger_zone.preheader")}
                        header={t("page_profile.danger_zone.header")}
                        subheader={t("page_profile.danger_zone.subheader")}
                    >
                        <Button
                            style="WOR"
                            action={startOver}
                            buttonText={t("page_profile.danger_zone.header")}
                        />
                    </Division>
                </Section>
                <Footer />
            </ScrollView>
            <BottomNav currentLocation={currentpage} />
        </View>
    );
}
