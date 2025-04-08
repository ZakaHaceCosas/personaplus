import { router } from "expo-router";
import { Routes } from "@/constants/routes";
import { URLValues } from "@/constants/urls";
import { Linking } from "react-native";

/** Goes back safely. This means, if an error happens and the app can't go back, instead of getting stuck, it will go home. */
export function SafelyGoBack(target?: string): void {
    try {
        if (!router.canGoBack()) {
            router.replace(target ?? Routes.MAIN.HOME);
            return;
        }
        router.back();
        return;
    } catch (e) {
        console.error(`Error (safely) going back! ${e}`);
        router.replace(Routes.MAIN.HOME);
        return;
    }
}

/** Safely opens a URL. Can be a `URLValues` (app related URL) or any other string. */
export async function SafelyOpenUrl(url: URLValues | string): Promise<void> {
    try {
        await Linking.openURL(url);
    } catch (e) {
        throw new Error(`Can't open ${url}: ${e}`);
    }
}
