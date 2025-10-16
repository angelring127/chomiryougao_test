"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import type { Gender } from "@/types/seasoning";
import { User, UserCheck, Lock } from "lucide-react";

export function GenderToggle() {
  const { gender, setGender } = useAppStore();
  const { t } = useI18n();

  const genders: { value: Gender; icon: typeof User; disabled: boolean }[] = [
    { value: "male", icon: User, disabled: false },
    { value: "female", icon: UserCheck, disabled: true },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {t("gender.select")}:
      </span>
      <div className="flex gap-1 bg-muted rounded-md p-1">
        {genders.map((g) => {
          const Icon = g.icon;
          return (
            <button
              key={g.value}
              onClick={() => !g.disabled && setGender(g.value)}
              disabled={g.disabled}
              className={`px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-1.5 ${
                gender === g.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : g.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-background"
              }`}
              aria-label={`Select ${g.value}${g.disabled ? " (disabled)" : ""}`}
              title={g.disabled ? t("gender.comingSoon") : undefined}
            >
              <Icon className="h-4 w-4" />
              <span>{t(`gender.${g.value}`)}</span>
              {g.disabled && <Lock className="h-3 w-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
