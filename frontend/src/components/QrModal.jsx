import { useEffect, useRef } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Download, X } from "lucide-react";
import CopyButton from "./CopyButton";

const PNG_SIZE = 1024; // alta resolução para impressão
const QR_FG = "#09090b";
const QR_BG = "#ffffff";

function saveBlob(blob, filename) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export default function QrModal({ link, onClose }) {
  const svgBoxRef = useRef(null);
  const canvasBoxRef = useRef(null);
  const closeBtnRef = useRef(null);

  // ESC fecha, trava o scroll do fundo e move o foco para o modal
  useEffect(() => {
    if (!link) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [link, onClose]);

  if (!link) return null;

  function downloadPng() {
    const canvas = canvasBoxRef.current?.querySelector("canvas");
    canvas?.toBlob(
      (blob) => blob && saveBlob(blob, `qr-${link.short_code}.png`),
      "image/png"
    );
  }

  function downloadSvg() {
    const svg = svgBoxRef.current?.querySelector("svg");
    if (!svg) return;
    const source = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    saveBlob(blob, `qr-${link.short_code}.svg`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="animate-fade-in absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-title"
        className="animate-modal-in relative w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/60"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 id="qr-title" className="text-base font-semibold text-zinc-100">
              QR Code
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">Aponte a câmera para abrir o link.</p>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Fundo branco + alto contraste garantem leitura por qualquer câmera */}
        <div
          ref={svgBoxRef}
          className="rounded-2xl bg-white p-3 shadow-inner"
        >
          <QRCodeSVG
            value={link.short_url}
            size={256}
            level="M"
            marginSize={1}
            bgColor={QR_BG}
            fgColor={QR_FG}
            className="h-auto w-full"
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2">
          <span className="truncate font-mono text-xs text-zinc-400">
            {link.short_url.replace(/^https?:\/\//, "")}
          </span>
          <CopyButton text={link.short_url} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={downloadPng}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.97]"
          >
            <Download className="h-4 w-4" />
            PNG
          </button>
          <button
            onClick={downloadSvg}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-800 active:scale-[0.97]"
          >
            <Download className="h-4 w-4" />
            SVG
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500">
          O código aponta para o link curto, não para o destino final.
        </p>

        {/* Canvas oculto em alta resolução, usado apenas para exportar o PNG */}
        <div ref={canvasBoxRef} className="hidden" aria-hidden="true">
          <QRCodeCanvas
            value={link.short_url}
            size={PNG_SIZE}
            level="M"
            marginSize={2}
            bgColor={QR_BG}
            fgColor={QR_FG}
          />
        </div>
      </div>
    </div>
  );
}
