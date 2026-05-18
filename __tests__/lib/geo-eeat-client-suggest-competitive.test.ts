import { describe, expect, it, vi } from 'vitest';
import {
    parseGeoEeatCompetitiveFields,
    suggestGeoEeatCompetitiveInputs,
} from '@/lib/geo-eeat/client-suggest-competitive';

describe('geo-eeat client-suggest-competitive', () => {
    it('parseGeoEeatCompetitiveFields splits newline lists', () => {
        expect(
            parseGeoEeatCompetitiveFields('a.de\nb.de', 'Frage 1\nFrage 2')
        ).toEqual({
            competitors: ['a.de', 'b.de'],
            queries: ['Frage 1', 'Frage 2'],
        });
    });

    it('suggestGeoEeatCompetitiveInputs returns competitors and queries', async () => {
        const fetchFn = vi.fn().mockResolvedValue(
            new Response(
                JSON.stringify({
                    competitors: ['competitor.de'],
                    queries: ['Was ist das?'],
                }),
                { status: 200 }
            )
        );

        const result = await suggestGeoEeatCompetitiveInputs(
            'https://example.com',
            fetchFn,
            '/api/scan/geo-eeat/suggest-competitors-queries'
        );

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data.competitors).toEqual(['competitor.de']);
            expect(result.data.queries).toEqual(['Was ist das?']);
        }
    });

    it('suggestGeoEeatCompetitiveInputs surfaces API errors', async () => {
        const fetchFn = vi.fn().mockResolvedValue(
            new Response(JSON.stringify({ error: 'When runCompetitive is true, provide competitors and/or queries.' }), {
                status: 400,
            })
        );

        const result = await suggestGeoEeatCompetitiveInputs(
            'https://example.com',
            fetchFn,
            '/api/scan/geo-eeat/suggest-competitors-queries'
        );

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toContain('runCompetitive');
        }
    });
});
