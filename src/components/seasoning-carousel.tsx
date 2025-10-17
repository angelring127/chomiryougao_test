"use client";

import { useState, useEffect } from "react";
import seasoningsData from "@/../data/seasonings.json";
import type { SeasoningCode } from "@/types/seasoning";

const SEASONING_IMAGE_MAP: Record<SeasoningCode, string> = {
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

export function SeasoningCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % seasoningsData.length);
        setIsAnimating(false);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentSeasoning = seasoningsData[currentIndex];
  const imagePath = SEASONING_IMAGE_MAP[currentSeasoning.code as SeasoningCode];

  return (
    <div className="flex justify-center items-center py-6">
      <div
        className={`w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center transition-all duration-300 ${
          isAnimating ? "opacity-0 scale-90" : "opacity-100 scale-100"
        }`}
      >
        <img
          src={imagePath}
          alt={currentSeasoning.name.ja}
          className="w-full h-full object-contain drop-shadow-xl"
          style={{
            filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.15))",
          }}
        />
      </div>
    </div>
  );
}
