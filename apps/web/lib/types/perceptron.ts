export type DatasetName = "linearly_separable" | "xor";

export type PerceptronPoint = {
  x1: number;
  x2: number;
  label: number;
};

export type PerceptronPrediction = {
  x1: number;
  x2: number;
  pred: number;
};

export type PerceptronState = {
  weights: [number, number];
  bias: number;
  learning_rate: number;
  epoch: number;
  dataset: DatasetName;
};

export type PerceptronResponse = {
  dataset: {
    points: PerceptronPoint[];
  };
  state: PerceptronState;
  metrics: {
    accuracy: number;
    mistakes: number;
  };
  predictions: PerceptronPrediction[];
  boundary: {
    w1: number;
    w2: number;
    b: number;
  };
  notes: string[];
};
