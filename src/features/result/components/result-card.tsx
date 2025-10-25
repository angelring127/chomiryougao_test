"use client";

import { useI18n } from "@/hooks/use-i18n";
import type { AnalysisResult, SeasoningCode, Gender } from "@/types/seasoning";
import { formatProbability } from "@/features/inference/lib/inference-engine";
import seasoningsData from "@/../data/seasonings.json";
import celebritiesData from "@/../data/celebrities.json";
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
    const map: Record<SeasoningCode, string> = {
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
    return map[code];
  };

  // 밝은 색상 판별 함수
  const isLightColor = (hexColor: string) => {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 200;
  };

  // 텍스트 스타일 (밝은 색은 검은 그림자와 테두리 추가)
  const getTextStyle = (color: string) => {
    if (isLightColor(color)) {
      return {
        color,
        textShadow:
          "0 0 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.7), 0 0 9px rgba(0,0,0,0.5), 1px 1px 3px rgba(0,0,0,0.8)",
        WebkitTextStroke: "0.5px rgba(0,0,0,0.3)",
      };
    }
    return { color };
  };

  if (!top1Info) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Top 1 結果 - 조미료 중심 디자인 */}
      <div
        className="relative p-8 rounded-2xl shadow-xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${top1Info.color}20 0%, ${top1Info.color}10 100%)`,
          borderColor: top1Info.color,
          borderWidth: "3px",
        }}
      >
        {/* 배경 조미료 이미지 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <img
            src={getImagePath(result.top1.code)}
            alt=""
            className="w-full h-full object-contain scale-150"
          />
        </div>

        <div className="relative z-10 text-center space-y-6">
          <p className="text-sm text-muted-foreground font-medium">
            {t("result.top")}
          </p>

          {/* 큰 조미료 이미지 */}
          <div className="w-80 h-80 mx-auto flex items-center justify-center mb-4">
            <img
              src={getImagePath(result.top1.code)}
              alt={top1Info.name[language]}
              className="max-w-full max-h-full object-contain drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.3))",
              }}
            />
          </div>

          <div className="space-y-2">
            <h2
              className="text-5xl font-bold mb-3"
              style={getTextStyle(top1Info.color)}
            >
              {top1Info.name[language]}
            </h2>
            <p
              className="text-6xl font-extrabold"
              style={getTextStyle(top1Info.color)}
            >
              {top1Percent}%
            </p>
          </div>

          <div className="text-lg text-foreground/80 leading-relaxed max-w-md mx-auto pt-4">
            {String(
              t(`${top1Info.descKey}${gender === "female" ? "_female" : ""}`)
            )
              .split("\n\n")
              .map((section: string, index: number) => {
                if (section.includes("【") && section.includes("】")) {
                  // 얼굴 특징이나 성격 섹션
                  const [title, ...content] = section.split("\n");
                  return (
                    <div key={index} className="mb-6 last:mb-0">
                      <h4
                        className="text-xl font-semibold mb-3 text-primary"
                        style={getTextStyle(top1Info.color)}
                      >
                        {title}
                      </h4>
                      <p className="text-base leading-relaxed">
                        {content.join("\n")}
                      </p>
                    </div>
                  );
                } else {
                  // 일반 설명
                  return (
                    <p key={index} className="mb-4 text-base leading-relaxed">
                      {section}
                    </p>
                  );
                }
              })}
          </div>
        </div>
      </div>

      {/* Top 3 Progress Bars - 조미료 아이콘 포함 */}
      <div className="bg-card p-6 rounded-xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-center mb-4">
          {t("result.mix")}
        </h3>

        <div className="space-y-4">
          {result.top3.map((item, index) => {
            const info = getSeasoningInfo(item.code);
            if (!info) return null;

            const percent = formatProbability(item.probability);

            return (
              <div key={item.code} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {/* 작은 조미료 아이콘 */}
                    <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-full p-1.5">
                      <img
                        src={getImagePath(item.code)}
                        alt={info.name[language]}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="font-medium text-base">
                      {info.name[language]}
                    </span>
                  </div>
                  <span
                    className="font-bold text-lg"
                    style={getTextStyle(info.color)}
                  >
                    {percent}%
                  </span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden border border-gray-300">
                  <div
                    className="h-full transition-all duration-1000 ease-out rounded-full"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: info.color,
                      animation: `slideIn 1s ease-out ${index * 0.1}s both`,
                      border: "1px solid rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 有名人リスト - 조미료 워터마크 추가 */}
      {(() => {
        const celebrities = (celebritiesData as any)[result.top1.code];
        const celebList = celebrities?.[gender] || [];

        if (celebList.length > 0) {
          return (
            <div className="relative bg-card p-6 rounded-xl shadow-lg overflow-hidden">
              {/* 배경 조미료 워터마크 */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                <img
                  src={getImagePath(result.top1.code)}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="relative z-10">
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
