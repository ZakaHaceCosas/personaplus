import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import type { FullProfile } from "@/types/user";
import BetterButton from "@/components/interaction/better_button";
import { ErrorUserData, OrchestrateUserData } from "@/toolkit/user";
import { router } from "expo-router";
import { Routes } from "@/constants/routes";
import { useEffect, useState } from "react";
import Section from "@/components/ui/sections/section";
import Division from "@/components/ui/sections/division";
import Loading from "@/components/static/loading";
import GapView from "@/components/ui/gap_view";
import PageEnd from "@/components/static/page_end";
import TopBar from "@/components/navigation/top_bar";
import FontSizes from "@/constants/font_sizes";
import { Alert, StyleSheet, View } from "react-native";
import { version as currentVersion } from "../../package.json";
import URLs from "@/constants/urls";
import semver from "semver";
import { SafelyOpenUrl } from "@/toolkit/routing";
import { ShowToast } from "@/toolkit/android";
import IconView from "@/components/ui/icon_view";
import Colors from "@/constants/colors";

const styles = StyleSheet.create({
    iconView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
});

export default function HomeScreen(): ReactElement {
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

    interface Release {
        tag_name: string;
        prerelease: boolean;
        assets: { browser_download_url: string; name: string }[];
        html_url: string;
    }

    /**
     * Checks for updates. Shows a modal if you're not up to date, prompting to update.
     *
     * @async
     * @returns {Promise<void>}
     */
    async function CheckForUpdates(): Promise<void> {
        try {
            ShowToast(t("pages.profile.divisions.update.updateFlow.checking"));
            const response = await fetch(URLs.releasesApi);
            if (!response.ok) {
                console.error(
                    `Failed to fetch releases (status ${response.status})`,
                );
                return;
            }
            const releases: Release[] = await response.json(); // gets releases

            // sorts releases by date and gets the most recent
            const latestRelease: Release | undefined = releases
                .filter((release: Release): string | null =>
                    semver.valid(release.tag_name),
                ) // validate tags
                .sort((a: Release, b: Release): 0 | 1 | -1 =>
                    semver.compare(b.tag_name, a.tag_name),
                )[0];

            if (!latestRelease || !latestRelease.assets[0]) {
                console.error("No latest release.");
                return;
            }

            const latestVersion: string = latestRelease.tag_name; // gets the tagname
            const latestUrl: string =
                latestRelease.assets[0].browser_download_url;

            if (semver.gt(latestVersion, currentVersion)) {
                // if it's not the same as your current version, you're not up to date!
                Alert.alert(
                    t(
                        "pages.profile.divisions.update.updateFlow.updateAvailable",
                    ),
                    t(
                        "pages.profile.divisions.update.updateFlow.updateAvailableText",
                        {
                            latestVersion: latestVersion,
                        },
                    ),
                    [
                        {
                            text: t(
                                "pages.profile.divisions.update.updateFlow.buttons.update",
                            ),
                            style: "default",
                            onPress: async (): Promise<void> =>
                                await SafelyOpenUrl(latestUrl), // update will download the APK from the browser
                        },
                        {
                            text: t(
                                "pages.profile.divisions.update.updateFlow.buttons.changelog",
                            ),
                            onPress: async (): Promise<void> =>
                                await SafelyOpenUrl(URLs.latestChangelog), // changelog will just open the page so you see whats new
                        },
                        {
                            text: t("globals.nevermind"),
                            style: "destructive",
                            onPress: (): void => {}, // closes
                        },
                    ],
                );
            } else {
                ShowToast(
                    t("pages.profile.divisions.update.updateFlow.upToDate"),
                );
            }
        } catch (e) {
            console.error(`Error checking for updates: ${e}`);
            ShowToast(t("pages.profile.divisions.update.updateFlow.cantCheck"));
        }
    }

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
                    <View style={styles.iconView}>
                        <IconView
                            name="face"
                            size={FontSizes.REGULAR}
                            color={Colors.BASIC.WHITE}
                            text={t("pages.profile.data.age", {
                                age: userData.age,
                            })}
                        />
                        <GapView width={10} />
                        <IconView
                            name="scale"
                            size={FontSizes.REGULAR}
                            color={Colors.BASIC.WHITE}
                            text={t("pages.profile.data.weight", {
                                weight: userData.weight,
                            })}
                        />
                        <GapView width={10} />
                        <IconView
                            name="height"
                            size={FontSizes.REGULAR}
                            color={Colors.BASIC.WHITE}
                            text={t("pages.profile.data.height", {
                                height: userData.height,
                            })}
                        />
                    </View>
                    <GapView height={10} />
                    <BetterButton
                        buttonText={t(
                            "pages.profile.interactions.updateProfile.text",
                        )}
                        buttonHint={t(
                            "pages.profile.interactions.updateProfile.hint",
                        )}
                        style="DEFAULT"
                        action={(): void =>
                            router.push(Routes.MAIN.SETTINGS.UPDATE_PROFILE)
                        }
                    />
                </Division>
            </Section>
            <GapView height={20} />
            <Section kind="Settings">
                <Division
                    header={t("pages.profile.divisions.settings.header")}
                    subHeader={t("pages.profile.divisions.settings.subheader")}
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText={t(
                            "pages.profile.divisions.settings.action.text",
                        )}
                        buttonHint={t(
                            "pages.profile.divisions.settings.action.hint",
                        )}
                        style="ACE"
                        action={(): void => {
                            router.push(Routes.MAIN.SETTINGS.SETTINGS_PAGE);
                        }}
                    />
                </Division>
            </Section>
            <GapView height={20} />
            <Section kind="About">
                <Division
                    header={t("pages.profile.divisions.update.header")}
                    subHeader={t("pages.profile.divisions.update.subheader", {
                        version: currentVersion,
                    })}
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText={t(
                            "pages.profile.divisions.update.action.text",
                        )}
                        buttonHint={t(
                            "pages.profile.divisions.update.action.hint",
                        )}
                        style="DEFAULT"
                        action={async (): Promise<void> => {
                            await CheckForUpdates();
                        }}
                    />
                </Division>
                <Division
                    preHeader={t("globals.about")}
                    header={t("pages.profile.divisions.about.header")}
                    subHeader={t("pages.profile.divisions.about.subheader")}
                    /* subHeader="Find out who's behind the app you're (hopefully!) enjoying right now." */
                    direction="vertical"
                    gap={0}
                >
                    <BetterButton
                        buttonText={t(
                            "pages.profile.divisions.about.action.text",
                        )}
                        buttonHint={t(
                            "pages.profile.divisions.about.action.hint",
                        )}
                        style="DEFAULT"
                        action={(): void => {
                            router.push(Routes.ABOUT.ABOUT_PAGE);
                        }}
                    />
                </Division>
            </Section>
            <PageEnd includeText={true} />
        </>
    );
}
