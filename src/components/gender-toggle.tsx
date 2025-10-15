"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import type { Gender } from "@/types/seasoning";
import { User, UserCheck } from "lucide-react";

export function GenderToggle() {
  const { gender, setGender } = useAppStore();
  const { t } = useI18n();

  const genders: { value: Gender; icon: typeof User }[] = [
    { value: "male", icon: User },
    { value: "female", icon: UserCheck },
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
              onClick={() => setGender(g.value)}
              className={`px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-1.5 ${
                gender === g.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-background"
              }`}
              aria-label={`Select ${g.value}`}
            >
              <Icon className="h-4 w-4" />
              <span>{t(`gender.${g.value}`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
