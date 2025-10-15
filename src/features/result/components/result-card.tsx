"use client";

import { useI18n } from "@/hooks/use-i18n";
import type { AnalysisResult, SeasoningCode, Gender } from "@/types/seasoning";
import { formatProbability } from "@/features/inference/lib/inference-engine";
import seasoningsData from "@/../data/seasonings.json";
import celebritiesData from "@/../data/celebrities.json";
import Image from "next/image";
import { Star } from "lucide-react";

interface ResultCardProps {
  result: AnalysisResult;
  gender?: Gender;
}

export function ResultCard({ result, gender = "male" }: ResultCardProps) {
  const { t, language } = useI18n();

  const getSeasoningInfo = (code: SeasoningCode) => {
    return seasoningsData.find((s) => s.code === code);
  };

  const top1Info = getSeasoningInfo(result.top1.code);
  const top1Percent = formatProbability(result.top1.probability);

  const getImagePath = (code: SeasoningCode) => {
    const genderFolder = gender === "female" ? "여성" : "남성";
    const nameMap: Record<SeasoningCode, string> = {
      soy_sauce: "간장",
      miso: "미소",
      salt: "소금",
      sugar: "설탕",
      vinegar: "식초",
      sauce: "소스",
      mayo: "마요네즈",
      ketchup: "케첩",
      olive: gender === "female" ? "올리브오일" : "올리브",
    };

    const fileName = nameMap[code];
    return `/images/face/${genderFolder}/얼굴_${fileName}_${
      genderFolder === "여성" ? "여성" : "남성"
    }.png`;
  };

  if (!top1Info) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Top 1 結果 */}
      <div
        className="relative p-8 rounded-2xl shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${top1Info.color}15 0%, ${top1Info.color}05 100%)`,
          borderColor: top1Info.color,
          borderWidth: "2px",
        }}
      >
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground font-medium">
            {t("result.top")}
          </p>

          <div className="relative w-64 h-64 mx-auto">
            <Image
              src={getImagePath(result.top1.code)}
              alt={top1Info.name[language]}
              fill
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h2
              className="text-4xl font-bold mb-2"
              style={{ color: top1Info.color }}
            >
              {top1Info.name[language]}
            </h2>
            <p
              className="text-5xl font-extrabold"
              style={{ color: top1Info.color }}
            >
              {top1Percent}%
            </p>
          </div>

          <p className="text-base text-foreground/80 leading-relaxed max-w-md mx-auto">
            {t(top1Info.descKey)}
          </p>
        </div>
      </div>

      {/* Top 3 Progress Bars */}
      <div className="bg-card p-6 rounded-xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-center mb-4">
          {t("result.mix")}
        </h3>

        <div className="space-y-3">
          {result.top3.map((item, index) => {
            const info = getSeasoningInfo(item.code);
            if (!info) return null;

            const percent = formatProbability(item.probability);

            return (
              <div key={item.code} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{info.name[language]}</span>
                  <span className="font-bold" style={{ color: info.color }}>
                    {percent}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000 ease-out rounded-full"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: info.color,
                      animation: `slideIn 1s ease-out ${index * 0.1}s both`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 有名人リスト */}
      {(() => {
        const celebrities = (celebritiesData as any)[result.top1.code];
        const celebList = celebrities?.[gender] || [];

        if (celebList.length > 0) {
          return (
            <div className="bg-card p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <h3 className="text-lg font-semibold text-center">
                  {language === "ja" && "似ているタイプの有名人"}
                  {language === "ko" && "비슷한 타입의 유명인"}
                  {language === "en" && "Similar Type Celebrities"}
                  {language === "zh" && "相似類型的名人"}
                </h3>
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {celebList.map((celeb: any, index: number) => {
                  const displayName = celeb[language] || celeb.ja;
                  const searchQuery = encodeURIComponent(celeb.search);
                  const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;

                  return (
                    <a
                      key={index}
                      href={googleSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full text-sm font-medium hover:from-primary/20 hover:to-primary/10 hover:border-primary/30 transition-all hover:scale-105 cursor-pointer"
                    >
                      {displayName}
                    </a>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">
                {language === "ja" && "※参考例です（クリックで検索）"}
                {language === "ko" && "※ 참고 예시입니다 (클릭하여 검색)"}
                {language === "en" && "※ Reference only (Click to search)"}
                {language === "zh" && "※ 僅供參考（點擊搜尋）"}
              </p>
            </div>
          );
        }
        return null;
      })()}

      {/* モデルバージョン */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {t("footer.version")}: {result.modelVersion}
        </p>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
