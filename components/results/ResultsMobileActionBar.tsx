'use client';

import type { SelectChangeEvent } from '@mui/material';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { MsqdxButton, MsqdxIcon, MsqdxSelect } from '@msqdx/react';
import { AMC_GEO_MOBILE_ACTION_BAR_Z_INDEX } from '@/lib/constants';
import type { ScanResult } from '@/lib/types';

export type ResultsMobileActionBarProps = {
  pdfExporting: boolean;
  pdfLabel: string;
  pdfCreatingLabel: string;
  onPdfExport: () => void;
  currentDevice: string | undefined;
  relatedScans: ScanResult[];
  onSelectDevice: (scanId: string) => void;
  deviceSelectLabel: string;
};

export function ResultsMobileActionBar({
  pdfExporting,
  pdfLabel,
  pdfCreatingLabel,
  onPdfExport,
  currentDevice,
  relatedScans,
  onSelectDevice,
  deviceSelectLabel,
}: ResultsMobileActionBarProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  if (!compact) return null;

  const showDeviceSelect = relatedScans.length > 1;
  const deviceOptions = ['desktop', 'tablet', 'mobile']
    .map((d) => {
      const scan = relatedScans.find((s) => s.device === d);
      if (!scan) return null;
      return { value: scan.id, label: d.charAt(0).toUpperCase() + d.slice(1) };
    })
    .filter(Boolean) as { value: string; label: string }[];

  const currentScan = relatedScans.find((s) => s.device === currentDevice) ?? relatedScans[0];

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: AMC_GEO_MOBILE_ACTION_BAR_Z_INDEX,
        display: 'grid',
        gridTemplateColumns: showDeviceSelect ? '1fr 1fr' : '1fr',
        gap: 1,
        p: 'var(--msqdx-spacing-sm)',
        bgcolor: 'var(--color-card-bg)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
      }}
    >
      <MsqdxButton
        variant="outlined"
        size="small"
        fullWidth
        disabled={pdfExporting}
        onClick={onPdfExport}
        startIcon={<MsqdxIcon name="Download" size="sm" />}
      >
        {pdfExporting ? pdfCreatingLabel : pdfLabel}
      </MsqdxButton>
      {showDeviceSelect && currentScan && (
        <MsqdxSelect
          label={deviceSelectLabel}
          value={currentScan.id}
          onChange={(e: SelectChangeEvent<unknown>) => onSelectDevice(String(e.target.value))}
          options={deviceOptions}
        />
      )}
    </Box>
  );
}
