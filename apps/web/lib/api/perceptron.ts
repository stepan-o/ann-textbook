import { apiPost } from "@/lib/api/client";
import type {
  DatasetName,
  PerceptronResponse,
  PerceptronState,
} from "@/lib/types/perceptron";

export async function initializePerceptron(
  dataset: DatasetName,
  learningRate = 0.1,
): Promise<PerceptronResponse> {
  return apiPost<PerceptronResponse>("/api/perceptron/initialize", {
    dataset,
    learning_rate: learningRate,
  });
}

export async function trainPerceptron(
  state: PerceptronState,
  steps: number,
): Promise<PerceptronResponse> {
  return apiPost<PerceptronResponse>("/api/perceptron/train", {
    state,
    steps,
  });
}
