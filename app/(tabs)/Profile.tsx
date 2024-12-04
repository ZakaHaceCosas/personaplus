import {
    BetterTextHeader,
    BetterTextNormalText,
    BetterTextSubHeader,
} from "@/components/text/BetterTextPresets";
import { useTranslation } from "react-i18next";
import AsyncStorage from "expo-sqlite/kv-store";
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
import GapView from "@/components/ui/GapView";
import PageEnd from "@/components/static/PageEnd";

export default function HomeScreen() {
    const [userData, setUserData] = useState<FullProfile>(ErrorUserData);
    const [loading, setLoading] = useState<boolean>(true);

    const { t } = useTranslation();

    useEffect((): void => {
        async function handler(): Promise<void> {
            try {
                const profile: FullProfile = await OrchestrateUserData();
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
            userData.language = userData.language === "es" ? "en" : "es";
            await AsyncStorage.setItem(
                StoredItemNames.userData,
                JSON.stringify(userData),
            );
            router.replace(ROUTES.MAIN.PROFILE);
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
            <GapView height={10} />
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
                <Division
                    preHeader="Preferences"
                    header="Change language"
                    subHeader={`You're currently using ${t(`globals.languages.${userData.language}`)}`}
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText="Change language"
                        buttonHint="Changes your language."
                        style="DEFAULT"
                        action={changeLanguage}
                    />
                </Division>
                <Division
                    preHeader="Advanced"
                    header="Experiments"
                    subHeader="Features still in progress. Test them early, share feedback, and help us improve—but note they're unstable."
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText="Open Experiments"
                        buttonHint="Opens a page where experiments can be enabled or disabled."
                        style="HMM"
                        action={() =>
                            router.push(ROUTES.DEV_INTERFACE.EXPERIMENTS)
                        }
                    />
                </Division>
                <Division
                    preHeader="Advanced"
                    header="Launch Dev Interface"
                    subHeader="An interface for contributors to see what's up from the inside of the app."
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText="Dev Interface"
                        buttonHint="Launches Dev Interface"
                        style="HMM"
                        action={() => router.push(ROUTES.DEV_INTERFACE.HOME)}
                    />
                </Division>
            </Section>
            <GapView height={20} />
            <Section kind="About">
                <Division
                    preHeader="About"
                    header="About us"
                    subHeader="Find out who's behind the app you're (hopefully!) enjoying right now."
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText="See about us"
                        buttonHint="Opens a page to see info about the app, its creator, etc..."
                        style="DEFAULT"
                        action={() => {
                            router.push(ROUTES.ABOUT.ABOUT_PAGE);
                        }}
                    />
                </Division>
                <Division
                    preHeader="About"
                    header="License"
                    subHeader="PersonaPlus is licensed under GPL-v3. Enter here to learn more. Note this page is only in English."
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText="See license"
                        buttonHint="Opens a page to see the app's license."
                        style="DEFAULT"
                        action={() => {
                            router.push(ROUTES.ABOUT.LICENSE);
                        }}
                    />
                </Division>
            </Section>
            <GapView height={20} />
            <Section kind="Danger">
                <Division
                    preHeader="Dangerous"
                    header="Reset app"
                    subHeader="It will permanently remove all of your user data, with no way to go back. Use it at your own will."
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText="Reset PersonaPlus"
                        buttonHint="makes your account go boom"
                        style="WOR"
                        action={() => updateBrm5(true)}
                    />
                </Division>
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
