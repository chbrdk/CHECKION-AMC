'use client';

import Link from 'next/link';
import { Box, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { MsqdxTypography, MsqdxButton } from '@msqdx/react';
import { SharePanel } from '@/components/SharePanel';
import { AddToProject } from '@/components/AddToProject';
import { PATH_SCAN } from '@/lib/constants';

export type GeoEeatPageToolbarProps = {
  title: string;
  backLabel: string;
  rerunLabel: string;
  rerunRunningLabel: string;
  canRerunCompetitive: boolean;
  rerunLoading: boolean;
  onRerun: () => void;
  jobId: string;
  projectId: string | null;
  onProjectAssigned: () => void;
};

export function GeoEeatPageToolbar({
  title,
  backLabel,
  rerunLabel,
  rerunRunningLabel,
  canRerunCompetitive,
  rerunLoading,
  onRerun,
  jobId,
  projectId,
  onProjectAssigned,
}: GeoEeatPageToolbarProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  const rerunButton = canRerunCompetitive ? (
    <MsqdxButton
      variant="outlined"
      size="small"
      onClick={onRerun}
      disabled={rerunLoading}
      sx={{ minWidth: rerunLoading ? 140 : undefined }}
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
  ) : null;

  const share = <SharePanel resourceType="geo_eeat" resourceId={jobId} />;
  const addToProject = (
    <AddToProject
      resourceType="geo_eeat"
      resourceId={jobId}
      currentProjectId={projectId}
      onAssigned={onProjectAssigned}
    />
  );

  return (
    <Box sx={{ mb: 2, px: { xs: 'var(--msqdx-spacing-md)', md: 0 } }}>
      {compact ? (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <MsqdxTypography variant="h5" sx={{ fontWeight: 700, flex: 1, minWidth: 0 }}>
            {title}
          </MsqdxTypography>
          <Link href={PATH_SCAN} style={{ textDecoration: 'none', flexShrink: 0 }}>
            <MsqdxButton variant="text" size="small">
              {backLabel}
            </MsqdxButton>
          </Link>
        </Box>
      ) : (
        <>
      <MsqdxTypography variant="h5" sx={{ fontWeight: 700, mb: 0 }}>
        {title}
      </MsqdxTypography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {rerunButton}
          {addToProject}
          {share}
          <Link href={PATH_SCAN}>
            <MsqdxButton variant="text" size="small">
              {backLabel}
            </MsqdxButton>
          </Link>
        </Box>
        </>
      )}
    </Box>
  );
}
