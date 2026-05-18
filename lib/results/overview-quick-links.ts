import type { ResultsViewMode } from '@/lib/results/view-modes';

export type ResultsOverviewQuickLinkInput = {
  hasLlmSummary: boolean;
  hasScreenshot: boolean;
  hasUx: boolean;
  hasStructure: boolean;
  hasSeo: boolean;
  hasInfra: boolean;
  hasGenerative: boolean;
};

/** View modes surfaced as shortcuts from the overview on mobile (excludes overview itself). */
export function getResultsOverviewQuickLinkModes(input: ResultsOverviewQuickLinkInput): ResultsViewMode[] {
  const modes: ResultsViewMode[] = ['list'];
  if (input.hasScreenshot) modes.push('visual');
  if (input.hasLlmSummary) modes.push('summary');
  if (input.hasUx) modes.push('ux');
  if (input.hasStructure) modes.push('structure');
  if (input.hasSeo) modes.push('seo');
  if (input.hasInfra) modes.push('infra');
  if (input.hasGenerative) modes.push('generative');
  return modes;
}
