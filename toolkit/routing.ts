import { router } from "expo-router";
import { Routes } from "@/constants/routes";
import { URLValues } from "@/constants/urls";
import { Linking } from "react-native";

/** Goes back safely. This means, if an error happens and the app can't go back, instead of getting stuck, it will go home. */
export function SafelyGoBack(target?: string): void {
    try {
        if (router.canGoBack()) {
            router.back();
            return;
        } else {
            router.replace(target ?? Routes.MAIN.HOME);
            return;
        }
    } catch (e) {
        console.error(`Error (safely) going back! ${e}`);
        return;
    }
}

/** Safely opens a URL. Can be a `URLValues` (app related URL) or any other string. */
export async function SafelyOpenUrl(url: URLValues | string): Promise<void> {
    // note: in R5 i remember Álvaro using useCallback for this
    // i'll see if i add that later on
    try {
        if (await Linking.canOpenURL(url)) {
            await Linking.openURL(url);
        } else {
            throw new Error(`Huh? Can't open the ${url} URL. What's up?`);
        }
    } catch (e) {
        throw new Error(`Bruh. An error occurred trying to open an URL: ${e}`);
    }
}
