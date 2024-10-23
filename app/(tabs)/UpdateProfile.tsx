// TODO - migrate from RAWR5
// (DONE - updating import paths and var names)
// (TODO - the rest)
// UpdateProfile.tsx
// Update your profile.

import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, TextInput, View } from "react-native";
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
import Swap, { SwapOption } from "@/components/interaction/Swap";
import BetterInputField from "@/components/interaction/BetterInputField";
import PageEnd from "@/components/static/PageEnd";

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

    const handleGenderChange = (value: string | null) => {
        setGenderValue(value);
    };

    const genderOptions: SwapOption[] = [
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
            ); // bro forgot to add data
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <BackButton t={t} />
            <BetterTextHeader>
                {t("subPage_edit_profile.title")}
            </BetterTextHeader>
            <BetterTextSubHeader>
                {t("subPage_edit_profile.subtitle")}
            </BetterTextSubHeader>
            <GapView height={15} />
            <BetterInputField
                label={t("page_welcome.fragment_one.questions.username")}
                placeholder={t("page_welcome.fragment_one.questions.username")}
                value={formData.username}
                name="PROFILE_EDITOR__USERNAME_INPUT_FIELD"
                changeAction={(text) => handleChange("username", text)}
                refIndex={0}
                inputRefs={inputRefs}
                nextFieldIndex={1}
                length={40}
                readOnly={false}
            />
            <GapView height={15} />
            <BetterInputField
                label={t("page_welcome.fragment_one.questions.height")}
                placeholder={t("page_welcome.fragment_one.questions.height")}
                name="PROFILE_EDITOR__HEIGHT_INPUT_FIELD"
                value={formData.height}
                changeAction={(text) => handleChange("height", text)}
                refIndex={1}
                inputRefs={inputRefs}
                nextFieldIndex={2}
                length={3}
                readOnly={false}
            />
            <GapView height={15} />
            <BetterInputField
                label={t("page_welcome.fragment_one.questions.weight")}
                placeholder={t("page_welcome.fragment_one.questions.weight")}
                name="PROFILE_EDITOR__WEIGHT_INPUT_FIELD"
                value={formData.weight}
                changeAction={(text) => handleChange("weight", text)}
                refIndex={2}
                inputRefs={inputRefs}
                nextFieldIndex={3}
                length={3}
                readOnly={false}
            />
            <GapView height={15} />
            <BetterInputField
                label={t("page_welcome.fragment_one.questions.age")}
                placeholder={t("page_welcome.fragment_one.questions.age")}
                name="PROFILE_EDITOR__AGE_INPUT_FIELD"
                value={formData.age}
                changeAction={(text) => handleChange("age", text)}
                refIndex={2}
                inputRefs={inputRefs}
                nextFieldIndex={3}
                length={3}
                readOnly={false}
            />
            <GapView height={15} />
            <BetterText
                textAlign="normal"
                fontWeight="Regular"
                fontSize={15}
                textColor={Colors.LABELS.SDD}
            >
                {t("page_profile.your_profile_division.gender")}
            </BetterText>
            <GapView height={5} />
            <Swap
                key="genderSwap"
                options={genderOptions}
                value={genderValue}
                onValueChange={(value: string | null): void =>
                    handleGenderChange(value)
                }
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
                                : t("page_welcome.you_are_not_that_old", {
                                      age: formData.age,
                                  })
                        }
                        buttonHint="TODO"
                    />
                )}
            </View>
            <PageEnd includeText={false} />
        </>
    );
}
