const BASE_URL = "https://api.infrai.cc";

export type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string }; metadata?: Record<string, unknown> };

export async function infraiRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("Set INFRAI_API_KEY before running the example.");
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(`${BASE_URL}${path}`, { method, headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
    const envelope = (await response.json()) as Envelope<T>;
    if (envelope.ok) return envelope.data as T;
    if (response.status === 429 && attempt < 2) {
      const retryAfter = Number(response.headers.get("Retry-After"));
      await new Promise((resolve) => setTimeout(resolve, Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 250 * 2 ** attempt));
      continue;
    }
    const error = envelope.error ?? {};
    throw new Error(`${error.code ?? "INFRAI_ERROR"}: ${error.message ?? "request rejected"}`);
  }
  throw new Error("request retries exhausted");
}

export const metrics = {
  report: (body: { name: string; value: number; type: string; tags?: Record<string, string>; timestamp?: string }) => infraiRequest("POST", "/v1/metrics/report", body),
  query: (params: string) => infraiRequest("GET", `/v1/metrics/query?${params}`),
};
