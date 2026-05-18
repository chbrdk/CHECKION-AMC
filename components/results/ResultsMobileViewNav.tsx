'use client';

import { useEffect, useRef } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { MsqdxButton } from '@msqdx/react';
import { MSQDX_BRAND_PRIMARY } from '@msqdx/tokens';
import type { ResultsViewMode } from '@/lib/results/view-modes';

export type ResultsMobileViewNavTab = {
  value: ResultsViewMode;
  label: string;
};

export type ResultsMobileViewNavProps = {
  value: ResultsViewMode;
  onChange: (mode: ResultsViewMode) => void;
  tabs: ResultsMobileViewNavTab[];
  ariaLabel: string;
};

/** Horizontal chip strip for results view modes on mobile (replaces Ansicht dropdown). */
export function ResultsMobileViewNav({ value, onChange, tabs, ariaLabel }: ResultsMobileViewNavProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current
      ?.querySelector<HTMLElement>('[data-results-view-active="true"]')
      ?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
  }, [value]);

  if (!compact || tabs.length <= 1) return null;

  const handleSelect = (mode: ResultsViewMode) => {
    onChange(mode);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Box
      ref={scrollRef}
      role="tablist"
      aria-label={ariaLabel}
      sx={{
        display: 'flex',
        gap: 0.75,
        overflowX: 'auto',
        flexWrap: 'nowrap',
        pb: 1,
        mb: 'var(--msqdx-spacing-sm)',
        mx: -0.5,
        px: 0.5,
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {tabs.map((tab) => {
        const selected = tab.value === value;
        return (
          <MsqdxButton
            key={tab.value}
            data-results-view-active={selected ? 'true' : undefined}
            role="tab"
            aria-selected={selected}
            variant={selected ? 'contained' : 'outlined'}
            brandColor={selected ? 'green' : undefined}
            size="small"
            onClick={() => handleSelect(tab.value)}
            sx={{
              flexShrink: 0,
              whiteSpace: 'nowrap',
              minHeight: 32,
              ...(!selected && {
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-on-light)',
                '&:hover': {
                  borderColor: alpha(MSQDX_BRAND_PRIMARY.green, 0.5),
                  bgcolor: alpha(MSQDX_BRAND_PRIMARY.green, 0.06),
                },
              }),
            }}
          >
            {tab.label}
          </MsqdxButton>
        );
      })}
    </Box>
  );
}
