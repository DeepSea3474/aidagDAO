"use client";

import { useRouter } from "next/router";

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, locales, pathname, query, asPath } = router;

  const changeLanguage = (lng: string) => {
    router.push({ pathname, query }, asPath, { locale: lng });
  };

  return (
    <div className="flex gap-2">
      {locales?.map((lng) => (
        <button
          key={lng}
          onClick={() => changeLanguage(lng)}
          className={`px-3 py-1 rounded ${
            lng === locale ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;

