import Link from "next/link";

const GITHUB_URL = "https://github.com/Sclatch/ryusei-flux";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600 dark:focus-visible:outline-sky-400";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
      <style>{`
        @keyframes ryusei-streak {
          0%   { transform: rotate(20deg) translateX(-30vw); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: rotate(20deg) translateX(120vw); opacity: 0; }
        }
        .ryusei-streak {
          animation: ryusei-streak 1.8s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ryusei-streak { animation: none; opacity: 0; }
        }
      `}</style>

      {/* Navigation */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <a
          href="#"
          className={`text-base font-semibold tracking-tight ${focusRing}`}
        >
          Ryusei Flux
        </a>
      </header>

      {/* Main content - flex grows to fill available space */}
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* One-time meteor streak on page load */}
          <div
            aria-hidden="true"
            className="ryusei-streak pointer-events-none absolute left-[6%] top-[14%] h-[2px] w-72 rounded-full bg-gradient-to-r from-transparent via-sky-500/60 to-sky-400"
          />

          <div className="mx-auto max-w-5xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
            <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl md:leading-[1.05]">
              Free tools that improve your social life.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Ryusei Flux is a growing collection of practical utilities for my personal use, and I want to share them with the world. All tools are free to use, and I hope they help you as much as they help me.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#tools"
                className={`rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 ${focusRing}`}
              >
                Browse tools
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900 ${focusRing}`}
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-zinc-500 dark:text-zinc-400">
          {/* Credit */}
          <p className={`text-sm text-zinc-500 dark:text-zinc-400 ${focusRing}`}>
            Crafted with ❤️ by Sclatch, 2026.<br />
            Built with Next.js and Tailwind CSS.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors hover:text-zinc-900 dark:hover:text-white ${focusRing}`}
          >
            Source on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}