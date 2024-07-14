import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/components/translations/en.json"
import es from "@/components/translations/es.json"

const resources = { en, es }

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
