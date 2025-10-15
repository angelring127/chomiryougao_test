"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import type { SeasoningCode, InferenceResult } from "@/types/seasoning";
import seasoningsData from "@/../data/seasonings.json";

interface ShareButtonsProps {
  topSeasoningCode: SeasoningCode;
  percentage: string;
  top3Results: InferenceResult[];
}

const SHARE_CHANNELS = [
  { name: "X (Twitter)", icon: "𝕏", color: "#000000" },
  { name: "LINE", icon: "💬", color: "#00B900" },
  { name: "Facebook", icon: "f", color: "#1877F2" },
  { name: "WhatsApp", icon: "📱", color: "#25D366" },
] as const;

export function ShareButtons({
  topSeasoningCode,
  percentage,
  top3Results,
}: ShareButtonsProps) {
  const { t, language } = useI18n();
  const [copied, setCopied] = useState(false);

  const seasoningInfo = seasoningsData.find((s) => s.code === topSeasoningCode);
  const seasoningName = seasoningInfo?.name[language] || "";

  const shareText = t("share.text", {
    name: seasoningName,
    percent: percentage,
  });

  // 결과 데이터를 URL에 인코딩
  const encodeResults = () => {
    return top3Results
      .map((r) => `${r.code}:${Math.round(r.probability * 100)}`)
      .join(",");
  };

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/result?r=${encodeResults()}`
      : "";

  const handleShare = (channel: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    let url = "";

    switch (channel) {
      case "X (Twitter)":
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "LINE":
        url = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "Facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case "WhatsApp":
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }

    // GA4 イベント送信
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "share_click", {
        channel: channel.toLowerCase().replace(/\s/g, "_"),
        top_label: topSeasoningCode,
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <h3 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
        <Share2 className="h-5 w-5" />
        {t("share.title")}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {SHARE_CHANNELS.map((channel) => (
          <button
            key={channel.name}
            onClick={() => handleShare(channel.name)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{
              backgroundColor: channel.color,
              color: "#ffffff",
            }}
          >
            <span className="text-xl">{channel.icon}</span>
            <span className="text-sm">{channel.name}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleCopyLink}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm">{t("share.copied")}</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            <span className="text-sm">{t("share.copyLink")}</span>
          </>
        )}
      </button>
    </div>
  );
}
