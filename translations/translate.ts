import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
// somehow unused: import { getLocales } from 'expo-localization';

import enTranslations from '@/translations/en.json';
import esTranslations from '@/translations/es.json';
import { FullProfile } from '@/types/User';
import { logToConsole } from '@/toolkit/debug/Console';

// Define las traducciones disponibles
const resources = {
    en: { translation: enTranslations },
    es: { translation: esTranslations },
};

export async function getDefaultLocale(): Promise<"es" | "en"> {
    try {
        // const locales = getLocales();     (unused, for whatever reason)
        const savedData = await AsyncStorage.getItem('userData');
        let savedDataValue: FullProfile | null = null;

        try {
            if (savedData) {
                savedDataValue = JSON.parse(savedData) as FullProfile;
            } else {
                logToConsole("Warning! No language data. Might fallback to english.", "warn")
            }
        } catch (e) {
            logToConsole("Error parsing JSON from AsyncStorage: " + e, "warn");
        }

        const savedLanguageValue = savedDataValue?.language ?? "es"; // TODO: change to "en" upon release
        const defaultLanguage: "es" | "en" = (savedLanguageValue === "es" || savedLanguageValue === "en") ? savedLanguageValue : "en";

        return defaultLanguage;
    } catch (e) {
        logToConsole("Error handling getDefaultLocale(): " + e + ". This is a warning and not an error because it doesn't have severe side effects. Fallback to English.", "warn")
        return "en"
    }
}

// Función para inicializar i18n
const initializeI18n = async () => {
    const defaultLanguage = await getDefaultLocale()

    // Inicializa i18n con los recursos y el idioma detectado
    i18n.use(initReactI18next).init({
        resources,
        lng: defaultLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        compatibilityJSON: 'v3',
    });
};

// Llama a la función para inicializar i18n
initializeI18n();

// Función para cambiar el idioma y guardarlo en AsyncStorage
const changeLanguage = async (language: string) => {
    await AsyncStorage.setItem('language', language);
    i18n.changeLanguage(language);
};

export default i18n;
export { changeLanguage };
