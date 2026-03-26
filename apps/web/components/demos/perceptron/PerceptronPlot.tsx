export function PerceptronPlot() {
  return (
    <div className="flex h-full min-h-[420px] flex-col rounded-2xl border border-dashed border-stone-700 bg-stone-950/50 p-4">
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-stone-100">Plot Placeholder</h2>
        <p className="max-w-xl text-sm leading-6 text-stone-300">
          Dataset points, predictions, and the perceptron decision boundary will
          render here in the next task.
        </p>
      </div>

      <div className="mt-6 flex flex-1 items-center justify-center rounded-2xl border border-stone-800 bg-stone-900/60">
        <svg
          viewBox="0 0 320 320"
          className="h-full w-full max-w-[480px]"
          aria-label="Perceptron plot placeholder"
        >
          <rect x="40" y="24" width="240" height="240" fill="none" stroke="#57534e" />
          <line x1="40" y1="264" x2="280" y2="24" stroke="#a8a29e" strokeDasharray="8 8" />
          <circle cx="96" cy="208" r="10" fill="#f5f5f4" stroke="#78716c" strokeWidth="2" />
          <circle cx="224" cy="80" r="10" fill="#292524" stroke="#e7e5e4" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
