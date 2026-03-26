# Vertical Slice 1

**Perceptron → XOR**

Goal: one polished chapter that proves the whole system works end to end:

* multi-page textbook shell
* one theory page
* one interactive demo
* one Python kernel
* one API route
* one visualization that makes the idea obvious

This slice should teach:

* what a perceptron is
* linear separability
* why XOR breaks it
* why hidden layers are needed

---

# 1. Definition of done

This slice is “done” when you have:

## Frontend

* homepage with textbook shell
* `/perceptron` page
* left panel: explanation + math + controls
* right panel: 2D plot of points + decision boundary
* toggle between:

    * linearly separable dataset
    * XOR dataset
* button to:

    * initialize
    * train 1 step
    * train 10 steps
    * reset

## Backend

* perceptron implemented from scratch in NumPy
* endpoints:

    * initialize state
    * step
    * train
    * reset
* returns:

    * weights
    * bias
    * loss / mistakes
    * predictions
    * boundary parameters

## Pedagogy

User should be able to see:

* perceptron learns separable data
* perceptron fails on XOR
* failure is structural, not just “needs more epochs”

That last point matters a lot.

---

# 2. File tree for this slice

Add this first:

```text
apps/
  web/
    app/
      page.tsx
      perceptron/
        page.tsx

    components/
      layout/
        SiteShell.tsx
      demos/
        perceptron/
          PerceptronDemo.tsx
          PerceptronControls.tsx
          PerceptronPlot.tsx
          PerceptronMathPanel.tsx
      ui/
        Card.tsx
        Button.tsx
        Tabs.tsx

    lib/
      api/
        client.ts
        perceptron.ts
      types/
        perceptron.ts

  api/
    app/
      main.py
      routers/
        perceptron.py
      schemas/
        perceptron.py
      services/
        perceptron_service.py

packages/
  educational-kernels/
    python/
      kernels/
        perceptron.py
      tests/
        test_perceptron.py

docs/
  demo-specs/
    perceptron.md
```

---

# 3. Build order

Do it in this order.

## Step 1 — backend kernel

Build the raw NumPy perceptron first.

## Step 2 — API route

Wrap the kernel with FastAPI.

## Step 3 — frontend page shell

Create the `/perceptron` route with placeholder panels.

## Step 4 — static plot

Render dataset points in the browser.

## Step 5 — connect API

Load initial state from backend.

## Step 6 — step/train buttons

Wire training controls.

## Step 7 — show boundary + mistakes

Visualize model state.

## Step 8 — add theory + math side panel

Make it textbook-like.

---

# 4. The backend educational contract

Keep the first contract very simple.

## Request: initialize

```json
{
  "dataset": "linearly_separable",
  "learning_rate": 0.1
}
```

## Request: step/train

```json
{
  "state": {
    "weights": [
      0.0,
      0.0
    ],
    "bias": 0.0,
    "learning_rate": 0.1,
    "dataset": "xor"
  },
  "steps": 1
}
```

## Response

```json
{
  "dataset": {
    "points": [
      {
        "x1": 0,
        "x2": 0,
        "label": 0
      },
      {
        "x1": 0,
        "x2": 1,
        "label": 1
      },
      {
        "x1": 1,
        "x2": 0,
        "label": 1
      },
      {
        "x1": 1,
        "x2": 1,
        "label": 0
      }
    ]
  },
  "state": {
    "weights": [
      0.2,
      -0.1
    ],
    "bias": 0.0,
    "learning_rate": 0.1,
    "epoch": 3
  },
  "metrics": {
    "mistakes": 2,
    "accuracy": 0.5
  },
  "predictions": [
    {
      "x1": 0,
      "x2": 0,
      "pred": 1
    },
    {
      "x1": 0,
      "x2": 1,
      "pred": 0
    },
    {
      "x1": 1,
      "x2": 0,
      "pred": 1
    },
    {
      "x1": 1,
      "x2": 1,
      "pred": 0
    }
  ],
  "boundary": {
    "w1": 0.2,
    "w2": -0.1,
    "b": 0.0
  },
  "notes": [
    "Perceptron can only learn a linear decision boundary."
  ]
}
```

---

# 5. Kernel behavior

For the very first slice, keep the perceptron plain:

[
z = w_1 x_1 + w_2 x_2 + b
]

[
\hat y =
\begin{cases}
1 & \text{if } z \ge 0 \
0 & \text{otherwise}
\end{cases}
]

Update rule:

[
w \leftarrow w + \eta (y - \hat y)x
]

[
b \leftarrow b + \eta (y - \hat y)
]

Important: do not add sigmoid yet.
This page is about the actual perceptron.

---

# 6. Datasets for the first slice

Use exactly two.

## A. Linearly separable

Example:

* (0,0) → 0
* (0,1) → 0
* (1,0) → 1
* (1,1) → 1

or a nicer spread in continuous 2D.

## B. XOR

* (0,0) → 0
* (0,1) → 1
* (1,0) → 1
* (1,1) → 0

That contrast is the whole lesson.

---

# 7. Backend code skeleton

## `packages/educational-kernels/python/kernels/perceptron.py`

```python
from dataclasses import dataclass
import numpy as np


@dataclass
class PerceptronState:
    weights: np.ndarray
    bias: float
    learning_rate: float
    epoch: int = 0


def activation(z: float) -> int:
    return 1 if z >= 0 else 0


def predict_point(x: np.ndarray, state: PerceptronState) -> int:
    z = float(np.dot(state.weights, x) + state.bias)
    return activation(z)


def step_dataset(X: np.ndarray, y: np.ndarray, state: PerceptronState) -> PerceptronState:
    w = state.weights.copy()
    b = float(state.bias)

    for i in range(len(X)):
        x_i = X[i]
        y_i = int(y[i])
        y_hat = activation(float(np.dot(w, x_i) + b))
        error = y_i - y_hat
        w = w + state.learning_rate * error * x_i
        b = b + state.learning_rate * error

    return PerceptronState(
        weights=w,
        bias=b,
        learning_rate=state.learning_rate,
        epoch=state.epoch + 1,
    )


def evaluate(X: np.ndarray, y: np.ndarray, state: PerceptronState):
    preds = np.array([predict_point(x, state) for x in X], dtype=int)
    accuracy = float((preds == y).mean())
    mistakes = int((preds != y).sum())
    return preds, accuracy, mistakes
```

---

## `apps/api/app/schemas/perceptron.py`

```python
from pydantic import BaseModel
from typing import Literal, List

DatasetName = Literal["linearly_separable", "xor"]


class InitializeRequest(BaseModel):
    dataset: DatasetName
    learning_rate: float = 0.1


class PerceptronStateModel(BaseModel):
    weights: List[float]
    bias: float
    learning_rate: float
    epoch: int = 0
    dataset: DatasetName


class TrainRequest(BaseModel):
    state: PerceptronStateModel
    steps: int = 1
```

---

## `apps/api/app/services/perceptron_service.py`

```python
import numpy as np
from educational_kernels.python.kernels.perceptron import (
    PerceptronState,
    step_dataset,
    evaluate,
)


def get_dataset(name: str):
    if name == "xor":
        X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
        y = np.array([0, 1, 1, 0], dtype=int)
        return X, y

    X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
    y = np.array([0, 0, 1, 1], dtype=int)
    return X, y


def initialize_state(dataset: str, learning_rate: float):
    X, y = get_dataset(dataset)
    state = PerceptronState(
        weights=np.zeros(2, dtype=float),
        bias=0.0,
        learning_rate=learning_rate,
        epoch=0,
    )
    return build_response(X, y, state, dataset)


def train_state(dataset: str, weights, bias: float, learning_rate: float, epoch: int, steps: int):
    X, y = get_dataset(dataset)
    state = PerceptronState(
        weights=np.array(weights, dtype=float),
        bias=bias,
        learning_rate=learning_rate,
        epoch=epoch,
    )

    for _ in range(steps):
        state = step_dataset(X, y, state)

    return build_response(X, y, state, dataset)


def build_response(X, y, state, dataset: str):
    preds, accuracy, mistakes = evaluate(X, y, state)

    points = [
        {"x1": float(X[i, 0]), "x2": float(X[i, 1]), "label": int(y[i])}
        for i in range(len(X))
    ]
    predictions = [
        {"x1": float(X[i, 0]), "x2": float(X[i, 1]), "pred": int(preds[i])}
        for i in range(len(X))
    ]

    notes = ["Perceptron can only represent a linear decision boundary."]
    if dataset == "xor":
        notes.append("XOR is not linearly separable, so training cannot fully solve it.")

    return {
        "dataset": {"points": points},
        "state": {
            "weights": state.weights.tolist(),
            "bias": state.bias,
            "learning_rate": state.learning_rate,
            "epoch": state.epoch,
            "dataset": dataset,
        },
        "metrics": {
            "accuracy": accuracy,
            "mistakes": mistakes,
        },
        "predictions": predictions,
        "boundary": {
            "w1": float(state.weights[0]),
            "w2": float(state.weights[1]),
            "b": float(state.bias),
        },
        "notes": notes,
    }
```

---

## `apps/api/app/routers/perceptron.py`

```python
from fastapi import APIRouter
from app.schemas.perceptron import InitializeRequest, TrainRequest
from app.services.perceptron_service import initialize_state, train_state

router = APIRouter(prefix="/api/perceptron", tags=["perceptron"])


@router.post("/initialize")
def initialize(req: InitializeRequest):
    return initialize_state(req.dataset, req.learning_rate)


@router.post("/train")
def train(req: TrainRequest):
    s = req.state
    return train_state(
        dataset=s.dataset,
        weights=s.weights,
        bias=s.bias,
        learning_rate=s.learning_rate,
        epoch=s.epoch,
        steps=req.steps,
    )
```

Then include it in `apps/api/app/main.py`:

```python
from app.routers.perceptron import router as perceptron_router

app.include_router(perceptron_router)
```

---

# 8. Frontend type + API helpers

## `apps/web/lib/types/perceptron.ts`

```ts
export type DatasetName = "linearly_separable" | "xor";

export type PerceptronResponse = {
    dataset: {
        points: { x1: number; x2: number; label: number }[];
    };
    state: {
        weights: [number, number];
        bias: number;
        learning_rate: number;
        epoch: number;
        dataset: DatasetName;
    };
    metrics: {
        accuracy: number;
        mistakes: number;
    };
    predictions: { x1: number; x2: number; pred: number }[];
    boundary: {
        w1: number;
        w2: number;
        b: number;
    };
    notes: string[];
};
```

## `apps/web/lib/api/perceptron.ts`

```ts
import {apiPost} from "@/lib/api/client";
import type {DatasetName, PerceptronResponse} from "@/lib/types/perceptron";

export async function initializePerceptron(
    dataset: DatasetName,
    learning_rate = 0.1
): Promise<PerceptronResponse> {
    return apiPost("/api/perceptron/initialize", {dataset, learning_rate});
}

export async function trainPerceptron(
    state: PerceptronResponse["state"],
    steps: number
): Promise<PerceptronResponse> {
    return apiPost("/api/perceptron/train", {state, steps});
}
```

And make sure `client.ts` has both `apiGet` and `apiPost`.

---

# 9. First frontend page

## `apps/web/app/perceptron/page.tsx`

```tsx
import {PerceptronDemo} from "@/components/demos/perceptron/PerceptronDemo";

export default function PerceptronPage() {
    return <PerceptronDemo/>;
}
```

---

## `apps/web/components/demos/perceptron/PerceptronDemo.tsx`

```tsx
"use client";

import {useEffect, useState} from "react";
import {initializePerceptron, trainPerceptron} from "@/lib/api/perceptron";
import type {DatasetName, PerceptronResponse} from "@/lib/types/perceptron";
import {PerceptronPlot} from "./PerceptronPlot";

export function PerceptronDemo() {
    const [dataset, setDataset] = useState<DatasetName>("linearly_separable");
    const [data, setData] = useState<PerceptronResponse | null>(null);
    const [loading, setLoading] = useState(false);

    async function init(nextDataset = dataset) {
        setLoading(true);
        try {
            const res = await initializePerceptron(nextDataset, 0.1);
            setData(res);
        } finally {
            setLoading(false);
        }
    }

    async function train(steps: number) {
        if (!data) return;
        setLoading(true);
        try {
            const res = await trainPerceptron(data.state, steps);
            setData(res);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        init("linearly_separable");
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-6">
            <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)] gap-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h1 className="text-3xl font-semibold mb-4">Perceptron → XOR</h1>

                    <p className="text-white/80 mb-4">
                        A perceptron learns a linear decision boundary. That works for linearly separable data, but
                        fails on XOR.
                    </p>

                    <div className="space-y-3 mb-6">
                        <label className="block text-sm text-white/70">Dataset</label>
                        <select
                            value={dataset}
                            onChange={async (e) => {
                                const next = e.target.value as DatasetName;
                                setDataset(next);
                                await init(next);
                            }}
                            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2"
                        >
                            <option value="linearly_separable">Linearly separable</option>
                            <option value="xor">XOR</option>
                        </select>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                        <button onClick={() => init()} className="rounded-2xl px-4 py-2 bg-white text-black">
                            Reset
                        </button>
                        <button onClick={() => train(1)}
                                className="rounded-2xl px-4 py-2 bg-white/10 border border-white/10">
                            Train 1 step
                        </button>
                        <button onClick={() => train(10)}
                                className="rounded-2xl px-4 py-2 bg-white/10 border border-white/10">
                            Train 10 steps
                        </button>
                    </div>

                    {data && (
                        <div className="space-y-3 text-sm text-white/80">
                            <div>Epoch: {data.state.epoch}</div>
                            <div>Weights: [{data.state.weights[0].toFixed(2)}, {data.state.weights[1].toFixed(2)}]</div>
                            <div>Bias: {data.state.bias.toFixed(2)}</div>
                            <div>Accuracy: {(data.metrics.accuracy * 100).toFixed(0)}%</div>
                            <div>Mistakes: {data.metrics.mistakes}</div>
                            <div className="pt-2">
                                {data.notes.map((note, i) => (
                                    <p key={i} className="text-white/60">{note}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {loading && <div className="mt-4 text-white/50">Updating…</div>}
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    {data && <PerceptronPlot data={data}/>}
                </div>
            </div>
        </div>
    );
}
```

---

# 10. Plot for the first pass

For the very first pass, do not overcomplicate D3.
Use plain SVG or lightweight D3.

The plot should show:

* point positions
* true label color
* predicted label ring or stroke
* decision boundary line if possible

If `w2 !== 0`, boundary is:

[
x_2 = -(w_1 x_1 + b)/w_2
]

If `w2` is near zero, show a vertical boundary approximation.

For this slice, that is enough.

---

# 11. What the homepage should be

Keep `app/page.tsx` minimal:

* title
* one paragraph
* “Start with Perceptron”
* link to `/perceptron`

Do not build the whole site shell yet.
Build only enough shell to support the first chapter.

---

# 12. What not to do in this slice

Do **not** add yet:

* sigmoid
* logistic regression
* animation-heavy graph editor
* MDX content system
* chapter sidebar for every future topic
* authentication
* persistent backend sessions
* canvas/webgl
* transformer anything

This slice is about proving the educational loop.

---

# 13. Immediate next task list

Do these now, in order:

1. Create the perceptron kernel file in `packages/educational-kernels/python/kernels/perceptron.py`
2. Add the FastAPI schema, service, and router
3. Confirm backend endpoint works with Postman/browser
4. Create `/perceptron` page and `PerceptronDemo.tsx`
5. Add the API client and types
6. Render the dataset points
7. Add training buttons
8. Draw the decision boundary
9. Check that separable data converges and XOR does not

---

# 14. Success criteria for the pedagogy

When you click between datasets:

* **linearly separable** should become mostly or fully correct after training
* **xor** should stubbornly refuse to become perfect

If that happens and the boundary is visible, the first slice is already doing real conceptual work.

---

# 15. Best next slice after this

Once this works, the next slice should be:

**Logistic regression / sigmoid neuron**

Then after that:

**MLP solves XOR**

That sequence will be beautiful because it creates the exact conceptual ladder:

* perceptron fails
* sigmoid/logistic reframes output
* hidden layer solves XOR
* now hidden representations become necessary, not decorative
