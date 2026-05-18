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
- **Routen:** `proxy.ts` (Next.js 16) erlaubt `/scan`, `/results/*`, `/geo-eeat/*` (GEO/E-E-A-T-Ergebnisse), `/settings`, Login/Register, API. `/` → Redirect `/scan`. Alles andere → `/scan`. In der Sidebar sind **Scan** und **Einstellungen** klickbar.
- **DB:** Gleiche `DATABASE_URL` wie Haupt-CHECKION möglich.
- **Schema:** Kein `drizzle-kit push` beim Start (nur mit `CHECKION_RUN_SCHEMA_PUSH=1`). Migrationen über Haupt-CHECKION.
- **Sprache:** UI und AMC-API-Fehlertexte **ausschließlich Deutsch** (`lib/amc-locale.ts` erzwingt `de`; Cookie/Browser-`en` wird ignoriert).
- **Projekte:** Kein Projekt-Dropdown auf `/scan`, keine `projectId` in Scan-Requests, kein „Zu Projekt hinzufügen“ auf Ergebnissen (`isAmcScanProjectSelectorEnabled()` → `false`).
- **GEO/E-E-A-T:** Nur **vollständige Analyse** mit **immer aktivem** Competitive Benchmark (Konkurrenten/Fragen-Felder sichtbar), kein Kurzmodus-Tab und keine Checkbox „Sichtbarkeit in LLMs“ (`isAmcGeoEeatQuickScanEnabled()` / `isAmcGeoEeatCompetitiveSelectorEnabled()` → `false`).
- **WCAG-Standard:** Kein Level-Dropdown auf `/scan`; Scans laufen fest mit **WCAG 2.1 AA** (`isAmcScanWcagStandardSelectorEnabled()` → `false`).
- **Scan-Engines:** Kein Engine-Picker; fest **axe-core + HTML CodeSniffer** (`isAmcScanRunnerSelectorEnabled()` → `false`).
- **Scan-Seite:** Kein separater Seitenkopf — **Neuer Scan** + Beschreibung stehen in der Konfigurationskarte (`isAmcScanPageHeaderEnabled()` → `false`). Auf Mobile kein horizontales Padding (`isAmcMobileMainFlushHorizontal()` für `/scan`, `/results/*` und `/geo-eeat/*`, siehe `lib/amc-page-shell.ts`).
- **Scan-Ergebnisse (Mobile):** Horizontale **Chip-Navigation** statt Ansichten-Dropdown (`ResultsMobileViewNav`); Quick-Links in der Übersichtskarte (`ResultsOverviewQuickLinks`); ab Tablet Tabs wie im Hauptprodukt; Issue-Filter als Selects in „Liste & Details“; PDF/Gerät in der Scan-Karte (`isAmcResultsViewModeSelectorOnMobileEnabled()` → `false`).
- **GEO-Ergebnisse (Mobile):** Phase 1: Toolbar, Sprungnavigation, vertikale Metriken, Kurz-Modelllabels, Diagramm ab `md`, volle Balkenbreite, 2-Zeilen-Queries. Phase 2: Sticky Action Bar (Teilen/Rerun), Run/Modell als Select, Zitationen vertikal, Chips „+N mehr“, Reasoning einklappbar, Karten-Innenpadding auf Flush-Pages (`lib/amc-page-shell.ts`).
- **Einstellungen:** Nur Profil, Erscheinungsbild, Passwort und Abmelden — kein **Standard-Konfiguration**, kein **API-Zugang**, kein **Über CHECKION** (`isAmcSettingsScanConfigEnabled()` / `isAmcSettingsApiTokensEnabled()` / `isAmcSettingsAboutEnabled()` → `false`).

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
| `GEMINI_API_KEY` | **Optional weglassen** — AMC nutzt keinen Gemini-Competitive-Benchmark (Code: `isAmcGeminiCompetitiveBenchmarkEnabled()` → `false`). Verhindert 429/503-Spam in den Logs. Competitive läuft über **OpenAI** (+ **Anthropic**, falls `ANTHROPIC_API_KEY` gesetzt). |
| `CHECKION_DISABLE_GEMINI_COMPETITIVE` | `1` zusätzlich möglich (erzwingt leere Gemini-Modellliste auch außerhalb AMC-Flag) |
| `CHECKION_COMPETITIVE_GEMINI_MODELS` | Nur falls Gemini wieder aktiv: z. B. `gemini-2.5-flash` (kommagetrennt), nicht die volle Pro-Liste |

Repo in Coolify auf **CHECKION-AMC** umstellen (nicht CHECKION).

## Code-Stellen (nur im Fork)

- `lib/amc-lite.ts` — Routen-Allowlist
- `lib/amc-locale.ts`, `lib/amc-api-messages.ts` — Deutsch-only Locale & API-Meldungen
- `lib/amc-register.ts` — Registrierungs-Schema + Passwort-Generierung
- `app/register/page.tsx`, `app/api/auth/register/route.ts`
- `proxy.ts`
- `components/AmcLiteNavLink.tsx`, `components/Sidebar.tsx`
- `components/geo-eeat/*`, `lib/geo-eeat/model-label.ts`, `lib/amc-page-shell.ts` — GEO-Ergebnisse Mobile-UX
- `scripts/docker-entrypoint.sh`
