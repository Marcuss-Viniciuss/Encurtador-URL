import { useState } from "react";
import { AlertCircle, ExternalLink, Link2, Loader2, Scissors } from "lucide-react";
import CopyButton from "./CopyButton";
import QrButton from "./QrButton";

export default function UrlForm({ onSubmit, status, error, result, onShowQr }) {
  const [value, setValue] = useState("");
  const loading = status === "loading";

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  }

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <div className="group flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-2 pl-4 shadow-2xl shadow-black/40 transition focus-within:border-zinc-600 focus-within:ring-4 focus-within:ring-white/10">
          <Link2 className="h-5 w-5 shrink-0 text-zinc-500 transition group-focus-within:text-zinc-300" />
          <input
            type="url"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Cole sua URL longa aqui..."
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none sm:text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Scissors className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{loading ? "Encurtando" : "Encurtar"}</span>
          </button>
        </div>
      </form>

      {status === "error" && (
        <p
          role="alert"
          className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      {status === "success" && result && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-400/80">
              Link criado
            </p>
            <a
              href={result.short_url}
              target="_blank"
              rel="noreferrer"
              className="mt-0.5 inline-flex max-w-full items-center gap-1.5 truncate font-mono text-sm text-emerald-300 hover:underline"
            >
              {result.short_url.replace(/^https?:\/\//, "")}
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <QrButton onClick={() => onShowQr(result)} />
            <CopyButton text={result.short_url} showLabel />
          </div>
        </div>
      )}
    </section>
  );
}
