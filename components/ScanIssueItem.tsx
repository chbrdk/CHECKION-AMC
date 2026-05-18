'use client';

import React, { memo } from 'react';
import { Box, alpha } from '@mui/material';
import { MsqdxAccordionItem, MsqdxTypography, MsqdxChip } from '@msqdx/react';
import { MSQDX_SPACING, MSQDX_THEME, MSQDX_BRAND_PRIMARY, MSQDX_NEUTRAL } from '@msqdx/tokens';
import type { Issue } from '@/lib/types';
import { issueSeverityConfig } from '@/lib/issues/severity-config';
import { useI18n } from '@/components/i18n/I18nProvider';

const tableBorder = `1px solid ${MSQDX_NEUTRAL[200]}`;

interface ScanIssueItemProps {
  issue: Issue;
  globalRowIndex: number;
  registerRef: (index: number, el: HTMLDivElement | null) => void;
}

/** Mobile card row: message-first, meta chips, expandable selector/context (no table grid). */
export const ScanIssueItem = memo(({ issue, globalRowIndex, registerRef }: ScanIssueItemProps) => {
  const { t } = useI18n();
  const config = issueSeverityConfig(issue.type);
  const itemId = `issue-${globalRowIndex}`;
  const hasDetails = Boolean(issue.selector || issue.context || issue.helpUrl);

  const handleRef = React.useCallback(
    (el: HTMLDivElement | null) => registerRef(globalRowIndex, el),
    [globalRowIndex, registerRef]
  );

  const levelLabel =
    issue.wcagLevel === 'Unknown' ? null : issue.wcagLevel === 'APCA' ? 'APCA' : `Level ${issue.wcagLevel}`;
  const codeLabel = issue.code.length > 56 ? `${issue.code.slice(0, 56)}…` : issue.code;

  return (
    <Box
      id={`${itemId}-wrapper`}
      ref={handleRef}
      data-row-index={globalRowIndex}
      sx={{
        borderRadius: `${MSQDX_SPACING.borderRadius.md}px`,
        border: tableBorder,
        backgroundColor: MSQDX_THEME.light.surface.primary,
        overflow: 'hidden',
        transition: 'background-color 0.12s, box-shadow 0.12s',
        '&:hover': {
          backgroundColor: alpha(config.color, 0.06),
        },
      }}
    >
      {hasDetails ? (
        <MsqdxAccordionItem
          id={itemId}
          summary={
            <Box sx={{ display: 'flex', gap: 1, width: '100%', minWidth: 0, py: 0.25 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: config.color, flexShrink: 0, mt: 0.75 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <MsqdxTypography
                  variant="body2"
                  sx={{ fontWeight: 600, lineHeight: 1.45, color: MSQDX_THEME.light.text.primary, whiteSpace: 'normal' }}
                >
                  {issue.message}
                </MsqdxTypography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.75 }}>
                  <MsqdxChip
                    label={config.label}
                    size="small"
                    sx={{
                      backgroundColor: alpha(config.color, 0.12),
                      color: config.color,
                      fontWeight: 600,
                      fontSize: '0.65rem',
                      height: 22,
                    }}
                  />
                  {levelLabel && (
                    <MsqdxChip
                      label={levelLabel}
                      size="small"
                      sx={{
                        backgroundColor:
                          issue.wcagLevel === 'APCA'
                            ? alpha(MSQDX_BRAND_PRIMARY.purple, 0.12)
                            : alpha(MSQDX_BRAND_PRIMARY.green, 0.1),
                        color: issue.wcagLevel === 'APCA' ? MSQDX_BRAND_PRIMARY.purple : MSQDX_BRAND_PRIMARY.green,
                        fontSize: '0.65rem',
                        height: 22,
                      }}
                    />
                  )}
                  <MsqdxChip
                    label={issue.runner}
                    size="small"
                    sx={{
                      backgroundColor: alpha(MSQDX_NEUTRAL[400], 0.12),
                      color: MSQDX_THEME.light.text.secondary,
                      fontSize: '0.65rem',
                      height: 22,
                    }}
                  />
                </Box>
                {issue.code && (
                  <MsqdxTypography
                    variant="caption"
                    component="div"
                    sx={{
                      mt: 0.75,
                      fontFamily: 'monospace',
                      fontSize: '0.68rem',
                      color: MSQDX_THEME.light.text.tertiary,
                      wordBreak: 'break-all',
                      lineHeight: 1.35,
                    }}
                  >
                    {codeLabel}
                  </MsqdxTypography>
                )}
              </Box>
            </Box>
          }
        >
          <IssueDetailsPanel issue={issue} fixDocsLabel={t('results.fixDocs')} fixDocsAria={t('results.fixDocsAria')} />
        </MsqdxAccordionItem>
      ) : (
        <Box sx={{ p: 1.25, display: 'flex', gap: 1, minWidth: 0 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: config.color, flexShrink: 0, mt: 0.75 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <MsqdxTypography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.45, whiteSpace: 'normal' }}>
              {issue.message}
            </MsqdxTypography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.75 }}>
              <MsqdxChip label={config.label} size="small" sx={{ backgroundColor: alpha(config.color, 0.12), color: config.color, fontWeight: 600, fontSize: '0.65rem', height: 22 }} />
              {levelLabel && <MsqdxChip label={levelLabel} size="small" sx={{ fontSize: '0.65rem', height: 22 }} />}
              <MsqdxChip label={issue.runner} size="small" sx={{ fontSize: '0.65rem', height: 22 }} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
});

ScanIssueItem.displayName = 'ScanIssueItem';

function IssueDetailsPanel({
  issue,
  fixDocsLabel,
  fixDocsAria,
}: {
  issue: Issue;
  fixDocsLabel: string;
  fixDocsAria: string;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, pt: 0.5 }}>
      {issue.selector && (
        <Box>
          <MsqdxTypography variant="caption" sx={{ color: MSQDX_THEME.light.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            CSS Selector
          </MsqdxTypography>
          <Box
            component="code"
            sx={{
              display: 'block',
              mt: 0.5,
              p: 1,
              borderRadius: 1,
              backgroundColor: MSQDX_NEUTRAL[100],
              color: MSQDX_THEME.light.text.primary,
              fontSize: '0.72rem',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              border: tableBorder,
            }}
          >
            {issue.selector}
          </Box>
        </Box>
      )}
      {issue.context && (
        <Box>
          <MsqdxTypography variant="caption" sx={{ color: MSQDX_THEME.light.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            HTML Context
          </MsqdxTypography>
          <Box
            component="pre"
            sx={{
              mt: 0.5,
              p: 1,
              borderRadius: 1,
              backgroundColor: MSQDX_NEUTRAL[100],
              color: MSQDX_THEME.light.text.primary,
              fontSize: '0.72rem',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              maxHeight: 200,
              overflowY: 'auto',
              border: tableBorder,
            }}
          >
            {issue.context}
          </Box>
        </Box>
      )}
      {issue.helpUrl && (
        <a
          href={issue.helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={fixDocsAria}
          style={{ fontSize: '0.8rem', color: MSQDX_BRAND_PRIMARY.green, textDecoration: 'underline', fontWeight: 500 }}
        >
          {fixDocsLabel} →
        </a>
      )}
    </Box>
  );
}
