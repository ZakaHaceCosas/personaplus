// todo: doing this, some day
import BetterButton from "@/components/interaction/BetterButton";
import Loading from "@/components/static/Loading";
import Division from "@/components/ui/sections/Division";
import { logToConsole } from "@/toolkit/debug/Console";
import React, { useEffect, useState } from "react";
import StoredItemNames from "@/constants/StoredItemNames";
import AsyncStorage from "expo-sqlite/kv-store";
import { useTranslation } from "react-i18next";
import { ErrorUserData, OrchestrateUserData, updateBrm5 } from "@/toolkit/User";
import { FullProfile } from "@/types/User";
import ROUTES from "@/constants/Routes";
import { router } from "expo-router";
import GapView from "@/components/ui/GapView";
import Section from "@/components/ui/sections/Section";
import PageEnd from "@/components/static/PageEnd";
import TopBar from "@/components/navigation/TopBar";

export default function Settings() {
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
            <TopBar
                includeBackButton={true}
                header="Settings"
                subHeader="Your app, your rule. Tweak it here."
            />
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
            </Section>
            <GapView height={20} />
            <Section kind="Developer">
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
