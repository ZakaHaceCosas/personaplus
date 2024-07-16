import * as React from "react";
import * as Native from "react-native";
import BetterText from "@/components/BetterText";
import * as Router from "expo-router";
import GapView from "@/components/GapView";
import Swap from "@/components/Swap";
import { termLog } from "./DeveloperInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/Buttons";
import { useTranslation } from "react-i18next";

// Creamos los estilos
const styles = Native.StyleSheet.create({
    containerview: {
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
    },
    mainview: {
        padding: 20,
        paddingTop: 50,
        display: "flex",
        flexDirection: "column",
        width: "100vw" as Native.DimensionValue,
        height: "100vh" as Native.DimensionValue,
        overflow: "scroll",
    },
    flexbtns: {
        display: "flex",
        flexDirection: "row",
        width: "calc(100% - 5px)" as Native.DimensionValue,
    },
});

// Creamos la función
export default function UpdateProfile() {
    const { t } = useTranslation();
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
        { value: "male", label: "Male", default: true },
        { value: "female", label: "Female", default: false },
    ];
    const inputRefs = React.useRef<Native.TextInput[]>([]);

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

    // eslint-disable-next-line
    let isFirstStepDone =
        !genderValue ||
        Number(formData.age) > 125 ||
        genderValue.trim() === "" ||
        !formData.age ||
        !formData.username ||
        formData.username.trim() === "" ||
        !formData.weight ||
        !formData.height;

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
                Router.router.navigate("/");
            } catch (e) {
                const log = "Error creating profile: " + e;
                termLog(log, "error");
            }
        } else {
            termLog("Error saving user data, some data is missing!", "error");
        }
    };

    return (
        <Native.View style={styles.containerview}>
            <Native.ScrollView style={styles.mainview}>
                <BetterText
                    fontSize={20}
                    fontWeight="Light"
                    onTap={Router.router.back}
                >
                    {"<"} {t("globals.go_back")}
                </BetterText>
                <GapView height={20} />
                <BetterText textAlign="normal" fontWeight="Bold" fontSize={35}>
                    Update your profile
                </BetterText>
                <BetterText
                    textAlign="normal"
                    fontWeight="Regular"
                    fontSize={20}
                >
                    Life changes and so do you.
                </BetterText>
                <GapView height={15} />
                <Native.TextInput
                    placeholder="Username (doesn't have to be your real name)"
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
                <Native.TextInput
                    placeholder="Height (cm) (don't add decimals)"
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
                <Native.TextInput
                    placeholder="Weight (kg) (don't add decimals)"
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
                <Native.TextInput
                    placeholder="Age (years)"
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
                <Native.View style={styles.flexbtns}>
                    <Button
                        style="DEFAULT"
                        action={Router.router.back}
                        buttonText={t("globals.go_back")}
                        width="fill"
                    />
                    <GapView width={15} />
                    {!isFirstStepDone && (
                        <Button
                            style="ACE"
                            action={submit}
                            buttonText="Save!"
                            width="fill"
                        />
                    )}
                    {isFirstStepDone && (
                        <Button
                            style="HMM"
                            action={() => {}}
                            buttonText={
                                !(Number(formData.age) > 125)
                                    ? "Fill all the required fields"
                                    : `You are NOT ${formData.age} years old.`
                            }
                            width="fill"
                        />
                    )}
                </Native.View>
            </Native.ScrollView>
        </Native.View>
    );
}
