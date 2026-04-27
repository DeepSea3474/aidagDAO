import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    en: { translation: { welcome: "SoulwareAI Dashboard", presale: "LSC Presale", dao: "Governance" } },
    tr: { translation: { welcome: "SoulwareAI Paneli", presale: "LSC Ön Satış", dao: "Yönetişim" } },
    de: { translation: { welcome: "Armaturenbrett", presale: "Vorverkauf", dao: "Regierung" } },
    fr: { translation: { welcome: "Tableau de Bord", presale: "Prévente", dao: "Gouvernance" } },
    ru: { translation: { welcome: "Панель управления", presale: "Предпродажа", dao: "Управление" } },
    zh: { translation: { welcome: "仪表板", presale: "预售", dao: "治理" } },
    es: { translation: { welcome: "Panel de Control", presale: "Preventa", dao: "Gobernanza" } },
    ar: { translation: { welcome: "لوحة القيادة", presale: "ما قبل البيع", dao: "الحوكمة" } },
    ja: { translation: { welcome: "ダッシュボード", presale: "プレセール", dao: "ガバナンス" } },
    hi: { translation: { welcome: "डैशबोर्ड", presale: "पूर्व बिक्री", dao: "शासन" } }
  },
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});
export default i18n;
