"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/features/upload/components/image-uploader";
import { LanguageSwitcher } from "@/components/language-switcher";
import { GenderToggle } from "@/components/gender-toggle";
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

    trackEvents.inferenceStart("tm-v1.0.0-dummy");
    const startTime = Date.now();

    try {
      await analyze(uploadedImage, gender);
      const duration = Date.now() - startTime;
      trackEvents.inferenceDone("tm-v1.0.0-dummy", duration);
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
        {/* 広告スロット（上部） */}
        <div className="mb-8">
          <AdSlot slotId="top-slot" position="top" />
        </div>

        {/* ヒーローセクション */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            {t("description")}
          </p>
        </div>

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
