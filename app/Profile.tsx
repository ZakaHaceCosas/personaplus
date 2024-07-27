// Profile.tsx
// Profile page.

import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    DimensionValue,
    Alert,
    Linking,
    Platform,
    ToastAndroid,
    View,
    ScrollView,
} from "react-native";
import { router, usePathname } from "expo-router";
import BetterText from "@/src/BetterText";
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
    language: "en" | "es" | string;
}

// Creamos los estilos
const styles = StyleSheet.create({
    containerview: {
        width: "100vw" as DimensionValue,
        height: "100vh" as DimensionValue,
    },
    mainview: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as DimensionValue,
        height: "100vh" as DimensionValue,
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
                    new Date(b.tag_name).getTime() -
                    new Date(a.tag_name).getTime()
            )[0];

            if (latestRelease) {
                const latestVersion = latestRelease.tag_name;
                termLog(`Latest version: ${latestVersion}`, "log");

                if (latestVersion !== currentVersion) {
                    Alert.alert(
                        t("page_profile.updates.update_flow.update_available"),
                        t(
                            "page_profile.updates.update_flow.update_available_text",
                            { latestVersion: latestVersion }
                        ),
                        [
                            {
                                text: "Update",
                                style: "default",
                                onPress: () =>
                                    Linking.openURL(
                                        latestRelease.assets.length > 0
                                            ? latestRelease.assets[0]
                                                  .browser_download_url
                                            : ""
                                    ),
                            },
                            {
                                text: "See changelog",
                                onPress: () =>
                                    Linking.openURL(
                                        latestRelease.html_url || ""
                                    ),
                            },
                            {
                                text: "Cancel",
                                style: "destructive",
                                onPress: () => {},
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

    // Loading state
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(true);
    const [language, setLanguage] = useState<"en" | "es" | string>("en");
    const [username, setUsername] = useState<string>("Unknown");
    const [gender, setGender] = useState<string>("Unknown");
    const [age, setAge] = useState<string>("Unknown");
    const [height, setHeight] = useState<string>("Unknown");
    const [weight, setWeight] = useState<string>("Unknown");

    const getMultiple = async (): Promise<UserData> => {
        try {
            const values = await AsyncStorage.multiGet([
                "username",
                "gender",
                "age",
                "height",
                "weight",
                "language",
            ]);

            const data: UserData = {
                username: values[0][1] || "Unknown",
                gender: values[1][1] || "Unknown",
                age: values[2][1] || "Unknown",
                height: values[3][1] || "Unknown",
                weight: values[4][1] || "Unknown",
                language: values[5][1] || "en",
            };
            return data;
        } catch (e) {
            termLog(String(e), "error");
            return {
                username: "Unknown",
                gender: "Unknown",
                age: "Unknown",
                height: "Unknown",
                weight: "Unknown",
                language: "en",
            };
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const userData = await getMultiple();
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

    const currentpage: string = usePathname();

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
        return (
            <View style={styles.containerview}>
                <BottomNav currentLocation={currentpage} />
                <ScrollView>
                    <View style={styles.mainview}>
                        <BetterText
                            fontWeight="Regular"
                            fontSize={15}
                            textAlign="center"
                            textColor="#C8C8C8"
                        >
                            {t("globals.loading")}
                        </BetterText>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.containerview}>
            <BottomNav currentLocation={currentpage} />
            <ScrollView>
                <View style={styles.mainview}>
                    <BetterText
                        textAlign="normal"
                        fontWeight="Bold"
                        fontSize={35}
                    >
                        {t("page_profile.header.label")}
                    </BetterText>
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={20}
                    >
                        {t("page_profile.header.sublabel")}
                        {username}!
                    </BetterText>
                    <GapView height={20} />
                    <Section kind="Profile">
                        <Division header={username}>
                            <View style={styles.flexyview}>
                                <BetterText
                                    textAlign="normal"
                                    textColor="#FFF"
                                    fontWeight="Regular"
                                    fontSize={15}
                                >
                                    {t(
                                        "page_profile.your_profile_division.gender"
                                    )}
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
                                    textColor="#FFF"
                                    fontWeight="Regular"
                                    fontSize={15}
                                >
                                    {t(
                                        "page_profile.your_profile_division.age"
                                    )}
                                    : {String(age)}
                                    {t(
                                        "page_profile.your_profile_division.age_suffix"
                                    )}
                                </BetterText>
                                <BetterText
                                    textAlign="normal"
                                    textColor="#FFF"
                                    fontWeight="Regular"
                                    fontSize={15}
                                >
                                    {t(
                                        "page_profile.your_profile_division.height"
                                    )}
                                    : {String(height)} cm
                                </BetterText>

                                <BetterText
                                    textAlign="normal"
                                    textColor="#FFF"
                                    fontWeight="Regular"
                                    fontSize={15}
                                >
                                    {t(
                                        "page_profile.your_profile_division.weight"
                                    )}
                                    : {String(weight)} kg
                                </BetterText>
                                <GapView height={10} />
                                <Button
                                    style="ACE"
                                    action={() =>
                                        router.navigate("/UpdateProfile")
                                    }
                                    buttonText={t(
                                        "page_profile.your_profile_division.update_button"
                                    )}
                                />
                            </View>
                        </Division>
                    </Section>
                    <GapView height={20} />
                    <Section kind="Settings">
                        <Division
                            header={t("page_profile.change_your_language")}
                        >
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
                            subheader={t(
                                "page_profile.about_division.subheader"
                            )}
                        >
                            <Button
                                style="ACE"
                                action={() => router.navigate("/About")}
                                buttonText={t(
                                    "page_profile.about_division.button"
                                )}
                            />
                        </Division>
                        {Platform.OS === "android" && (
                            <Division
                                status="REGULAR"
                                iconName={null}
                                header={t("page_profile.updates.header")}
                                subheader={t(
                                    "page_profile.updates.subheader",
                                    { version: "0.0.1-R5-b23" } // placed it here so you only update once for all langs
                                )}
                            >
                                <Button
                                    style="ACE"
                                    action={checkForUpdates}
                                    buttonText={t(
                                        "page_profile.updates.button"
                                    )}
                                />
                            </Division>
                        )}
                    </Section>
                    <GapView height={20} />
                    <Section kind="Developer">
                        <Division
                            status="REGULAR"
                            preheader="DEV INTERFACE"
                            header={t(
                                "page_profile.developer.use_dev_interface"
                            )}
                            subheader={t("page_profile.developer.description")}
                        >
                            <View style={styles.flexyview}>
                                <Button
                                    style="HMM"
                                    action={() =>
                                        router.navigate("/DeveloperInterface")
                                    }
                                    buttonText={t(
                                        "page_profile.developer.button"
                                    )}
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
                                buttonText={t(
                                    "page_profile.danger_zone.header"
                                )}
                            />
                        </Division>
                    </Section>
                    <Footer />
                </View>
            </ScrollView>
        </View>
    );
}
