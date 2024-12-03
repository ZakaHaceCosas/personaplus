// UpdateProfile.tsx
// Update your profile.

import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "expo-sqlite/kv-store";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import { logToConsole } from "@/toolkit/debug/Console";
import { OrchestrateUserData, ValidateUserData } from "@/toolkit/User";
import Loading from "@/components/static/Loading";
import BackButton from "@/components/navigation/GoBack";
import GapView from "@/components/ui/GapView";
import {
    BetterTextHeader,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import BetterText from "@/components/text/BetterText";
import BetterButton from "@/components/interaction/BetterButton";
import Swap, { SwapOption } from "@/components/interaction/Swap";
import BetterInputField from "@/components/interaction/BetterInputField";
import PageEnd from "@/components/static/PageEnd";
import { BasicUserData } from "@/types/User";
import StoredItemNames from "@/constants/StoredItemNames";
import SafelyGoBack from "@/toolkit/Routing";
import ROUTES from "@/constants/Routes";
import GetStuffForUserDataQuestion from "@/constants/UserData";
import getCommonScreenSize from "@/constants/Screen";

const styles = StyleSheet.create({
    buttonWrapper: {
        display: "flex",
        flexDirection: "row",
        width: getCommonScreenSize("width"),
        alignItems: "center",
        justifyContent: "center",
        bottom: -160, // TODO - this is kinda unresponsive
        position: "absolute",
    },
});

export default function UpdateProfile() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(true);
    const [workingData, setWorkingData] = useState<BasicUserData>(); // Store previous data

    // Fetch all user data
    useEffect(() => {
        async function handle() {
            try {
                const data = await OrchestrateUserData("basic");
                if (!data) {
                    router.replace(ROUTES.MAIN.WELCOME_SCREEN);
                    throw new Error("no work data");
                }
                setWorkingData(data);
                setLoading(false);
            } catch (e) {
                console.error(e);
            }
        }
        handle();
    }, []);

    const genderOptions: SwapOption[] = GetStuffForUserDataQuestion(
        "gender",
    ) as SwapOption[];
    const inputRefs = useRef<TextInput[]>([]);

    async function submit() {
        if (
            ValidateUserData(
                workingData!.gender,
                workingData!.age,
                workingData!.weight,
                workingData!.height,
                workingData!.username,
            )
        ) {
            try {
                // Save data to AsyncStorage
                await AsyncStorage.setItem(
                    StoredItemNames.userData,
                    JSON.stringify(workingData),
                );
                SafelyGoBack(ROUTES.MAIN.PROFILE);
            } catch (e) {
                logToConsole("Error creating profile: " + e, "error");
            }
        } else {
            logToConsole(
                "Error saving user data, some data is missing!",
                "error",
            ); // bro forgot to add data
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
    ) {
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
                    changeAction={(text) =>
                        setWorkingData((prev) => ({ ...prev!, username: text }))
                    }
                    shouldRef={true}
                />
            </>
        );
    }

    if (loading) return <Loading />;

    return (
        <>
            <BackButton t={t} />
            <BetterTextHeader>
                {t("pages.updateProfile.header")}
            </BetterTextHeader>
            <BetterTextSubHeader>
                {t("pages.updateProfile.subheader")}
            </BetterTextSubHeader>
            <GapView height={15} />
            {spawnInputField(
                t("globals.userData.username.wordShorter"),
                t("pages.welcome.questions.aboutYou.placeholders.username"),
                workingData!.username,
                "username",
                0,
                "default",
                30,
            )}
            <GapView height={5} />
            {spawnInputField(
                t("globals.userData.age.word"),
                t("pages.welcome.questions.aboutYou.placeholders.age"),
                workingData!.age,
                "age",
                1,
                "numeric",
                2,
            )}
            <GapView height={5} />
            {spawnInputField(
                t("globals.userData.weight"),
                t("pages.welcome.questions.aboutYou.placeholders.weight"),
                workingData!.weight,
                "weight",
                2,
                "numeric",
                3,
            )}
            <GapView height={5} />
            {spawnInputField(
                t("globals.userData.height"),
                t("pages.welcome.questions.aboutYou.placeholders.height"),
                workingData!.height,
                "height",
                3,
                "numeric",
                3,
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
                    setWorkingData((prev) => ({
                        ...prev!,
                        gender: value as "male" | "female",
                    }))
                }
                order="horizontal"
            />
            <GapView height={5} />
            <View style={styles.buttonWrapper}>
                <BetterButton
                    style="DEFAULT"
                    action={router.back}
                    buttonText={t("globals.go_back")}
                    buttonHint="TODO"
                />
                <GapView width={15} />
                <BetterButton
                    style="ACE"
                    action={async () => {
                        await submit();
                    }}
                    buttonText={t("globals.save")}
                    buttonHint="TODO"
                />
            </View>
            <PageEnd includeText={false} size="tiny" />
        </>
    );
}