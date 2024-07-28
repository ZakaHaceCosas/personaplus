import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';

import enTranslations from '@/src/translations/en.json';
import esTranslations from '@/src/translations/es.json';

// Define las traducciones disponibles
const resources = {
    en: { translation: enTranslations },
    es: { translation: esTranslations },
};

// Función para inicializar i18n
const initializeI18n = async () => {
    const locales = getLocales()
    // Obtén el idioma guardado en AsyncStorage, o si no, el idioma por defecto del usuario
    const savedLanguage = await AsyncStorage.getItem('language') || locales.at(0)?.languageCode;
    const defaultLanguage = (savedLanguage === "es" || savedLanguage === "en") ? savedLanguage : "en"; // Si el idioma por defecto del usuario es un idioma soportado, bien. Si no, inglés.

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
