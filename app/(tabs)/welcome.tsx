/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/app/(tabs)/welcome.tsx
 * Basically: Welcome to PersonaPlus!
 *
 * <=============================================================================>
 */

import React, {
    MutableRefObject,
    ReactElement,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import { router } from "expo-router";
import { StyleSheet, TextInput, View } from "react-native";
import Swap, { SwapOption } from "@/components/interaction/swap";
import GapView from "@/components/ui/gap_view";
import BetterText from "@/components/text/better_text";
import AsyncStorage from "expo-sqlite/kv-store";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/colors";
import { FullProfile, FullProfileForCreation } from "@/types/user";
import { GetCommonScreenSize } from "@/constants/screen";
import {
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
import { IndividualUserDataValidators, ValidateUserData } from "@/toolkit/user";
import FontSizes from "@/constants/font_sizes";
import Select, { SelectOption } from "@/components/interaction/select";
import BetterButton from "@/components/interaction/better_button";
import BetterInputField from "@/components/interaction/better_input_field";
import StoredItemNames from "@/constants/stored_item_names";
import { TimeStringUtilities } from "@/toolkit/today";
import { Routes } from "@/constants/routes";
import GetStuffForUserDataQuestion from "@/constants/user_data";
import URLs from "@/constants/urls";
import { SafelyOpenUrl } from "@/toolkit/routing";
import BetterAlert from "@/components/ui/better_alert";
import { UniversalItemStyle } from "@/constants/ui/pressables";
import PageEnd from "@/components/static/page_end";
import MultiSelect, {
    MultiSelectOption,
} from "@/components/interaction/multi_select";
import TopBar from "@/components/navigation/top_bar";

// We define the styles
const styles = StyleSheet.create({
    mainView: {
        height: GetCommonScreenSize("height"),
        width: GetCommonScreenSize("width"),
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: Colors.MAIN.APP,
    },
    wrapperView: {
        width: GetCommonScreenSize("width"),
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    bottomWrapperView: {
        width: GetCommonScreenSize("width"),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    welcomeView: {
        height: GetCommonScreenSize("height"),
        width: GetCommonScreenSize("width"),
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    buttonWrapper: {
        display: "flex",
        flexDirection: "row",
        width: GetCommonScreenSize("width"),
        alignItems: "center",
        justifyContent: "center",
    },
    progressBar: {
        width: GetCommonScreenSize("width"),
        height: 5,
        borderRadius: 100,
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
    },
    progressBarItem: {
        flex: 1,
    },
});

// We create the function
export default function WelcomePage(): ReactElement {
    const { t } = useTranslation();
    // what "tab" of the page the user's on
    const [currentTab, setTab] = useState<number>(0);
    const amountOfTabs: number = 5;
    // hmm i don't know how to explain this one (but it works)
    const inputRefs: MutableRefObject<TextInput[]> = useRef<TextInput[]>([]);

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
        healthConditions: "none",
    });

    // stateful logic to validate formData
    const [isStepOneValid, validateStepOne] = useState<boolean>(false);
    const [isStepTwoValid, validateStepTwo] = useState<boolean>(false);
    const [isStepThreeValid, validateStepThree] = useState<boolean>(false);
    const [isStepFourValid, validateStepFour] = useState<boolean>(false);
    const [isStepFiveValid, validateStepFive] = useState<boolean>(false);

    const activenessSelectOptions = GetStuffForUserDataQuestion(
        "activeness",
    ) as SelectOption[];
    const sleepTimeSelectOptions = GetStuffForUserDataQuestion(
        "sleepTime",
    ) as SelectOption[];
    const focusOptions = GetStuffForUserDataQuestion("focus") as SwapOption[];
    const genderOptions = GetStuffForUserDataQuestion("gender") as SwapOption[];
    const healthConditionOptions = GetStuffForUserDataQuestion(
        "healthConditions",
    ) as MultiSelectOption[];

    /* for the time picker to be displayed or not */
    const [showTimePicker, toggleTimePicker] = useState<boolean>(false);

    // pagination
    /** Goes to the next "tab" of the Welcome screen. If there are no more pages, calls `submitUser()`.
     * @see submitUser()
     */
    function goNext(): void {
        if (currentTab >= 0 && currentTab <= amountOfTabs - 1) {
            setTab((prevPage: number): number => prevPage + 1);
        } else {
            submitUser();
        }
    }
    /** Goes to the previous "tab" of the Welcome screen. */
    function goBack(): void {
        if (currentTab >= 0) {
            setTab((prevPage: number): number => prevPage - 1);
        }
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
            console.error(
                `Error handling data changes happened at Welcome screen: ${e}`,
            );
        }
    }

    /**
     * Submit's `formData` and tries to register the user. Don't get confused, "registration" is locally, no account system, no cloud, whatsoever. At least at this stage of development. **Async function.**
     *
     * @async
     * @returns {Promise<void>}
     */
    async function submitUser(): Promise<void> {
        if (
            !Object.values(formData).some(
                (value): boolean =>
                    value === null || value === 0 || value === "",
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
                    healthConditions: validData.healthConditions,
                };

                const stringData: string = JSON.stringify(userData);

                await AsyncStorage.setItem(
                    StoredItemNames.userData,
                    stringData,
                );
                await AsyncStorage.setItem(
                    StoredItemNames.activeObjectives,
                    "[]",
                );
                await AsyncStorage.setItem(
                    StoredItemNames.passiveObjectives,
                    "[]",
                );
                router.replace(Routes.MAIN.HOME);
                console.log(
                    `${userData.username} was successfully registered with no errors. Give yourself a plus!\n${validData}`,
                    "success",
                );
                return;
            } catch (e) {
                console.error(
                    `Error creating profile! Data: ${JSON.stringify(
                        formData,
                    )}\nError: ${e}.`,
                );
                return;
            }
        } else {
            console.error(
                `Error saving user data, some data is missing or not valid! JSON is:\n${JSON.stringify(
                    formData,
                )}`,
            );
            return;
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
                    changeAction={(text: string): void =>
                        handleChange(name, text)
                    }
                    isValid={isValid}
                    validatorMessage={errorMessage}
                />
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
        const options: SelectOption[] =
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
                    changeAction={(value: string | number): void =>
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
            validateStepFour(formData.healthConditions !== null);
            validateStepFive(formData.theThinkHour !== "");
        } catch (e) {
            console.error(`Error validating user data: ${e}`);
        }
    }, [formData]);

    /**
     * Spawns the navigation buttons - "Go back" and "Continue" / "Let's go" if it's the last page.
     *
     * @returns {ReactElement}
     */
    function NavigationButtons(): ReactElement {
        let buttonText: string;
        let style: "ACE" | "HMM";
        let action: () => void;

        switch (currentTab) {
            case 1:
                buttonText = isStepOneValid
                    ? t("globals.interaction.continue")
                    : t("globals.interaction.somethingIsWrong");
                style = isStepOneValid ? "ACE" : "HMM";
                action = isStepOneValid ? goNext : () => {};
                break;
            case 2:
                buttonText = isStepTwoValid
                    ? t("globals.interaction.continue")
                    : t("globals.interaction.somethingIsWrong");
                style = isStepTwoValid ? "ACE" : "HMM";
                action = isStepTwoValid ? goNext : (): void => {};
                break;
            case 3:
                buttonText = isStepThreeValid
                    ? t("globals.interaction.continue")
                    : t("globals.interaction.somethingIsWrong");
                style = isStepThreeValid ? "ACE" : "HMM";
                action = isStepThreeValid ? goNext : (): void => {};
                break;
            case 4:
                buttonText = isStepFourValid
                    ? t("globals.interaction.continue")
                    : t("globals.interaction.somethingIsWrong");
                style = isStepFourValid ? "ACE" : "HMM";
                action = isStepFourValid ? goNext : (): void => {};
                break;
            case 5:
                buttonText = isStepFiveValid
                    ? t("globals.interaction.goAheadGood")
                    : t("globals.interaction.somethingIsWrong");
                style = isStepFiveValid ? "ACE" : "HMM";
                action = isStepFiveValid ? goNext : (): void => {};
                break;
            default:
                console.error(
                    `Someone forgot to assign a case for tab ${currentTab}.`,
                    "warn",
                );
                buttonText = "Error";
                style = "HMM";
                action = (): void => {};
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
                        currentTab === 5
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
    function ProgressBar(): ReactElement {
        return (
            <View style={styles.progressBar}>
                <View
                    style={[
                        styles.progressBarItem,
                        {
                            backgroundColor:
                                currentTab >= 1
                                    ? Colors.PRIMARIES.ACE.ACE
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
                                    ? Colors.PRIMARIES.ACE.ACE
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
                                    ? Colors.PRIMARIES.ACE.ACE
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
                                    ? Colors.PRIMARIES.ACE.ACE
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
                                currentTab >= 5
                                    ? Colors.PRIMARIES.ACE.ACE
                                    : Colors.MAIN.DIVISION_BORDER,
                        },
                    ]}
                />
            </View>
        );
    }

    function BottomView(): ReactElement {
        if (currentTab === 0) return <></>;

        return (
            <View style={styles.bottomWrapperView}>
                <NavigationButtons />
                <GapView height={10} />
                <ProgressBar />
                <PageEnd size="tiny" includeText={false} />
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
        confirmButton: {
            backgroundColor: Colors.PRIMARIES.ACE.ACE,
            borderColor: Colors.PRIMARIES.ACE.ACE_STROKE,
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
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 20,
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
        container: {
            width: "90%",
            height: "100%",
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
                                textColor={Colors.PRIMARIES.ACE.ACE}
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
                            style="ACE"
                            action={goNext}
                        />
                    </View>
                )}
                {currentTab === 1 && (
                    <>
                        <TopBar
                            header={t("pages.welcome.questions.aboutYou.ask")}
                            subHeader={t(
                                "pages.welcome.questions.aboutYou.description",
                            )}
                            includeBackButton={false}
                        />
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
                            IndividualUserDataValidators.username.validator(
                                formData.username,
                            ),
                            IndividualUserDataValidators.username.message(
                                formData.username,
                                t,
                            ),
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
                                        ? t(
                                              "userData.formValidation.username.forbiddenError",
                                          )
                                        : t(
                                              "userData.formValidation.username.forbiddenPsoe",
                                          )}
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
                            IndividualUserDataValidators.age.validator(
                                formData.age,
                            ),
                            IndividualUserDataValidators.age.message(
                                formData.age,
                                t,
                            ),
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
                            IndividualUserDataValidators.weight.validator(
                                formData.weight,
                            ),
                            IndividualUserDataValidators.weight.message(
                                formData.weight,
                                t,
                            ),
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
                            IndividualUserDataValidators.height.validator(
                                formData.height,
                            ),
                            IndividualUserDataValidators.height.message(
                                formData.height,
                                t,
                            ),
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
                        />
                        <GapView height={10} />
                        <BetterText
                            isLink={true}
                            fontWeight="Medium"
                            fontSize={FontSizes.REGULAR}
                            onTap={async (): Promise<void> => {
                                await SafelyOpenUrl(URLs.privacy);
                            }}
                        >
                            {t("globals.interaction.privacy")}
                        </BetterText>
                    </>
                )}
                {currentTab === 2 && (
                    <>
                        <TopBar
                            header={t("pages.welcome.questions.focus.ask")}
                            subHeader={t(
                                "pages.welcome.questions.focus.description",
                            )}
                            includeBackButton={false}
                        />
                        <Swap
                            options={focusOptions}
                            value={formData.focus}
                            order="vertical"
                            onValueChange={(value) =>
                                handleChange("focus", value)
                            }
                        />
                    </>
                )}
                {currentTab === 3 && (
                    <>
                        <TopBar
                            header={t(
                                "pages.welcome.questions.aboutYouAgain.ask",
                            )}
                            subHeader={t(
                                "pages.welcome.questions.aboutYouAgain.description",
                            )}
                            includeBackButton={false}
                        />
                        {spawnInputSelect("sleepHours")}
                        <GapView height={10} />
                        {spawnInputSelect("activeness")}
                    </>
                )}
                {currentTab === 4 && (
                    <>
                        <TopBar
                            header={t(
                                "pages.welcome.questions.medicalConditions.ask",
                            )}
                            subHeader={t(
                                "pages.welcome.questions.medicalConditions.description",
                            )}
                            includeBackButton={false}
                        />
                        <MultiSelect
                            options={healthConditionOptions}
                            changeAction={(
                                values: MultiSelectOption[],
                            ): void => {
                                setFormData({
                                    ...formData,
                                    healthConditions:
                                        values.length === 0
                                            ? "none"
                                            : values.map(
                                                  (
                                                      value: MultiSelectOption,
                                                  ): string => value.value,
                                              ),
                                });
                            }}
                        />
                        <GapView height={5} />
                        {(formData.healthConditions === "none" ||
                            !formData.healthConditions ||
                            formData.healthConditions.length === 0) && (
                            <BetterTextSmallerText>
                                {t(
                                    "pages.welcome.questions.medicalConditions.none",
                                )}
                            </BetterTextSmallerText>
                        )}
                    </>
                )}
                {currentTab === 5 && (
                    <>
                        <TopBar
                            header={t(
                                "pages.welcome.questions.theThinkHour.ask",
                            )}
                            subHeader={t(
                                "pages.welcome.questions.theThinkHour.description",
                            )}
                            includeBackButton={false}
                        />
                        <BetterButton
                            style="ACE"
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
                                    TimeStringUtilities.Format(pickedDuration),
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
                            closeOnOverlayPress={false}
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
