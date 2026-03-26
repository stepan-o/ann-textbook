import numpy as np

from kernels.perceptron import PerceptronState, evaluate, step_dataset


def get_dataset(name: str) -> tuple[np.ndarray, np.ndarray]:
    if name == "linearly_separable":
        X = np.array(
            [
                [0.0, 0.0],
                [0.0, 1.0],
                [1.0, 0.0],
                [1.0, 1.0],
            ],
            dtype=float,
        )
        y = np.array([0, 0, 1, 1], dtype=int)
        return X, y

    if name == "xor":
        X = np.array(
            [
                [0.0, 0.0],
                [0.0, 1.0],
                [1.0, 0.0],
                [1.0, 1.0],
            ],
            dtype=float,
        )
        y = np.array([0, 1, 1, 0], dtype=int)
        return X, y

    raise ValueError(f"Unknown dataset: {name}")


def initialize_state(dataset: str, learning_rate: float) -> dict[str, object]:
    X, y = get_dataset(dataset)
    state = PerceptronState(
        weights=np.zeros(2, dtype=float),
        bias=0.0,
        learning_rate=learning_rate,
        epoch=0,
    )
    return build_response(X, y, state, dataset)


def train_state(
    dataset: str,
    weights: list[float],
    bias: float,
    learning_rate: float,
    epoch: int,
    steps: int,
) -> dict[str, object]:
    X, y = get_dataset(dataset)
    state = PerceptronState(
        weights=np.array(weights, dtype=float),
        bias=float(bias),
        learning_rate=learning_rate,
        epoch=epoch,
    )

    for _ in range(steps):
        state = step_dataset(X, y, state)

    return build_response(X, y, state, dataset)


def build_response(
    X: np.ndarray,
    y: np.ndarray,
    state: PerceptronState,
    dataset: str,
) -> dict[str, object]:
    predictions, accuracy, mistakes = evaluate(X, y, state)

    points = [
        {
            "x1": float(X[i, 0]),
            "x2": float(X[i, 1]),
            "label": int(y[i]),
        }
        for i in range(len(X))
    ]

    prediction_rows = [
        {
            "x1": float(X[i, 0]),
            "x2": float(X[i, 1]),
            "pred": int(predictions[i]),
        }
        for i in range(len(X))
    ]

    notes = [
        "Perceptron can only represent a linear decision boundary.",
        "XOR is not linearly separable, so a single perceptron cannot solve it perfectly.",
    ]

    if dataset == "linearly_separable":
        notes.append("This dataset is linearly separable, so the perceptron can learn it.")

    if dataset == "xor":
        notes.append("Training may reduce some mistakes, but the failure on XOR is structural.")

    return {
        "dataset": {
            "points": points,
        },
        "state": {
            "weights": [float(weight) for weight in state.weights.tolist()],
            "bias": float(state.bias),
            "learning_rate": float(state.learning_rate),
            "epoch": int(state.epoch),
            "dataset": dataset,
        },
        "metrics": {
            "accuracy": float(accuracy),
            "mistakes": int(mistakes),
        },
        "predictions": prediction_rows,
        "boundary": {
            "w1": float(state.weights[0]),
            "w2": float(state.weights[1]),
            "b": float(state.bias),
        },
        "notes": notes,
    }
