'use client';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import { MsqdxTypography } from '@msqdx/react';
import { InfoTooltip } from '@/components/InfoTooltip';
import { amcMobileFlushCardSx } from '@/lib/amc-page-shell';

export type ResultsPageHeaderProps = {
  title: string;
  titleInfo: string;
  infoAriaLabel: string;
  url: string;
  score: number;
  scoreLabel: string;
  scoreInfo: string;
  scoreColor: string;
};

export function ResultsPageHeader({
  title,
  titleInfo,
  infoAriaLabel,
  url,
  score,
  scoreLabel,
  scoreInfo,
  scoreColor,
}: ResultsPageHeaderProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  return (
    <Box
      sx={{
        mb: 'var(--msqdx-spacing-sm)',
        bgcolor: 'var(--color-card-bg)',
        borderRadius: 'var(--msqdx-radius-lg, 12px)',
        ...amcMobileFlushCardSx,
        py: { xs: 'var(--msqdx-spacing-md)', md: 'var(--msqdx-spacing-md)' },
      }}
    >
      {compact ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, minWidth: 0, flex: 1 }}>
              <MsqdxTypography component="span" variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                {title}
              </MsqdxTypography>
              <InfoTooltip title={titleInfo} ariaLabel={infoAriaLabel} />
            </Box>
            <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <MsqdxTypography component="span" sx={{ fontSize: 40, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                {score}
              </MsqdxTypography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                <MsqdxTypography variant="caption" sx={{ fontSize: '0.65rem', color: 'var(--color-text-muted-on-light)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {scoreLabel}
                </MsqdxTypography>
                <InfoTooltip title={scoreInfo} ariaLabel={infoAriaLabel} placement="bottom" />
              </Box>
            </Box>
          </Box>
          <MsqdxTypography variant="body2" sx={{ color: 'var(--color-text-muted-on-light)', wordBreak: 'break-all' }}>
            {url}
          </MsqdxTypography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, marginBottom: 0, verticalAlign: 'middle' }}>
              <MsqdxTypography component="span" variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.02em', display: 'inline' }}>
                {title}
              </MsqdxTypography>
              <InfoTooltip title={titleInfo} ariaLabel={infoAriaLabel} />
            </Box>
            <MsqdxTypography
              variant="body2"
              sx={{
                color: 'var(--color-text-muted-on-light)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 600,
              }}
            >
              {url}
            </MsqdxTypography>
          </Box>
          <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <MsqdxTypography component="span" sx={{ fontSize: 48, fontWeight: 800, color: scoreColor, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {score}
            </MsqdxTypography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
              <MsqdxTypography variant="caption" sx={{ fontSize: '0.65rem', color: 'var(--color-text-muted-on-light)', textTransform: 'uppercase', fontWeight: 600 }}>
                {scoreLabel}
              </MsqdxTypography>
              <InfoTooltip title={scoreInfo} ariaLabel={infoAriaLabel} placement="bottom" />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
