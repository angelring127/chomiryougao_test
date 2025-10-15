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
              <h2 className="text-2xl font-semibold">画像の取り扱いについて</h2>
              <p className="text-muted-foreground leading-relaxed">
                本サービスでは、アップロードされた画像はすべてお客様のブラウザ内でのみ処理され、
                サーバーに送信されることはありません。画像データはブラウザのメモリ上にのみ保存され、
                ページを閉じると完全に削除されます。
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">クッキーの使用</h2>
              <p className="text-muted-foreground leading-relaxed">
                本サービスでは、ユーザー体験の向上のために、言語設定などの情報を
                ブラウザのローカルストレージに保存します。
                これらの情報は個人を特定するものではありません。
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">アクセス解析</h2>
              <p className="text-muted-foreground leading-relaxed">
                本サービスでは、Google
                Analyticsを使用してアクセス解析を行っています。
                これにより収集されるデータは、サービス改善のために使用され、
                個人を特定する情報は含まれません。
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">広告について</h2>
              <p className="text-muted-foreground leading-relaxed">
                本サービスでは、Google AdSenseによる広告を表示しています。
                広告配信事業者は、Cookieを使用して興味に基づく広告を配信する場合があります。
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-semibold">お問い合わせ</h2>
              <p className="text-muted-foreground leading-relaxed">
                本プライバシーポリシーに関するご質問は、サービス管理者までお問い合わせください。
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
            <Link href="/terms" className="hover:underline">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
