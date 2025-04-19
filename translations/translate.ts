/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
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
import StoredItemNames from "@/constants/stored_item_names";
import { OrchestrateUserData, ValidateUserData } from "@/toolkit/user";
import { ShowToast } from "@/toolkit/android";

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
            const locale: string | null | undefined = locales[0]?.languageCode;
            return locale === "es" ? "es" : "en";
        }

        const savedLanguage: "es" | "en" = savedData.language ?? "en";

        return savedLanguage;
    } catch (e) {
        console.warn(
            `Error handling getDefaultLocale(): ${e}. This is a warning and not an error because it doesn't have severe side effects. Fallback to English.`,
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
        console.error(`Error with i18n init: ${e}`, {
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
 * @param {FullProfile} userData User's data.
 * @param {("es" | "en")} language The language you want to set.
 * @returns {Promise<0 | 1>} 0 if success, 1 if failure.
 */
async function ChangeLanguage(
    userData: FullProfile,
    language: "es" | "en",
): Promise<void> {
    try {
        if (!userData) throw new Error("Why is userData (still) null?");
        const newUserData: FullProfile = {
            ...userData,
            language,
        };
        await AsyncStorage.setItem(
            StoredItemNames.userData,
            JSON.stringify(newUserData),
        );
        await i18n.changeLanguage(language);
        ShowToast(
            userData.language === "es"
                ? "¡Hecho! Reinicia la app para aplicar tus cambios."
                : "Done! Restart the app to apply your changes.",
        );
        return;
    } catch (e) {
        throw new Error(
            `Error changing language: ${e}\n${{
                function: "changeLanguage",
                isHandler: false,
                location: "@/translations/translate.ts",
            }}`,
        );
    }
}

export default i18n;
export { ChangeLanguage };
