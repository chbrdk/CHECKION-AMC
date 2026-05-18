'use client';

import type { SelectChangeEvent } from '@mui/material';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { MsqdxSelect, MsqdxTabs } from '@msqdx/react';
import type { CompetitiveRunOption } from '@/lib/geo-eeat/competitive-run-options';

export type GeoEeatCompetitiveRunSelectorProps = {
  options: CompetitiveRunOption[];
  selectedIndex: number;
  onChange: (index: number, runId: string | null) => void;
  selectLabel: string;
};

export function GeoEeatCompetitiveRunSelector({
  options,
  selectedIndex,
  onChange,
  selectLabel,
}: GeoEeatCompetitiveRunSelectorProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  if (options.length <= 1) return null;

  if (compact) {
    return (
      <Box sx={{ py: 'var(--msqdx-spacing-xs)', px: { xs: 'var(--msqdx-spacing-md)', md: 0 } }}>
        <MsqdxSelect
          label={selectLabel}
          value={selectedIndex}
          onChange={(e: SelectChangeEvent<unknown>) => {
            const i = Number(e.target.value);
            const opt = options.find((o) => o.value === i) ?? options[0];
            onChange(opt?.value ?? 0, opt?.runId ?? null);
          }}
          options={options.map((o) => ({ value: o.value, label: o.label }))}
          fullWidth
        />
      </Box>
    );
  }

  return (
    <MsqdxTabs
      value={selectedIndex}
      onChange={(v) => {
        const i = Number(v);
        const opt = options.find((o) => o.value === i) ?? options[0];
        onChange(i, opt?.runId ?? null);
      }}
      tabs={options.map((o) => ({ label: o.label, value: o.value }))}
    />
  );
}
