import { useCallback, useEffect, useState } from "react";
import { createUrl, listUrls } from "./api";
import UrlForm from "./components/UrlForm";
import UrlList from "./components/UrlList";
import QrModal from "./components/QrModal";

export default function App() {
  const [urls, setUrls] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [qrLink, setQrLink] = useState(null); // link cujo QR está aberto (null = modal fechado)

  const refresh = useCallback(async () => {
    try {
      setUrls(await listUrls());
    } catch {
      // a lista é secundária: falhar aqui não deve bloquear o formulário
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const closeQr = useCallback(() => setQrLink(null), []);

  async function handleShorten(url) {
    setStatus("loading");
    setError(null);
    try {
      const created = await createUrl(url);
      setResult(created);
      setStatus("success");
      setUrls((prev) => [created, ...prev]);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100 antialiased">
      {/* brilho sutil no topo */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_70%)]" />

      <main className="relative mx-auto max-w-3xl px-4 py-20 sm:py-28">
        <header className="mb-10 text-center">
          <h1 className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-5xl font-bold tracking-tighter text-transparent sm:text-6xl">
            Links curtos,
            <br />
            resultados claros.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-zinc-400">
            Encurte qualquer URL e acompanhe cada clique em um só lugar.
          </p>
        </header>

        <UrlForm
          onSubmit={handleShorten}
          status={status}
          error={error}
          result={result}
          onShowQr={setQrLink}
        />
        <UrlList urls={urls} onRefresh={refresh} onShowQr={setQrLink} />
      </main>

      <QrModal link={qrLink} onClose={closeQr} />
    </div>
  );
}
