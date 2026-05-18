import { afterEach, describe, expect, it, vi } from 'vitest';
import { isAmcGeminiCompetitiveBenchmarkEnabled } from '@/lib/amc-lite';
import { getCompetitiveBenchmarkGeminiModels } from '@/lib/llm/config';

describe('getCompetitiveBenchmarkGeminiModels', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('AMC fork disables Gemini competitive benchmark', () => {
        expect(isAmcGeminiCompetitiveBenchmarkEnabled()).toBe(false);
        expect(getCompetitiveBenchmarkGeminiModels()).toEqual([]);
    });

    it('CHECKION_DISABLE_GEMINI_COMPETITIVE forces empty list', async () => {
        vi.stubEnv('CHECKION_DISABLE_GEMINI_COMPETITIVE', '1');
        vi.resetModules();
        const mod = await import('@/lib/llm/config');
        expect(mod.getCompetitiveBenchmarkGeminiModels()).toEqual([]);
    });
});
