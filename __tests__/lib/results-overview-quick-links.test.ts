import { describe, expect, it } from 'vitest';
import { getResultsOverviewQuickLinkModes } from '@/lib/results/overview-quick-links';

describe('getResultsOverviewQuickLinkModes', () => {
  it('always includes list and adds modes when data exists', () => {
    expect(
      getResultsOverviewQuickLinkModes({
        hasLlmSummary: false,
        hasScreenshot: false,
        hasUx: false,
        hasStructure: false,
        hasSeo: false,
        hasInfra: false,
        hasGenerative: false,
      })
    ).toEqual(['list']);

    expect(
      getResultsOverviewQuickLinkModes({
        hasLlmSummary: true,
        hasScreenshot: true,
        hasUx: true,
        hasStructure: true,
        hasSeo: true,
        hasInfra: true,
        hasGenerative: true,
      })
    ).toEqual(['list', 'visual', 'summary', 'ux', 'structure', 'seo', 'infra', 'generative']);
  });
});
