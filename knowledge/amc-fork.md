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
# Konflikte typisch: Sidebar.tsx, proxy.ts, scripts/docker-entrypoint.sh, lib/amc-lite.ts
```

## AMC-spezifisches Verhalten

- **Registrierung:** `/register` mit **Name**, **E-Mail**, **Unternehmen**, **Passwort** und verpflichtendem **Marketing-Opt-in**. Nach erfolgreicher Registrierung automatischer Login → `/scan`. Gäste ohne Session landen zuerst auf `/register`.
- **Marketing-Einwilligung:** Tabelle `user_marketing_consents` lebt im **Haupt-Repo CHECKION** (Migration `0022`, `drizzle-kit push` beim CHECKION-Deploy). AMC schreibt nur Daten; kein eigenes Schema-Push. Siehe `CHECKION/knowledge/checkion-marketing-consents.md`.
- **Navigation:** Alle Einträge sichtbar; nur **Scan** (Luppe) klickbar. Rest ausgegraut + Tooltip (`nav.amcLiteUpgradeTooltip`).
- **Routen:** `proxy.ts` (Next.js 16) erlaubt `/scan`, `/results/*`, `/settings`, Login/Register, API. `/` → Redirect `/scan`. Alles andere → `/scan`. In der Sidebar sind **Scan** und **Einstellungen** klickbar.
- **DB:** Gleiche `DATABASE_URL` wie Haupt-CHECKION möglich.
- **Schema:** Kein `drizzle-kit push` beim Start (nur mit `CHECKION_RUN_SCHEMA_PUSH=1`). Migrationen über Haupt-CHECKION.
- **Sprache:** UI und AMC-API-Fehlertexte **ausschließlich Deutsch** (`lib/amc-locale.ts` erzwingt `de`; Cookie/Browser-`en` wird ignoriert).
- **Projekte:** Kein Projekt-Dropdown auf `/scan`, keine `projectId` in Scan-Requests, kein „Zu Projekt hinzufügen“ auf Ergebnissen (`isAmcScanProjectSelectorEnabled()` → `false`).
- **GEO/E-E-A-T:** Nur **vollständige Analyse** (URL + optional Wettbewerbs-Benchmark), kein Kurzmodus-Tab (`isAmcGeoEeatQuickScanEnabled()` → `false`).

## Coolify (AMC)

| Variable | Hinweis |
|----------|---------|
| `DATABASE_URL` | Gleich wie Haupt-CHECKION (optional getrennt) |
| `AUTH_URL` | `https://amc.projects-a.plygrnd.tech` |
| `AUTH_SECRET` | Eigen (32+ Zeichen), nicht mit Production teilen |
| `CHECKION_RUN_SCHEMA_PUSH` | **nicht setzen** (Default: skip) |
| `CHECKION_*_ON_START` | **nicht setzen** (Backfill/Sync von Haupt-CHECKION übernehmen führt zu Startup-Fehlern) |
| `REDIS_URL` | Entweder erreichbar konfigurieren **oder** weglassen |
| `CHECKION_DISABLE_REDIS_RATE_LIMIT` | `1` empfohlen, wenn AMC kein Redis hat (verhindert 500 bei Register/Scan bei DNS-Fehler `EAI_AGAIN`) |

Repo in Coolify auf **CHECKION-AMC** umstellen (nicht CHECKION).

## Code-Stellen (nur im Fork)

- `lib/amc-lite.ts` — Routen-Allowlist
- `lib/amc-locale.ts`, `lib/amc-api-messages.ts` — Deutsch-only Locale & API-Meldungen
- `lib/amc-register.ts` — Registrierungs-Schema + Passwort-Generierung
- `app/register/page.tsx`, `app/api/auth/register/route.ts`
- `proxy.ts`
- `components/AmcLiteNavLink.tsx`, `components/Sidebar.tsx`
- `scripts/docker-entrypoint.sh`
