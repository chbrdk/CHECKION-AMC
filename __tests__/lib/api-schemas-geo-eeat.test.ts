import { describe, expect, it } from 'vitest';
import { geoEeatBodySchema } from '@/lib/api-schemas';

describe('geoEeatBodySchema', () => {
    const baseUrl = 'https://example.com';

    it('rejects runCompetitive without competitors or queries', () => {
        const result = geoEeatBodySchema.safeParse({
            url: baseUrl,
            runCompetitive: true,
            competitors: [],
            queries: [],
        });
        expect(result.success).toBe(false);
    });

    it('accepts runCompetitive with at least one query', () => {
        const result = geoEeatBodySchema.safeParse({
            url: baseUrl,
            runCompetitive: true,
            competitors: [],
            queries: ['Frage 1'],
        });
        expect(result.success).toBe(true);
    });

    it('accepts full run without competitive flag', () => {
        const result = geoEeatBodySchema.safeParse({ url: baseUrl });
        expect(result.success).toBe(true);
    });
});
