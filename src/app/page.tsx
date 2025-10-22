"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageUploader } from "@/features/upload/components/image-uploader";
import { LanguageSwitcher } from "@/components/language-switcher";
import { GenderToggle } from "@/components/gender-toggle";
import { SeasoningCarousel } from "@/components/seasoning-carousel";
import { AdSlot } from "@/components/ad-slot";
import { useI18n } from "@/hooks/use-i18n";
import { useInference } from "@/features/inference/hooks/use-inference";
import { Sparkles, AlertCircle } from "lucide-react";
import { trackEvents } from "@/lib/analytics";
import { useAppStore } from "@/store/app-store";
import Link from "next/link";

export default function HomePage() {
  const { t } = useI18n();
  const router = useRouter();
  const { analyze, isLoading, error } = useInference();
  const { gender } = useAppStore();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageProcessed = async (dataUrl: string) => {
    setUploadedImage(dataUrl);
    trackEvents.uploadSuccess();
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) return;

    trackEvents.inferenceStart("tm-v1.0.0");
    const startTime = Date.now();

    try {
      await analyze(uploadedImage, gender);
      const duration = Date.now() - startTime;
      trackEvents.inferenceDone("tm-v1.0.0", duration);
      router.push("/result");
    } catch (err) {
      console.error("Analysis error:", err);
    }
  };

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
        {/* ヒーローセクション */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            {t("description")}
          </p>

          {/* 조미료 슬라이드 */}
          <SeasoningCarousel />
        </div>

        {/* サービス紹介セクション */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {t("intro.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-center">
              {t("intro.description")}
            </p>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-center">
                {t("intro.features.title")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(t("intro.features.items")) &&
                  t("intro.features.items").map(
                    (item: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 bg-background/50 rounded-lg p-4"
                      >
                        <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{item}</p>
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
        </section>

        {/* 性別選択 */}
        <div className="flex justify-center mb-12">
          <GenderToggle />
        </div>

        {/* アップロードセクション */}
        <div className="max-w-2xl mx-auto space-y-6">
          <ImageUploader onImageProcessed={handleImageProcessed} />

          {uploadedImage && !isLoading && (
            <div className="text-center">
              <button
                onClick={handleAnalyze}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <Sparkles className="inline h-5 w-5 mr-2" />
                {t("cta.analyze")}
              </button>
            </div>
          )}

          {isLoading && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                <span className="text-primary font-medium">
                  {t("inference.analyzing")}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm text-destructive font-medium">
                    {t("upload.error.title")}
                  </p>
                  <p className="text-xs text-destructive/80 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* プライバシー通知 */}
        <div className="max-w-2xl mx-auto mt-12 p-4 bg-muted/30 rounded-lg border">
          <p className="text-sm text-center text-muted-foreground">
            🔒 {t("privacy.description")}
          </p>
        </div>

        {/* 広告スロット（中段） */}
        <div className="my-16">
          <AdSlot slotId="top-slot" position="top" />
        </div>

        {/* 使い方セクション */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t("howTo.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(t("howTo.steps")) &&
              t("howTo.steps").map((step: any, index: number) => (
                <div
                  key={index}
                  className="relative bg-card rounded-xl p-6 border shadow-sm"
                >
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 mt-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
          </div>
        </section>

        {/* 調味料タイプ紹介セクション */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4 text-center">
            {t("seasoningTypes.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            {t("seasoningTypes.description")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { type: "soy_sauce", image: "syouyu.png" },
              { type: "miso", image: "miso.png" },
              { type: "salt", image: "salt.png" },
              { type: "sugar", image: "sugar.png" },
              { type: "vinegar", image: "osu.png" },
              { type: "sauce", image: "sauce.png" },
              { type: "mayo", image: "mayonnaise.png" },
              { type: "ketchup", image: "ketchup.png" },
              { type: "olive", image: "olive_oil.png" },
            ].map(({ type, image }) => (
              <div
                key={type}
                className="bg-card rounded-xl p-4 border text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer group"
              >
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <Image
                    src={`/images/choumiryou/${image}`}
                    alt={t(`seasoningTypes.${type}`)}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <p className="font-medium text-sm leading-tight">
                  {t(`seasoningTypes.${type}`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* メリットセクション */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t("benefits.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.isArray(t("benefits.items")) &&
              t("benefits.items").map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 border text-center"
                >
                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
          </div>
        </section>

        {/* FAQセクション */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t("faq.title")}
          </h2>
          <div className="space-y-4">
            {Array.isArray(t("faq.items")) &&
              t("faq.items").map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-card rounded-lg p-6 border shadow-sm"
                >
                  <h3 className="font-semibold mb-2 flex items-start gap-2">
                    <span className="text-primary">Q.</span>
                    {item.question}
                  </h3>
                  <p className="text-muted-foreground text-sm pl-6">
                    <span className="text-primary font-semibold">A.</span>{" "}
                    {item.answer}
                  </p>
                </div>
              ))}
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="border-t py-6 md:py-8">
        <div className="container space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:underline">
              {t("footer.privacy")}
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/terms" className="hover:underline">
              {t("footer.terms")}
            </Link>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {t("footer.madeWith")}
          </p>
        </div>
      </footer>
    </div>
  );
}
