import { router } from "expo-router";
import { logToConsole } from "@/toolkit/debug/Console";
import ROUTES from "@/constants/Routes";
import { URLValues } from "@/constants/Urls";
import { Linking } from "react-native";

/** Goes back safely. This means, if an error happens and the app can't go back, instead of getting stuck, it will go home. */
export function SafelyGoBack(target?: string): void {
    try {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace(target ?? ROUTES.MAIN.HOME);
        }
    } catch (e) {
        logToConsole("Error when (safely) going back!" + e, "error");
        throw e;
    }
}

/** Safely opens a URL. */
export async function SafelyOpenUrl(url: URLValues): Promise<void> {
    try {
        if (await Linking.canOpenURL(url)) {
            await Linking.openURL(url);
        } else {
            logToConsole(`Huh? Can't open the ${url} URL. What's up?`, "error");
        }
    } catch (e) {
        logToConsole(
            `Bruh. An error occurred trying to open an URL: ${e}`,
            "error",
        );
        throw e;
    }
}
