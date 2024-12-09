import BetterButton from "@/components/interaction/better_button";
import Loading from "@/components/static/loading";
import Division from "@/components/ui/sections/division";
import { logToConsole } from "@/toolkit/debug/console";
import React, { useEffect, useState } from "react";
import StoredItemNames from "@/constants/stored_item_names";
import AsyncStorage from "expo-sqlite/kv-store";
import { useTranslation } from "react-i18next";
import { ErrorUserData, OrchestrateUserData, updateBrm5 } from "@/toolkit/user";
import { FullProfile } from "@/types/user";
import ROUTES from "@/constants/routes";
import { router } from "expo-router";
import GapView from "@/components/ui/gap_view";
import Section from "@/components/ui/sections/section";
import PageEnd from "@/components/static/page_end";
import TopBar from "@/components/navigation/top_bar";
import { cancelScheduledNotifications } from "@/hooks/use_notification";
import { ShowToast } from "@/toolkit/android";

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
                logToConsole(`Error orchestrating user data: ${e}`, "error");
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
            ShowToast(
                userData.language === "es"
                    ? "¡Hecho! Reinicia la app para aplicar tus cambios."
                    : "Done! Restart the app to apply your changes.",
            );
        } catch (e) {
            logToConsole(`Error changing language: ${e}`, "error");
        }
    }

    async function changeNotifications(): Promise<void> {
        try {
            if (!userData) throw new Error("Why is userData (still) null?");
            userData.wantsNotifications = !userData.wantsNotifications;
            if (userData.wantsNotifications === false) {
                await cancelScheduledNotifications(t, true);
            } else {
                ShowToast(
                    t("pages.settings.preferences.notifications.flow.enabled"),
                );
            }
            await AsyncStorage.setItem(
                StoredItemNames.userData,
                JSON.stringify(userData),
            );
            router.replace(ROUTES.MAIN.SETTINGS.SETTINGS_PAGE);
        } catch (e) {
            logToConsole(`Error toggling notifications: ${e}`, "error");
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
                        action={changeLanguage}
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
                        action={changeNotifications}
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
                            router.push(ROUTES.DEV_INTERFACE.EXPERIMENTS)
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
                        action={() => router.push(ROUTES.DEV_INTERFACE.HOME)}
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
                        action={async () => {
                            await updateBrm5(true, t);
                        }}
                    />
                </Division>
            </Section>
            <PageEnd includeText={true} size="tiny" />
        </>
    );
}
