'use client';

import { Children, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { MsqdxButton } from '@msqdx/react';

export type GeoEeatCollapsibleChipsProps = {
  children: React.ReactNode;
  maxVisible?: number;
  moreLabel: (hiddenCount: number) => string;
  lessLabel: string;
};

export function GeoEeatCollapsibleChips({
  children,
  maxVisible = 4,
  moreLabel,
  lessLabel,
}: GeoEeatCollapsibleChipsProps) {
  const items = useMemo(() => Children.toArray(children).filter(Boolean), [children]);
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = Math.max(0, items.length - maxVisible);
  const visible = expanded || hiddenCount === 0 ? items : items.slice(0, maxVisible);

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{visible}</Box>
      {hiddenCount > 0 && (
        <MsqdxButton
          variant="text"
          size="small"
          onClick={() => setExpanded((v) => !v)}
          sx={{ mt: 0.5, minHeight: 28, px: 0.5 }}
        >
          {expanded ? lessLabel : moreLabel(hiddenCount)}
        </MsqdxButton>
      )}
    </Box>
  );
}
