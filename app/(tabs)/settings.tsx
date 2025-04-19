/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/app/(tabs)/settings.tsx
 * Basically: Settings, for users to tweak the app to their liking.
 *
 * <=============================================================================>
 */

import BetterButton from "@/components/interaction/better_button";
import Loading from "@/components/static/loading";
import Division from "@/components/ui/sections/division";
import React, { useEffect, useState } from "react";
import StoredItemNames from "@/constants/stored_item_names";
import AsyncStorage from "expo-sqlite/kv-store";
import { useTranslation } from "react-i18next";
import { ErrorUserData, OrchestrateUserData, updateBrm5 } from "@/toolkit/user";
import { FullProfile } from "@/types/user";
import { Routes } from "@/constants/routes";
import { router } from "expo-router";
import GapView from "@/components/ui/gap_view";
import Section from "@/components/ui/sections/section";
import PageEnd from "@/components/static/page_end";
import TopBar from "@/components/navigation/top_bar";
import { cancelScheduledNotifications } from "@/hooks/use_notification";
import { ShowToast } from "@/toolkit/android";
import { ChangeLanguage } from "@/translations/translate";

export default function Settings() {
    const [userData, setUserData] = useState<FullProfile>(ErrorUserData);
    const [loading, setLoading] = useState<boolean>(true);

    const { t } = useTranslation();

    useEffect((): void => {
        async function handler(): Promise<void> {
            const profile: FullProfile = await OrchestrateUserData();
            setUserData(profile);
            setLoading(false);
        }

        handler();
    }, []);

    async function changeNotifications(): Promise<void> {
        try {
            if (!userData) throw new Error("Why is userData (still) null?");
            userData.wantsNotifications = !userData.wantsNotifications;
            await AsyncStorage.setItem(
                StoredItemNames.userData,
                JSON.stringify(userData),
            );
            switch (userData.wantsNotifications) {
                case false:
                    await cancelScheduledNotifications(t, true);
                    break;
                case true:
                    ShowToast(
                        t(
                            "pages.settings.preferences.notifications.flow.enabled",
                        ),
                    );
                    break;
            }
            router.replace(Routes.MAIN.PROFILE);
            router.replace(Routes.MAIN.SETTINGS.SETTINGS_PAGE);
        } catch (e) {
            console.error(`Error toggling notifications: ${e}`);
        }
    }

    if (loading) return <Loading />;

    return (
        <>
            <TopBar
                includeBackButton={true}
                header={t("globals.settings")}
                subHeader={t("pages.settings.subheader")}
            />
            <Section kind="Settings">
                <Division
                    preHeader={t("pages.settings.preferences.word")}
                    header={t("pages.settings.preferences.language.header")}
                    subHeader={t(
                        "pages.settings.preferences.language.subheader",
                        { lang: t(`globals.languages.${userData.language}`) },
                    )}
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText={t(
                            "pages.settings.preferences.language.action.text",
                        )}
                        buttonHint={t(
                            "pages.settings.preferences.language.action.hint",
                        )}
                        style="DEFAULT"
                        action={async (): Promise<void> =>
                            await ChangeLanguage(
                                userData,
                                (userData.language =
                                    userData.language === "es" ? "en" : "es"),
                            )
                        }
                    />
                </Division>
                <Division
                    preHeader={t("pages.settings.preferences.word")}
                    header={t(
                        "pages.settings.preferences.notifications.header",
                    )}
                    subHeader={t(
                        "pages.settings.preferences.notifications.subheader",
                    )}
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText={t(
                            `pages.settings.preferences.notifications.action.${userData.wantsNotifications}Text`,
                        )}
                        buttonHint={t(
                            `pages.settings.preferences.notifications.action.${userData.wantsNotifications}Hint`,
                        )}
                        style={userData.wantsNotifications ? "DEFAULT" : "ACE"}
                        action={async (): Promise<void> => {
                            await changeNotifications();
                        }}
                    />
                </Division>
            </Section>
            <GapView height={20} />
            <Section kind="Developer">
                <Division
                    preHeader={t("pages.settings.advanced.word")}
                    header={t("pages.settings.advanced.experiments.header")}
                    subHeader={t(
                        "pages.settings.advanced.experiments.subheader",
                    )}
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText={t(
                            "pages.settings.advanced.experiments.action.text",
                        )}
                        buttonHint={t(
                            "pages.settings.advanced.experiments.action.hint",
                        )}
                        style="HMM"
                        action={() =>
                            router.push(Routes.DEV_INTERFACE.EXPERIMENTS)
                        }
                    />
                </Division>
                <Division
                    preHeader={t("pages.settings.advanced.word")}
                    header={t("pages.settings.advanced.devInterface.header")}
                    subHeader={t(
                        "pages.settings.advanced.devInterface.subheader",
                    )}
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText={t(
                            "pages.settings.advanced.devInterface.action.text",
                        )}
                        buttonHint={t(
                            "pages.settings.advanced.devInterface.action.hint",
                        )}
                        style="HMM"
                        action={() => router.push(Routes.DEV_INTERFACE.HOME)}
                    />
                </Division>
            </Section>
            <GapView height={20} />
            <Section kind="Danger">
                <Division
                    preHeader={t("pages.settings.dangerous.word")}
                    header={t("pages.settings.dangerous.resetApp.header")}
                    subHeader={t("pages.settings.dangerous.resetApp.subheader")}
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText={t(
                            "pages.settings.dangerous.resetApp.action.text",
                        )}
                        buttonHint={t(
                            "pages.settings.dangerous.resetApp.action.hint",
                        )}
                        style="WOR"
                        action={async (): Promise<void> => {
                            await updateBrm5(t);
                        }}
                    />
                </Division>
            </Section>
            <PageEnd includeText={true} size="tiny" />
        </>
    );
}
