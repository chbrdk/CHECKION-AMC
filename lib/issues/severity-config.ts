import { MSQDX_STATUS } from '@msqdx/tokens';

export const ISSUE_SEVERITY_CONFIG: Record<string, { label: string; color: string }> = {
  error: { label: 'Error', color: MSQDX_STATUS.error.base },
  warning: { label: 'Warning', color: MSQDX_STATUS.warning.base },
  notice: { label: 'Notice', color: MSQDX_STATUS.info.base },
};

export function issueSeverityConfig(type: string) {
  return ISSUE_SEVERITY_CONFIG[type] ?? ISSUE_SEVERITY_CONFIG.notice;
}
