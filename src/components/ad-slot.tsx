"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  slotId: string;
  position: "top" | "bottom";
  className?: string;
}

export function AdSlot({ slotId, position, className = "" }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

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
  }, []);

  return (
    <div
      ref={adRef}
      className={`min-h-[100px] w-full flex items-center justify-center bg-muted/30 rounded-lg ${className}`}
      data-ad-position={position}
    >
      {/* MVP: プレースホルダー表示 */}
      <div className="text-xs text-muted-foreground">Ad Slot ({position})</div>

      {/* 本番環境では以下を使用 */}
      {/* <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      /> */}
    </div>
  );
}
