'use client';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import { MsqdxTypography, MsqdxChip, MsqdxTooltip } from '@msqdx/react';

export type GeoEeatCompetitiveMetricRowProps = {
  domain: string;
  shareOfVoicePct: string;
  barWidthPct: number;
  avgPositionLabel: string;
  barColor: string;
  hoverBg: string;
  tooltipTitle: string;
  radiusSm: number;
  borderColor: string;
  textPrimary: string;
  textTertiary: string;
};

export function GeoEeatCompetitiveMetricRow({
  domain,
  shareOfVoicePct,
  barWidthPct,
  avgPositionLabel,
  barColor,
  hoverBg,
  tooltipTitle,
  radiusSm,
  borderColor,
  textPrimary,
  textTertiary,
}: GeoEeatCompetitiveMetricRowProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  return (
    <MsqdxTooltip title={tooltipTitle} placement="top">
      <Box
        sx={{
          display: 'flex',
          flexDirection: compact ? 'column' : 'row',
          alignItems: compact ? 'stretch' : 'center',
          gap: compact ? 0.75 : 'var(--msqdx-spacing-sm)',
          flexWrap: compact ? 'nowrap' : 'wrap',
          p: 'var(--msqdx-spacing-xs)',
          borderRadius: `${radiusSm}px`,
          cursor: 'default',
          '&:hover': { bgcolor: hoverBg },
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <MsqdxChip size="small" label={domain} sx={{ fontWeight: 600, maxWidth: '100%' }} />
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--msqdx-spacing-xs)',
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: compact ? 0 : 80,
              height: 28,
              borderRadius: `${radiusSm}px`,
              bgcolor: borderColor,
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <Box
              sx={{
                width: `${barWidthPct}%`,
                minWidth: barWidthPct > 0 ? 4 : 0,
                height: '100%',
                bgcolor: barColor,
                borderRadius: `${radiusSm}px`,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
          <MsqdxTypography variant="body2" sx={{ fontWeight: 600, minWidth: 48, color: textPrimary }}>
            {shareOfVoicePct}
          </MsqdxTypography>
        </Box>
        <MsqdxTypography
          variant="body2"
          sx={{
            color: textTertiary,
            minWidth: compact ? 0 : 90,
          }}
        >
          {avgPositionLabel}
        </MsqdxTypography>
      </Box>
    </MsqdxTooltip>
  );
}
