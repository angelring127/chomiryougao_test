export type SeasoningCode =
  | "soy_sauce"
  | "miso"
  | "salt"
  | "sugar"
  | "vinegar"
  | "sauce"
  | "mayo"
  | "ketchup"
  | "olive";

export type Gender = "male" | "female";

export interface SeasoningType {
  code: SeasoningCode;
  name: {
    ja: string;
    ko: string;
    en: string;
    zh: string;
  };
  color: string;
  descKey: string;
  availableFor: Gender[];
}

export interface InferenceResult {
  code: SeasoningCode;
  probability: number;
}

export interface AnalysisResult {
  top1: InferenceResult;
  top3: InferenceResult[];
  timestamp: number;
  modelVersion: string;
}

export type Language = "ja" | "ko" | "en" | "zh";

export interface Translation {
  [key: string]: string | string[] | Translation;
}
