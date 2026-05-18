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
      fullWidth={compact}
      onClick={onRerun}
      disabled={rerunLoading}
      sx={{ minWidth: compact ? undefined : rerunLoading ? 140 : undefined }}
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
    <Box sx={{ mb: 2 }}>
      <MsqdxTypography variant="h5" sx={{ fontWeight: 700, mb: compact ? 1.5 : 0 }}>
        {title}
      </MsqdxTypography>
      {compact ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, alignItems: 'stretch' }}>
            {rerunButton}
            {share}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            {addToProject}
            <Link href={PATH_SCAN} style={{ textDecoration: 'none', marginLeft: 'auto' }}>
              <MsqdxButton variant="text" size="small">
                {backLabel}
              </MsqdxButton>
            </Link>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 1 }}>
          {rerunButton}
          {addToProject}
          {share}
          <Link href={PATH_SCAN}>
            <MsqdxButton variant="text" size="small">
              {backLabel}
            </MsqdxButton>
          </Link>
        </Box>
      )}
    </Box>
  );
}
