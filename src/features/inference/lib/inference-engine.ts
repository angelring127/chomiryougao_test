import type { SeasoningCode, InferenceResult, Gender } from "@/types/seasoning";
import seasoningsData from "@/../data/seasonings.json";

const SEASONINGS = seasoningsData as Array<{
  code: SeasoningCode;
  availableFor: Gender[];
}>;

export async function loadModel(): Promise<void> {
  // TODO: Teachable Machine モデルの読み込み
  // const model = await tmImage.load(modelURL, metadataURL)
  await new Promise((resolve) => setTimeout(resolve, 500));
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
  // TODO: 実際の推論処理
  // const predictions = await model.predict(imageElement)

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return generateDummyProbabilities(gender);
}

export function getTop3Results(results: InferenceResult[]): InferenceResult[] {
  return [...results].sort((a, b) => b.probability - a.probability).slice(0, 3);
}

export function formatProbability(probability: number): string {
  return Math.round(probability * 100).toString();
}
