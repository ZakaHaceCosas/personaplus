import React, {
    ReactElement,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import { router } from "expo-router";
import { StyleSheet, View, TextInput } from "react-native";
import Swap, { SwapOption } from "@/components/interaction/swap";
import GapView from "@/components/ui/gap_view";
import BetterText from "@/components/text/better_text";
import AsyncStorage from "expo-sqlite/kv-store";
import { logToConsole } from "@/toolkit/debug/console";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/colors";
import { FullProfile, FullProfileForCreation } from "@/types/user";
import getCommonScreenSize from "@/constants/screen";
import {
    BetterTextHeader,
    BetterTextSmallerText,
    BetterTextSmallText,
    BetterTextSubHeader,
} from "@/components/text/better_text_presets";
import {
    CustomTimerPickerModalStyles,
    TimerPickerModal,
} from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import { getDefaultLocale } from "@/translations/translate";
import { VALID_USER_CAPS, ValidateUserData } from "@/toolkit/user";
import FontSizes from "@/constants/font_sizes";
import Select, { SelectOption } from "@/components/interaction/select";
import BetterButton from "@/components/interaction/better_button";
import BetterInputField from "@/components/interaction/better_input_field";
import StoredItemNames from "@/constants/stored_item_names";
import { formatTimeString } from "@/toolkit/time";
import ROUTES from "@/constants/routes";
import GetStuffForUserDataQuestion from "@/constants/user_data";
import URLs from "@/constants/urls";
import { DEFAULT_EXPERIMENTS } from "@/constants/experiments";
import { SafelyOpenUrl } from "@/toolkit/routing";
import BetterAlert from "@/components/ui/better_alert";
import { UniversalItemStyle } from "@/constants/ui/pressables";

// We define the styles
const styles = StyleSheet.create({
    mainView: {
        height: getCommonScreenSize("height"),
        width: getCommonScreenSize("width"),
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: Colors.MAIN.APP,
    },
    wrapperView: {
        width: getCommonScreenSize("width"),
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    bottomWrapperView: {
        width: getCommonScreenSize("width"),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    welcomeView: {
        height: getCommonScreenSize("height"),
        width: getCommonScreenSize("width"),
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    buttonWrapper: {
        display: "flex",
        flexDirection: "row",
        width: getCommonScreenSize("width"),
        alignItems: "center",
        justifyContent: "center",
    },
    progressBar: {
        width: getCommonScreenSize("width"),
        height: 4,
        borderRadius: 100,
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
    },
    progressBarItem: {
        borderRadius: 20,
        flex: 1,
    },
});

// We create the function
export default function WelcomePage() {
    const { t } = useTranslation();
    // what "tab" of the page the user's on
    const [currentTab, setTab] = useState(0);
    // hmm i don't know how to explain this one (but it works)
    const inputRefs = useRef<TextInput[]>([]);

    // formData
    const [formData, setFormData] = useState<FullProfileForCreation>({
        username: "",
        height: "",
        weight: "",
        age: "",
        language: "en",
        sleepHours: null,
        activeness: null,
        focus: null,
        gender: null,
        theThinkHour: "",
        isNewUser: true,
        wantsNotifications: true,
    });

    // stateful logic to validate formData
    const [isStepOneValid, validateStepOne] = useState<boolean>(false);
    const [isStepTwoValid, validateStepTwo] = useState<boolean>(false);
    const [isStepThreeValid, validateStepThree] = useState<boolean>(false);
    const [isStepFourValid, validateStepFour] = useState<boolean>(false);

    const activenessSelectOptions = GetStuffForUserDataQuestion(
        "activeness",
    ) as SelectOption[];
    const sleepTimeSelectOptions = GetStuffForUserDataQuestion(
        "sleepTime",
    ) as SelectOption[];
    const focusOptions = GetStuffForUserDataQuestion("focus") as SwapOption[];
    const genderOptions = GetStuffForUserDataQuestion("gender") as SwapOption[];

    /* for the time picker to be displayed or not */
    const [showTimePicker, toggleTimePicker] = useState<boolean>(false);

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
     * Handles the change of the value of a variable that's associated with `formData`. In other words, if you have a `<TextInput>` for the username, upon it's change you would call this function, being `item` `"username"` and `value` the string value of that `<TextInput>`.
     *
     * **Note:** Pass just the _name_ of the property, not the entire variable (e.g. **username**, NOT ~~formData.username~~).
     *
     * @param {"username" | "age" | "height" | "weight" | "gender" | "language" | "activeness" | "focus" | "sleepHours" | "theThinkHour"} item The _name_ of the property you wish to edit.
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
            | "activeness"
            | "focus"
            | "sleepHours"
            | "theThinkHour",
        value: string | number | null,
    ): void {
        try {
            setFormData((prevData: FullProfileForCreation) => ({
                ...prevData,
                [item]: value,
            }));
            return;
        } catch (e) {
            logToConsole(
                `Error handling data changes happened at Welcome screen: ${e}`,
                "error",
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
                (value) => value === null || value === 0 || value === "",
            ) &&
            isStepOneValid &&
            isStepTwoValid &&
            isStepThreeValid &&
            isStepFourValid
        ) {
            try {
                const locale: "es" | "en" = await getDefaultLocale();
                const validData = formData as FullProfile; // if we're on this code block we assume all data IS valid, so we simply convert types to tell TS we're sure about that
                const userData: FullProfile = {
                    username: validData.username,
                    height: validData.height,
                    weight: validData.weight,
                    age: validData.age,
                    gender: validData.gender,
                    focus: validData.focus,
                    sleepHours: validData.sleepHours,
                    activeness: validData.activeness,
                    language: locale,
                    theThinkHour: validData.theThinkHour,
                    isNewUser: false,
                    wantsNotifications: validData.wantsNotifications,
                };

                const stringData: string = JSON.stringify(userData);

                logToConsole(`Trying to register: ${stringData}`, "log");

                await AsyncStorage.setItem(
                    StoredItemNames.userData,
                    stringData,
                );
                await AsyncStorage.setItem(
                    StoredItemNames.experiments,
                    JSON.stringify(DEFAULT_EXPERIMENTS),
                );
                await AsyncStorage.setItem(StoredItemNames.objectives, "[]");
                router.replace(ROUTES.MAIN.HOME);
                logToConsole(
                    `${userData.username} was successfully registered with no errors. Give yourself a plus!`,
                    "success",
                );
                return 0;
            } catch (e) {
                logToConsole(
                    `Error creating profile! Data: ${JSON.stringify(formData)}\nError: ${e}.`,
                    "error",
                );
                return 1;
            }
        } else {
            logToConsole(
                `Error saving user data, some data is missing or not valid! JSON is:\n${JSON.stringify(formData)}`,
                "warn",
                undefined,
                true,
            );
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
     * @param {("default" | "numeric")} [keyboardType="default"] Whether to use the normal keyboard or a numeric pad.
     * @param {number} length Max length of the input.
     * @param {boolean} isValid Whether the input is valid or not.
     * @param {string} errorMessage Message to show if the input is not valid.
     * @returns {ReactNode} Returns a Fragment with a `<BetterText>` (label), `<TextInput />`, and a `<GapView />` between them.
     */
    function spawnInputField(
        label: string,
        placeholder: string,
        value: string | number,
        name: "username" | "age" | "height" | "weight",
        refIndex: number,
        keyboardType: "default" | "numeric" = "default",
        length: number,
        isValid: boolean,
        errorMessage: string,
    ): ReactNode {
        return (
            <>
                <BetterInputField
                    readOnly={false}
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    name={name}
                    refIndex={refIndex}
                    length={length}
                    refParams={{ inputRefs, totalRefs: 4 }}
                    keyboardType={keyboardType}
                    changeAction={(text) => handleChange(name, text)}
                    shouldRef={true}
                    isValid={isValid}
                />
                {isValid === false && (
                    <>
                        <GapView height={5} />
                        <BetterTextSmallText>
                            {errorMessage}
                        </BetterTextSmallText>
                    </>
                )}
            </>
        );
    }

    /**
     * Spawns an input select _based on_ the given parameters.
     *
     * @param {("activeness" | "sleepHours")} associatedValue What is this select related to. Only two fixed options, `"activeness"` and `"sleepHours"`, so you don't have to specify all the values / options. It's done by the function itself ;].
     * @returns {ReactNode} Returns a Fragment with a `<BetterText>` (label), `<Select />` with the associated options, and a `<GapView />` between them.
     */
    function spawnInputSelect(
        associatedValue: "activeness" | "sleepHours",
    ): ReactNode {
        const options =
            associatedValue === "activeness"
                ? activenessSelectOptions
                : sleepTimeSelectOptions;

        return (
            <>
                <BetterTextSmallText>
                    {associatedValue === "activeness"
                        ? t("pages.welcome.questions.activeness.ask")
                        : t("pages.welcome.questions.sleepTime.ask")}
                </BetterTextSmallText>
                <GapView height={5} />
                <Select
                    mode="dropdown"
                    dialogPrompt={t("globals.interaction.chooseAnOption")}
                    changeAction={(value) =>
                        handleChange(
                            associatedValue,
                            value !== null && value !== undefined
                                ? value
                                : null,
                        )
                    }
                    currentValue={formData[associatedValue] ?? ""}
                    selectOptions={options}
                    t={t}
                />
            </>
        );
    }

    useEffect((): void => {
        try {
            validateStepOne(ValidateUserData(formData, "BasicHealth"));
            validateStepTwo(formData.focus !== null);
            validateStepThree(
                formData.sleepHours !== null &&
                    formData.sleepHours > 0 &&
                    formData.sleepHours < 12 &&
                    formData.activeness !== null,
            );
            validateStepFour(formData.theThinkHour !== "");
        } catch (e) {
            logToConsole(`Error validating user data: ${e}`, "error");
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
        isTheLastOne: boolean,
    ): ReactElement {
        let buttonText: string;
        let style: "GOD" | "HMM";
        let action: () => void;

        switch (step) {
            case 1:
                buttonText = isStepOneValid
                    ? isTheLastOne
                        ? t("globals.interaction.goAheadGood")
                        : t("globals.interaction.continue")
                    : t("globals.interaction.somethingIsWrong");
                style = isStepOneValid ? "GOD" : "HMM";
                action = isStepOneValid ? goNext : () => {};
                break;
            case 2:
                buttonText = isStepTwoValid
                    ? isTheLastOne
                        ? t("globals.interaction.goAheadGood")
                        : t("globals.interaction.continue")
                    : t("globals.interaction.somethingIsWrong");
                style = isStepTwoValid ? "GOD" : "HMM";
                action = isStepTwoValid ? goNext : () => {};
                break;
            case 3:
                buttonText = isStepThreeValid
                    ? isTheLastOne
                        ? t("globals.interaction.goAheadGood")
                        : t("globals.interaction.continue")
                    : t("globals.interaction.somethingIsWrong");
                style = isStepThreeValid ? "GOD" : "HMM";
                action = isStepThreeValid ? goNext : () => {};
                break;
            case 4:
                buttonText = isStepFourValid
                    ? isTheLastOne
                        ? t("globals.interaction.goAheadGood")
                        : t("globals.interaction.continue")
                    : t("globals.interaction.somethingIsWrong");
                style = isStepFourValid ? "GOD" : "HMM";
                action = isStepFourValid ? goNext : () => {};
                break;
        }

        return (
            <View style={styles.buttonWrapper}>
                <BetterButton
                    buttonText={t("globals.interaction.goBack")}
                    buttonHint="Goes one page back"
                    style="DEFAULT"
                    action={goBack}
                />
                <GapView width={10} />
                <BetterButton
                    buttonText={buttonText}
                    buttonHint={
                        isTheLastOne
                            ? "Registers the user and redirects to the home page"
                            : "Goes one page forward"
                    }
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
            <View style={styles.progressBar}>
                <View
                    style={[
                        styles.progressBarItem,
                        {
                            backgroundColor:
                                currentTab >= 1
                                    ? Colors.PRIMARIES.GOD.GOD
                                    : Colors.MAIN.DIVISION_BORDER,
                        },
                    ]}
                />
                <GapView width={5} />
                <View
                    style={[
                        styles.progressBarItem,
                        {
                            backgroundColor:
                                currentTab >= 2
                                    ? Colors.PRIMARIES.GOD.GOD
                                    : Colors.MAIN.DIVISION_BORDER,
                        },
                    ]}
                />
                <GapView width={5} />
                <View
                    style={[
                        styles.progressBarItem,
                        {
                            backgroundColor:
                                currentTab >= 3
                                    ? Colors.PRIMARIES.GOD.GOD
                                    : Colors.MAIN.DIVISION_BORDER,
                        },
                    ]}
                />
                <GapView width={5} />
                <View
                    style={[
                        styles.progressBarItem,
                        {
                            backgroundColor:
                                currentTab >= 4
                                    ? Colors.PRIMARIES.GOD.GOD
                                    : Colors.MAIN.DIVISION_BORDER,
                        },
                    ]}
                />
            </View>
        );
    }

    function BottomView() {
        if (currentTab === 0) return <></>;

        return (
            <View style={styles.bottomWrapperView}>
                {spawnNavigationButtons(
                    currentTab as 1 | 2 | 3 | 4,
                    currentTab === 4 ? true : false,
                )}
                <GapView height={10} />
                {spawnProgressBar()}
            </View>
        );
    }

    const pickerStyles: CustomTimerPickerModalStyles = {
        backgroundColor: Colors.MAIN.SECTION,
        modalTitle: {
            textAlign: "center",
            maxWidth: "75%",
        },
        text: {
            color: "#FFF",
            fontFamily: "BeVietnamPro-Regular",
        },
        pickerContainer: {
            overflow: "visible",
        },
        confirmButton: {
            backgroundColor: Colors.PRIMARIES.GOD.GOD,
            borderColor: Colors.PRIMARIES.GOD.GOD_STROKE,
            color: Colors.BASIC.BLACK,
            borderWidth: UniversalItemStyle.borderWidth,
            borderRadius: UniversalItemStyle.borderRadius,
            padding: UniversalItemStyle.padding,
        },
        cancelButton: {
            backgroundColor: Colors.MAIN.DEFAULT_ITEM.BACKGROUND,
            borderColor: Colors.MAIN.DEFAULT_ITEM.STROKE,
            color: Colors.BASIC.WHITE,
            borderWidth: UniversalItemStyle.borderWidth,
            borderRadius: UniversalItemStyle.borderRadius,
            padding: UniversalItemStyle.padding,
        },
        buttonContainer: {
            minWidth: "80%",
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
        },
        button: {
            width: "100%",
            textAlign: "center",
        },
        contentContainer: {
            borderColor: Colors.MAIN.DEFAULT_ITEM.STROKE,
            borderWidth: UniversalItemStyle.borderWidth,
            borderRadius: UniversalItemStyle.borderRadius * 2,
        },
    };

    return (
        <View style={styles.mainView}>
            <View style={styles.wrapperView}>
                {currentTab === 0 && (
                    <View style={styles.welcomeView}>
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
                            buttonHint="Begins the on-boarding process"
                            style="GOD"
                            action={goNext}
                        />
                    </View>
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
                                onTap={async (): Promise<void> => {
                                    await SafelyOpenUrl(URLs.privacy);
                                }}
                            >
                                {t("globals.interaction.learnMore")}
                            </BetterText>
                        </BetterTextSubHeader>
                        <GapView height={5} />
                        {spawnInputField(
                            t("globals.userData.username.wordShorter"),
                            t(
                                "pages.welcome.questions.aboutYou.placeholders.username",
                            ),
                            formData.username,
                            "username",
                            0,
                            "default",
                            40,
                            formData.username.length === 0 ||
                                (formData.username.length >= 3 &&
                                    formData.username.length < 40 &&
                                    !(
                                        formData.username.toLowerCase() ===
                                            "error" ||
                                        formData.username.toLowerCase() ===
                                            "error." ||
                                        formData.username
                                            .toLowerCase()
                                            .includes("pedro sánchez") ||
                                        formData.username
                                            .toLowerCase()
                                            .includes("pedro sanchez") ||
                                        formData.username
                                            .toLowerCase()
                                            .includes("psoe")
                                    ))
                                ? true
                                : false,
                            formData.username.length === 0
                                ? "Username cannot be empty."
                                : formData.username.length <
                                        VALID_USER_CAPS.USERNAME.MIN ||
                                    formData.username.length >=
                                        VALID_USER_CAPS.USERNAME.MAX
                                  ? `Your username must be between ${VALID_USER_CAPS.USERNAME.MIN} and ${VALID_USER_CAPS.USERNAME.MAX} characters long.`
                                  : VALID_USER_CAPS.USERNAME.INVALID.includes(
                                          formData.username.toLowerCase(),
                                      )
                                    ? "The username contains forbidden terms."
                                    : "",
                        )}
                        {
                            /* LMAO */
                            (formData.username.toLowerCase() === "error" ||
                                formData.username.toLowerCase() === "error." ||
                                formData.username
                                    .toLowerCase()
                                    .includes("pedro sánchez") ||
                                formData.username
                                    .toLowerCase()
                                    .includes("pedro sanchez") ||
                                formData.username
                                    .toLowerCase()
                                    .includes("psoe")) && (
                                <BetterTextSmallerText>
                                    {formData.username.toLowerCase() ===
                                        "error" ||
                                    formData.username.toLowerCase() === "error."
                                        ? `"Error" is not allowed as a username (we reserve it as a keyword for in-app error-handling).`
                                        : "no me seas gracioso."}
                                </BetterTextSmallerText>
                            )
                        }

                        <GapView height={5} />
                        {spawnInputField(
                            t("globals.userData.age.word"),
                            t(
                                "pages.welcome.questions.aboutYou.placeholders.age",
                            ),
                            formData.age,
                            "age",
                            1,
                            "numeric",
                            3,
                            formData.age === "" ||
                                (formData.age >= VALID_USER_CAPS.AGE.MIN &&
                                    formData.age <= VALID_USER_CAPS.AGE.MAX)
                                ? true
                                : false,
                            formData.age === ""
                                ? ""
                                : !(formData.age >= VALID_USER_CAPS.AGE.MIN)
                                  ? "You're NOT that young!"
                                  : !(formData.age <= VALID_USER_CAPS.AGE.MAX)
                                    ? "You're NOT that old!"
                                    : "",
                        )}
                        <GapView height={5} />
                        {spawnInputField(
                            t("globals.userData.weight"),
                            t(
                                "pages.welcome.questions.aboutYou.placeholders.weight",
                            ),
                            formData.weight,
                            "weight",
                            2,
                            "numeric",
                            5,
                            formData.weight === "" ||
                                (formData.weight >=
                                    VALID_USER_CAPS.WEIGHT.MIN &&
                                    formData.weight <=
                                        VALID_USER_CAPS.WEIGHT.MAX)
                                ? true
                                : false,
                            formData.weight === ""
                                ? ""
                                : !(
                                        formData.weight >=
                                        VALID_USER_CAPS.WEIGHT.MIN
                                    )
                                  ? "You're NOT that light!"
                                  : !(
                                          formData.weight <=
                                          VALID_USER_CAPS.WEIGHT.MAX
                                      )
                                    ? "You're NOT that heavy!"
                                    : "",
                        )}
                        <GapView height={5} />
                        {spawnInputField(
                            t("globals.userData.height"),
                            t(
                                "pages.welcome.questions.aboutYou.placeholders.height",
                            ),
                            formData.height,
                            "height",
                            3,
                            "numeric",
                            5,
                            formData.height === "" ||
                                (formData.height >=
                                    VALID_USER_CAPS.HEIGHT.MIN &&
                                    formData.height <=
                                        VALID_USER_CAPS.HEIGHT.MAX)
                                ? true
                                : false,
                            formData.height === ""
                                ? ""
                                : !(
                                        formData.height >=
                                        VALID_USER_CAPS.HEIGHT.MIN
                                    )
                                  ? "You're NOT that light!"
                                  : !(
                                          formData.height <=
                                          VALID_USER_CAPS.HEIGHT.MAX
                                      )
                                    ? "You're NOT that heavy!"
                                    : "",
                        )}
                        <GapView height={5} />
                        <BetterText
                            textAlign="normal"
                            fontWeight="Regular"
                            fontSize={FontSizes.REGULAR}
                            textColor={Colors.LABELS.SDD}
                        >
                            {t("globals.userData.gender.word")}
                        </BetterText>
                        <GapView height={5} />
                        <Swap
                            options={genderOptions}
                            value={formData.gender}
                            order="horizontal"
                            onValueChange={(value) =>
                                handleChange("gender", value)
                            }
                            style="GOD"
                        />
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
                            onValueChange={(value) =>
                                handleChange("focus", value)
                            }
                            style="GOD"
                        />
                    </>
                )}
                {currentTab === 3 && (
                    <>
                        <BetterTextHeader>
                            {t("pages.welcome.questions.aboutYouAgain.ask")}
                        </BetterTextHeader>
                        <BetterTextSubHeader>
                            {t(
                                "pages.welcome.questions.aboutYouAgain.description",
                            )}
                        </BetterTextSubHeader>
                        <GapView height={10} />
                        {spawnInputSelect("sleepHours")}
                        <GapView height={10} />
                        {spawnInputSelect("activeness")}
                    </>
                )}
                {currentTab === 4 && (
                    <>
                        <BetterTextHeader>
                            {t("pages.welcome.questions.theThinkHour.ask")}
                        </BetterTextHeader>
                        <BetterTextSubHeader>
                            {t(
                                "pages.welcome.questions.theThinkHour.description",
                            )}
                        </BetterTextSubHeader>
                        <GapView height={10} />
                        <BetterButton
                            style="GOD"
                            buttonText={t(
                                "pages.welcome.questions.theThinkHour.summon",
                            )}
                            buttonHint="Summons a modal where the user can pick an hour of the day for The Think Hour."
                            action={() => toggleTimePicker(!showTimePicker)}
                        />
                        <TimerPickerModal
                            visible={showTimePicker}
                            setIsVisible={toggleTimePicker}
                            onConfirm={(pickedDuration) => {
                                handleChange(
                                    "theThinkHour",
                                    formatTimeString(pickedDuration),
                                );
                                toggleTimePicker(false);
                            }}
                            hideSeconds={true}
                            padHoursWithZero={true}
                            padMinutesWithZero={true}
                            allowFontScaling={true}
                            modalTitle={t(
                                "pages.welcome.questions.theThinkHour.ask",
                            )}
                            onCancel={() => toggleTimePicker(false)}
                            closeOnOverlayPress={true}
                            LinearGradient={LinearGradient}
                            styles={pickerStyles}
                            modalProps={{
                                overlayOpacity: 0.25,
                            }}
                        />
                        <GapView height={10} />
                        {formData.theThinkHour && (
                            <>
                                <BetterTextSmallText>
                                    {t(
                                        "pages.welcome.questions.theThinkHour.youChose",
                                        { hour: formData.theThinkHour },
                                    )}
                                </BetterTextSmallText>
                                <GapView height={10} />
                            </>
                        )}
                        <BetterAlert
                            style="DEFAULT"
                            layout="alert"
                            title={t(
                                "pages.welcome.questions.theThinkHour.TEMP_disclaimer",
                            )}
                            bodyText={t(
                                "pages.welcome.questions.theThinkHour.TEMP_disclaimer2",
                            )}
                        />
                    </>
                )}
            </View>
            <BottomView />
        </View>
    );
}
