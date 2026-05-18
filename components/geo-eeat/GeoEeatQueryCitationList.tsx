'use client';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import { MsqdxTypography, MsqdxChip } from '@msqdx/react';
import type { CompetitiveCitation } from '@/lib/types';

export type GeoEeatQueryCitationListProps = {
  citations: CompetitiveCitation[];
  positionLabel: (position: number) => string;
  noCitationsLabel: string;
  radiusSm: number;
  tableBorder: string;
  surfacePrimary: string;
  textTertiary: string;
};

export function GeoEeatQueryCitationList({
  citations,
  positionLabel,
  noCitationsLabel,
  radiusSm,
  tableBorder,
  surfacePrimary,
  textTertiary,
}: GeoEeatQueryCitationListProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  if (!citations.length) {
    return (
      <MsqdxTypography variant="caption" sx={{ fontStyle: 'italic', color: textTertiary }}>
        {noCitationsLabel}
      </MsqdxTypography>
    );
  }

  const sorted = [...citations].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  if (!compact) {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--msqdx-spacing-xxs)', alignItems: 'center' }}>
        {sorted.map((c, cIdx) => (
          <Box
            key={cIdx}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--msqdx-spacing-xxs)',
              px: 'var(--msqdx-spacing-xs)',
              py: 'var(--msqdx-spacing-xxs)',
              borderRadius: `${radiusSm}px`,
              bgcolor: surfacePrimary,
              border: tableBorder,
            }}
          >
            <MsqdxTypography variant="caption" sx={{ fontWeight: 600, color: textTertiary }}>
              {positionLabel(c.position ?? cIdx + 1)}
            </MsqdxTypography>
            <MsqdxChip size="small" label={c.domain} sx={{ height: 22 }} />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      {sorted.map((c, cIdx) => (
        <Box
          key={cIdx}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            px: 'var(--msqdx-spacing-xs)',
            py: 'var(--msqdx-spacing-xs)',
            borderRadius: `${radiusSm}px`,
            bgcolor: surfacePrimary,
            border: tableBorder,
          }}
        >
          <MsqdxChip size="small" label={c.domain} sx={{ height: 22, maxWidth: '100%' }} />
          <MsqdxTypography variant="caption" sx={{ fontWeight: 600, color: textTertiary, flexShrink: 0 }}>
            {positionLabel(c.position ?? cIdx + 1)}
          </MsqdxTypography>
        </Box>
      ))}
    </Box>
  );
}
