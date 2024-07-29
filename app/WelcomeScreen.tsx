// WelcomeScreen.tsx
// Welcome page

import React, { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import {
    StyleSheet,
    Dimensions,
    DimensionValue,
    ScrollView,
    View,
    TextInput,
    Linking,
} from "react-native";
import Swap from "@/src/Swap";
import Button from "@/src/Buttons";
import GapView from "@/src/GapView";
import BetterText from "@/src/BetterText";
import { Picker as Select } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { termLog } from "@/src/toolkit/debug/console";
import { useTranslation } from "react-i18next";
import { validateBasicData } from "@/src/toolkit/userData";
import colors from "@/src/toolkit/design/colors";
import { getDefaultLocale } from "@/src/toolkit/translations";

// Definimos los estilos
const styles = StyleSheet.create({
    mainview: {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        display: "flex",
        flexDirection: "column",
        overflow: "scroll",
    },
    fragmentview: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        height: Dimensions.get("screen").height,
        width: Dimensions.get("screen").width - 40,
    },
    flexbtns: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        width: "calc(100% - 5px)" as DimensionValue,
        alignItems: "center",
        justifyContent: "center",
    },
    picker: {
        padding: 12,
        width: "100%",
        backgroundColor: colors.MAIN.BLANDITEM.BACKGROUND,
        borderColor: colors.MAIN.BLANDITEM.STRK,
        borderWidth: 2,
        borderRadius: 10,
        color: colors.BASIC.WHITE,
    },
});

// Definimos la función
export default function WelcomePage() {
    const { t } = useTranslation();
    const [language, setLanguage] = useState<"en" | "es" | string>("en");
    const [currentTab, setTab] = useState(1);
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
    const [focuspointValue, setFocuspointValue] = useState<string | null>(null);
    const handleFocuspointChange = (value: string) => {
        setFocuspointValue(value);
    };
    const focuspointoptions = [
        {
            value: "",
            label: t("globals.select_placeholder"),
            default: true,
        },
        {
            value: "exercising",
            label: t("page_welcome.fragment_two.options.exercising"),
            default: false,
        },
        {
            value: "eating",
            label: t("page_welcome.fragment_two.options.eating"),
            default: false,
        },
        {
            value: "wellbeing",
            label: t("page_welcome.fragment_two.options.wellbeing"),
            default: false,
        },
        // both options here equal no priority
        // then why create two options?
        // if user says he doesnt know, no focus will be used and he'll see the assistant feature (when it gets developed lol)
        // if user says he has everything as a priority, no focus will be used and he'll be free to do whatever by himself
        {
            value: "noprior",
            label: t("page_welcome.fragment_two.options.noprior"),
            default: false,
        },
        {
            value: "nopriorwithassist",
            label: t("page_welcome.fragment_two.options.nopriorwithassist"),
            default: false,
        },
    ];

    const isFirstStepDone = validateBasicData(
        genderValue,
        formData.age,
        formData.weight,
        formData.height,
        formData.username
    );

    const [sleep, setSleep] = useState("");
    const sleeps = [
        t("page_welcome.fragment_three.questions.sleeping.three_or_less"),
        t("page_welcome.fragment_three.questions.sleeping.four"),
        t("page_welcome.fragment_three.questions.sleeping.five"),
        t("page_welcome.fragment_three.questions.sleeping.six"),
        t("page_welcome.fragment_three.questions.sleeping.seven"),
        t("page_welcome.fragment_three.questions.sleeping.eight"),
        t("page_welcome.fragment_three.questions.sleeping.nine"),
        t("page_welcome.fragment_three.questions.sleeping.ten"),
        t("page_welcome.fragment_three.questions.sleeping.more_than_ten"),
    ];
    const [howActiveTheUserIs, setHowActiveTheUserIs] = useState("");
    const activnessOptions = [
        t("page_welcome.fragment_three.questions.activness.poor"),
        t("page_welcome.fragment_three.questions.activness.small"),
        t("page_welcome.fragment_three.questions.activness.normal"),
        t("page_welcome.fragment_three.questions.activness.intense"),
        t("page_welcome.fragment_three.questions.activness.super"),
    ];
    const focusNextField = (index: number): void => {
        if (inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const gonext = () => {
        if (currentTab > 0 && currentTab <= 3) {
            setTab(prevPage => prevPage + 1);
        } else {
            router.replace("/");
        }
    };

    const goback = () => {
        setTab(prevPage => prevPage - 1);
    };

    useEffect(() => {
        const setDefaultLanguage = async () => {
            const lang = await getDefaultLocale();
            setLanguage(lang);
        };

        setDefaultLanguage();
    }, []);

    const submit = async () => {
        if (
            genderValue &&
            focuspointValue &&
            sleep &&
            formData.username &&
            formData.height &&
            formData.weight &&
            formData.height &&
            language
        ) {
            try {
                await AsyncStorage.setItem("username", formData.username);
                await AsyncStorage.setItem("height", formData.height);
                await AsyncStorage.setItem("weight", formData.weight);
                await AsyncStorage.setItem("age", formData.age);
                await AsyncStorage.setItem("gender", genderValue);
                await AsyncStorage.setItem("focuspoint", focuspointValue);
                await AsyncStorage.setItem("sleep", sleep);
                await AsyncStorage.setItem("activness", howActiveTheUserIs);
                await AsyncStorage.setItem("hasLaunched", "true");
                await AsyncStorage.setItem("objectives", "{}");
                await AsyncStorage.setItem("language", language);
                router.replace("/");
            } catch (e) {
                termLog("Error creating profile: " + e, "error");
            }
        } else {
            termLog(
                "Error saving user data, some data is missing!",
                "warn",
                true
            );
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <ScrollView
            style={styles.mainview}
            contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {currentTab === 1 && (
                <View style={styles.fragmentview}>
                    <BetterText
                        textAlign="normal"
                        fontWeight="Bold"
                        fontSize={40}
                    >
                        {t("page_welcome.welcome")}
                        <BetterText
                            textAlign="normal"
                            fontWeight="ExtraBold"
                            fontSize={40}
                            textColor={colors.PRIMARIES.GOD.GOD}
                        >
                            PersonaPlus
                        </BetterText>
                        !
                    </BetterText>
                    <GapView height={5} />
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={20}
                    >
                        {t("page_welcome.subtitle")}
                    </BetterText>
                    <GapView height={10} />
                    <View style={styles.flexbtns}>
                        <Button
                            style="GOD"
                            action={gonext}
                            buttonText={t("page_welcome.buttons.start")}
                            width="fill"
                            height={500}
                        />
                    </View>
                </View>
            )}

            {currentTab === 2 && (
                <View style={styles.fragmentview}>
                    <BetterText fontWeight="Bold" fontSize={40}>
                        {t("page_welcome.fragment_one.title")}
                    </BetterText>
                    <GapView height={5} />
                    <BetterText fontWeight="Regular" fontSize={20}>
                        {t("page_welcome.fragment_one.subtitle")}{" "}
                        <BetterText
                            url={true}
                            textAlign="normal"
                            fontWeight="Regular"
                            fontSize={20}
                            textColor={colors.PRIMARIES.ACE.ACE}
                            onTap={() =>
                                Linking.openURL(
                                    "https://github.com/ZakaHaceCosas/personaplus/blob/main/PRIVACY.md"
                                )
                            }
                        >
                            {t("globals.learn_more")}
                        </BetterText>
                        .
                    </BetterText>
                    <GapView height={10} />
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
                                backgroundColor:
                                    colors.MAIN.BLANDITEM.BACKGROUND,
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
                    <GapView height={10} />
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
                                backgroundColor:
                                    colors.MAIN.BLANDITEM.BACKGROUND,
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
                    <GapView height={10} />
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
                                backgroundColor:
                                    colors.MAIN.BLANDITEM.BACKGROUND,
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
                    <GapView height={10} />
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
                        placeholder={t(
                            "page_welcome.fragment_one.questions.age"
                        )}
                        value={formData.age}
                        readOnly={false}
                        placeholderTextColor={colors.MAIN.BLANDITEM.PLACEHOLDER}
                        style={[
                            {
                                backgroundColor:
                                    colors.MAIN.BLANDITEM.BACKGROUND,
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
                    <GapView height={10} />
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
                        order="vertical"
                    />
                    <GapView height={10} />
                    <View style={styles.flexbtns}>
                        <Button
                            style="DEFAULT"
                            action={goback}
                            buttonText={t("globals.go_back")}
                            width="fill"
                        />
                        {isFirstStepDone && (
                            <Button
                                style="ACE"
                                action={gonext}
                                buttonText={t("globals.continue")}
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
                </View>
            )}

            {currentTab === 3 && (
                <View style={styles.fragmentview}>
                    <BetterText
                        textAlign="normal"
                        fontWeight="Bold"
                        fontSize={40}
                    >
                        {t("page_welcome.fragment_two.title")}
                    </BetterText>
                    <GapView height={10} />
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={20}
                    >
                        {t("page_welcome.fragment_two.subtitle")}
                    </BetterText>
                    <GapView height={10} />
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={10}
                        textColor={colors.LBLS.SDD}
                    >
                        {t("page_welcome.fragment_two.subsubtitle")}
                    </BetterText>
                    <GapView height={20} />
                    <Swap
                        id="focuspointswap"
                        key="focuspointswap"
                        options={focuspointoptions}
                        value={focuspointValue}
                        order="horizontal"
                        onValueChange={handleFocuspointChange}
                    />
                    <GapView height={15} />
                    <View style={styles.flexbtns}>
                        <Button
                            style="DEFAULT"
                            action={goback}
                            buttonText={t("globals.go_back")}
                            width="fill"
                        />
                        {!(
                            !focuspointValue || focuspointValue.trim() === ""
                        ) && (
                            <Button
                                style="ACE"
                                action={gonext}
                                buttonText={t("globals.continue")}
                                width="fill"
                            />
                        )}
                        {(!focuspointValue ||
                            focuspointValue.trim() === "") && (
                            <Button
                                style="HMM"
                                action={() => {}}
                                buttonText={t("globals.fill_all_items")}
                                width="fill"
                            />
                        )}
                    </View>
                </View>
            )}

            {currentTab === 4 && (
                <View style={styles.fragmentview}>
                    <BetterText
                        textAlign="normal"
                        fontWeight="Bold"
                        fontSize={40}
                    >
                        {t("page_welcome.fragment_three.title")}
                    </BetterText>
                    <GapView height={10} />
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={20}
                    >
                        {t("page_welcome.fragment_three.subtitle")}
                    </BetterText>
                    <GapView height={20} />
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={15}
                    >
                        {t(
                            "page_welcome.fragment_three.questions.sleeping.asks"
                        )}
                    </BetterText>
                    <GapView height={10} />
                    <Select
                        selectedValue={sleep}
                        onValueChange={itemValue => setSleep(itemValue)}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        <Select.Item
                            label={t("globals.select_placeholder")}
                            value=""
                            color={colors.MAIN.BLANDITEM.PLACEHOLDER}
                        />
                        {sleeps.map(sleep => (
                            <Select.Item
                                key={sleep}
                                label={sleep}
                                value={sleep}
                            />
                        ))}
                    </Select>
                    <GapView height={15} />
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={15}
                    >
                        {t(
                            "page_welcome.fragment_three.questions.activness.asks"
                        )}
                    </BetterText>
                    <GapView height={10} />
                    <Select
                        selectedValue={howActiveTheUserIs}
                        onValueChange={itemValue =>
                            setHowActiveTheUserIs(itemValue)
                        }
                        style={styles.picker}
                        mode="dialog"
                    >
                        <Select.Item
                            label={t("globals.select_placeholder")}
                            value=""
                            color={colors.MAIN.BLANDITEM.PLACEHOLDER}
                        />
                        {activnessOptions.map(option => (
                            <Select.Item
                                key={option}
                                label={option}
                                value={option}
                            />
                        ))}
                    </Select>
                    <GapView height={15} />
                    <View style={styles.flexbtns}>
                        <Button
                            style="DEFAULT"
                            action={goback}
                            buttonText={t("globals.go_back")}
                            width="fill"
                        />
                        {!sleep ||
                        sleep.trim() === "" ||
                        !howActiveTheUserIs ||
                        howActiveTheUserIs.trim() === "" ? (
                            <Button
                                style="HMM"
                                action={() => {}}
                                buttonText={t("globals.fill_all_items")}
                                width="fill"
                            />
                        ) : (
                            <Button
                                style="ACE"
                                action={submit}
                                buttonText={t("globals.lets_go")}
                                width="fill"
                            />
                        )}
                    </View>
                </View>
            )}
        </ScrollView>
    );
}
