'use client';

import { Box } from '@mui/material';
import { MsqdxButton, MsqdxTypography } from '@msqdx/react';
import type { ResultsViewMode } from '@/lib/results/view-modes';

export type ResultsOverviewQuickLink = {
  mode: ResultsViewMode;
  label: string;
};

export type ResultsOverviewQuickLinksProps = {
  title: string;
  links: ResultsOverviewQuickLink[];
  onNavigate: (mode: ResultsViewMode) => void;
};

export function ResultsOverviewQuickLinks({ title, links, onNavigate }: ResultsOverviewQuickLinksProps) {
  if (links.length === 0) return null;

  return (
    <Box sx={{ mt: 'var(--msqdx-spacing-sm)', pt: 'var(--msqdx-spacing-sm)', borderTop: '1px solid var(--color-border)' }}>
      <MsqdxTypography variant="caption" sx={{ display: 'block', fontWeight: 600, mb: 0.75, color: 'var(--color-text-muted-on-light)' }}>
        {title}
      </MsqdxTypography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {links.map((link) => (
          <MsqdxButton
            key={link.mode}
            variant="text"
            size="small"
            onClick={() => onNavigate(link.mode)}
            sx={{
              justifyContent: 'flex-start',
              px: 0,
              minHeight: 32,
              fontWeight: 500,
              color: 'var(--color-text-on-light)',
              '&:hover': { bgcolor: 'transparent', color: 'var(--msqdx-color-brand-green, #2d8a4e)' },
            }}
          >
            {link.label} →
          </MsqdxButton>
        ))}
      </Box>
    </Box>
  );
}
