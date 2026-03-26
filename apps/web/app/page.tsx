import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_32%),linear-gradient(180deg,_#111827_0%,_#020617_100%)] px-6 py-20 text-stone-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-[32px] border border-white/10 bg-white/6 p-10 shadow-2xl shadow-black/25 backdrop-blur md:p-14">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
            Interactive Computational Textbook
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-stone-50 md:text-5xl">
            Learn neural networks from first principles, from early ANNs to
            modern LLM ideas.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-stone-300 md:text-lg">
            This project pairs transparent math, inspectable code, and live
            visual demos so each chapter can show not just what works, but why.
            The first chapter starts with the perceptron and the famous XOR
            failure that makes hidden layers feel necessary.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-stone-950/55 p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-stone-100">
              Chapter 1
            </p>
            <p className="text-sm leading-6 text-stone-300">
              Perceptron to XOR: linear separability, decision boundaries, and
              the limit of a single neuron.
            </p>
          </div>

          <Link
            href="/perceptron"
            className="inline-flex items-center justify-center rounded-full bg-stone-100 px-5 py-3 text-sm font-medium text-stone-950 transition hover:bg-white"
          >
            Start Chapter 1
          </Link>
        </div>
      </div>
    </main>
  );
}
