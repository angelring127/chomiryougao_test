"use client";

import { useEffect, useRef } from "react";
import {
  ADSENSE_AD_UNITS_ENABLED,
  ADSENSE_CLIENT_ID,
} from "@/lib/adsense";

interface AdSlotProps {
  slotId: string;
  className?: string;
}

export function AdSlot({ slotId, className = "" }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isInitialized = useRef(false);
  const canRenderAd =
    ADSENSE_AD_UNITS_ENABLED && ADSENSE_CLIENT_ID && /^\d+$/.test(slotId);

  useEffect(() => {
    if (!canRenderAd || isInitialized.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInitialized.current) {
            isInitialized.current = true;

            // AdSense スクリプトのロード（本番環境用）
            try {
              if (
                typeof window !== "undefined" &&
                (window as any).adsbygoogle
              ) {
                ((window as any).adsbygoogle =
                  (window as any).adsbygoogle || []).push({});
              }
            } catch (error) {
              console.error("AdSense error:", error);
            }
          }
        });
      },
      {
        rootMargin: "100px",
      }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [canRenderAd]);

  if (!canRenderAd) {
    return null;
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle block ${className}`}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
