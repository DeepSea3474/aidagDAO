'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export const LANGS = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
] as const;

export type LangCode = typeof LANGS[number]['code'];

import { TRANSLATIONS, TranslationKey } from './translations';
import { EXT_TRANSLATIONS, ExtKey } from './translations-ext';

export type AnyKey = TranslationKey | ExtKey;

interface Ctx {
  lang: LangCode;
  setLang: (c: LangCode) => void;
  t: (key: AnyKey) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('aidag_lang') as LangCode | null;
      if (saved && LANGS.some(l => l.code === saved)) setLangState(saved);
    } catch {}
    const onChange = (e: Event) => {
      const code = (e as CustomEvent).detail as LangCode | undefined;
      if (code && LANGS.some(l => l.code === code)) setLangState(code);
    };
    window.addEventListener('aidag-lang-change', onChange as EventListener);
    return () => window.removeEventListener('aidag-lang-change', onChange as EventListener);
  }, []);

  const setLang = (code: LangCode) => {
    setLangState(code);
    try { localStorage.setItem('aidag_lang', code); } catch {}
    window.dispatchEvent(new CustomEvent('aidag-lang-change', { detail: code }));
    if (typeof document !== 'undefined') {
      document.documentElement.lang = code;
      document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    }
  };

  const t = (key: AnyKey): string => {
    const base = TRANSLATIONS[lang] || TRANSLATIONS.en;
    const baseEn = TRANSLATIONS.en;
    const ext = EXT_TRANSLATIONS[lang] || {};
    const extEn = EXT_TRANSLATIONS.en || {};
    const k = key as string;
    return (ext as Record<string, string>)[k]
      ?? (base as Record<string, string>)[k]
      ?? (extEn as Record<string, string>)[k]
      ?? (baseEn as Record<string, string>)[k]
      ?? k;
  };

  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: 'en' as LangCode,
      setLang: () => {},
      t: (k: AnyKey) => {
        const kk = k as string;
        return ((EXT_TRANSLATIONS.en as Record<string, string>)[kk]
          ?? (TRANSLATIONS.en as Record<string, string>)[kk]
          ?? kk);
      },
      dir: 'ltr' as const,
    };
  }
  return ctx;
}

export function useT() {
  return useLang().t;
}
