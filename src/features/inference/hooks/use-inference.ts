"use client";

import { useState, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import type { AnalysisResult, Gender } from "@/types/seasoning";
import {
  loadModel,
  runInference,
  getTop3Results,
} from "../lib/inference-engine";
import modelVersionData from "@/../data/model_versions.json";

interface UseInferenceResult {
  isLoading: boolean;
  error: string | null;
  analyze: (imageDataUrl: string, gender?: Gender) => Promise<void>;
}

export function useInference(): UseInferenceResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAnalysisResult } = useAppStore();

  const analyze = useCallback(
    async (imageDataUrl: string, gender: Gender = "male") => {
      setIsLoading(true);
      setError(null);

      try {
        await loadModel();

        const results = await runInference(imageDataUrl, gender);
        const top3 = getTop3Results(results);

        if (top3.length === 0) {
          throw new Error("No results returned from inference");
        }

        const analysisResult: AnalysisResult = {
          top1: top3[0],
          top3,
          timestamp: Date.now(),
          modelVersion: modelVersionData.current,
        };

        setAnalysisResult(analysisResult);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Inference error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [setAnalysisResult]
  );

  return {
    isLoading,
    error,
    analyze,
  };
}
