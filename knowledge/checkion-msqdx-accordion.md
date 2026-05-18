# CHECKION – Issues-Liste (Results Page)

## Desktop: virtuelle Tabelle

Ab `md`: **ScanIssueList** mit Header (Schwere, Meldung, Level, Runner, Code) und **ScanIssueRow** (virtualisiert, `<details>` für Selector/Kontext).

## Mobile: Karten-Accordion

Unter `md`: dieselbe **ScanIssueList** rendert **ScanIssueItem**-Karten (Meldung zuerst, Meta-Chips, aufklappbarer Selector/Kontext/Fix-Docs). Kein horizontaler Tabellen-Scroll.

Hervorhebung weiter per CSS (`data-highlighted-index` / `data-row-index`).

`size` und `borderRadius` gehören auf **`MsqdxAccordion`** (siehe `ScanIssueList.tsx`), nicht auf **`MsqdxAccordionItem`** (nur `id`, `summary`, `children`, optional `highlighted` / `highlightColor`).

## Referenzen

- Results-Page: `app/results/[id]/page.tsx`
- Liste: `components/ScanIssueList.tsx`, `components/ScanIssueRow.tsx`, `components/ScanIssueItem.tsx`
