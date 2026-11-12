import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text, showLabel = false }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard indisponível (ex.: contexto não seguro)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copiar link"
      aria-label="Copiar link"
      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {showLabel && (copied ? "Copiado" : "Copiar")}
    </button>
  );
}
