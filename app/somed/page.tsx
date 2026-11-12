import type { Metadata } from "next";
import DownloadForm from "./DownloadForm";

export const metadata: Metadata = {
  title: "Somedo - Flux",
  description:
    "Download videos and images from social media posts by pasting the post's URL.",
};

export default function SomedoPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-950 text-zinc-100">
      <main className="flex flex-1 flex-col">
        <section className="relative flex flex-1 items-center overflow-hidden">
          {/* py-24 keeps content clear of the fixed burger button */}
          <div className="relative z-10 mx-auto flex w-full flex-col gap-8 px-6 py-24 md:px-24">
            <h1 className="font-gloock tracking-tight">
              <span className="block text-2xl">Flux's</span>
              <span className="block text-6xl sm:text-8xl">Somedo</span>
            </h1>

            <p className="max-w-xl font-serif text-zinc-400">
              Download videos and images from various social media platforms.<br/>
              Enter the URL of the post, then click “Download”.
            </p>

            <DownloadForm />

          </div>
        </section>
      </main>
    </div>
  );
}