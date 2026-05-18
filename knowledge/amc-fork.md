# CHECKION-AMC (Demo-Fork)

Fork von [CHECKION](https://github.com/chbrdk/CHECKION) für **https://amc.projects-a.plygrnd.tech** — Scan-only Demo, gemeinsame Datenbank mit Haupt-CHECKION.

## Repos & Remotes

| Remote | URL |
|--------|-----|
| `upstream` | `https://github.com/chbrdk/CHECKION.git` |
| `origin` | `https://github.com/chbrdk/CHECKION-AMC.git` (nach Anlage auf GitHub setzen) |

```bash
cd CHECKION-AMC
git remote add origin https://github.com/chbrdk/CHECKION-AMC.git   # einmalig
git push -u origin main
```

Updates von CHECKION holen:

```bash
git fetch upstream
git merge upstream/main
# Konflikte typisch: Sidebar.tsx, middleware.ts, scripts/docker-entrypoint.sh, lib/amc-lite.ts
```

## AMC-spezifisches Verhalten

- **Navigation:** Alle Einträge sichtbar; nur **Scan** (Luppe) klickbar. Rest ausgegraut + Tooltip (`nav.amcLiteUpgradeTooltip`).
- **Routen:** `middleware.ts` erlaubt `/scan`, `/results/*`, Login/Register, API. `/` → Redirect `/scan`. Alles andere → `/scan`.
- **DB:** Gleiche `DATABASE_URL` wie Haupt-CHECKION möglich.
- **Schema:** Kein `drizzle-kit push` beim Start (nur mit `CHECKION_RUN_SCHEMA_PUSH=1`). Migrationen über Haupt-CHECKION.

## Coolify (AMC)

| Variable | Hinweis |
|----------|---------|
| `DATABASE_URL` | Gleich wie Haupt-CHECKION (optional getrennt) |
| `AUTH_URL` | `https://amc.projects-a.plygrnd.tech` |
| `AUTH_SECRET` | Eigen (32+ Zeichen), nicht mit Production teilen |
| `CHECKION_RUN_SCHEMA_PUSH` | **nicht setzen** (Default: skip) |
| `CHECKION_*_ON_START` | **nicht setzen** |

Repo in Coolify auf **CHECKION-AMC** umstellen (nicht CHECKION).

## Code-Stellen (nur im Fork)

- `lib/amc-lite.ts` — Routen-Allowlist
- `middleware.ts`
- `components/AmcLiteNavLink.tsx`, `components/Sidebar.tsx`
- `scripts/docker-entrypoint.sh`
