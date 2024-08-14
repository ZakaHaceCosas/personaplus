import { Alert, Platform, ToastAndroid, Linking } from "react-native";
import { termLog } from "@/src/toolkit/debug/console";
import { TFunction } from "i18next";
import { version } from "@/package.json";
import { PreAppVersion } from "@/src/types/Versioning";

interface Release {
    tag_name: string;
    prerelease: boolean;
    assets: { browser_download_url: string; name: string }[];
    html_url: string;
}

export default async function checkForUpdates(t: TFunction) {
    // Current app version
    const currentVersion: string = version as PreAppVersion;
    // FORMAT: X.X.X-R5-bX
    // e.g. 0.0.1-R5-b25

    try {
        const response = await fetch(
            "https://api.github.com/repos/ZakaHaceCosas/personaplus/releases"
        ); // checks github
        if (!response.ok) {
            termLog(
                `Failed to fetch releases (status ${response.status})`,
                "error"
            );
            throw new Error(
                `Failed to fetch releases (status ${response.status})`
            );
        }
        const releases: Release[] = await response.json(); // gets releases

        // sorts releases by date and gets the most recent
        const latestRelease = releases.sort(
            (a, b) => new Date(b.tag_name).getTime() -
                new Date(a.tag_name).getTime()
        )[0];

        if (latestRelease) {
            const latestVersion = latestRelease.tag_name; // gets the tagname
            termLog(`Latest version: ${latestVersion}`, "log");

            if (latestVersion !== currentVersion) {
                // if it's not the same as your current version, you're not up to date!
                Alert.alert(
                    t("page_profile.updates.update_flow.update_available"),
                    t(
                        "page_profile.updates.update_flow.update_available_text",
                        { latestVersion: latestVersion }
                    ),
                    [
                        {
                            text: t(
                                "page_profile.updates.update_flow.buttons.update"
                            ),
                            style: "default",
                            onPress: () => Linking.openURL(
                                latestRelease.assets.length > 0
                                    ? latestRelease.assets[0]
                                        .browser_download_url
                                    : ""
                            ), // update will download the APK from the browser
                        },
                        {
                            text: t(
                                "page_profile.updates.update_flow.buttons.changelog"
                            ),
                            onPress: () => Linking.openURL(
                                latestRelease.html_url || ""
                            ), // changelog will just open the page so you see whats new
                        },
                        {
                            text: t("globals.nevermind"),
                            style: "destructive",
                            onPress: () => { }, // closes
                        },
                    ]
                );
            } else {
                if (Platform.OS === "android") {
                    ToastAndroid.show(
                        t(
                            "page_profile.updates.update_flow.youre_up_to_date"
                        ),
                        ToastAndroid.SHORT
                    );
                }
            }
        } else {
            if (Platform.OS === "android") {
                ToastAndroid.show(
                    t(
                        "page_profile.updates.update_flow.youre_maybe_up_to_date"
                    ),
                    ToastAndroid.SHORT
                );
            }
        }
    } catch (e) {
        termLog("Error checking for update: " + e, "error");
        if (Platform.OS === "android") {
            ToastAndroid.show(
                t("page_profile.updates.update_flow.failed_to_check"),
                ToastAndroid.SHORT
            );
        }
    }
}
