export const RESULTS_VIEW_MODE_IDS = [
  'overview',
  'list',
  'summary',
  'visual',
  'ux',
  'structure',
  'seo',
  'infra',
  'generative',
] as const;

export type ResultsViewMode = (typeof RESULTS_VIEW_MODE_IDS)[number];

const MOBILE_SHORT_LABELS: Record<ResultsViewMode, string> = {
  overview: 'Übersicht',
  list: 'Liste',
  summary: 'UX/CX',
  visual: 'Visuell',
  ux: 'UX Audit',
  structure: 'Struktur',
  seo: 'SEO',
  infra: 'Infra',
  generative: 'GEO',
};

export function shortenResultsViewModeLabel(mode: ResultsViewMode, fullLabel: string): string {
  return MOBILE_SHORT_LABELS[mode] ?? fullLabel;
}
