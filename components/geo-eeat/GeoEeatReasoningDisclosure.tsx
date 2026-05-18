'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { MsqdxTypography, MsqdxButton } from '@msqdx/react';

export type GeoEeatReasoningDisclosureProps = {
  text: string;
  showLabel: string;
  hideLabel: string;
  maxCollapsedLines?: number;
};

export function GeoEeatReasoningDisclosure({
  text,
  showLabel,
  hideLabel,
  maxCollapsedLines = 3,
}: GeoEeatReasoningDisclosureProps) {
  const [open, setOpen] = useState(false);
  const trimmed = text.trim();
  if (!trimmed) return null;

  const likelyLong = trimmed.length > 160 || trimmed.split(/\s+/).length > 28;
  if (!likelyLong) {
    return (
      <MsqdxTypography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'var(--color-text-muted-on-light)' }}>
        {trimmed}
      </MsqdxTypography>
    );
  }

  return (
    <Box sx={{ mt: 0.5 }}>
      <MsqdxTypography
        variant="caption"
        sx={{
          display: 'block',
          color: 'var(--color-text-muted-on-light)',
          ...(open
            ? {}
            : {
                display: '-webkit-box',
                WebkitLineClamp: maxCollapsedLines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }),
        }}
      >
        {trimmed}
      </MsqdxTypography>
      <MsqdxButton
        variant="text"
        size="small"
        onClick={() => setOpen((v) => !v)}
        sx={{ mt: 0.25, minHeight: 28, px: 0.5 }}
      >
        {open ? hideLabel : showLabel}
      </MsqdxButton>
    </Box>
  );
}
