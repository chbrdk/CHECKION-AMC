export type CompetitiveRunOption = {
  value: number;
  label: string;
  runId: string | null;
};

export function buildCompetitiveRunOptions(
  currentLabel: string,
  history: Array<{ id: string; started_at: string }>,
  formatHistoryDate: (iso: string) => string,
): CompetitiveRunOption[] {
  return [
    { value: 0, label: currentLabel, runId: null },
    ...history.map((run, i) => {
      const dateStr = run.started_at ? formatHistoryDate(run.started_at) : '';
      return {
        value: i + 1,
        label: dateStr || run.id.slice(0, 8),
        runId: run.id,
      };
    }),
  ];
}

export function competitiveRunIndexFromSelection(
  selectedRunId: string | null,
  history: Array<{ id: string }>,
): number {
  if (selectedRunId == null) return 0;
  const idx = history.findIndex((r) => r.id === selectedRunId);
  return idx >= 0 ? idx + 1 : 0;
}
