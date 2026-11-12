const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function request(path, options) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // 422 do FastAPI devolve um array em "detail"
    const message = Array.isArray(body.detail)
      ? "URL inválida. Use um link completo, ex.: https://exemplo.com"
      : body.detail;
    throw new Error(message ?? "Algo deu errado. Tente novamente.");
  }
  return res.json();
}

export const createUrl = (url) =>
  request("/api/urls", { method: "POST", body: JSON.stringify({ url }) });

export const listUrls = () => request("/api/urls");
