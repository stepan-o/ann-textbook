from dataclasses import dataclass


@dataclass
class PerceptronState:
    weights: list[float]
    bias: float
    learning_rate: float
    epoch: int = 0


def activation(value: float) -> int:
    return 1 if value >= 0 else 0
