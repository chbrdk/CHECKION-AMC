import { describe, expect, it } from 'vitest';
import { shortenResultsViewModeLabel } from '@/lib/results/view-modes';

describe('shortenResultsViewModeLabel', () => {
  it('returns short mobile labels', () => {
    expect(shortenResultsViewModeLabel('list', 'Liste & Details')).toBe('Liste');
    expect(shortenResultsViewModeLabel('generative', 'Generative Search (GEO)')).toBe('GEO');
  });
});
