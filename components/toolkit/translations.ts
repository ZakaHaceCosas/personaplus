import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from '@/components/translations/en.json';
import esTranslations from '@/components/translations/es.json';

const resources = {
    en: { translation: enTranslations },
    es: { translation: esTranslations },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        compatibilityJSON: 'v3',
    });

const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
};

export default i18n;
export { changeLanguage };
