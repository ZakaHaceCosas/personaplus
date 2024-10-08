import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
// somehow unused: import { getLocales } from 'expo-localization';
import enTranslations from "@/translations/en.json";
import esTranslations from "@/translations/es.json";
import { FullProfile } from "@/types/User";
import { logToConsole } from "@/toolkit/debug/Console";
import StoredItemNames from "@/constants/StoredItemNames";

// Defines available translates
const resources = {
    en: { translation: enTranslations },
    es: { translation: esTranslations },
};

/**
 * Gets the locale that is currently being used, or the default one if none.
 *
 * @export
 * @async
 * @returns {Promise<"es" | "en">}
 */
export async function getDefaultLocale(): Promise<"es" | "en"> {
    try {
        // const locales = getLocales();     (unused, for whatever reason)
        const savedData: string | null = await AsyncStorage.getItem(
            StoredItemNames.userData,
        );
        let savedDataValue: FullProfile | null = null;

        try {
            if (savedData) {
                savedDataValue = JSON.parse(savedData) as FullProfile;
            } else {
                logToConsole(
                    "Warning! No language data. Might fallback to english.",
                    "warn",
                );
            }
        } catch (e) {
            logToConsole(
                "Error parsing JSON from AsyncStorage: " + e,
                "warn",
                {
                    location: "@/translations/translate.ts",
                    isHandler: false,
                    function:
                        "getDefaultLocale() @ try-catch #1 @ sub try-catch #1",
                },
                false,
            );
        }

        const savedLanguageValue: "es" | "en" =
            savedDataValue?.language ?? "es"; // TODO: change to "en" upon release
        const defaultLanguage: "es" | "en" =
            savedLanguageValue === "es" || savedLanguageValue === "en" ?
                savedLanguageValue
                : "en";

        return defaultLanguage;
    } catch (e) {
        logToConsole(
            "Error handling getDefaultLocale(): " +
            e +
            ". This is a warning and not an error because it doesn't have severe side effects. Fallback to English.",
            "warn",
            {
                location: "@/translations/translate.ts",
                isHandler: false,
                function: "getDefaultLocale() @ try-catch #1",
            },
        );
        return "en";
    }
}

/**
 * Function to initialize i18n
 *
 * @async
 * @returns {Promise<void>}
 */
async function initializeI18n(): Promise<void> {
    const defaultLanguage: "es" | "en" = await getDefaultLocale();

    // try to init i18n with detected language and resources
    try {
        i18n.use(initReactI18next).init({
            resources,
            lng: defaultLanguage,
            fallbackLng: "en",
            interpolation: {
                escapeValue: false,
            },
            compatibilityJSON: "v3",
        });
    } catch (e) {
        logToConsole("Error with i18n init: " + e, "error", {
            location: "@/translations/translate.ts",
            isHandler: false,
            function: "initializeI18n()",
        });
    }
}

initializeI18n();

/**
 * Function to change the language and save it to the AsyncStorage. **Async function.**
 *
 * @async
 * @param {("es" | "en")} language The language you want to set.
 * @returns {Promise<0 | 1>} 0 if success, 1 if failure.
 */
async function changeLanguage(language: "es" | "en"): Promise<0 | 1> {
    try {
        const savedData: string | null = await AsyncStorage.getItem(
            StoredItemNames.userData,
        );
        if (savedData === null) {
            throw new Error("Why is userData null?");
        }
        const userData: FullProfile = JSON.parse(savedData);
        await AsyncStorage.setItem(
            StoredItemNames.userData,
            JSON.stringify({ ...userData, language }),
        );
        i18n.changeLanguage(language);
        return 0;
    } catch (e) {
        logToConsole(
            "Error changing language: " + e,
            "error",
            {
                function: "changeLanguage",
                isHandler: false,
                location: "@/translations/translate.ts",
            },
            false,
        );
        return 1;
    }
}

export default i18n;
export { changeLanguage };
