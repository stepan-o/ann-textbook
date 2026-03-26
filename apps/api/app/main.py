from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.perceptron import router as perceptron_router

app = FastAPI(title="ANN Textbook API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(perceptron_router)


@app.get("/health")
def health():
    return {"ok": True}
