'use client';

import type { ReactNode } from 'react';
import NextLink from 'next/link';
import { Box, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { useI18n } from '@/components/i18n/I18nProvider';
import { AMC_ADMIN_NAV_TOOLTIP_Z_INDEX } from '@/lib/constants';
import { AMC_LITE_UPGRADE_TOOLTIP_KEY, isAmcLiteNavHrefEnabled } from '@/lib/amc-lite';

export type AmcLiteNavLinkProps = {
  href: string;
  children: ReactNode;
  target?: string;
  rel?: string;
};

/** Blocks navigation for locked routes; shows upgrade tooltip on disabled nav items. */
export function AmcLiteNavLink({ href, children, target, rel }: AmcLiteNavLinkProps) {
  const { t } = useI18n();
  const theme = useTheme();
  /** Align with MsqdxAdminNav drawer (overlay below md). */
  const isDrawerNav = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  if (isAmcLiteNavHrefEnabled(href)) {
    return (
      <NextLink href={href} target={target} rel={rel} style={{ textDecoration: 'none', color: 'inherit' }}>
        {children}
      </NextLink>
    );
  }

  return (
    <Tooltip
      title={t(AMC_LITE_UPGRADE_TOOLTIP_KEY)}
      placement={isDrawerNav ? 'bottom' : 'right'}
      arrow
      slotProps={{
        popper: {
          sx: { zIndex: AMC_ADMIN_NAV_TOOLTIP_Z_INDEX },
        },
      }}
    >
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
