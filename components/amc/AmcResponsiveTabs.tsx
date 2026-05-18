'use client';

import type { SelectChangeEvent } from '@mui/material';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { MsqdxSelect, MsqdxTabs } from '@msqdx/react';

export type AmcTabOption = {
  value: string;
  label: string;
};

export type AmcResponsiveTabsProps = {
  value: string;
  onChange: (value: string) => void;
  tabs: AmcTabOption[];
  selectLabel: string;
};

/** Tabs on md+, select dropdown below md (AMC mobile layouts). */
export function AmcResponsiveTabs({ value, onChange, tabs, selectLabel }: AmcResponsiveTabsProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  if (tabs.length <= 1) return null;

  if (compact) {
    return (
      <Box sx={{ py: 'var(--msqdx-spacing-xs)' }}>
        <MsqdxSelect
          label={selectLabel}
          value={value}
          onChange={(e: SelectChangeEvent<unknown>) => onChange(String(e.target.value))}
          options={tabs.map((tab) => ({ value: tab.value, label: tab.label }))}
          fullWidth
        />
      </Box>
    );
  }

  return (
    <MsqdxTabs
      value={value}
      onChange={(v) => onChange(String(v))}
      tabs={tabs.map((tab) => ({ value: tab.value, label: tab.label }))}
    />
  );
}
