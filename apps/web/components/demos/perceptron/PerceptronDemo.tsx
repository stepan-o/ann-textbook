"use client";

import { useEffect, useState } from "react";

import { initializePerceptron, trainPerceptron } from "@/lib/api/perceptron";
import type {
  DatasetName,
  PerceptronResponse,
} from "@/lib/types/perceptron";

import { PerceptronPlot } from "./PerceptronPlot";

export function PerceptronDemo() {
  const [dataset, setDataset] =
    useState<DatasetName>("linearly_separable");
  const [data, setData] = useState<PerceptronResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function init(nextDataset = dataset) {
    setLoading(true);
    setError(null);

    try {
      const response = await initializePerceptron(nextDataset, 0.1);
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not initialize the perceptron demo.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function train(steps: number) {
    if (!data) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await trainPerceptron(data.state, steps);
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not train the perceptron.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialState() {
      setLoading(true);
      setError(null);

      try {
        const response = await initializePerceptron("linearly_separable", 0.1);
        if (!cancelled) {
          setData(response);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not initialize the perceptron demo.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialState();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,113,108,0.16),_transparent_36%),linear-gradient(180deg,_#111827_0%,_#020617_100%)] px-6 py-10 text-stone-100">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[390px_minmax(0,1fr)]">
        <section className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/25 backdrop-blur">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
              Vertical Slice 1
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-50">
              Perceptron -&gt; XOR
            </h1>
            <p className="text-sm leading-6 text-stone-300">
              A perceptron learns a single linear decision boundary. That works
              on linearly separable data and breaks in a revealing way on XOR.
            </p>
          </div>

          <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-stone-950/60 p-4">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                Dataset
              </p>
              <select
                value={dataset}
                onChange={async (event) => {
                  const nextDataset = event.target.value as DatasetName;
                  setDataset(nextDataset);
                  await init(nextDataset);
                }}
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-stone-900 px-3 py-2 text-sm text-stone-100 outline-none transition focus:border-cyan-400"
              >
                <option value="linearly_separable">Linearly separable</option>
                <option value="xor">XOR</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void init()}
                disabled={loading}
                className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => void train(1)}
                disabled={loading || !data}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-stone-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Train 1 Step
              </button>
              <button
                type="button"
                onClick={() => void train(10)}
                disabled={loading || !data}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-stone-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Train 10 Steps
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Try training on both datasets and compare what happens to the
              mistake count.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-stone-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Model State
              </p>

              {data ? (
                <dl className="mt-3 space-y-3 text-sm text-stone-200">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-stone-400">Epoch</dt>
                    <dd>{data.state.epoch}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-stone-400">Weights</dt>
                    <dd>
                      [{data.state.weights[0].toFixed(2)},{" "}
                      {data.state.weights[1].toFixed(2)}]
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-stone-400">Bias</dt>
                    <dd>{data.state.bias.toFixed(2)}</dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-3 text-sm text-stone-400">
                  Waiting for the first backend response.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-stone-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Metrics
              </p>

              {data ? (
                <dl className="mt-3 space-y-3 text-sm text-stone-200">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-stone-400">Accuracy</dt>
                    <dd>{(data.metrics.accuracy * 100).toFixed(0)}%</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-stone-400">Mistakes</dt>
                    <dd>{data.metrics.mistakes}</dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-3 text-sm text-stone-400">
                  Metrics will appear after initialization.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-stone-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Notes
            </p>

            {data ? (
              <div className="mt-3 space-y-2 text-sm leading-6 text-stone-300">
                {data.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-stone-400">
                The educational notes from the backend will appear here.
              </p>
            )}
          </div>

          {loading ? (
            <p className="mt-4 text-sm text-cyan-300">Updating model state...</p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/25 backdrop-blur">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Visualization
              </p>
              <h2 className="mt-1 text-xl font-medium text-stone-50">
                Decision boundary preview
              </h2>
            </div>
            <div className="rounded-full border border-white/10 bg-stone-950/60 px-3 py-1 text-xs text-stone-300">
              {dataset === "xor" ? "XOR" : "Linearly separable"}
            </div>
          </div>

          <p className="mb-5 max-w-2xl text-sm leading-6 text-stone-300">
            Train on the separable dataset to watch the line settle into a clean
            split. Switch to XOR and the mismatched rings should remain, even
            after extra training.
          </p>

          <PerceptronPlot data={data} />
        </section>
      </div>
    </main>
  );
}
