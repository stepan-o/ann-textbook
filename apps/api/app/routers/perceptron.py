from fastapi import APIRouter

from app.schemas.perceptron import InitializeRequest, TrainRequest
from app.services.perceptron_service import initialize_state, train_state

router = APIRouter(prefix="/api/perceptron", tags=["perceptron"])


@router.post("/initialize")
def initialize(req: InitializeRequest) -> dict[str, object]:
    return initialize_state(req.dataset, req.learning_rate)


@router.post("/train")
def train(req: TrainRequest) -> dict[str, object]:
    state = req.state
    return train_state(
        dataset=state.dataset,
        weights=state.weights,
        bias=state.bias,
        learning_rate=state.learning_rate,
        epoch=state.epoch,
        steps=req.steps,
    )
