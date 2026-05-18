'use client';

import type { SelectChangeEvent } from '@mui/material';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { MsqdxSelect, MsqdxTabs } from '@msqdx/react';
import { shortenCompetitiveModelLabel } from '@/lib/geo-eeat/model-label';

export type GeoEeatCompetitiveModelSelectorProps = {
  models: string[];
  modelIndex: number;
  onChange: (index: number) => void;
  selectLabel: string;
};

export function GeoEeatCompetitiveModelSelector({
  models,
  modelIndex,
  onChange,
  selectLabel,
}: GeoEeatCompetitiveModelSelectorProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  if (models.length <= 1) return null;

  if (compact) {
    return (
      <Box sx={{ py: 'var(--msqdx-spacing-xs)', px: { xs: 'var(--msqdx-spacing-md)', md: 0 } }}>
        <MsqdxSelect
          label={selectLabel}
          value={modelIndex}
          onChange={(e: SelectChangeEvent<unknown>) => onChange(Number(e.target.value))}
          options={models.map((model, i) => ({
            value: i,
            label: shortenCompetitiveModelLabel(model),
          }))}
          fullWidth
        />
      </Box>
    );
  }

  return (
    <MsqdxTabs
      value={modelIndex}
      onChange={(v) => onChange(Number(v))}
      tabs={models.map((model, i) => ({ label: model, value: i }))}
    />
  );
}
