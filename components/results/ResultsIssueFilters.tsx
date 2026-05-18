'use client';

import type { SelectChangeEvent } from '@mui/material';
import { Box, alpha, useMediaQuery, useTheme } from '@mui/material';
import { MsqdxButton, MsqdxSelect } from '@msqdx/react';
import { MSQDX_BRAND_PRIMARY, MSQDX_NEUTRAL, MSQDX_STATUS } from '@msqdx/tokens';
import { InfoTooltip } from '@/components/InfoTooltip';
import type { IssueSeverity } from '@/lib/types';

export type ResultsSeverityTab = {
  key: 'all' | IssueSeverity | 'passed';
  label: string;
  count: number;
};

export type ResultsIssueFiltersProps = {
  severityTabs: ResultsSeverityTab[];
  activeSeverity: string;
  onSeverityChange: (key: string) => void;
  levelFilter: string;
  onLevelChange: (level: string) => void;
  levelStats: Record<string, number>;
  severityInfo: string;
  levelInfo: string;
  infoAriaLabel: string;
  severitySelectLabel: string;
  levelSelectLabel: string;
  allLevelsLabel: string;
};

export function ResultsIssueFilters({
  severityTabs,
  activeSeverity,
  onSeverityChange,
  levelFilter,
  onLevelChange,
  levelStats,
  severityInfo,
  levelInfo,
  infoAriaLabel,
  severitySelectLabel,
  levelSelectLabel,
  allLevelsLabel,
}: ResultsIssueFiltersProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  if (compact) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 'var(--msqdx-spacing-sm)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <InfoTooltip title={severityInfo} ariaLabel={infoAriaLabel} placement="bottom" />
          <InfoTooltip title={levelInfo} ariaLabel={infoAriaLabel} placement="bottom" />
        </Box>
        <MsqdxSelect
          label={severitySelectLabel}
          value={activeSeverity}
          onChange={(e: SelectChangeEvent<unknown>) => onSeverityChange(String(e.target.value))}
          options={severityTabs.map((tab) => ({
            value: tab.key,
            label: `${tab.label} (${tab.count})`,
          }))}
          fullWidth
        />
        <MsqdxSelect
          label={levelSelectLabel}
          value={levelFilter}
          onChange={(e: SelectChangeEvent<unknown>) => onLevelChange(String(e.target.value))}
          options={['all', 'A', 'AA', 'AAA', 'APCA'].map((level) => ({
            value: level,
            label:
              level === 'all'
                ? allLevelsLabel
                : `${level === 'APCA' ? 'APCA' : `Lvl ${level}`}${level !== 'all' ? ` (${levelStats[level] ?? 0})` : ''}`,
          }))}
          fullWidth
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <InfoTooltip title={severityInfo} ariaLabel={infoAriaLabel} placement="bottom" />
      <InfoTooltip title={levelInfo} ariaLabel={infoAriaLabel} placement="bottom" />
      {severityTabs.map((tab) => (
        <MsqdxButton
          key={tab.key}
          variant={activeSeverity === tab.key ? 'contained' : 'text'}
          brandColor={
            tab.key === 'passed'
              ? 'green'
              : activeSeverity === tab.key
                ? tab.key === 'error'
                  ? 'pink'
                  : tab.key === 'warning'
                    ? 'yellow'
                    : 'green'
                : undefined
          }
          size="small"
          onClick={() => onSeverityChange(tab.key)}
          sx={{
            fontSize: '0.75rem',
            ...(activeSeverity !== tab.key && { color: 'var(--color-text-muted-on-light)' }),
            minWidth: 'auto',
          }}
        >
          {tab.label} ({tab.count})
        </MsqdxButton>
      ))}
      <Box sx={{ width: 1, height: 24, bgcolor: 'var(--color-secondary-dx-grey-light-tint)', mx: 1, alignSelf: 'center' }} />
      {['all', 'A', 'AA', 'AAA', 'APCA'].map((level) => (
        <MsqdxButton
          key={level}
          variant={levelFilter === level ? 'contained' : 'text'}
          size="small"
          onClick={() => onLevelChange(level)}
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: '16px',
            color: levelFilter === level ? '#000' : 'var(--color-text-muted-on-light)',
            backgroundColor: levelFilter === level ? MSQDX_BRAND_PRIMARY.green : 'transparent',
            '&:hover': {
              backgroundColor: levelFilter === level ? MSQDX_BRAND_PRIMARY.green : alpha(MSQDX_NEUTRAL[200], 0.1),
            },
            minWidth: 'auto',
            px: 2,
          }}
        >
          {level === 'all' ? allLevelsLabel : level === 'APCA' ? 'APCA' : `Lvl ${level}`}
          {level !== 'all' && (
            <Box
              component="span"
              sx={{
                ml: 1,
                fontSize: '0.65rem',
                opacity: 0.7,
                backgroundColor: 'rgba(0,0,0,0.1)',
                px: 0.5,
                borderRadius: '4px',
              }}
            >
              {levelStats[level] ?? 0}
            </Box>
          )}
        </MsqdxButton>
      ))}
    </Box>
  );
}
