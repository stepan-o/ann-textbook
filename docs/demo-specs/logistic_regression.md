---

## Slice 2 spec: Logistic Regression / Sigmoid Neuron

### Learning goals

This slice should teach:

* a sigmoid neuron turns a linear score into a value between 0 and 1
* logistic regression keeps the same linear core as the perceptron, but changes the output interpretation and learning rule
* the output is probability-like, not a hard threshold during training
* cross-entropy gives a smoother training signal than the perceptron update rule
* logistic regression still learns only a **linear** boundary, so XOR still remains unsolved

### Scope

This slice should include:

* homepage link updated to include the new chapter
* `/logistic-regression` chapter page
* controls for dataset selection, reset, train 1 step, train 10 steps
* 2D visualization of:

    * points
    * predicted probabilities
    * thresholded predictions
    * current decision boundary
* FastAPI endpoints for initialize and train
* from-scratch NumPy logistic regression kernel
* concise explanatory copy connecting it to the perceptron slice

### Mathematical core

For input `x = [x1, x2]`:

```text
z = w1 * x1 + w2 * x2 + b
p = sigmoid(z) = 1 / (1 + exp(-z))
```

Prediction for display:

```text
y_hat = 1 if p >= 0.5 else 0
```

Loss over dataset:

```text
L = - mean( y * log(p) + (1 - y) * log(1 - p) )
```

Gradient descent update:

```text
dw = (1/N) * X^T (p - y)
db = mean(p - y)

w <- w - lr * dw
b <- b - lr * db
```

### Datasets

Reuse the same two datasets:

* `linearly_separable`
* `xor`

That keeps the comparison with the perceptron slice clean.

### Pedagogical success condition

The reader should come away with:

* “This is basically a single sigmoid neuron / logistic regression model.”
* “It learns more smoothly than a perceptron.”
* “But it is still only one linear boundary, so it still cannot solve XOR.”
* “Changing the output and loss helps learning, but does not change representational capacity.”

That last sentence is the core point.

---

## Recommended file additions

```text
apps/
  web/
    app/
      logistic-regression/
        page.tsx
    components/
      demos/
        logistic/
          LogisticRegressionDemo.tsx
          LogisticRegressionPlot.tsx
    lib/
      api/
        logistic.ts
      types/
        logistic.ts

  api/
    app/
      routers/
        logistic.py
      schemas/
        logistic.py
      services/
        logistic_service.py

packages/
  educational-kernels/
    python/
      kernels/
        logistic_regression.py
      tests/
        test_logistic_regression.py

docs/
  demo-specs/
    logistic-regression.md
```

This fits the current repo growth pattern exactly: more kernels, more API-backed slices, more frontend chapters, one
concept at a time.

---