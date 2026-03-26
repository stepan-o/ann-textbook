from typing import Literal

from pydantic import BaseModel, Field

DatasetName = Literal["linearly_separable", "xor"]


class InitializeRequest(BaseModel):
    dataset: DatasetName
    learning_rate: float = Field(default=0.1, gt=0)


class PerceptronStateModel(BaseModel):
    weights: tuple[float, float]
    bias: float
    learning_rate: float = Field(gt=0)
    epoch: int = Field(default=0, ge=0)
    dataset: DatasetName


class TrainRequest(BaseModel):
    state: PerceptronStateModel
    steps: int = Field(default=1, ge=1)
