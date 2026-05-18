/**
 * Client helper: fetch AI-suggested competitors/queries for GEO/E-E-A-T competitive runs.
 */

export type GeoEeatCompetitiveInputs = {
    competitors: string[];
    queries: string[];
};

export type SuggestGeoEeatCompetitiveResult =
    | { ok: true; data: GeoEeatCompetitiveInputs }
    | { ok: false; error: string };

function parseLists(data: unknown): GeoEeatCompetitiveInputs {
    const record = data as { competitors?: unknown; queries?: unknown };
    const competitors = Array.isArray(record.competitors)
        ? record.competitors.filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
        : [];
    const queries = Array.isArray(record.queries)
        ? record.queries.filter((q): q is string => typeof q === 'string' && q.trim().length > 0)
        : [];
    return { competitors, queries };
}

/** POST suggest-competitors-queries; used when competitive is on but lists are empty. */
export async function suggestGeoEeatCompetitiveInputs(
    url: string,
    fetchFn: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
    suggestEndpoint: string,
    options?: { signal?: AbortSignal; timeoutMs?: number }
): Promise<SuggestGeoEeatCompetitiveResult> {
    const controller = new AbortController();
    const timeoutMs = options?.timeoutMs ?? 60_000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const signal = options?.signal ?? controller.signal;

    try {
        const res = await fetchFn(suggestEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
            signal,
        });
        clearTimeout(timeoutId);

        const text = await res.text();
        let data: { error?: string; competitors?: string[]; queries?: string[] } = {};
        if (text.trim()) {
            try {
                data = JSON.parse(text) as typeof data;
            } catch {
                return { ok: false, error: 'Invalid response from suggest API.' };
            }
        }

        if (!res.ok) {
            return { ok: false, error: data.error ?? `Suggest failed (${res.status})` };
        }

        return { ok: true, data: parseLists(data) };
    } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === 'AbortError') {
            return { ok: false, error: 'Suggest request timed out.' };
        }
        return { ok: false, error: err instanceof Error ? err.message : 'Suggest request failed.' };
    }
}

export function parseGeoEeatCompetitiveFields(competitorsText: string, queriesText: string): GeoEeatCompetitiveInputs {
    const competitors = competitorsText
        .trim()
        .split(/\n/)
        .map((s) => s.trim())
        .filter(Boolean);
    const queries = queriesText
        .trim()
        .split(/\n/)
        .map((s) => s.trim())
        .filter(Boolean);
    return { competitors, queries };
}
