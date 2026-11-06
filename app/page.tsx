import MeteorShower from "@/app/components/ui/MeteorShower";

const GITHUB_URL = "https://github.com/Sclatch/ryusei-flux";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">

      {/* Main grows to fill the space between the top of the page and the footer */}
      <main className="flex flex-1 flex-col">
        {/* Hero: fills main and vertically centers its content */}
        <section className="relative flex flex-1 items-center overflow-hidden">
          <MeteorShower />

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-start gap-8 px-6 py-16">
            <div>
              <p className="font-gloock leading-tight">
                Ryusei
              </p>
              <h1 className="font-gloock text-4xl tracking-tight sm:text-5xl md:text-6xl">
                Flux
              </h1>
            </div>

            <p className="max-w-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
              Ryusei Flux is a collection of tools for my personal use. <br/>
              All tools are free to use, no data collection or tracking, and no ads.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#tools"
                className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Browse tools
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}