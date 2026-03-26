# Project Structure Overview

This repository is an interactive computational textbook project that moves from
early ANN concepts toward later LLM ideas, one polished vertical slice at a
time.

## Current shape

The monorepo currently has three main code areas:

- `apps/web`: Next.js frontend for chapter pages, controls, and visualizations
- `apps/api`: FastAPI backend for educational compute endpoints
- `packages/educational-kernels`: from-scratch Python kernels and tests

There is also a small docs layer:

- `docs/demo-specs`: implementation continuity docs for individual slices

## What exists right now

### Frontend

`apps/web` currently contains:

- homepage at `/`
- chapter page at `/perceptron`
- `PerceptronDemo.tsx` for controls, state display, and explanatory copy
- `PerceptronPlot.tsx` for the 2D perceptron visualization
- `lib/api` for small API helpers
- `lib/types` for response and state types

The frontend is intentionally lightweight. It does not yet have a broader
chapter system, MDX content layer, or reusable design system beyond what this
slice needs.

### Backend

`apps/api` currently contains:

- FastAPI app entrypoint
- perceptron request schemas
- perceptron router
- perceptron service layer
- local bootstrap for importing shared educational kernels from the monorepo

The backend is stateless right now. It computes from explicit request payloads
and returns explicit educational responses.

### Educational kernels

`packages/educational-kernels/python` currently contains:

- `kernels/perceptron.py`
- `tests/test_perceptron.py`

This package is the home for transparent math-first implementations that can be
reused by the backend.

## Current vertical slice

The implemented slice is:

- **Perceptron -> XOR**

It already covers:

- perceptron kernel from scratch
- API endpoints to initialize and train
- frontend controls for dataset switching and training
- visualization of points, predictions, and decision boundary
- concise educational framing of linear separability and XOR failure

The detailed slice continuity doc lives in:

- `docs/demo-specs/perceptron.md`

## Expansion paths that exist right now

The current structure supports a few clear next steps without major rework:

### 1. More educational kernels

The `packages/educational-kernels/python` area can grow with additional
math-first kernels, for example:

- sigmoid neuron / logistic regression
- simple multilayer perceptron for XOR
- later optimization or representation examples

### 2. More API-backed slices

The `apps/api/app/routers`, `schemas`, and `services` structure can expand one
slice at a time by adding new endpoints with explicit payloads for each demo.

### 3. More frontend chapters

The `apps/web/app` route structure can expand with one route per chapter, while
`components/demos` can hold chapter-specific interactive components.

### 4. Richer textbook content

Once a few slices exist, the project can add:

- MDX-backed chapter prose
- chapter navigation
- shared educational layout components

That should come after more slices prove out the teaching pattern.

## What the codebase does not need yet

At the current stage, the repo does not need:

- generalized training frameworks
- persistent backend sessions
- large shared UI abstraction layers
- broad curriculum scaffolding before more slices exist

The best growth path is still vertical: finish one concept cleanly, then add the
next concept in the same end-to-end pattern.
