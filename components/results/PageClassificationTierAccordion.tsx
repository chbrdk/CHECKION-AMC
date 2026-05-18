'use client';

import { Box } from '@mui/material';
import { MsqdxTypography, MsqdxChip, MsqdxAccordion, MsqdxAccordionItem } from '@msqdx/react';
import { GeoEeatCollapsibleChips } from '@/components/geo-eeat/GeoEeatCollapsibleChips';

export type PageClassificationTierGroup = {
  tier: number;
  tags: Array<{ tag: string }>;
};

export type PageClassificationTierAccordionProps = {
  tiers: PageClassificationTierGroup[];
  tierLabel: (tier: number) => string;
  tierDescription: (tier: number) => string;
  tagCountLabel: (count: number) => string;
  chipsMoreLabel: (hidden: number) => string;
  chipsLessLabel: string;
  compact?: boolean;
};

export function PageClassificationTierAccordion({
  tiers,
  tierLabel,
  tierDescription,
  tagCountLabel,
  chipsMoreLabel,
  chipsLessLabel,
  compact = false,
}: PageClassificationTierAccordionProps) {
  if (tiers.length === 0) return null;

  const renderTags = (tags: Array<{ tag: string }>, tier: number) => {
    const chips = tags.map((tt, i) => (
      <MsqdxChip key={`${tier}-${i}`} label={tt.tag} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
    ));

    if (compact && tags.length > 4) {
      return (
        <GeoEeatCollapsibleChips moreLabel={chipsMoreLabel} lessLabel={chipsLessLabel}>
          {chips}
        </GeoEeatCollapsibleChips>
      );
    }

    return <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{chips}</Box>;
  };

  return (
    <MsqdxAccordion
      allowMultiple
      size="small"
      borderRadius="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--msqdx-spacing-xs)',
        background: 'transparent',
        border: 'none',
      }}
    >
      {tiers.map(({ tier, tags }) => (
        <MsqdxAccordionItem
          key={tier}
          id={`page-classification-tier-${tier}`}
          summary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', width: '100%', pr: 1 }}>
              <MsqdxTypography variant="subtitle2" sx={{ fontWeight: 600, flex: 1, minWidth: 0 }}>
                {tierLabel(tier)}: {tierDescription(tier)}
              </MsqdxTypography>
              <MsqdxChip size="small" label={tagCountLabel(tags.length)} sx={{ flexShrink: 0 }} />
            </Box>
          }
        >
          <Box sx={{ pt: 'var(--msqdx-spacing-xs)' }}>{renderTags(tags, tier)}</Box>
        </MsqdxAccordionItem>
      ))}
    </MsqdxAccordion>
  );
}
