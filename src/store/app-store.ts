"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language, AnalysisResult, Gender } from "@/types/seasoning";

interface AppState {
  language: Language | null;
  gender: Gender;
  uploadedImage: string | null;
  analysisResult: AnalysisResult | null;
  setLanguage: (language: Language) => void;
  setGender: (gender: Gender) => void;
  setUploadedImage: (image: string | null) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  clearAll: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: null,
      gender: "male",
      uploadedImage: null,
      analysisResult: null,
      setLanguage: (language) => set({ language }),
      setGender: (gender) => set({ gender }),
      setUploadedImage: (uploadedImage) => set({ uploadedImage }),
      setAnalysisResult: (analysisResult) => set({ analysisResult }),
      clearAll: () => set({ uploadedImage: null, analysisResult: null }),
    }),
    {
      name: "chomiryo-gao-storage",
      partialize: (state) => ({
        language: state.language,
        gender: state.gender,
        analysisResult: state.analysisResult,
      }),
    }
  )
);
