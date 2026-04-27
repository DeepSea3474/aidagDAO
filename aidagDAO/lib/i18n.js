import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../public/locales/en/common.json";
import tr from "../public/locales/tr/common.json";
import de from "../public/locales/de/common.json";
import fr from "../public/locales/fr/common.json";
import es from "../public/locales/es/common.json";
import pt from "../public/locales/pt/common.json";
import ru from "../public/locales/ru/common.json";
import zh from "../public/locales/zh/common.json";
import ar from "../public/locales/ar/common.json";
import ja from "../public/locales/ja/common.json";

export const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "ja", name: "日本語", flag: "🇯🇵" }
];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
    de: { translation: de },
    fr: { translation: fr },
    es: { translation: es },
    pt: { translation: pt },
    ru: { translation: ru },
    zh: { translation: zh },
    ar: { translation: ar },
    ja: { translation: ja }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
