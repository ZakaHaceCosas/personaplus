import React, { useRef, useState } from "react";
import {
    DimensionValue,
    StyleSheet,
    TextInput,
    View,
    ScrollView,
} from "react-native";
import { router } from "expo-router";
import BetterText from "@/src/BetterText";
import GapView from "@/src/GapView";
import Swap from "@/src/Swap";
import { termLog } from "./DeveloperInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/src/Buttons";
import { useTranslation } from "react-i18next";
import { validateBasicData } from "@/src/toolkit/userData";

// Creamos los estilos
const styles = StyleSheet.create({
    containerview: {
        width: "100vw" as DimensionValue,
        height: "100vh" as DimensionValue,
    },
    mainview: {
        padding: 20,
        paddingTop: 50,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as DimensionValue,
        height: "100vh" as DimensionValue,
        overflow: "scroll",
    },
    flexbtns: {
        display: "flex",
        flexDirection: "row",
        width: "calc(100% - 5px)" as DimensionValue,
    },
});

// Creamos la función
export default function UpdateProfile() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        username: "",
        height: "",
        weight: "",
        age: "",
    });
    const [genderValue, setGenderValue] = useState<string | null>(null);
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

    const focusNextField = (index: number): void => {
        if (inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

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
                await AsyncStorage.setItem("username", formData.username);
                await AsyncStorage.setItem("height", formData.height);
                await AsyncStorage.setItem("weight", formData.weight);
                await AsyncStorage.setItem("age", formData.age);
                await AsyncStorage.setItem("gender", genderValue);
                router.navigate("/");
            } catch (e) {
                termLog("Error creating profile: " + e, "error");
            }
        } else {
            termLog("Error saving user data, some data is missing!", "error");
        }
    };

    return (
        <View style={styles.containerview}>
            <ScrollView style={styles.mainview}>
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
                <TextInput
                    placeholder={t(
                        "page_welcome.fragment_one.questions.username"
                    )}
                    value={formData.username}
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
                            color: "#FFF",
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
                <TextInput
                    placeholder={t(
                        "page_welcome.fragment_one.questions.height"
                    )}
                    value={formData.height}
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
                            color: "#FFF",
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
                <TextInput
                    placeholder={t(
                        "page_welcome.fragment_one.questions.weight"
                    )}
                    value={formData.weight}
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
                            color: "#FFF",
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
                <TextInput
                    placeholder={t("page_welcome.fragment_one.questions.age")}
                    value={formData.age}
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
                            color: "#FFF",
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
