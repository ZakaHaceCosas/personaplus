/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/translations/translate.ts
 * Basically: Main translation handler.
 *
 * <=============================================================================>
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "expo-sqlite/kv-store";
import { getLocales, Locale } from "expo-localization";
import enTranslations from "@/translations/en.json";
import esTranslations from "@/translations/es.json";
import { FullProfile } from "@/types/user";
import { logToConsole } from "@/toolkit/console";
import StoredItemNames from "@/constants/stored_item_names";
import { OrchestrateUserData, ValidateUserData } from "@/toolkit/user";

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
        const locales: Locale[] = getLocales();
        const savedData: FullProfile = await OrchestrateUserData();

        if (ValidateUserData(savedData, "Full") === false) {
            const locale: string | null = locales[0].languageCode;
            return locale === "en" || locale === "es" ? locale : "en";
        }

        const savedLanguage: "es" | "en" = savedData.language;

        return savedLanguage;
    } catch (e) {
        logToConsole(
            `Error handling getDefaultLocale(): ${e}. This is a warning and not an error because it doesn't have severe side effects. Fallback to English.`,
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
        logToConsole(`Error with i18n init: ${e}`, "error", {
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
        const userData: FullProfile = await OrchestrateUserData();
        const newUserData: FullProfile = {
            ...userData,
            language,
        };
        await AsyncStorage.setItem(
            StoredItemNames.userData,
            JSON.stringify(newUserData),
        );
        i18n.changeLanguage(language);
        return 0;
    } catch (e) {
        logToConsole(
            `Error changing language: ${e}`,
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
