import {
    BetterTextHeader,
    BetterTextNormalText,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { FullProfile } from "@/types/User";
import BetterButton from "@/components/interaction/BetterButton";
import { ErrorUserData, OrchestrateUserData, updateBrm5 } from "@/toolkit/User";
import { router } from "expo-router";
import { logToConsole } from "@/toolkit/debug/Console";
import StoredItemNames from "@/constants/StoredItemNames";
import ROUTES from "@/constants/Routes";
import { useEffect, useState } from "react";
import Section from "@/components/ui/sections/Section";
import Division from "@/components/ui/sections/Division";
import Loading from "@/components/static/Loading";
import BetterText from "@/components/text/BetterText";
import FontSizes from "@/constants/FontSizes";
import GapView from "@/components/ui/GapView";

export default function HomeScreen() {
    const [userData, setUserData] = useState<FullProfile>(ErrorUserData);
    const [loading, setLoading] = useState<boolean>(true);

    const { t } = useTranslation();

    useEffect((): void => {
        async function handler(): Promise<void> {
            try {
                const profile: FullProfile | null = await OrchestrateUserData();
                if (!profile) {
                    setUserData(ErrorUserData);
                    return;
                }
                setUserData(profile);
            } catch (e) {
                logToConsole("Error orchestrating user data: " + e, "error");
            } finally {
                setLoading(false);
            }
        }

        handler();
    }, []);

    async function changeLanguage(): Promise<void> {
        try {
            if (!userData) throw new Error("Why is userData (still) null?");
            userData.language = "es";
            await AsyncStorage.setItem(
                StoredItemNames.userData,
                JSON.stringify(userData),
            );
        } catch (e) {
            logToConsole("Error changing language:" + e, "error");
        }
    }

    if (loading) return <Loading />;

    return (
        <>
            <BetterTextHeader>{t("pages.profile.header")}</BetterTextHeader>
            <BetterTextSubHeader>
                {t("pages.profile.subheader", { username: userData?.username })}
            </BetterTextSubHeader>
            <BetterText
                fontSize={FontSizes.LARGER}
                isLink={true}
                fontWeight="Regular"
                onTap={changeLanguage}
            >
                SET LANGUAGE TO SPANISH HERE (dev purposes)
            </BetterText>
            <Section kind="Profile">
                <Division
                    header={userData.username}
                    direction="vertical"
                    gap={0}
                >
                    <BetterTextNormalText>
                        {t("Age: {{age}} years old", { age: userData.age })}
                    </BetterTextNormalText>
                    <GapView height={5} />
                    <BetterTextNormalText>
                        {t("Weight: {{w}}kg", { w: userData.weight })}
                    </BetterTextNormalText>
                    <GapView height={5} />
                    <BetterTextNormalText>
                        {t("Height: {{h}}cm", { h: userData.height })}
                    </BetterTextNormalText>
                    <GapView height={10} />
                    <BetterButton
                        buttonText="Update profile"
                        buttonHint="Takes you to a page from where you can update your profile"
                        style="DEFAULT"
                        action={() =>
                            router.push(ROUTES.MAIN.SETTINGS.UPDATE_PROFILE)
                        }
                    />
                </Division>
            </Section>
            <GapView height={20} />
            <Section kind="Settings">
                <BetterButton
                    buttonText="DO NOT PRESS OR YOU WILL BE FIRED"
                    buttonHint="makes your account go boom"
                    style="WOR"
                    action={() => updateBrm5(true)}
                />
                <BetterButton
                    buttonText="Dev Interface"
                    buttonHint="Launches Dev Interface"
                    style="HMM"
                    action={() => router.navigate(ROUTES.DEV_INTERFACE.HOME)}
                />
            </Section>
        </>
    );
}
