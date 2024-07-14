// WelcomeScreen.tsx
// Welcome page

import * as React from "react";
import * as Native from "react-native";
import * as Router from "expo-router";
import Swap from "@/components/Swap";
import Button from "@/components/Buttons";
import GapView from "@/components/GapView";
import BetterText from "@/components/BetterText";
import { Picker as Select } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { termLog } from "./DeveloperInterface";
import { useTranslation } from "react-i18next";

// Definimos los estilos
const styles = Native.StyleSheet.create({
    mainview: {
        width: "100%",
        height: Native.Dimensions.get("window").height,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 40,
    },
    flexbtns: {
        display: "flex",
        flexDirection: "row",
        gap: 15,
        width: "calc(100% - 5px)" as Native.DimensionValue,
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
    const [language, setLanguage] = React.useState<"en" | "es">("en");
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
        { value: "male", label: "Male", default: true },
        { value: "female", label: "Female", default: false },
    ];
    const progenderoptions = [
        { value: "male", label: "Gigachad", default: true },
        { value: "female", label: "Transformer", default: false }, // lol.
        { value: "female", label: "Non-existant being", default: false },
    ];
    const inputRefs = React.useRef<Native.TextInput[]>([]);
    const easteregg: number = Math.floor(Math.random() * 69000) + 1;
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
            label: "My focus is exercising, I need to start moving my body ASAP!",
            default: false,
        },
        {
            value: "eating",
            label: "My focus is my diet, I need to take control over what I eat.",
            default: false,
        },
        {
            value: "wellbeing",
            label: "My focus is my digital welfare & mental health.",
            // That addiction to my phone has to stop, somehow.  --- text too large, but i want to somehow get it in there...
            default: false,
        },
        // both options here equal no priority
        // then why create two options?
        // if user says he doesnt know, no focus will be used and he'll see the assistant feature (when it gets developed lol)
        // if user says he has everything as a priority, no focus will be used and he'll be free to do whatever by himself
        {
            value: "noprior",
            label: "Everything is a top priority for me!",
            default: false,
        },
        {
            value: "nopriorwithassist",
            label: "Don't know / Can't decide on one",
            default: false,
        },
    ];
    // ESLint prefers constants as this is "never reassigned", but since the form changes I do believe this DOES get reassigned, so I disable ESLint here.
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
    const [sleep, setSleep] = React.useState("");
    const sleeps = [
        "3 hours or less",
        "4 hours",
        "5 hours",
        "6 hours",
        "7 hours",
        "8 hours",
        "9 hours",
        "10 hours",
        "More than 10 hours",
    ];
    const [howActiveTheUserIs, setHowActiveTheUserIs] = React.useState("");
    const activnessOptions = [
        "Poorly active (almost no exercise)",
        "A bit active (1 or 2 days of light exercise)",
        "Active (3 to 5 days of exercise)",
        "Intensely active (more than 5 days of exercise, and/or intense exercises)",
        "Very active (exercise every day, even more than once a day, and/or pretty intense exercises)",
    ];
    const [timeToPushUp, setTimeToPushUp] = React.useState("");
    const pushUpOptions = [
        "One second (incredible)...",
        "About 2-3 seconds",
        "About 3-5 seconds",
        "About 5-7 seconds",
        "About 7-10 seconds",
        "More than 10 second",
        "I don't know / I never do push ups",
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
            Router.router.navigate("/");
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
                Router.router.navigate("/");
            } catch (e) {
                const log = "Error creating profile: " + e;
                termLog(log, "error");
            }
        } else {
            termLog("Error saving user data, some data is missing!", "error");
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <Native.View style={styles.mainview}>
            {currentTab === 1 && (
                <React.Fragment>
                    <BetterText
                        textAlign="normal"
                        fontWeight="Bold"
                        fontSize={40}
                    >
                        Welcome to{" "}
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
                        Were proud to see you want to give yourself a plus.
                    </BetterText>
                    <GapView height={20} />
                    <Native.View style={styles.flexbtns}>
                        <Button
                            style="GOD"
                            action={gonext}
                            buttonText="Let's get started!"
                            width="fill"
                            height={500}
                        />
                    </Native.View>
                </React.Fragment>
            )}

            {currentTab === 2 && (
                <React.Fragment>
                    <BetterText
                        textAlign="normal"
                        fontWeight="Bold"
                        fontSize={40}
                    >
                        Tell us about yourself
                    </BetterText>
                    <GapView height={10} />
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={20}
                    >
                        We only ask for the data we need for the app to work. No
                        data is sent outside of this device, ever.{" "}
                        <BetterText
                            url={true}
                            textAlign="normal"
                            fontWeight="Regular"
                            fontSize={20}
                            textColor="#3280FF"
                            onTap={() =>
                                Native.Linking.openURL(
                                    "https://github.com/ZakaHaceCosas/personaplus/blob/main/PRIVACY.md"
                                )
                            }
                        >
                            Learn more
                        </BetterText>
                        .
                    </BetterText>
                    <GapView height={20} />
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
                    <Native.View style={styles.flexbtns}>
                        <Button
                            style="DEFAULT"
                            action={goback}
                            buttonText="Go back"
                            width="fill"
                        />
                        {!isFirstStepDone && (
                            <Button
                                style="ACE"
                                action={gonext}
                                buttonText={"Continue"}
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
                </React.Fragment>
            )}

            {currentTab === 3 && (
                <React.Fragment>
                    <BetterText
                        textAlign="normal"
                        fontWeight="Bold"
                        fontSize={40}
                    >
                        What is your main objective?
                    </BetterText>
                    <GapView height={10} />
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={20}
                    >
                        We know you want to improve yourself, but, what is your
                        key focus point?
                    </BetterText>
                    <GapView height={10} />
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={10}
                        textColor="#C8C8C8"
                    >
                        Choose only one option. You can change it any time.
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
                    <Native.View style={styles.flexbtns}>
                        <Button
                            style="DEFAULT"
                            action={goback}
                            buttonText="Go back"
                            width="fill"
                        />
                        {!(
                            !focuspointValue || focuspointValue.trim() === ""
                        ) && (
                            <Button
                                style="ACE"
                                action={gonext}
                                buttonText="Continue"
                                width="fill"
                            />
                        )}
                        {(!focuspointValue ||
                            focuspointValue.trim() === "") && (
                            <Button
                                style="HMM"
                                action={() => {}}
                                buttonText="Fill all the required fileds"
                                width="fill"
                            />
                        )}
                    </Native.View>
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
                        How much do you sleep each night? Doesn&apos;t need to
                        be exact.
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
                        How active are you? This means, with what frequency do
                        you perform exercise or other phisical activities?
                        Doesn&apos;t need to be exact.
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
                        Have you ever done a push-up? How long does it take you?
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
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={15}
                    >
                        What language would you prefer to use?
                    </BetterText>
                    <GapView height={10} />
                    <Select
                        selectedValue={language}
                        onValueChange={itemValue => setLanguage(itemValue)}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        <Select.Item
                            label={t("globals.select_placeholder")}
                            value=""
                            color="#999"
                        />
                        <Select.Item
                            key={"spanish"}
                            label={"Spanish"}
                            value={"es"}
                        />
                        <Select.Item
                            key={"english"}
                            label={"English"}
                            value={"en"}
                        />
                    </Select>
                    <GapView height={15} />
                    <Native.View style={styles.flexbtns}>
                        <Button
                            style="DEFAULT"
                            action={goback}
                            buttonText="Go back"
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
                                buttonText="Fill all the required fileds"
                                width="fill"
                            />
                        ) : (
                            <Button
                                style="ACE"
                                action={submit}
                                buttonText="Finish!"
                                width="fill"
                            />
                        )}
                    </Native.View>
                </React.Fragment>
            )}
        </Native.View>
    );
}
