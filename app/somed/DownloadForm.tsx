"use client";

import { useRef, useState, type FormEvent } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "done"; downloadUrl: string; filename?: string };

function parseUrl(value: string): URL | null {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

export default function DownloadForm() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  const loading = status.kind === "loading";
  const error = status.kind === "error" ? status.message : null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const url = parseUrl(value);
    if (!url) {
      setStatus({
        kind: "error",
        message: "Enter a full link that starts with http:// or https://",
      });
      inputRef.current?.focus();
      return;
    }

    setStatus({ kind: "loading" });
    try {
      // TODO: build this endpoint (app/api/somedo/route.ts). It should accept
      // { url } and respond with { downloadUrl: string, filename?: string }.
      const res = await fetch("/api/somedo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.href }),
      });
      if (!res.ok) throw new Error("Request failed");

      const data = (await res.json()) as {
        downloadUrl: string;
        filename?: string;
      };
      setStatus({ kind: "done", ...data });
    } catch {
      setStatus({
        kind: "error",
        message: "Couldn’t fetch that link. Check the URL and try again.",
      });
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setValue(text);
      setStatus({ kind: "idle" });
    } catch {
      // Clipboard access denied: the user can still paste by hand.
    }
    inputRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-2xl">
      <label
        htmlFor="url-input"
        className="mb-2 block font-serif text-sm text-zinc-400"
      >
        Enter URL
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          ref={inputRef}
          id="url-input"
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder="Paste video/image URL here..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (status.kind !== "idle") setStatus({ kind: "idle" });
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "url-error" : undefined}
          className={`min-w-0 flex-1 rounded-md border bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 ${
            error ? "border-red-500/70" : "border-zinc-700"
          } ${focusRing}`}
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handlePaste}
            className={`rounded-md border border-zinc-700 px-5 py-2.5 text-sm text-zinc-100 transition-colors hover:bg-zinc-900 ${focusRing}`}
          >
            Paste
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`rounded-md bg-white px-5 py-2.5 text-sm text-zinc-900 transition-colors hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-60 ${focusRing}`}
          >
            {loading ? "Preparing…" : "Download"}
          </button>
        </div>
      </div>

      {/* Status messages are announced to screen readers */}
      <div aria-live="polite" className="mt-3 min-h-6 text-sm">
        {error && (
          <p id="url-error" className="text-red-400">
            {error}
          </p>
        )}
        {status.kind === "done" && (
          <p className="text-zinc-300">
            Ready.{" "}
            <a
              href={status.downloadUrl}
              download={status.filename}
              className={`text-sky-400 underline underline-offset-4 hover:text-sky-300 ${focusRing}`}
            >
              Save file
            </a>
          </p>
        )}
      </div>
    </form>
  );
}