import React, {
    ReactElement,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import { router } from "expo-router";
import { StyleSheet, Dimensions, View, TextInput, Linking } from "react-native";
import Swap from "@/components/interaction/Swap";
import GapView from "@/components/ui/GapView";
import BetterText from "@/components/text/BetterText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logToConsole } from "@/toolkit/debug/Console";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import { FullProfile } from "@/types/User";
import getCommonScreenSize from "@/constants/Screen";
import {
    BetterTextHeader,
    BetterTextSmallText,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { getDefaultLocale } from "@/translations/translate";
import { validateBasicUserData } from "@/toolkit/User";
import FontSizes from "@/constants/FontSizes";
import Select from "@/components/interaction/Select";
import BetterButton from "@/components/interaction/BetterButton";

// We define the styles
const styles = StyleSheet.create({
    mainview: {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        display: "flex",
        flexDirection: "column",
        backgroundColor: Colors.MAIN.APP,
    },
    fragmentview: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        height: Dimensions.get("screen").height,
        width: Dimensions.get("screen").width - 40,
    },
    buttonWrapper: {
        display: "flex",
        flexDirection: "row",
        width: getCommonScreenSize("width"),
        alignItems: "center",
        justifyContent: "center",
    },
    picker: {
        padding: 12,
        width: "100%",
        backgroundColor: Colors.MAIN.BLANDITEM.BACKGROUND,
        borderColor: Colors.MAIN.BLANDITEM.STRK,
        borderWidth: 2,
        borderRadius: 10,
        color: Colors.BASIC.WHITE,
    },
    textinput: {
        backgroundColor: Colors.MAIN.BLANDITEM.BACKGROUND,
        borderRadius: 10,
        padding: 15,
        borderWidth: 4,
        borderColor: Colors.MAIN.BLANDITEM.STRK,
        width: "100%",
        color: Colors.BASIC.WHITE,
        fontFamily: "BeVietnamPro-Regular",
    },
});

// We create the function
export default function WelcomePage() {
    const { t } = useTranslation();
    // what "tab" of the page the user's on
    const [currentTab, setTab] = useState(0);
    // mhmm i dont know how to explain this one (but it works)
    const inputRefs = useRef<TextInput[]>([]);

    // formData
    const [formData, setFormData] = useState<FullProfile>({
        username: "",
        height: "",
        weight: "",
        age: "",
        language: "en",
        sleepHours: "",
        activness: null,
        focus: null,
        gender: null,
        theThinkHour: "",
        isNewUser: true,
    });

    // stateful logic to validate formData
    const [isStepOneValid, validateStepOne] = useState<boolean>(false);
    const [isStepTwoValid, validateStepTwo] = useState<boolean>(false);
    const [isStepThreeValid, validateStepThree] = useState<boolean>(false);
    const [isStepFourValid, validateStepFour] = useState<boolean>(false);

    // options
    const genderOptions = [
        {
            value: "male",
            label: t("globals.userData.gender.male"),
            default: false,
        },
        {
            value: "female",
            label: t("globals.userData.gender.female"),
            default: false,
        },
    ];
    const focusOptions = [
        {
            value: "",
            label: t("globals.interaction.chooseAnOption"),
            default: true,
        },
        {
            value: "exercising",
            label: t("pages.welcome.questions.focus.options.exercising"),
            default: false,
        },
        {
            value: "diet",
            label: t("pages.welcome.questions.focus.options.eating"),
            default: false,
        },
        {
            value: "wellbeing",
            label: t("pages.welcome.questions.focus.options.wellbeing"),
            default: false,
        },
        // both options below equal no priority
        // then why create two options?
        // if user says he doesnt know, no focus will be used and he'll see the assistant feature (when it gets developed lol)
        // if user says he has everything as a priority, no focus will be used and he'll be free to do whatever by himself
        {
            value: "noPriority",
            label: t("pages.welcome.questions.focus.options.noPriority"),
            default: false,
        },
        {
            value: "assistMePls",
            label: t("pages.welcome.questions.focus.options.assistMePls"),
            default: false,
        },
    ];
    const sleepTimeOptions = [
        t("pages.welcome.questions.sleepTime.options.threeOrLess"),
        t("pages.welcome.questions.sleepTime.options.four"),
        t("pages.welcome.questions.sleepTime.options.five"),
        t("pages.welcome.questions.sleepTime.options.six"),
        t("pages.welcome.questions.sleepTime.options.seven"),
        t("pages.welcome.questions.sleepTime.options.eight"),
        t("pages.welcome.questions.sleepTime.options.nine"),
        t("pages.welcome.questions.sleepTime.options.ten"),
        t("pages.welcome.questions.sleepTime.options.moreThanTen"),
    ];
    const sleepTimeSelectOptions = sleepTimeOptions.map((option) => ({
        label: option,
        value: option,
        enabled: true,
    }));
    const activnessOptions = [
        t("pages.welcome.questions.activness.options.poor"),
        t("pages.welcome.questions.activness.options.small"),
        t("pages.welcome.questions.activness.options.normal"),
        t("pages.welcome.questions.activness.options.intense"),
        t("pages.welcome.questions.activness.options.super"),
    ];
    const activnessSelectOptions = activnessOptions.map((option) => ({
        label: option,
        value: option,
        enabled: true,
    }));

    const [showPicker, setShowPicker] = useState<boolean>(false);

    /**
     * Focuses the next `<TextInput>` when the user presses the arrow / continue / next button on mobile keyboard.
     *
     * @param {number} index The **target** index - if your input has a `refIndex` of **2**, the *target* (this value) would be **3**. For `refIndex` see `spawnInputField()`.
     */
    function focusNextField(index: number): void {
        if (inputRefs.current[index]) {
            inputRefs.current[index].focus();
        }
    }

    // pagination
    /** Goes to the next "page" of the Welcome screen. If there are no more pages, calls `submitUser()`.
     * @see submitUser()
     */
    function goNext(): void {
        if (currentTab >= 0 && currentTab <= 3) {
            setTab((prevPage) => prevPage + 1);
        } else {
            submitUser();
        }
    }
    /** Goes to the previous "page" of the Welcome screen. */
    function goBack(): void {
        setTab((prevPage) => prevPage - 1);
    }

    /**
     * Handles the change of the value of a variable that's associated with `formData`. In other words, if you have a `<TextInput>` for the username, upon it's change you would call this function, being `item` `"username"` and `value` the string vaule of that `<TextInput>`.
     *
     * **Note:** Pass just the _name_ of the property, not the entire variable (e.g. **username**, NOT ~~formData.username~~).
     *
     * @param {"username" | "age" | "height" | "weight" | "gender" | "language" | "activness" | "focus" | "sleepHours" | "theThinkHour"} item The _name_ of the property you wish to edit.
     * @param {string | number} value The value you want to set the `item` to.
     */
    function handleChange(
        item:
            | "username"
            | "age"
            | "height"
            | "weight"
            | "gender"
            | "language"
            | "activness"
            | "focus"
            | "sleepHours"
            | "theThinkHour",
        value: string | number
    ): void {
        try {
            setFormData((prevData) => ({
                ...prevData,
                [item]: value,
            }));
            logToConsole("FORM DATA:" + JSON.stringify(formData), "log");
        } catch (e) {
            logToConsole(
                "Error handling data changes. Happened at Welcome screen.",
                "error"
            );
        }
    }

    /**
     * Submit's `formData` and tries to register the user. Don't get confused, "registration" is locally, no account system, no cloud, whatsoever. At least at this stage of development. **Async function.**
     *
     * @async
     * @returns {Promise<0 | 1>} 0 if success, 1 if failure.
     */
    async function submitUser(): Promise<0 | 1> {
        if (
            !Object.values(formData).some(
                (value) => value === null || value === 0 || value === ""
            ) &&
            isStepOneValid &&
            isStepTwoValid &&
            isStepThreeValid &&
            isStepFourValid
        ) {
            try {
                const userData: FullProfile = {
                    username: formData.username,
                    height: formData.height,
                    weight: formData.weight,
                    age: formData.age,
                    gender: formData.gender,
                    focus: formData.focus,
                    sleepHours: formData.sleepHours,
                    activness: formData.activness,
                    language: await getDefaultLocale(),
                    theThinkHour: formData.theThinkHour,
                    isNewUser: false,
                };

                logToConsole(
                    "Trying to register: " + JSON.stringify(userData),
                    "log"
                );

                await AsyncStorage.setItem(
                    "userData",
                    JSON.stringify(userData)
                );

                await AsyncStorage.setItem("objectives", "{}");
                router.replace("/");
                logToConsole(
                    "User " +
                        formData.username +
                        " registered with no erros. Give yourself a plus!",
                    "success"
                );
                return 0;
            } catch (e) {
                logToConsole(
                    "Error creating profile: " +
                        e +
                        ". Data: " +
                        JSON.stringify(formData),
                    "error"
                );
                return 1;
            }
        } else {
            logToConsole(
                "Error saving user data, some data is missing or not valid!",
                "warn",
                true
            );
            logToConsole("User data: " + JSON.stringify(formData), "log");
            return 1;
        }
    }

    /**
     * Spawns an input field with the given parameters.
     *
     * @param {string} label A short text to show before the input to give indications.
     * @param {string} placeholder The placeholder of the input.
     * @param {string | number} value The value of the input. Set it to a stateful value, e.g. `formData.username`.
     * @param {string} name The name of the property / stateful value it's linked to, e.g. `username` for `formData.username`.
     * @param {number} refIndex It's index. _yes, you have to count all the calls the `spawnInputField` can keep an incremental index_.
     * @param {number} nextFieldIndex `refIndex` + 1, basically.
     * @param {("default" | "numeric")} [keyboardType="default"] Whether to use the normal keyboard or a numeric pad.
     * @param {number} lenght Max lenght of the input.
     * @returns {ReactNode} Returns a Fragment with a `<BetterText>` (label), `<TextInput />`, and a `<GapView />` between them.
     */
    function spawnInputField(
        label: string,
        placeholder: string,
        value: string | number,
        name: string,
        refIndex: number,
        nextFieldIndex: number,
        keyboardType: "default" | "numeric" = "default",
        lenght: number
    ): ReactNode {
        return (
            <>
                <BetterTextSmallText>{label}</BetterTextSmallText>
                <GapView height={5} />
                <TextInput
                    placeholder={placeholder}
                    value={typeof value === "string" ? value : String(value)}
                    placeholderTextColor={Colors.MAIN.BLANDITEM.PLACEHOLDER}
                    style={styles.textinput}
                    autoCorrect={false}
                    multiline={false}
                    maxLength={lenght}
                    textAlign="left"
                    keyboardType={keyboardType}
                    key={`${name}input`}
                    returnKeyType={nextFieldIndex === 4 ? "done" : "next"}
                    onChangeText={(text) =>
                        handleChange(
                            name as "username" | "age" | "height" | "weight",
                            text
                        )
                    }
                    onSubmitEditing={() => focusNextField(nextFieldIndex)}
                    ref={(ref) => ref && (inputRefs.current[refIndex] = ref)}
                />
            </>
        );
    }

    /**
     * Spawns an input picker _based on_ the given parameters.
     *
     * @param {("activness" | "sleepHours")} associatedValue What is this picker related to. Only two fixed options, `"activness"` and `"sleepHours"`, so you don't have to specify all the values / options. It's done by the function itself ;].
     * @returns {ReactNode} Returns a Fragment with a `<BetterText>` (label), `<Select />` with the associated options, and a `<GapView />` between them.
     */
    function spawnInputSelect(
        associatedValue: "activness" | "sleepHours"
    ): ReactNode {
        const options =
            associatedValue === "activness"
                ? activnessSelectOptions
                : sleepTimeSelectOptions;

        return (
            <>
                <BetterTextSmallText>
                    {associatedValue === "activness"
                        ? t("pages.welcome.questions.activness.ask")
                        : t("pages.welcome.questions.sleepTime.ask")}
                </BetterTextSmallText>
                <GapView height={5} />
                <Select
                    mode="dropdown"
                    dialogPrompt={t("globals.interaction.chooseAnOption")}
                    changeAction={(value) =>
                        handleChange(
                            associatedValue,
                            value !== null && value !== undefined ? value : ""
                        )
                    }
                    currentValue={formData[associatedValue] ?? ""}
                    selectOptions={options}
                    t={t}
                />
            </>
        );
    }

    useEffect(() => {
        try {
            validateStepOne(
                validateBasicUserData(
                    formData.gender,
                    formData.age,
                    formData.weight,
                    formData.height,
                    formData.username
                )
            );
            // @ts-ignore - Comparison looks unintentional to TS because "" and the type of the focus option have no overlap, but the comparison IS intentional, so we just ts-ignore this.
            validateStepTwo(formData.focus !== "");
            validateStepThree(
                (formData.sleepHours || "") !== "" &&
                    (formData.activness || "") !== ""
            );
            validateStepFour((formData.theThinkHour || "") !== "");
            logToConsole("STEP ONE VALIDATION:" + isStepOneValid, "log");
            logToConsole("STEP TWO VALIDATION:" + isStepTwoValid, "log");
            logToConsole("STEP THREE VALIDATION:" + isStepThreeValid, "log");
            logToConsole("STEP FOUR VALIDATION:" + isStepFourValid, "log");
        } catch (e) {
            logToConsole("Error validating user data: " + e, "error");
        }
    }, [formData]);

    /**
     * Spawns the navigation buttons - "Go back" and "Continue" / "Let's go" if it's the last page.
     *
     * @param {(1 | 2 | 3 | 4)} step On what step / page you're placing this. Used for data validation.
     * @param {boolean} isTheLastOne Set to true if you're placing this in the last page. When `true` the continue button says "Let's go!" or something like that instead of "Continue".
     * @returns {ReactElement}
     */
    function spawnNavigationButtons(
        step: 1 | 2 | 3 | 4,
        isTheLastOne: boolean
    ): ReactElement {
        let buttonText: string;
        let style: "ACE" | "HMM";
        let action: () => void;

        switch (step) {
            case 1:
                buttonText = isStepOneValid
                    ? isTheLastOne
                        ? t("globals.interaction.goAheadGood")
                        : t("globals.interaction.continue")
                    : t("globals.interaction.somethingIsWrong");
                style = isStepOneValid ? "ACE" : "HMM";
                action = isStepOneValid ? goNext : () => {};
                break;
            case 2:
                buttonText = isStepTwoValid
                    ? isTheLastOne
                        ? t("globals.interaction.goAheadGood")
                        : t("globals.interaction.continue")
                    : t("globals.interaction.somethingIsWrong");
                style = isStepTwoValid ? "ACE" : "HMM";
                action = isStepTwoValid ? goNext : () => {};
                break;
            case 3:
                buttonText = isStepThreeValid
                    ? isTheLastOne
                        ? t("globals.interaction.goAheadGood")
                        : t("globals.interaction.continue")
                    : t("globals.interaction.somethingIsWrong");
                style = isStepThreeValid ? "ACE" : "HMM";
                action = isStepThreeValid ? goNext : () => {};
                break;
            case 4:
                buttonText = isStepFourValid
                    ? isTheLastOne
                        ? t("globals.interaction.goAheadGood")
                        : t("globals.interaction.continue")
                    : t("globals.interaction.somethingIsWrong");
                style = isStepFourValid ? "ACE" : "HMM";
                action = isStepFourValid ? goNext : () => {};
                break;
        }

        return (
            <View style={styles.buttonWrapper}>
                <BetterButton
                    buttonText={t("globals.interaction.goBack")}
                    style="DEFAULT"
                    action={goBack}
                />
                <GapView width={10} />
                <BetterButton
                    buttonText={buttonText}
                    style={style}
                    action={action}
                />
            </View>
        );
    }

    /**
     * Spawns a progress bar at the bottom that keeps track of how much is left to finish registration, and shows it to the user in an intuitive way. Everything's handled automatically and returns a `<View>` with absolute positioning, so no configuration is required.
     *
     * @returns {ReactElement}
     */
    function spawnProgressBar(): ReactElement {
        return (
            <View
                style={{
                    position: "absolute",
                    width: getCommonScreenSize("width"),
                    height: 4,
                    borderRadius: 100,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "row",
                    bottom: 0,
                    zIndex: 99999,
                }}
            >
                <View
                    style={{
                        borderRadius: 20,
                        flex: 1,
                        backgroundColor:
                            currentTab >= 1
                                ? Colors.PRIMARIES.ACE.ACE
                                : Colors.MAIN.DIVISIONBORDER,
                    }}
                />
                <GapView width={5} />
                <View
                    style={{
                        borderRadius: 20,
                        flex: 1,
                        backgroundColor:
                            currentTab >= 2
                                ? Colors.PRIMARIES.ACE.ACE
                                : Colors.MAIN.DIVISIONBORDER,
                    }}
                />
                <GapView width={5} />
                <View
                    style={{
                        borderRadius: 20,
                        flex: 1,
                        backgroundColor:
                            currentTab >= 3
                                ? Colors.PRIMARIES.ACE.ACE
                                : Colors.MAIN.DIVISIONBORDER,
                    }}
                />
                <GapView width={5} />
                <View
                    style={{
                        borderRadius: 20,
                        flex: 1,
                        backgroundColor:
                            currentTab >= 4
                                ? Colors.PRIMARIES.ACE.ACE
                                : Colors.MAIN.DIVISIONBORDER,
                    }}
                />
            </View>
        );
    }

    /** Opens up our privacy policy in the user's browser. */
    function goToPrivacyPolicy(): void {
        async function handle() {
            try {
                if (
                    await Linking.canOpenURL(
                        "https://github.com/ZakaHaceCosas/personaplus/blob/main/PRIVACY.md"
                    )
                ) {
                    await Linking.openURL(
                        "https://github.com/ZakaHaceCosas/personaplus/blob/main/PRIVACY.md"
                    );
                } else {
                    logToConsole(
                        "Huh? Can't open the privacy policy URL. What's up?",
                        "error"
                    );
                }
            } catch (e) {
                logToConsole(
                    "Bruh. An error ocurred trying to open an URL.",
                    "error"
                );
            }
        }

        handle();
    }

    /**
     * Formats a time string, from the `{ hours?: number; minutes?: number; seconds?: number; }` object provided by `react-native-timer-picker` to a "HH:MM:SS" string.
     *
     * @param {{
     *  hours?: number;
     *  minutes?: number;
     *  seconds?: number;
     * }} time The time object.
     * @param {number} time.hours Hours.
     * @param {number} time.minutes Minutes.
     * @param {number} time.seconds Seconds.
     * @returns {string} A formated "HH:MM:SS" string.
     */
    function formatTimeString({
        hours,
        minutes,
        seconds,
    }: {
        hours?: number;
        minutes?: number;
        seconds?: number;
    }): string {
        const timeParts = [];

        if (hours !== undefined) {
            timeParts.push(hours.toString().padStart(2, "0"));
        }
        if (minutes !== undefined) {
            timeParts.push(minutes.toString().padStart(2, "0"));
        }
        if (seconds !== undefined) {
            timeParts.push(seconds.toString().padStart(2, "0"));
        }

        return timeParts.join(":");
    }

    return (
        <View
            style={{
                height: getCommonScreenSize("height"),
                width: getCommonScreenSize("width"),
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
            }}
        >
            {spawnProgressBar()}
            {currentTab === 0 && (
                <>
                    <BetterText fontSize={40} fontWeight="Bold">
                        {t("pages.welcome.beginning.welcomeTo")}{" "}
                        <BetterText
                            fontFamily="JetBrainsMono"
                            fontSize={40}
                            fontWeight="Bold"
                            textColor={Colors.PRIMARIES.GOD.GOD}
                        >
                            PersonaPlus
                        </BetterText>
                    </BetterText>
                    <BetterTextSubHeader>
                        {t("pages.welcome.beginning.subheader")}
                    </BetterTextSubHeader>
                    <GapView height={10} />
                    <BetterButton
                        buttonText={t("globals.interaction.goAheadGood")}
                        style="ACE"
                        action={goNext}
                    />
                </>
            )}
            {currentTab === 1 && (
                <>
                    <BetterTextHeader>
                        {t("pages.welcome.questions.aboutYou.ask")}
                    </BetterTextHeader>
                    <BetterTextSubHeader>
                        {t("pages.welcome.questions.aboutYou.description")}{" "}
                        <BetterText
                            isLink={true}
                            fontWeight="Medium"
                            fontSize={FontSizes.LARGE}
                            onTap={goToPrivacyPolicy}
                        >
                            {t("globals.interaction.learnMore")}
                        </BetterText>
                    </BetterTextSubHeader>
                    <GapView height={5} />
                    {spawnInputField(
                        t("globals.userData.username.wordShorter"),
                        t(
                            "pages.welcome.questions.aboutYou.placeholders.username"
                        ),
                        formData.username,
                        "username",
                        0,
                        1,
                        "default",
                        30
                    )}
                    <GapView height={5} />
                    {spawnInputField(
                        t("globals.userData.age.word"),
                        t("pages.welcome.questions.aboutYou.placeholders.age"),
                        formData.age,
                        "age",
                        1,
                        2,
                        "numeric",
                        2
                    )}
                    <GapView height={5} />
                    {spawnInputField(
                        t("globals.userData.weight"),
                        t(
                            "pages.welcome.questions.aboutYou.placeholders.weight"
                        ),
                        formData.weight,
                        "weight",
                        2,
                        3,
                        "numeric",
                        3
                    )}
                    <GapView height={5} />
                    {spawnInputField(
                        t("globals.userData.height"),
                        t(
                            "pages.welcome.questions.aboutYou.placeholders.height"
                        ),
                        formData.height,
                        "height",
                        3,
                        4,
                        "numeric",
                        3
                    )}
                    <GapView height={5} />
                    <BetterText
                        textAlign="normal"
                        fontWeight="Regular"
                        fontSize={FontSizes.REGULAR}
                        textColor={Colors.LBLS.SDD}
                    >
                        {t("globals.userData.gender.word")}
                    </BetterText>
                    <GapView height={5} />
                    <Swap
                        options={genderOptions}
                        value={formData.gender}
                        order="horizontal"
                        onValueChange={(value) => handleChange("gender", value)}
                    />
                    <GapView height={10} />
                    {spawnNavigationButtons(1, false)}
                </>
            )}
            {currentTab === 2 && (
                <>
                    <BetterTextHeader>
                        {t("pages.welcome.questions.focus.ask")}
                    </BetterTextHeader>
                    <BetterTextSubHeader>
                        {t("pages.welcome.questions.focus.description")}
                    </BetterTextSubHeader>
                    <GapView height={10} />
                    <Swap
                        options={focusOptions}
                        value={formData.focus}
                        order="vertical"
                        onValueChange={(value) => handleChange("focus", value)}
                    />
                    <GapView height={10} />
                    {spawnNavigationButtons(2, false)}
                </>
            )}
            {currentTab === 3 && (
                <>
                    <BetterTextHeader>
                        {t("pages.welcome.questions.aboutYouAgain.ask")}
                    </BetterTextHeader>
                    <BetterTextSubHeader>
                        {t("pages.welcome.questions.aboutYouAgain.description")}
                    </BetterTextSubHeader>
                    <GapView height={10} />
                    {spawnInputSelect("sleepHours")}
                    <GapView height={10} />
                    {spawnInputSelect("activness")}
                    <GapView height={10} />
                    {spawnNavigationButtons(3, false)}
                </>
            )}
            {currentTab === 4 && (
                <>
                    <BetterTextHeader>
                        {t("pages.welcome.questions.theThinkHour.ask")}
                    </BetterTextHeader>
                    <BetterTextSubHeader>
                        {t("pages.welcome.questions.theThinkHour.description")}
                    </BetterTextSubHeader>
                    <BetterButton
                        style="ACE"
                        buttonText={t(
                            "pages.welcome.questions.theThinkHour.summon"
                        )}
                        action={() => setShowPicker(!showPicker)}
                    />
                    <TimerPickerModal
                        visible={showPicker}
                        setIsVisible={setShowPicker}
                        onConfirm={(pickedDuration) => {
                            handleChange(
                                "theThinkHour",
                                formatTimeString(pickedDuration)
                                    ? formatTimeString(pickedDuration)
                                    : ""
                            );
                            setShowPicker(false);
                        }}
                        hideSeconds={true}
                        padHoursWithZero={true}
                        padMinutesWithZero={true}
                        allowFontScaling={true}
                        modalTitle={t(
                            "pages.welcome.questions.theThinkHour.ask"
                        )}
                        onCancel={() => setShowPicker(false)}
                        closeOnOverlayPress
                        Audio={Audio}
                        LinearGradient={LinearGradient}
                        styles={{
                            backgroundColor: Colors.MAIN.SECTION,
                            text: {
                                color: "#FFF",
                                fontFamily: "BeVietnamPro-Regular",
                            },
                            pickerContainer: {
                                overflow: "visible",
                            },
                        }}
                        modalProps={{
                            overlayOpacity: 0.2,
                        }}
                    />
                    <GapView height={10} />
                    {spawnNavigationButtons(4, true)}
                </>
            )}
        </View>
    );
}
