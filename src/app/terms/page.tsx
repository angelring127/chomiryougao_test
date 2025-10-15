"use client";

import { useI18n } from "@/hooks/use-i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Sparkles, FileText } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">
              {t("terms.title")}
            </h1>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">サービスの目的</h2>
              <p className="text-muted-foreground leading-relaxed">
                本サービスは、エンターテインメント目的で提供される顔診断サービスです。
                診断結果は機械学習モデルによる推定であり、
                科学的根拠や医学的根拠に基づくものではありません。
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">利用規約</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>本サービスは無料で提供されます</li>
                <li>診断結果の正確性は保証されません</li>
                <li>本サービスは予告なく変更・終了する場合があります</li>
                <li>
                  サービスの利用により生じた損害について、運営者は責任を負いません
                </li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">禁止事項</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>他人の写真を無断で使用すること</li>
                <li>サービスの運営を妨害する行為</li>
                <li>法令に違反する行為</li>
                <li>公序良俗に反する行為</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">著作権</h2>
              <p className="text-muted-foreground leading-relaxed">
                本サービスのコンテンツ（イラスト、テキストなど）の著作権は運営者に帰属します。
                診断結果の個人的な共有は許可されていますが、
                商業利用や無断転載は禁止されています。
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">免責事項</h2>
              <p className="text-muted-foreground leading-relaxed">
                本サービスは「現状のまま」提供され、
                運営者はサービスの完全性、正確性、有用性について一切保証しません。
                利用者は自己の責任において本サービスを利用するものとします。
              </p>
            </section>

            <div className="mt-12 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                最終更新日: 2025年1月
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
            <Link href="/privacy" className="hover:underline">
              {t("footer.privacy")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
