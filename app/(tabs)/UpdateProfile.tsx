// TODO - migrate from RAWR5
// (DONE - updating import paths and var names)
// (TODO - the rest)
// UpdateProfile.tsx
// Update your profile.

import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, TextInput, View, ScrollView } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import { logToConsole } from "@/toolkit/debug/Console";
import { validateUserData } from "@/toolkit/User";
import Loading from "@/components/static/Loading";
import BackButton from "@/components/navigation/GoBack";
import GapView from "@/components/ui/GapView";
import {
    BetterTextHeader,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import BetterText from "@/components/text/BetterText";
import BetterButton from "@/components/interaction/BetterButton";
import Swap from "@/components/interaction/Swap";

// TypeScript, supongo (should use toolkified ver instead?)
interface UserData {
    username: string;
    gender: string;
    age: string;
    height: string;
    weight: string;
}

// We define the styles
const styles = StyleSheet.create({
    mainView: {
        backgroundColor: Colors.MAIN.APP,
        padding: 20,
        paddingTop: 40,
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
    },
    flexButtons: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
    },
});

// We create the function
export default function UpdateProfile() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(true);
    const [previousUsername, setPreviousUsername] = useState<string>("Unknown"); // Store previous username
    const [previousGender, setPreviousGender] = useState<string>("Unknown"); // Store previous gender
    const [previousAge, setPreviousAge] = useState<string>("Unknown"); // Store previous age
    const [previousHeight, setPreviousHeight] = useState<string>("Unknown"); // Store previous height
    const [previousWeight, setPreviousWeight] = useState<string>("Unknown"); // Store previous weight

    // Fetch all user data from AsyncStorage
    const getAllUserData = async (): Promise<UserData> => {
        try {
            const values = await AsyncStorage.multiGet([
                "username",
                "gender",
                "age",
                "height",
                "weight",
            ]);

            // Construct UserData object with fetched values or defaults
            const data: UserData = {
                username: values[0][1] || "Unknown",
                gender: values[1][1] || "Unknown",
                age: values[2][1] || "Unknown",
                height: values[3][1] || "Unknown",
                weight: values[4][1] || "Unknown",
            };
            return data;
        } catch (e) {
            logToConsole(String(e), "error");
            return {
                // "Nice to meet you, Unknown"!
                username: "Unknown",
                gender: "Unknown",
                age: "Unknown",
                height: "Unknown",
                weight: "Unknown",
            };
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const userData = await getAllUserData();
            // Update state with fetched user data
            setPreviousUsername(userData.username);
            setPreviousGender(userData.gender);
            setPreviousAge(userData.age);
            setPreviousHeight(userData.height);
            setPreviousWeight(userData.weight);
            setLoading(false);
        };

        fetchData();
    }, []);

    const [formData, setFormData] = useState({
        username: previousUsername,
        height: previousHeight,
        weight: previousWeight,
        age: previousAge,
    });
    useEffect(() => {
        // Update form data when previous user data changes
        setFormData({
            username: previousUsername,
            height: previousHeight,
            weight: previousWeight,
            age: previousAge,
        });
        setGenderValue(previousGender);
    }, [
        previousAge,
        previousGender,
        previousHeight,
        previousUsername,
        previousWeight,
    ]);

    const [genderValue, setGenderValue] = useState<string | null>(
        previousGender,
    );

    const handleGenderChange = (value: string) => {
        setGenderValue(value);
    };

    const genderoptions = [
        {
            value: "male",
            label: t("page_welcome.fragment_one.questions.gender.male"),
            default: true,
        },
        {
            value: "female",
            label: t("page_welcome.fragment_one.questions.gender.female"),
            default: false,
        },
    ];
    const inputRefs = useRef<TextInput[]>([]);

    // when tapping the Next button on android keyboard, focus the next input field
    const focusNextField = (index: number): void => {
        if (inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Update form data with user input
    const handleChange = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Check if all required data is valid
    const isFirstStepDone: boolean = validateUserData(
        genderValue,
        formData.age,
        formData.weight,
        formData.height,
        formData.username,
    );

    const submit = async () => {
        if (
            genderValue &&
            formData.username &&
            formData.height &&
            formData.weight &&
            formData.height
        ) {
            try {
                // Save data to AsyncStorage
                await AsyncStorage.setItem("username", formData.username);
                await AsyncStorage.setItem("height", formData.height);
                await AsyncStorage.setItem("weight", formData.weight);
                await AsyncStorage.setItem("age", formData.age);
                await AsyncStorage.setItem("gender", genderValue);
                if (router.canGoBack()) {
                    router.back();
                } else {
                    router.replace("/Profile");
                } // go to the prev page
            } catch (e) {
                logToConsole("Error creating profile: " + e, "error");
            }
        } else {
            logToConsole(
                "Error saving user data, some data is missing!",
                "error",
            ); // bro forgor to add data
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <ScrollView
                style={styles.mainView}
                contentContainerStyle={{ flexGrow: 1 }}
                horizontal={false}
            >
                <BackButton t={t} />
                <GapView height={20} />
                <BetterTextHeader>
                    {t("subpage_edit_profile.title")}
                </BetterTextHeader>
                <BetterTextSubHeader>
                    {t("subpage_edit_profile.subtitle")}
                </BetterTextSubHeader>
                <GapView height={15} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={15}
                    textColor={Colors.LBLS.SDD}
                >
                    {t("page_welcome.fragment_one.questions.username")}
                </BetterText>
                <GapView height={5} />
                <TextInput
                    placeholder={t(
                        "page_welcome.fragment_one.questions.username",
                    )}
                    value={formData.username}
                    readOnly={false}
                    placeholderTextColor={Colors.MAIN.BLANDITEM.PLACEHOLDER}
                    style={[
                        {
                            backgroundColor: Colors.MAIN.BLANDITEM.BACKGROUND,
                            borderRadius: 10,
                            padding: 15,
                            borderWidth: 4,
                            borderColor: Colors.MAIN.BLANDITEM.STRK,
                            width: "100%",
                            color: Colors.BASIC.WHITE,
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
                    textContentType="username"
                    key="usernameinput"
                    enterKeyHint="next"
                    onChangeText={(text) => handleChange("username", text)}
                    onSubmitEditing={() => focusNextField(0)}
                    ref={(ref) => ref && (inputRefs.current[0] = ref)}
                />
                <GapView height={15} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={15}
                    textColor={Colors.LBLS.SDD}
                >
                    {t("page_welcome.fragment_one.questions.height")}
                </BetterText>
                <GapView height={5} />
                <TextInput
                    placeholder={t(
                        "page_welcome.fragment_one.questions.height",
                    )}
                    value={formData.height}
                    readOnly={false}
                    placeholderTextColor={Colors.MAIN.BLANDITEM.PLACEHOLDER}
                    style={[
                        {
                            backgroundColor: Colors.MAIN.BLANDITEM.BACKGROUND,
                            borderRadius: 10,
                            padding: 15,
                            borderWidth: 4,
                            borderColor: Colors.MAIN.BLANDITEM.STRK,
                            width: "100%",
                            color: Colors.BASIC.WHITE,
                            // @ts-expect-error: For some reason appears as "non supported property", but it does work properly.
                            outline: "none",
                            fontFamily: "BeVietnamPro-Regular",
                        },
                    ]}
                    autoCorrect={false}
                    multiline={false}
                    maxLength={3}
                    textAlign="left"
                    fontFamily="BeVietnamPro-Regular"
                    textContentType="none"
                    inputMode="numeric"
                    key="heightinput"
                    enterKeyHint="next"
                    onChangeText={(text) => handleChange("height", text)}
                    onSubmitEditing={() => focusNextField(1)}
                    ref={(ref) => ref && (inputRefs.current[1] = ref)}
                />
                <GapView height={15} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={15}
                    textColor={Colors.LBLS.SDD}
                >
                    {t("page_welcome.fragment_one.questions.weight")}
                </BetterText>
                <GapView height={5} />
                <TextInput
                    placeholder={t(
                        "page_welcome.fragment_one.questions.weight",
                    )}
                    value={formData.weight}
                    readOnly={false}
                    placeholderTextColor={Colors.MAIN.BLANDITEM.PLACEHOLDER}
                    style={[
                        {
                            backgroundColor: Colors.MAIN.BLANDITEM.BACKGROUND,
                            borderRadius: 10,
                            padding: 15,
                            borderWidth: 4,
                            borderColor: Colors.MAIN.BLANDITEM.STRK,
                            width: "100%",
                            color: Colors.BASIC.WHITE,
                            // @ts-expect-error: For some reason appears as "non supported property", but it does work properly.
                            outline: "none",
                            fontFamily: "BeVietnamPro-Regular",
                        },
                    ]}
                    autoCorrect={false}
                    multiline={false}
                    maxLength={3}
                    textAlign="left"
                    fontFamily="BeVietnamPro-Regular"
                    textContentType="none"
                    inputMode="numeric"
                    key="weightinput"
                    enterKeyHint="next"
                    onChangeText={(text) => handleChange("weight", text)}
                    onSubmitEditing={() => focusNextField(2)}
                    ref={(ref) => ref && (inputRefs.current[2] = ref)}
                />
                <GapView height={15} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={15}
                    textColor={Colors.LBLS.SDD}
                >
                    {t("page_welcome.fragment_one.questions.age")}
                </BetterText>
                <GapView height={5} />
                <TextInput
                    placeholder={t("page_welcome.fragment_one.questions.age")}
                    value={formData.age}
                    readOnly={false}
                    placeholderTextColor={Colors.MAIN.BLANDITEM.PLACEHOLDER}
                    style={[
                        {
                            backgroundColor: Colors.MAIN.BLANDITEM.BACKGROUND,
                            borderRadius: 10,
                            padding: 15,
                            borderWidth: 4,
                            borderColor: Colors.MAIN.BLANDITEM.STRK,
                            width: "100%",
                            color: Colors.BASIC.WHITE,
                            // @ts-expect-error: For some reason appears as "non supported property", but it does work properly.
                            outline: "none",
                            fontFamily: "BeVietnamPro-Regular",
                        },
                    ]}
                    autoCorrect={false}
                    multiline={false}
                    maxLength={3}
                    textAlign="left"
                    fontFamily="BeVietnamPro-Regular"
                    textContentType="none"
                    inputMode="numeric"
                    key="ageinput"
                    enterKeyHint="done"
                    onChangeText={(text) => handleChange("age", text)}
                    onSubmitEditing={() => {}}
                    ref={(ref) => ref && (inputRefs.current[3] = ref)}
                />
                <GapView height={15} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={15}
                    textColor={Colors.LBLS.SDD}
                >
                    {t("page_profile.your_profile_division.gender")}
                </BetterText>
                <GapView height={5} />
                <Swap
                    key="genderswap"
                    options={genderoptions}
                    value={genderValue}
                    onValueChange={handleGenderChange}
                    order="horizontal"
                />
                <GapView height={5} />
                <View style={styles.flexButtons}>
                    <BetterButton
                        style="DEFAULT"
                        action={router.back}
                        buttonText={t("globals.go_back")}
                        buttonHint="TODO"
                    />
                    <GapView width={15} />
                    {isFirstStepDone && (
                        <BetterButton
                            style="ACE"
                            action={submit}
                            buttonText={t("globals.save")}
                            buttonHint="TODO"
                        />
                    )}
                    {!isFirstStepDone && (
                        <BetterButton
                            style="HMM"
                            action={() => {}}
                            buttonText={
                                !(Number(formData.age) > 99)
                                    ? t("globals.fill_all_items")
                                    : t("page_welcome.you_aint_that_old", {
                                          age: formData.age,
                                      })
                            }
                            buttonHint="TODO"
                        />
                    )}
                </View>
            </ScrollView>
        </>
    );
}
