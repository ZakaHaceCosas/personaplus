// Results.tsx
// Results page for when a session is done.

import React, { useEffect, useState } from "react";
import { router, useGlobalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import GenerateRandomMessage from "@/toolkit/random_message";
import GapView from "@/components/ui/gap_view";
import Section from "@/components/ui/sections/section";
import Division from "@/components/ui/sections/division";
import BetterText from "@/components/text/better_text";
import BetterButton from "@/components/interaction/better_button";
import { Routes } from "@/constants/routes";
import { SessionParams } from "@/types/active_objectives";
import TopBar from "@/components/navigation/top_bar";
import { OrchestrateUserData, ValidateUserData } from "@/toolkit/user";
import { FullProfile } from "@/types/user";
import {
    areNotificationsScheduledForToday,
    cancelScheduledNotifications,
} from "@/hooks/use_notification";
import { logToConsole } from "@/toolkit/debug/console";
import { GetAllPendingObjectives } from "@/toolkit/objectives/active_objectives";

export default function Results() {
    // Params
    const originalParams = useGlobalSearchParams();
    const parseNumber = (value: any) => Number(value) || 0;
    const [userData, setUserData] = useState<FullProfile>();
    const [notificationsHandled, setNotificationsHandled] =
        useState<boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {
        async function fetchData(): Promise<void> {
            try {
                // fetch user
                const userData: FullProfile = await OrchestrateUserData();
                if (!ValidateUserData(userData, "Full")) {
                    router.replace(Routes.MAIN.WELCOME_SCREEN);
                    return;
                }
                setUserData(userData);
            } finally {
                // setLoading(false);
            }
        }

        fetchData();
    }, []);

    const params: SessionParams = {
        burntCalories: parseNumber(originalParams.burntCalories),
        elapsedTime: parseNumber(originalParams.elapsedTime),
        id: parseNumber(originalParams.identifier),
    };

    useEffect(() => {
        async function handle(): Promise<void> {
            if (notificationsHandled || !userData) return;

            try {
                const isRegistered: boolean =
                    await areNotificationsScheduledForToday();
                if (userData.wantsNotifications === false && isRegistered) {
                    await cancelScheduledNotifications(t, false);
                } else if (!Array.isArray(await GetAllPendingObjectives())) {
                    await cancelScheduledNotifications(t, false);
                }
            } catch (e) {
                logToConsole(`Error handling notifications: ${e}`, "error");
            } finally {
                setNotificationsHandled(true);
            }
        }

        handle();
    }, [userData, notificationsHandled, t]);

    return (
        <>
            <TopBar
                includeBackButton={false}
                header={t("pages.results.header")}
                subHeader={GenerateRandomMessage("sessionCompleted", t)}
            />
            <Section kind="HowYouAreDoing">
                <Division
                    preHeader={t("pages.results.actualResults.burntCalories")}
                    header={parseFloat(
                        params.burntCalories.toFixed(2),
                    ).toString()}
                />
            </Section>
            <GapView height={10} />
            <BetterText fontSize={20} fontWeight="Regular">
                {t("globals.interaction.wellDoneBud")}
            </BetterText>
            <GapView height={10} />
            <BetterButton
                action={() => {
                    router.replace(Routes.MAIN.HOME);
                }}
                style="ACE"
                buttonText={t("globals.interaction.goAhead")}
                buttonHint="Go home"
            />
        </>
    );
}
