from dataclasses import dataclass

import numpy as np


@dataclass
class PerceptronState:
    """Mutable perceptron parameters for a 2D educational demo."""

    weights: np.ndarray
    bias: float
    learning_rate: float
    epoch: int = 0


def activation(z: float) -> int:
    """Classic perceptron threshold activation."""

    return 1 if z >= 0 else 0


def predict_point(x: np.ndarray, state: PerceptronState) -> int:
    """Predict the binary label for one input point."""

    z = float(np.dot(state.weights, x) + state.bias)
    return activation(z)


def step_dataset(
    X: np.ndarray,
    y: np.ndarray,
    state: PerceptronState,
) -> PerceptronState:
    """Run one perceptron pass over the dataset in order."""

    weights = state.weights.copy()
    bias = float(state.bias)

    for i in range(len(X)):
        x_i = X[i]
        y_i = int(y[i])
        y_hat = activation(float(np.dot(weights, x_i) + bias))
        error = y_i - y_hat

        weights = weights + state.learning_rate * error * x_i
        bias = bias + state.learning_rate * error

    return PerceptronState(
        weights=weights,
        bias=bias,
        learning_rate=state.learning_rate,
        epoch=state.epoch + 1,
    )


def evaluate(
    X: np.ndarray,
    y: np.ndarray,
    state: PerceptronState,
) -> tuple[np.ndarray, float, int]:
    """Return predictions plus simple accuracy and mistake counts."""

    predictions = np.array([predict_point(x, state) for x in X], dtype=int)
    accuracy = float((predictions == y).mean())
    mistakes = int((predictions != y).sum())
    return predictions, accuracy, mistakes
