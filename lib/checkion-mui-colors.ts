/**
 * Hex colors for MUI `sx` / component props that call `alpha()` or `decomposeColor()`.
 * CSS variables in those places cause MUI production Error #9.
 * Keep in sync with `styles/globals.css` (`--color-*`).
 */
export const CHECKION_MUI_COLORS = {
  textMutedOnLight: '#475569',
  textOnLight: '#0f172a',
  textSecondary: '#94a3b8',
  themeAccent: '#b638ff',
} as const;
