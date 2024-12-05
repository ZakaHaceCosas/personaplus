import React from "react";
import { BetterTextNormalText } from "@/components/text/BetterTextPresets";
import { useTranslation } from "react-i18next";
import type { FullProfile } from "@/types/User";
import BetterButton from "@/components/interaction/BetterButton";
import { ErrorUserData, OrchestrateUserData } from "@/toolkit/User";
import { router } from "expo-router";
import { logToConsole } from "@/toolkit/debug/Console";
import ROUTES from "@/constants/Routes";
import { useEffect, useState } from "react";
import Section from "@/components/ui/sections/Section";
import Division from "@/components/ui/sections/Division";
import Loading from "@/components/static/Loading";
import GapView from "@/components/ui/GapView";
import PageEnd from "@/components/static/PageEnd";
import TopBar from "@/components/navigation/TopBar";

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

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={false}
                header={t("pages.profile.header")}
                subHeader={t("pages.profile.subheader", {
                    username: userData?.username,
                })}
            />
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
                    header="Open settings"
                    subHeader="Manage notifications, app language, and other preferences. Access advanced features and experiments. Reset the app if needed."
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText="Open settings page"
                        buttonHint="Opens a dedicated page to see and change all of the app's settings."
                        style="ACE"
                        action={() => {
                            router.push(ROUTES.MAIN.SETTINGS.SETTINGS_PAGE);
                        }}
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
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
