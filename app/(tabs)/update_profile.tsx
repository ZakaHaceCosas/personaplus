/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/app/(tabs)/update_profile.tsx
 * Basically: A page for you to update your profile.
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
import { StyleSheet, TextInput, View } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "expo-sqlite/kv-store";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/colors";
import {
    IndividualUserDataValidators,
    OrchestrateUserData,
    ValidateUserData,
} from "@/toolkit/user";
import Loading from "@/components/static/loading";
import GapView from "@/components/ui/gap_view";
import BetterText from "@/components/text/better_text";
import BetterButton from "@/components/interaction/better_button";
import Swap, { SwapOption } from "@/components/interaction/swap";
import BetterInputField from "@/components/interaction/better_input_field";
import PageEnd from "@/components/static/page_end";
import { BasicUserData, FullProfile } from "@/types/user";
import StoredItemNames from "@/constants/stored_item_names";
import { SafelyGoBack } from "@/toolkit/routing";
import { Routes } from "@/constants/routes";
import GetStuffForUserDataQuestion from "@/constants/user_data";
import { GetCommonScreenSize } from "@/constants/screen";
import TopBar from "@/components/navigation/top_bar";
import { BetterTextSmallerText } from "@/components/text/better_text_presets";

const styles = StyleSheet.create({
    buttonWrapper: {
        display: "flex",
        flexDirection: "row",
        width: GetCommonScreenSize("width"),
        alignItems: "center",
        justifyContent: "center",
    },
});

export default function UpdateProfile(): ReactElement {
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(true);
    const [workingData, setWorkingData] = useState<BasicUserData>(); // Store previous data

    // Fetch all user data
    useEffect((): void => {
        async function handle(): Promise<void> {
            try {
                const data: BasicUserData = await OrchestrateUserData("basic");
                setWorkingData(data);
            } catch (e) {
                console.error(`Error handling user data: ${e}`);
            } finally {
                setLoading(false);
            }
        }
        handle();
    }, []);

    const genderOptions: SwapOption[] = GetStuffForUserDataQuestion(
        "gender",
    ) as SwapOption[];
    const inputRefs: MutableRefObject<TextInput[]> = useRef<TextInput[]>([]);

    async function submit(): Promise<void> {
        if (workingData && ValidateUserData(workingData, "Basic")) {
            try {
                const data: FullProfile = await OrchestrateUserData();
                const newData: FullProfile = {
                    ...data,
                    username: workingData.username,
                    gender: workingData.gender,
                    age: workingData.age,
                    weight: workingData.weight,
                    height: workingData.height,
                };
                // Save data to AsyncStorage
                await AsyncStorage.setItem(
                    StoredItemNames.userData,
                    JSON.stringify(newData),
                );
                SafelyGoBack(Routes.MAIN.PROFILE);
            } catch (e) {
                console.error(`Error creating profile: ${e}`);
            }
        } else {
            console.error("Error saving user data, some data is missing!"); // bro forgot to add data
        }
    }

    /**
     * Spawns an input field with the given parameters.
     *
     * @param {string} label A short text to show before the input to give indications.
     * @param {string} placeholder The placeholder of the input.
     * @param {string | number} value The value of the input. Set it to a stateful value, e.g. `workingData!.username`.
     * @param {string} name The name of the property / stateful value it's linked to, e.g. `username` for `workingData!.username`.
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
                        setWorkingData(
                            (
                                prev: BasicUserData | undefined,
                            ): BasicUserData => ({
                                ...prev!,
                                [name]: text,
                            }),
                        )
                    }
                    isValid={isValid}
                    validatorMessage={errorMessage}
                />
            </>
        );
    }

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={true}
                header={t("pages.updateProfile.header")}
                subHeader={t("pages.updateProfile.subheader")}
            />
            {spawnInputField(
                t("globals.userData.username.wordShorter"),
                t("pages.welcome.questions.aboutYou.placeholders.username"),
                workingData!.username,
                "username",
                0,
                "default",
                40,
                IndividualUserDataValidators.username.validator(
                    workingData!.username,
                ),
                IndividualUserDataValidators.username.message(
                    workingData!.username,
                    t,
                ),
            )}
            {
                /* LMAO */
                (workingData!.username.toLowerCase() === "error" ||
                    workingData!.username.toLowerCase() === "error." ||
                    workingData!.username
                        .toLowerCase()
                        .includes("pedro sánchez") ||
                    workingData!.username
                        .toLowerCase()
                        .includes("pedro sanchez") ||
                    workingData!.username.toLowerCase().includes("psoe")) && (
                    <BetterTextSmallerText>
                        {workingData!.username.toLowerCase() === "error" ||
                        workingData!.username.toLowerCase() === "error."
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
                t("pages.welcome.questions.aboutYou.placeholders.age"),
                workingData!.age,
                "age",
                1,
                "numeric",
                3,
                IndividualUserDataValidators.age.validator(workingData!.age),
                IndividualUserDataValidators.age.message(workingData!.age, t),
            )}
            <GapView height={5} />
            {spawnInputField(
                t("globals.userData.weight"),
                t("pages.welcome.questions.aboutYou.placeholders.weight"),
                workingData!.weight,
                "weight",
                2,
                "numeric",
                5,
                IndividualUserDataValidators.weight.validator(
                    workingData!.weight,
                ),
                IndividualUserDataValidators.weight.message(
                    workingData!.weight,
                    t,
                ),
            )}
            <GapView height={5} />
            {spawnInputField(
                t("globals.userData.height"),
                t("pages.welcome.questions.aboutYou.placeholders.height"),
                workingData!.height,
                "height",
                3,
                "numeric",
                5,
                IndividualUserDataValidators.height.validator(
                    workingData!.height,
                ),
                IndividualUserDataValidators.height.message(
                    workingData!.height,
                    t,
                ),
            )}
            <GapView height={15} />
            <BetterText
                textAlign="normal"
                fontWeight="Regular"
                fontSize={15}
                textColor={Colors.LABELS.SDD}
            >
                {
                    new Date().getDate() === 28 && new Date().getMonth() === 5
                        ? t("EasterEggs.whyChangeGender") // "genders don't change, but okay"
                        : t("globals.userData.gender.word") // "Gender"
                    // i keep to myself the right to be as unhinged as i want to
                }
            </BetterText>
            <GapView height={5} />
            <Swap
                key="genderSwap"
                options={genderOptions}
                value={workingData!.gender}
                onValueChange={(value: string | null): void =>
                    setWorkingData(
                        (prev: BasicUserData | undefined): BasicUserData => ({
                            ...prev!,
                            gender: value as "male" | "female",
                        }),
                    )
                }
                order="horizontal"
            />
            <GapView height={20} />
            <View style={styles.buttonWrapper}>
                <BetterButton
                    style="DEFAULT"
                    action={router.back}
                    buttonText={t("globals.interaction.nevermind")}
                    buttonHint={t("pages.updateProfile.nevermindHint")}
                />
                <GapView width={10} />
                <BetterButton
                    style="ACE"
                    action={async (): Promise<void> => {
                        await submit();
                    }}
                    buttonText={t("globals.interaction.save")}
                    buttonHint={t("pages.updateProfile.saveHint")}
                />
            </View>
            <PageEnd includeText={false} size="tiny" />
        </>
    );
}
