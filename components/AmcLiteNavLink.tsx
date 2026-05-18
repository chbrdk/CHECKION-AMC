'use client';

import type { ReactNode } from 'react';
import NextLink from 'next/link';
import { Box, Tooltip } from '@mui/material';
import { useI18n } from '@/components/i18n/I18nProvider';
import { AMC_LITE_UPGRADE_TOOLTIP_KEY, normalizePathnameForAmcLite } from '@/lib/amc-lite';
import { PATH_SCAN } from '@/lib/constants';

export type AmcLiteNavLinkProps = {
  href: string;
  children: ReactNode;
  target?: string;
  rel?: string;
};

function isAmcLiteNavHrefEnabled(href: string): boolean {
  const path = normalizePathnameForAmcLite(href);
  return path === PATH_SCAN || path.startsWith(`${PATH_SCAN}/`);
}

/** Blocks navigation for non-scan routes; shows upgrade tooltip on locked items. */
export function AmcLiteNavLink({ href, children, target, rel }: AmcLiteNavLinkProps) {
  const { t } = useI18n();

  if (isAmcLiteNavHrefEnabled(href)) {
    return (
      <NextLink href={href} target={target} rel={rel} style={{ textDecoration: 'none', color: 'inherit' }}>
        {children}
      </NextLink>
    );
  }

  return (
    <Tooltip title={t(AMC_LITE_UPGRADE_TOOLTIP_KEY)} placement="right" arrow>
      <Box
        component="span"
        sx={{
          display: 'block',
          opacity: 0.45,
          cursor: 'not-allowed',
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        aria-disabled
      >
        {children}
      </Box>
    </Tooltip>
  );
}
