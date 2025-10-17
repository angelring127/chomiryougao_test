"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import type { Gender } from "@/types/seasoning";
import { Lock } from "lucide-react";

export function GenderToggle() {
  const { gender, setGender } = useAppStore();
  const { t } = useI18n();

  const genders: { value: Gender; iconSrc: string; disabled: boolean }[] = [
    {
      value: "male",
      iconSrc: "/images/sexs/gender01_male.png",
      disabled: false,
    },
    {
      value: "female",
      iconSrc: "/images/sexs/gender02_female.png",
      disabled: false,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {t("gender.select")}:
      </span>
      <div className="flex gap-2 bg-muted rounded-md p-2">
        {genders.map((g) => {
          return (
            <button
              key={g.value}
              onClick={() => !g.disabled && setGender(g.value)}
              disabled={g.disabled}
              className={`px-4 py-2 text-base rounded-md transition-colors flex items-center gap-2 ${
                gender === g.value
                  ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary"
                  : g.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-background"
              }`}
              aria-label={`Select ${g.value}${g.disabled ? " (disabled)" : ""}`}
              aria-pressed={gender === g.value}
              title={g.disabled ? t("gender.comingSoon") : undefined}
            >
              <img
                src={g.iconSrc}
                alt={t(`gender.${g.value}`)}
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
              />
              <span className="font-medium">{t(`gender.${g.value}`)}</span>
              {g.disabled && <Lock className="h-3 w-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
