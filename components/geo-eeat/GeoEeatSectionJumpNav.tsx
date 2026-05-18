'use client';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import { MsqdxButton } from '@msqdx/react';

export type GeoEeatSectionJump = {
  id: string;
  label: string;
};

export type GeoEeatSectionJumpNavProps = {
  sections: GeoEeatSectionJump[];
};

export function GeoEeatSectionJumpNav({ sections }: GeoEeatSectionJumpNavProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  if (!compact || sections.length < 2) return null;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        gap: 0.75,
        flexWrap: 'wrap',
        py: 1,
        mb: 1.5,
        bgcolor: 'var(--color-card-bg)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {sections.map((section) => (
        <MsqdxButton
          key={section.id}
          variant="outlined"
          size="small"
          onClick={() => scrollTo(section.id)}
          sx={{ flex: '1 1 auto', minWidth: 0 }}
        >
          {section.label}
        </MsqdxButton>
      ))}
    </Box>
  );
}
