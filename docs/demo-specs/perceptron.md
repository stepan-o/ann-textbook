# Perceptron -> XOR

## Learning goals

This vertical slice should help a reader quickly grasp five ideas:

- a perceptron computes a weighted sum and applies a threshold
- in 2D, a single perceptron can only form one linear decision boundary
- linearly separable data can be learned by moving that boundary
- XOR is a structural failure case for a single perceptron
- hidden layers matter later because they let us combine multiple boundaries

## Scope

This slice is intentionally small and end-to-end:

- homepage that introduces the textbook and links into the chapter
- `/perceptron` chapter page
- interactive controls for dataset selection, reset, train 1 step, and train 10 steps
- 2D visualization of points, predictions, and decision boundary
- FastAPI endpoints for initialize and train
- from-scratch NumPy perceptron kernel

The main success condition is pedagogical clarity, not feature breadth.

## Mathematical core

The kernel is a classic perceptron, not logistic regression.

For an input `x = [x1, x2]`:

```text
z = w1 * x1 + w2 * x2 + b
```

Prediction:

```text
y_hat = 1 if z >= 0 else 0
```

Update rule:

```text
w <- w + lr * (y - y_hat) * x
b <- b + lr * (y - y_hat)
```

The two datasets are:

- `linearly_separable`: labels can be separated by one line
- `xor`: labels cannot be separated by one line

## Backend contract summary

Dataset names:

- `linearly_separable`
- `xor`

Endpoints:

- `POST /api/perceptron/initialize`
- `POST /api/perceptron/train`

Initialize request:

```json
{
  "dataset": "linearly_separable",
  "learning_rate": 0.1
}
```

Train request:

```json
{
  "state": {
    "weights": [0.0, 0.0],
    "bias": 0.0,
    "learning_rate": 0.1,
    "epoch": 0,
    "dataset": "xor"
  },
  "steps": 10
}
```

Response shape:

- `dataset.points`
- `state`
- `metrics`
- `predictions`
- `boundary`
- `notes`

The response should stay explicit and educational rather than compressed or abstract.

## Frontend interaction summary

The chapter page should let the reader:

- start on the linearly separable dataset
- switch between `linearly_separable` and `xor`
- reset the current dataset
- train for 1 step or 10 steps
- inspect epoch, weights, bias, accuracy, mistakes, and notes
- compare true labels, predictions, and the current boundary in the plot

If the user only skims, the page should still communicate:

- one line can solve the separable dataset
- one line cannot solve XOR

## What this slice intentionally does not include

Do not expand this slice with:

- sigmoid or logistic regression
- multilayer perceptrons
- persistent sessions or database state
- MDX chapter system
- advanced graph editing
- pan/zoom/canvas/WebGL interactions
- generalized training frameworks
- unrelated ANN or transformer topics

## Next slice

The next slice should be:

**Logistic regression / sigmoid neuron**

That keeps the progression clean:

- perceptron shows the hard threshold model
- XOR exposes the limit of a single linear boundary
- later slices can introduce hidden layers as a necessary representational step
