def initialize_state(dataset: str, learning_rate: float) -> dict[str, object]:
    return {
        "dataset": dataset,
        "learning_rate": learning_rate,
        "message": "Perceptron initialization is not implemented yet.",
    }


def train_state(
    dataset: str,
    weights: list[float],
    bias: float,
    learning_rate: float,
    epoch: int,
    steps: int,
) -> dict[str, object]:
    return {
        "dataset": dataset,
        "weights": weights,
        "bias": bias,
        "learning_rate": learning_rate,
        "epoch": epoch,
        "steps": steps,
        "message": "Perceptron training is not implemented yet.",
    }
