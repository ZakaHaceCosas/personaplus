// UpdateProfile.tsx
// Update your profile.

import React, { useRef, useState, useEffect } from "react";
import {
    DimensionValue,
    StyleSheet,
    TextInput,
    View,
    ScrollView,
    Dimensions,
} from "react-native";
import { router } from "expo-router";
import BetterText from "@/src/BetterText";
import GapView from "@/src/GapView";
import Swap from "@/src/Swap";
import { termLog } from "@/src/toolkit/debug/console";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/src/Buttons";
import { useTranslation } from "react-i18next";
import { validateBasicData } from "@/src/toolkit/userData";
import colors from "@/src/toolkit/design/colors";
import Loading from "@/src/Loading";

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
    flexbtns: {
        display: "flex",
        flexDirection: "row",
        width: "calc(100% - 5px)" as DimensionValue,
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
            termLog(String(e), "error");
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
        previousGender
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
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Check if all required data is valid
    const isFirstStepDone = validateBasicData(
        genderValue,
        formData.age,
        formData.weight,
        formData.height,
        formData.username
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
                router.back(); // go to the prev page
            } catch (e) {
                termLog("Error creating profile: " + e, "error");
            }
        } else {
            termLog("Error saving user data, some data is missing!", "error"); // bro forgor to add data
        }
    };

    if (loading) {
        return <Loading currentpage={null} displayNav={false} />;
    }

    return (
        <View style={styles.containerview}>
            <ScrollView
                style={styles.mainview}
                contentContainerStyle={{ flex: 1 }}
                horizontal={false}
            >
                <BetterText
                    fontSize={20}
                    fontWeight="Light"
                    onTap={router.back}
                >
                    {"<"} {t("globals.go_back")}
                </BetterText>
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={35}>
                    {t("subpage_edit_profile.title")}
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={20}
                >
                    {t("subpage_edit_profile.subtitle")}
                </BetterText>
                <GapView height={15} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={15}
                    textColor={colors.LBLS.SDD}
                >
                    {t("page_welcome.fragment_one.questions.username")}
                </BetterText>
                <GapView height={5} />
                <TextInput
                    placeholder={t(
                        "page_welcome.fragment_one.questions.username"
                    )}
                    value={formData.username}
                    readOnly={false}
                    placeholderTextColor={colors.MAIN.BLANDITEM.PLACEHOLDER}
                    style={[
                        {
                            backgroundColor: colors.MAIN.BLANDITEM.BACKGROUND,
                            borderRadius: 10,
                            padding: 15,
                            borderWidth: 4,
                            borderColor: colors.MAIN.BLANDITEM.STRK,
                            width: "100%",
                            color: colors.BASIC.WHITE,
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
                    onChangeText={text => handleChange("username", text)}
                    onSubmitEditing={() => focusNextField(0)}
                    ref={ref => ref && (inputRefs.current[0] = ref)}
                />
                <GapView height={15} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={15}
                    textColor={colors.LBLS.SDD}
                >
                    {t("page_welcome.fragment_one.questions.height")}
                </BetterText>
                <GapView height={5} />
                <TextInput
                    placeholder={t(
                        "page_welcome.fragment_one.questions.height"
                    )}
                    value={formData.height}
                    readOnly={false}
                    placeholderTextColor={colors.MAIN.BLANDITEM.PLACEHOLDER}
                    style={[
                        {
                            backgroundColor: colors.MAIN.BLANDITEM.BACKGROUND,
                            borderRadius: 10,
                            padding: 15,
                            borderWidth: 4,
                            borderColor: colors.MAIN.BLANDITEM.STRK,
                            width: "100%",
                            color: colors.BASIC.WHITE,
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
                    onChangeText={text => handleChange("height", text)}
                    onSubmitEditing={() => focusNextField(1)}
                    ref={ref => ref && (inputRefs.current[1] = ref)}
                />
                <GapView height={15} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={15}
                    textColor={colors.LBLS.SDD}
                >
                    {t("page_welcome.fragment_one.questions.weight")}
                </BetterText>
                <GapView height={5} />
                <TextInput
                    placeholder={t(
                        "page_welcome.fragment_one.questions.weight"
                    )}
                    value={formData.weight}
                    readOnly={false}
                    placeholderTextColor={colors.MAIN.BLANDITEM.PLACEHOLDER}
                    style={[
                        {
                            backgroundColor: colors.MAIN.BLANDITEM.BACKGROUND,
                            borderRadius: 10,
                            padding: 15,
                            borderWidth: 4,
                            borderColor: colors.MAIN.BLANDITEM.STRK,
                            width: "100%",
                            color: colors.BASIC.WHITE,
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
                    onChangeText={text => handleChange("weight", text)}
                    onSubmitEditing={() => focusNextField(2)}
                    ref={ref => ref && (inputRefs.current[2] = ref)}
                />
                <GapView height={15} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={15}
                    textColor={colors.LBLS.SDD}
                >
                    {t("page_welcome.fragment_one.questions.age")}
                </BetterText>
                <GapView height={5} />
                <TextInput
                    placeholder={t("page_welcome.fragment_one.questions.age")}
                    value={formData.age}
                    readOnly={false}
                    placeholderTextColor={colors.MAIN.BLANDITEM.PLACEHOLDER}
                    style={[
                        {
                            backgroundColor: colors.MAIN.BLANDITEM.BACKGROUND,
                            borderRadius: 10,
                            padding: 15,
                            borderWidth: 4,
                            borderColor: colors.MAIN.BLANDITEM.STRK,
                            width: "100%",
                            color: colors.BASIC.WHITE,
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
                    onChangeText={text => handleChange("age", text)}
                    onSubmitEditing={() => {}}
                    ref={ref => ref && (inputRefs.current[3] = ref)}
                />
                <GapView height={15} />
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={15}
                    textColor={colors.LBLS.SDD}
                >
                    {t("page_profile.your_profile_division.gender")}
                </BetterText>
                <GapView height={5} />
                <Swap
                    id="genderswap"
                    key="genderswap"
                    options={genderoptions}
                    value={genderValue}
                    onValueChange={handleGenderChange}
                    order="horizontal"
                />
                <GapView height={5} />
                <View style={styles.flexbtns}>
                    <Button
                        style="DEFAULT"
                        action={router.back}
                        buttonText={t("globals.go_back")}
                        width="fill"
                    />
                    <GapView width={15} />
                    {isFirstStepDone && (
                        <Button
                            style="ACE"
                            action={submit}
                            buttonText={t("globals.save")}
                            width="fill"
                        />
                    )}
                    {!isFirstStepDone && (
                        <Button
                            style="HMM"
                            action={() => {}}
                            buttonText={
                                !(Number(formData.age) > 99)
                                    ? t("globals.fill_all_items")
                                    : t("page_welcome.you_aint_that_old", {
                                          age: formData.age,
                                      })
                            }
                            width="fill"
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
