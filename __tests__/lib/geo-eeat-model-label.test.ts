import { describe, it, expect } from 'vitest';
import { shortenCompetitiveModelLabel } from '@/lib/geo-eeat/model-label';

describe('shortenCompetitiveModelLabel', () => {
  it('maps known providers to short names', () => {
    expect(shortenCompetitiveModelLabel('gpt-4o')).toBe('GPT');
    expect(shortenCompetitiveModelLabel('OpenAI GPT-4')).toBe('GPT');
    expect(shortenCompetitiveModelLabel('claude-3-5-sonnet')).toBe('Claude');
    expect(shortenCompetitiveModelLabel('gemini-2.5-flash')).toBe('Gemini');
  });

  it('returns short strings unchanged', () => {
    expect(shortenCompetitiveModelLabel('Custom')).toBe('Custom');
  });

  it('truncates long unknown labels', () => {
    expect(shortenCompetitiveModelLabel('some-very-long-model-id')).toBe('some-very-lo…');
  });
});
