import { PerceptronPlot } from "./PerceptronPlot";

export function PerceptronDemo() {
  return (
    <main className="min-h-screen bg-stone-950 px-6 py-10 text-stone-100">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-3xl border border-stone-800 bg-stone-900/80 p-6">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-stone-400">
              Vertical Slice 1
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-50">
              Perceptron -&gt; XOR
            </h1>
            <p className="text-sm leading-6 text-stone-300">
              This placeholder page sets up the chapter shell for the first
              interactive demo. Training controls and model state will be wired
              in next.
            </p>
          </div>

          <div className="mt-8 space-y-4 rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                Dataset
              </p>
              <div className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-300">
                Linearly separable
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled
                className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-950 opacity-60"
              >
                Initialize
              </button>
              <button
                type="button"
                disabled
                className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300"
              >
                Train 1 Step
              </button>
              <button
                type="button"
                disabled
                className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300"
              >
                Train 10 Steps
              </button>
              <button
                type="button"
                disabled
                className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300"
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-stone-800 bg-stone-900/80 p-6">
          <PerceptronPlot />
        </section>
      </div>
    </main>
  );
}
