// WelcomeScreen.tsx
// Welcome page

import React from "react";
import { router } from "expo-router";
import {
    StyleSheet,
    Dimensions,
    DimensionValue,
    ScrollView,
    View,
    TextInput,
    Linking,
    Platform,
    ToastAndroid,
} from "react-native";
import Swap from "@/components/Swap";
import Button from "@/components/Buttons";
import GapView from "@/components/GapView";
import BetterText from "@/components/BetterText";
import { Picker as Select } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { termLog } from "./DeveloperInterface";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";
import { validateBasicData } from "@/components/toolkit/userData";

// Definimos los estilos
const styles = StyleSheet.create({
    mainview: {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        display: "flex",
        flexDirection: "column",
        padding: 20,
        overflow: "scroll",
    },
    flexbtns: {
        display: "flex",
        flexDirection: "row",
        gap: 15,
        width: "calc(100% - 5px)" as DimensionValue,
        alignItems: "center",
        justifyContent: "center",
    },
    picker: {
        padding: 12,
        width: "100%",
        backgroundColor: "#2A2D32",
        borderColor: "#3E4146",
        borderWidth: 2,
        borderRadius: 10,
        color: "#FFF",
    },
});

// Definimos la función
export default function WelcomePage() {
    const { t } = useTranslation();
    const [language, setLanguage] = React.useState<"en" | "es" | string>("en");
    const [currentTab, setTab] = React.useState(1);
    const [formData, setFormData] = React.useState({
        username: "",
        height: "",
        weight: "",
        age: "",
    });
    const [genderValue, setGenderValue] = React.useState<string | null>(null);
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
    // this below is a joke (keep it for production please, at least until i see it once)
    const progenderoptions = [
        { value: "male", label: "Gigachad", default: true },
        { value: "female", label: "Transformer", default: false }, // lol.
        { value: "female", label: "Non-existant being", default: false },
    ];
    const inputRefs = React.useRef<TextInput[]>([]);
    const easteregg: number = Math.floor(Math.random() * 690) + 1;
    const [focuspointValue, setFocuspointValue] = React.useState<string | null>(
        null
    );
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

    const [sleep, setSleep] = React.useState("");
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
    const [howActiveTheUserIs, setHowActiveTheUserIs] = React.useState("");
    const activnessOptions = [
        t("page_welcome.fragment_three.questions.activness.poor"),
        t("page_welcome.fragment_three.questions.activness.small"),
        t("page_welcome.fragment_three.questions.activness.normal"),
        t("page_welcome.fragment_three.questions.activness.intense"),
        t("page_welcome.fragment_three.questions.activness.super"),
    ];
    const [timeToPushUp, setTimeToPushUp] = React.useState("");
    const pushUpOptions = [
        t("page_welcome.fragment_three.questions.push_ups.one_sec"),
        t("page_welcome.fragment_three.questions.push_ups.two_sec"),
        t("page_welcome.fragment_three.questions.push_ups.three_sec"),
        t("page_welcome.fragment_three.questions.push_ups.five_sec"),
        t("page_welcome.fragment_three.questions.push_ups.seven_sec"),
        t("page_welcome.fragment_three.questions.push_ups.ten_sec"),
        t("page_welcome.fragment_three.questions.push_ups.doesnt_know"),
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
            router.navigate("/");
        }
    };

    const goback = () => {
        setTab(prevPage => prevPage - 1);
    };

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
                await AsyncStorage.setItem("pushupTime", timeToPushUp);
                await AsyncStorage.setItem("hasLaunched", "true");
                await AsyncStorage.setItem("objectives", "{}");
                await AsyncStorage.setItem("useDevTools", "false");
                await AsyncStorage.setItem("language", language);
                router.navigate("/");
            } catch (e) {
                const log = "Error creating profile: " + e;
                termLog(log, "error");
            }
        } else {
            termLog("Error saving user data, some data is missing!", "error");
        }
    };

    const handleChangeLanguaage = async (targetLang: "en" | "es") => {
        try {
            await AsyncStorage.setItem("language", targetLang);
            changeLanguage(targetLang);
            setLanguage(targetLang);
        } catch (e) {
            termLog("Error changing language! " + e, "error");
            if (Platform.OS === "android") {
                ToastAndroid.show(
                    t("page_profile.specific_errors.lang_react_error") +
                        " - " +
                        e,
                    ToastAndroid.LONG
                );
            }
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
                <React.Fragment>
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
                            textColor="#32FF80"
                        >
                            PersonaPlus
                        </BetterText>
                        !
                    </BetterText>
                    <GapView height={10} />
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={20}
                    >
                        {t("page_welcome.subtitle")}
                    </BetterText>
                    <GapView height={20} />
                    <View style={styles.flexbtns}>
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
                        <Button
                            style="GOD"
                            action={gonext}
                            buttonText={t("page_welcome.buttons.start")}
                            width="fill"
                            height={500}
                        />
                    </View>
                </React.Fragment>
            )}

            {currentTab === 2 && (
                <React.Fragment>
                    <BetterText
                        textAlign="center"
                        fontWeight="Bold"
                        fontSize={40}
                    >
                        {t("page_welcome.fragment_one.title")}
                    </BetterText>
                    <GapView height={10} />
                    <BetterText
                        textAlign="center"
                        fontWeight="Regular"
                        fontSize={20}
                    >
                        {t("page_welcome.fragment_one.subtitle")}{" "}
                        <BetterText
                            url={true}
                            textAlign="normal"
                            fontWeight="Regular"
                            fontSize={20}
                            textColor="#3280FF"
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
                    <GapView height={20} />
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
                        placeholder={t(
                            "page_welcome.fragment_one.questions.age"
                        )}
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
                    {easteregg !== 1 && (
                        <Swap
                            id="genderswap"
                            key="genderswap"
                            options={genderoptions}
                            value={genderValue}
                            onValueChange={handleGenderChange}
                            order="horizontal"
                        />
                    )}
                    {easteregg === 1 && (
                        <Swap
                            id="genderswap"
                            key="genderswap"
                            options={progenderoptions}
                            value={genderValue}
                            onValueChange={handleGenderChange}
                            order="horizontal"
                        />
                    )}
                    <GapView height={15} />
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
                </React.Fragment>
            )}

            {currentTab === 3 && (
                <React.Fragment>
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
                        textColor="#C8C8C8"
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
                </React.Fragment>
            )}

            {currentTab === 4 && (
                <React.Fragment>
                    <BetterText
                        textAlign="normal"
                        fontWeight="Bold"
                        fontSize={40}
                    >
                        Tell us about your habits
                    </BetterText>
                    <GapView height={10} />
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={20}
                    >
                        Understanding your life will help us help you improve
                        it.
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
                            color="#999"
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
                        mode="dropdown"
                    >
                        <Select.Item
                            label={t("globals.select_placeholder")}
                            value=""
                            color="#999"
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
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={15}
                    >
                        {t(
                            "page_welcome.fragment_three.questions.push_ups.asks"
                        )}
                    </BetterText>
                    <GapView height={10} />
                    <Select
                        selectedValue={timeToPushUp}
                        onValueChange={itemValue => setTimeToPushUp(itemValue)}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        <Select.Item
                            label={t("globals.select_placeholder")}
                            value=""
                            color="#999"
                        />
                        {pushUpOptions.map(option => (
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
                        !timeToPushUp ||
                        timeToPushUp.trim() === "" ||
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
                </React.Fragment>
            )}
        </ScrollView>
    );
}
