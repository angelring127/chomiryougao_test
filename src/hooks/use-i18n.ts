"use client";

import { useAppStore } from "@/store/app-store";
import type { Language, Translation } from "@/types/seasoning";
import { useEffect } from "react";

import jaTranslations from "@/../i18n/ja.json";
import koTranslations from "@/../i18n/ko.json";
import enTranslations from "@/../i18n/en.json";
import zhTranslations from "@/../i18n/zh.json";

const translations: Record<Language, Translation> = {
  ja: jaTranslations,
  ko: koTranslations,
  en: enTranslations,
  zh: zhTranslations,
};

export function useI18n() {
  const { language, setLanguage } = useAppStore();

  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    const supportedLangs: Language[] = ["ja", "ko", "en", "zh"];

    let detectedLang: Language = "ja";
    if (browserLang.startsWith("zh")) {
      detectedLang = "zh";
    } else {
      const langCode = browserLang.split("-")[0] as Language;
      if (supportedLangs.includes(langCode)) {
        detectedLang = langCode;
      }
    }

    if (!language) {
      setLanguage(detectedLang);
    }
  }, [language, setLanguage]);

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split(".");
    let value: any = translations[language || "ja"];

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    if (params) {
      return Object.entries(params).reduce(
        (acc, [paramKey, paramValue]) =>
          acc.replace(new RegExp(`{{${paramKey}}}`, "g"), paramValue),
        value
      );
    }

    return value;
  };

  return {
    language: language || "ja",
    setLanguage,
    t,
  };
}
