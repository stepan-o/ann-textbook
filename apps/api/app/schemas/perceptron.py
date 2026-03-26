from typing import Literal

from pydantic import BaseModel

DatasetName = Literal["linearly_separable", "xor"]


class InitializeRequest(BaseModel):
    dataset: DatasetName
    learning_rate: float = 0.1


class PerceptronStateModel(BaseModel):
    weights: list[float]
    bias: float
    learning_rate: float
    epoch: int = 0
    dataset: DatasetName


class TrainRequest(BaseModel):
    state: PerceptronStateModel
    steps: int = 1
