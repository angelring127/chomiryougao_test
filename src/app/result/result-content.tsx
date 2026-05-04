"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { ResultCard } from "@/features/result/components/result-card";
import { ShareButtons } from "@/features/result/components/share-buttons";
import { LanguageSwitcher } from "@/components/language-switcher";
import { formatProbability } from "@/features/inference/lib/inference-engine";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import type {
  AnalysisResult,
  Gender,
  InferenceResult,
  SeasoningCode,
} from "@/types/seasoning";
import modelVersionData from "@/../data/model_versions.json";
import seasoningsData from "@/../data/seasonings.json";

const VALID_GENDERS: Gender[] = ["male", "female"];
const VALID_CODES = new Set<SeasoningCode>(
  seasoningsData.map((seasoning) => seasoning.code as SeasoningCode)
);

function isValidGender(value: string | null): value is Gender {
  return VALID_GENDERS.includes(value as Gender);
}

function isValidSeasoningCode(value: string): value is SeasoningCode {
  return VALID_CODES.has(value as SeasoningCode);
}

function isAvailableForGender(code: SeasoningCode, gender: Gender): boolean {
  return Boolean(
    seasoningsData
      .find((seasoning) => seasoning.code === code)
      ?.availableFor.includes(gender)
  );
}

function parseSharedResults(
  resultsParam: string,
  gender: Gender
): InferenceResult[] | null {
  const parts = resultsParam.split(",");

  if (parts.length !== 3) {
    return null;
  }

  const seenCodes = new Set<SeasoningCode>();
  const top3: InferenceResult[] = [];

  for (const part of parts) {
    const [code, percent, extra] = part.split(":");
    const parsedPercent = Number(percent);

    if (
      extra !== undefined ||
      !code ||
      !isValidSeasoningCode(code) ||
      !isAvailableForGender(code, gender) ||
      seenCodes.has(code) ||
      !Number.isFinite(parsedPercent) ||
      parsedPercent < 0 ||
      parsedPercent > 100
    ) {
      return null;
    }

    seenCodes.add(code);
    top3.push({
      code,
      probability: parsedPercent / 100,
    });
  }

  return top3;
}

function isValidInferenceResults(
  results: InferenceResult[],
  gender: Gender
): boolean {
  if (results.length !== 3) {
    return false;
  }

  const seenCodes = new Set<SeasoningCode>();

  return results.every((result) => {
    if (
      !isValidSeasoningCode(result.code) ||
      !isAvailableForGender(result.code, gender) ||
      seenCodes.has(result.code) ||
      !Number.isFinite(result.probability) ||
      result.probability < 0 ||
      result.probability > 1
    ) {
      return false;
    }

    seenCodes.add(result.code);
    return true;
  });
}

function isValidAnalysisResult(
  result: AnalysisResult | null,
  gender: Gender
): result is AnalysisResult {
  return Boolean(
    result &&
      result.top1.code === result.top3[0]?.code &&
      isValidInferenceResults(result.top3, gender)
  );
}

export function ResultContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    analysisResult,
    gender,
    clearAll,
    setAnalysisResult,
    setGender,
  } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [displayResult, setDisplayResult] = useState<AnalysisResult | null>(
    null
  );
  const [hasInvalidSharedResult, setHasInvalidSharedResult] = useState(false);
  const resultsParam = searchParams.get("r");
  const sharedGenderParam = searchParams.get("g");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!resultsParam) {
      setHasInvalidSharedResult(false);
      return;
    }

    const restoredGender = isValidGender(sharedGenderParam)
      ? sharedGenderParam
      : "male";
    const top3 = parseSharedResults(resultsParam, restoredGender);

    if (!top3) {
      setHasInvalidSharedResult(true);
      setDisplayResult(null);
      return;
    }

    const restoredResult: AnalysisResult = {
      top1: top3[0],
      top3,
      timestamp: Date.now(),
      modelVersion: modelVersionData.current,
    };
    setHasInvalidSharedResult(false);
    setGender(restoredGender);
    setDisplayResult(restoredResult);
    setAnalysisResult(restoredResult);
  }, [resultsParam, sharedGenderParam, setAnalysisResult, setGender]);

  useEffect(() => {
    if (resultsParam) {
      return;
    }

    if (isValidAnalysisResult(analysisResult, gender)) {
      setDisplayResult(analysisResult);
      return;
    }

    setAnalysisResult(null);
    setDisplayResult(null);
  }, [resultsParam, analysisResult, gender, setAnalysisResult]);

  useEffect(() => {
    if (
      mounted &&
      !displayResult &&
      (!resultsParam || hasInvalidSharedResult)
    ) {
      router.push("/");
    }
  }, [mounted, displayResult, resultsParam, hasInvalidSharedResult, router]);

  if (!mounted || !displayResult) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const handleRetry = () => {
    clearAll();
    router.push("/");
  };

  const top1Percent = formatProbability(displayResult.top1.probability);

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
        <div className="max-w-4xl mx-auto space-y-12">
          {/* タイトル */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              {t("result.top")}
            </h1>
          </div>

          {/* 結果カード */}
          <ResultCard result={displayResult} gender={gender} />

          {/* 共有ボタン */}
          <ShareButtons
            topSeasoningCode={displayResult.top1.code}
            percentage={top1Percent}
            top3Results={displayResult.top3}
            gender={gender}
          />

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("cta.retake")}
            </button>
          </div>

          {/* 結果詳細セクション */}
          <section className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              {t("result.aboutYourType")}
            </h2>
            <div className="bg-card rounded-xl p-6 md:p-8 border shadow-sm">
              <div className="prose prose-slate max-w-none">
                <div className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {t(`desc.${gender === "female" && displayResult.top1.code !== "olive" ? displayResult.top1.code + "_female" : displayResult.top1.code}`)}
                </div>
              </div>
            </div>
          </section>

          {/* 他の調味料タイプ紹介 */}
          <section className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              {t("result.otherTypes")}
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              {t("result.otherTypesDesc")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayResult.top3.slice(1, 3).map((result) => {
                const seasoningInfo = seasoningsData.find(
                  (s) => s.code === result.code
                );
                const genderCode =
                  gender === "female" && result.code !== "olive"
                    ? result.code + "_female"
                    : result.code;
                const description = t(`desc.${genderCode}`)
                  .split("\n\n")[0]
                  .substring(0, 150) + "...";
                const percentage = formatProbability(result.probability);

                return (
                  <div
                    key={result.code}
                    className="bg-card rounded-xl p-6 border hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: seasoningInfo?.color }}
                      />
                      <h3 className="font-bold text-xl">
                        {t(`seasoningTypes.${result.code}`)}
                      </h3>
                      <span className="ml-auto text-2xl font-bold text-primary">
                        {percentage}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FAQセクション */}
          <section className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              {t("faq.title")}
            </h2>
            <div className="space-y-4">
              {Array.isArray(t("faq.items")) &&
                t("faq.items")
                  .slice(0, 3)
                  .map((item: any, index: number) => (
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

          {/* 再試行促進セクション */}
          <section className="max-w-2xl mx-auto mt-12 text-center">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">
                {t("result.tryDifferentPhoto")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("result.tryDifferentPhotoDesc")}
              </p>
              <button
                onClick={handleRetry}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                {t("cta.retake")}
              </button>
            </div>
          </section>
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
            <span className="hidden sm:inline">•</span>
            <Link href="/about" className="hover:underline">
              {t("nav.about")}
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
