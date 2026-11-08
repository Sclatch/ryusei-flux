import MeteorShower from "@/app/components/ui/MeteorShower";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-950 text-zinc-100">

      {/* Main grows to fill the space between the top of the page and the footer */}
      <main className="flex flex-1 flex-col">
        {/* Hero: fills main and vertically centers its content */}
        <section className="relative flex flex-1 items-center overflow-hidden">

          {/* Meteor shower background */}
          <MeteorShower />

          <div className="relative z-10 mx-auto flex w-full flex-col gap-8 px-6 md:px-24">
            <div>
              {/* PLEASE CHANGE THIS LOGO URL LATER */}
              <Image
                src="/logos/ryuseitext.png"
                alt="Ryusei"
                width={500}
                height={150} // use your PNG's real dimensions
                className="h-auto w-18 brightness-0 invert"
              />
              <h1 className="font-gloock text-8xl tracking-tight">
                Flux
              </h1>
            </div>

            <p className="font-serif text-zinc-400">
              Ryusei Flux is a collection of tools for my personal use. <br/>
              All tools are free to use, no data collection or tracking, and no ads.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#tools"
                className="rounded-md px-5 py-2.5 text-sm transition-colors hover:bg-zinc-400 bg-white text-zinc-900 hover:bg-zinc-200"
              >
                Browse tools
              </a>
              <a
                href="https://github.com/Sclatch/ryusei-flux"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border px-5 py-2.5 text-sm transition-colors border-zinc-700 text-zinc-100 hover:bg-zinc-900"
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