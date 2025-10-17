"use client";

import { useI18n } from "@/hooks/use-i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Sparkles, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col min-h-screen">
      {/* ヘッダー */}
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

      {/* メインコンテンツ */}
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">
              {t("privacy.title")}
            </h1>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                {t("privacy.imageHandling.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.imageHandling.content")}
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">
                {t("privacy.cookies.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.cookies.content")}
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">
                {t("privacy.analytics.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.analytics.content")}
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">
                {t("privacy.advertising.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.advertising.content")}
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">
                {t("privacy.contact.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.contact.content")}
              </p>
            </section>

            <div className="mt-12 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {t("privacy.lastUpdated")}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t py-6 md:py-8">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">
              {t("nav.home")}
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
