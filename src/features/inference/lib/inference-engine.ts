import type { SeasoningCode, InferenceResult, Gender } from "@/types/seasoning";
import seasoningsData from "@/../data/seasonings.json";

const SEASONINGS = seasoningsData as Array<{
  code: SeasoningCode;
  availableFor: Gender[];
}>;

// Teachable Machine モデルURL
const MODEL_URLS = {
  male: "https://teachablemachine.withgoogle.com/models/nKV4owvTC/",
  female: "https://teachablemachine.withgoogle.com/models/P3QZ3AWH_/",
};

let modelInstances: Record<Gender, any> = {
  male: null,
  female: null,
};

let isModelLoading: Record<Gender, boolean> = {
  male: false,
  female: false,
};

declare global {
  interface Window {
    tmImage: any;
  }
}

export async function loadModel(gender: Gender = "male"): Promise<void> {
  if (modelInstances[gender]) {
    return;
  }

  if (isModelLoading[gender]) {
    while (isModelLoading[gender]) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return;
  }

  isModelLoading[gender] = true;

  try {
    // Teachable Machine ライブラリの読み込み確認
    if (typeof window === "undefined" || !window.tmImage) {
      throw new Error("Teachable Machine library not loaded");
    }

    const modelURL = MODEL_URLS[gender] + "model.json";
    const metadataURL = MODEL_URLS[gender] + "metadata.json";

    modelInstances[gender] = await window.tmImage.load(modelURL, metadataURL);
    console.log(`${gender} model loaded successfully`);
  } catch (error) {
    console.error(`Failed to load ${gender} model:`, error);
    throw error;
  } finally {
    isModelLoading[gender] = false;
  }
}

function generateDummyProbabilities(
  gender: Gender = "male"
): InferenceResult[] {
  const availableSeasonings = SEASONINGS.filter((s) =>
    s.availableFor.includes(gender)
  );

  const results: InferenceResult[] = availableSeasonings.map((seasoning) => ({
    code: seasoning.code,
    probability: Math.random(),
  }));

  const sum = results.reduce((acc, r) => acc + r.probability, 0);

  return results.map((r) => ({
    ...r,
    probability: r.probability / sum,
  }));
}

export async function runInference(
  imageDataUrl: string,
  gender: Gender = "male"
): Promise<InferenceResult[]> {
  try {
    if (!modelInstances[gender]) {
      await loadModel(gender);
    }

    // 画像要素を作成
    const img = new Image();
    img.crossOrigin = "anonymous";

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageDataUrl;
    });

    // Teachable Machine で推論
    const predictions = await modelInstances[gender].predict(img);
    console.log(`${gender} model predictions:`, predictions);

    // 予測結果をInferenceResult形式に変換
    // モデルのクラス名: "soy_sauce_face", "mayo_face" など
    const availableSeasonings = SEASONINGS.filter((s) =>
      s.availableFor.includes(gender)
    );

    const results: InferenceResult[] = predictions
      .map((pred: any) => {
        // "_face" を削除してSeasoningCodeを取得
        // 例: "soy_sauce_face" → "soy_sauce"
        const className = pred.className.replace(/_face$/i, "");
        const seasoning = availableSeasonings.find((s) => s.code === className);

        if (seasoning) {
          return {
            code: seasoning.code,
            probability: pred.probability,
          };
        }
        return null;
      })
      .filter((r: any) => r !== null) as InferenceResult[];

    // 性別でフィルタリング
    const filteredResults = results.filter((r) => {
      const seasoning = availableSeasonings.find((s) => s.code === r.code);
      return seasoning !== undefined;
    });

    if (filteredResults.length === 0) {
      console.warn("No valid results, using dummy data");
      return generateDummyProbabilities(gender);
    }

    return filteredResults;
  } catch (error) {
    console.error("Inference error:", error);
    // エラー時はダミーデータを返す
    return generateDummyProbabilities(gender);
  }
}

export function getTop3Results(results: InferenceResult[]): InferenceResult[] {
  return [...results].sort((a, b) => b.probability - a.probability).slice(0, 3);
}

export function formatProbability(probability: number): string {
  return Math.round(probability * 100).toString();
}
