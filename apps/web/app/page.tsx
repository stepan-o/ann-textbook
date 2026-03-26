import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center bg-stone-950 px-6 py-20 text-stone-100">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-3xl border border-stone-800 bg-stone-900/70 p-10 shadow-2xl shadow-stone-950/30">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-400">
            ANN Textbook
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-stone-50">
            Interactive chapters from perceptrons to modern language models.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-stone-300">
            The first vertical slice focuses on the perceptron, linear
            separability, and why XOR forces us to think beyond a single linear
            boundary.
          </p>
        </div>

        <div>
          <Link
            href="/perceptron"
            className="inline-flex items-center rounded-full bg-stone-100 px-5 py-3 text-sm font-medium text-stone-950 transition hover:bg-white"
          >
            Start with Perceptron
          </Link>
        </div>
      </div>
    </main>
  );
}
