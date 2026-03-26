from pathlib import Path
import sys

import numpy as np

PYTHON_ROOT = Path(__file__).resolve().parents[1]
if str(PYTHON_ROOT) not in sys.path:
    sys.path.insert(0, str(PYTHON_ROOT))

from kernels.perceptron import (
    PerceptronState,
    activation,
    evaluate,
    predict_point,
    step_dataset,
)


def test_activation_uses_zero_as_positive_threshold() -> None:
    assert activation(-0.01) == 0
    assert activation(0.0) == 1
    assert activation(2.5) == 1


def test_predict_point_uses_weights_and_bias() -> None:
    state = PerceptronState(
        weights=np.array([1.0, -1.0], dtype=float),
        bias=-0.25,
        learning_rate=0.1,
    )

    assert predict_point(np.array([1.0, 0.0], dtype=float), state) == 1
    assert predict_point(np.array([0.0, 1.0], dtype=float), state) == 0


def test_step_dataset_applies_classic_perceptron_updates() -> None:
    X = np.array([[1.0, 0.0], [0.0, 1.0]], dtype=float)
    y = np.array([1, 0], dtype=int)
    initial_state = PerceptronState(
        weights=np.zeros(2, dtype=float),
        bias=0.0,
        learning_rate=1.0,
        epoch=0,
    )

    next_state = step_dataset(X, y, initial_state)

    np.testing.assert_array_equal(next_state.weights, np.array([0.0, -1.0]))
    assert next_state.bias == -1.0
    assert next_state.learning_rate == initial_state.learning_rate
    assert next_state.epoch == 1


def test_evaluate_returns_predictions_accuracy_and_mistakes() -> None:
    X = np.array([[0.0, 0.0], [1.0, 0.0], [2.0, 0.0]], dtype=float)
    y = np.array([0, 1, 1], dtype=int)
    state = PerceptronState(
        weights=np.array([1.0, 0.0], dtype=float),
        bias=-0.5,
        learning_rate=0.1,
    )

    predictions, accuracy, mistakes = evaluate(X, y, state)

    np.testing.assert_array_equal(predictions, np.array([0, 1, 1]))
    assert accuracy == 1.0
    assert mistakes == 0
