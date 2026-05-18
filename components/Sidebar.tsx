'use client';

import type { ElementType } from 'react';
import { usePathname } from 'next/navigation';
import { MsqdxAdminNav } from '@msqdx/react';
import type { AdminNavItem } from '@msqdx/react';
import { Box } from '@mui/material';
import { AmcLiteNavLink } from '@/components/AmcLiteNavLink';
import { THEME_ACCENT_WITH_FALLBACK } from '@/lib/theme-accent';
import { useI18n } from '@/components/i18n/I18nProvider';
import {
  PATH_HOME,
  PATH_SCAN,
  PATH_DEEP_SCANS,
  PATH_PROJECTS,
  PATH_DEVELOPERS,
  PATH_SETTINGS,
} from '@/lib/constants';

export type SidebarProps = {
    open?: boolean;
    onClose?: () => void;
};

/** AMC fork: all nav labels visible; only scan is navigable (see AmcLiteNavLink). */
export function Sidebar({ open = false, onClose = () => {} }: SidebarProps) {
    const pathname = usePathname();
    const { t } = useI18n();

    const NAV_ITEMS: AdminNavItem[] = [
        { label: t('nav.dashboard'), path: PATH_HOME, icon: 'dashboard', exact: true },
        { label: t('nav.newScan'), path: PATH_SCAN, icon: 'search' },
        { label: t('nav.deepScans'), path: PATH_DEEP_SCANS, icon: 'dataset' },
        { label: t('nav.projects'), path: PATH_PROJECTS, icon: 'folder' },
        { label: t('nav.developers'), path: PATH_DEVELOPERS, icon: 'code' },
    ];

    const EXTERNAL_ITEMS: AdminNavItem[] = [
        { label: t('nav.settings'), path: PATH_SETTINGS, icon: 'settings' },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <MsqdxAdminNav
                open={open}
                onClose={onClose}
                currentPath={pathname}
                items={NAV_ITEMS}
                externalItems={EXTERNAL_ITEMS}
                linkComponent={AmcLiteNavLink as ElementType}
                sx={{
                    backgroundColor: THEME_ACCENT_WITH_FALLBACK.backgroundColor,
                    borderRightColor: THEME_ACCENT_WITH_FALLBACK.borderColor,
                    color: 'var(--color-theme-accent-contrast, #ffffff)',
                    '& a': { color: 'inherit' },
                    '& .MuiIconButton-root': { color: 'var(--color-theme-accent-contrast, #ffffff)' },
                }}
            />
        </Box>
    );
}
