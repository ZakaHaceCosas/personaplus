import { router } from "expo-router";
import { logToConsole } from "@/toolkit/debug/Console";

/** Goes back safely. This means, if an error happens and the app can't go back, instead of getting stuck, it will go home. */
export default function SafelyGoBack(): void {
    try {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/");
        }
    } catch (e) {
        logToConsole("Error when (safely) going back!" + e, "error");
        throw e;
    }
}
