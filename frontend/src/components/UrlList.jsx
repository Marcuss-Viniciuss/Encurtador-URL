import { BarChart3, ExternalLink, RefreshCw } from "lucide-react";
import CopyButton from "./CopyButton";
import QrButton from "./QrButton";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

export default function UrlList({ urls, onRefresh, onShowQr }) {
  return (
    <section className="mt-14">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-zinc-100">Seus links</h2>
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            {urls.length}
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Atualizar
        </button>
      </div>

      {urls.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 py-14 text-center text-sm text-zinc-500">
          Nenhum link ainda. Cole uma URL acima para começar.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/50">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-3 font-medium">Link curto</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Original</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Criado</th>
                <th className="px-4 py-3 text-right font-medium">
                  <span className="inline-flex items-center justify-end gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5" />
                    Cliques
                  </span>
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70">
              {urls.map((u) => (
                <tr key={u.short_code} className="transition hover:bg-zinc-800/40">
                  <td className="px-4 py-3.5">
                    <a
                      href={u.short_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 font-mono text-xs text-emerald-300 ring-1 ring-inset ring-emerald-500/20 transition hover:bg-emerald-500/20"
                    >
                      {u.short_url.replace(/^https?:\/\//, "")}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                  <td
                    className="hidden max-w-[260px] truncate px-4 py-3.5 text-zinc-500 md:table-cell"
                    title={u.original_url}
                  >
                    {u.original_url}
                  </td>
                  <td className="hidden px-4 py-3.5 text-zinc-500 sm:table-cell">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-zinc-100">
                    {u.clicks}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <QrButton onClick={() => onShowQr(u)} />
                      <CopyButton text={u.short_url} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
