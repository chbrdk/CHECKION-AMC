'use client';

import { Box, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { MsqdxButton } from '@msqdx/react';
import { SharePanel } from '@/components/SharePanel';
import { AMC_GEO_MOBILE_ACTION_BAR_Z_INDEX } from '@/lib/constants';

export type GeoEeatMobileActionBarProps = {
  jobId: string;
  canRerunCompetitive: boolean;
  rerunLoading: boolean;
  rerunLabel: string;
  rerunRunningLabel: string;
  onRerun: () => void;
};

export function GeoEeatMobileActionBar({
  jobId,
  canRerunCompetitive,
  rerunLoading,
  rerunLabel,
  rerunRunningLabel,
  onRerun,
}: GeoEeatMobileActionBarProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  if (!compact) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: AMC_GEO_MOBILE_ACTION_BAR_Z_INDEX,
        display: 'grid',
        gridTemplateColumns: canRerunCompetitive ? '1fr 1fr' : '1fr',
        gap: 1,
        p: 'var(--msqdx-spacing-sm)',
        bgcolor: 'var(--color-card-bg)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
      }}
    >
      {canRerunCompetitive && (
        <MsqdxButton
          variant="outlined"
          size="small"
          fullWidth
          onClick={onRerun}
          disabled={rerunLoading}
        >
          {rerunLoading ? (
            <>
              <CircularProgress size={14} sx={{ mr: 0.5, color: 'inherit' }} />
              {rerunRunningLabel}
            </>
          ) : (
            rerunLabel
          )}
        </MsqdxButton>
      )}
      <SharePanel resourceType="geo_eeat" resourceId={jobId} compactTrigger />
    </Box>
  );
}
