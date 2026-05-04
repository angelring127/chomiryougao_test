"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, Shield, Sparkles, Utensils } from "lucide-react";
import { AdsenseReviewScript } from "@/components/adsense-review-script";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/hooks/use-i18n";
import seasoningsData from "@/../data/seasonings.json";
import type { SeasoningCode } from "@/types/seasoning";

const SEASONING_IMAGE_MAP: Record<SeasoningCode, string> = {
  soy_sauce: "/images/choumiryou/syouyu.png",
  miso: "/images/choumiryou/miso.png",
  salt: "/images/choumiryou/salt.png",
  sugar: "/images/choumiryou/sugar.png",
  vinegar: "/images/choumiryou/osu.png",
  sauce: "/images/choumiryou/sauce.png",
  mayo: "/images/choumiryou/mayonnaise.png",
  ketchup: "/images/choumiryou/ketchup.png",
  olive: "/images/choumiryou/olive_oil.png",
};

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col min-h-screen">
      <AdsenseReviewScript />

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6" />
            <span className="font-bold text-lg hidden sm:inline-block">
              {t("title")}
            </span>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">
                {t("about.title")}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.description")}
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.isArray(t("about.principles")) &&
              t("about.principles").map((item: any, index: number) => {
                const Icon = index === 0 ? Utensils : index === 1 ? Shield : Sparkles;

                return (
                  <div key={index} className="bg-card rounded-xl p-6 border">
                    <Icon className="h-7 w-7 text-primary mb-4" />
                    <h2 className="text-xl font-semibold mb-3">
                      {item.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {t("about.typeGuideTitle")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.typeGuideDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {seasoningsData.map((seasoning) => {
                const code = seasoning.code as SeasoningCode;
                const description = String(t(`desc.${code}`)).split("\n\n")[0];

                return (
                  <article
                    key={code}
                    className="bg-card rounded-xl p-5 border flex gap-4"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={SEASONING_IMAGE_MAP[code]}
                        alt={t(`seasoningTypes.${code}`)}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3
                        className="font-bold text-lg mb-2"
                        style={{ color: seasoning.color }}
                      >
                        {t(`seasoningTypes.${code}`)}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">
              {t("nav.home")}
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/privacy" className="hover:underline">
              {t("footer.privacy")}
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/terms" className="hover:underline">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
