import { QrCode } from "lucide-react";

export default function QrButton({ onClick, showLabel = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Gerar QR Code"
      aria-label="Gerar QR Code"
      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
    >
      <QrCode className="h-3.5 w-3.5" />
      {showLabel && "QR Code"}
    </button>
  );
}
