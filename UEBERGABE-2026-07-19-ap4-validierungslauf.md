---
titel: "Übergabe 4: AP3 fertig, AP4 (Validierungslauf) läuft"
erstellt: 2026-07-19
zweck: Wiedereinstieg, falls die Session/das Kontingent während AP4 endet — exakten Stand aus Ledger + git log ablesen
vorgänger: UEBERGABE-2026-07-18-bauprozess-ausfuehrung.md (erledigt), UEBERGABE-2026-07-17.md (weiterhin gültig)
---

# Übergabe 4 — AP4-Validierungslauf (19.07.2026)

> **Nachtrag (19.07., selbe Session): AP4 ist vollständig abgeschlossen.**
> Tasks 6–10 sind gebaut, reviewed („Approved") und committet; der
> Validierungslauf ergab 0 Befunde, CI ist grün inkl. der 3 Python-Prüfungen.
> Validierungsbericht: `docs\konzept\90-validierungsbericht-etappe-a.md`.
> Der Plan ist damit beendet. Es folgt der **Haltepunkt (B2)**: gebündelte
> Abnahme durch Michael (Laien-Test 01–05, Produktivtest MAG-Profil,
> Entscheidung E14/E15: FastAPI / Cytoscape.js, Triage der notierten
> Minor-Befunde, SDD-Abschlussreview über den ganzen Branch) — erst danach
> GitHub-Push. Der Abschnitt „AP4-Zuschnitt" unten ist damit erledigt.

## Wo wir stehen

**AP3 ist abgeschlossen:** Alle 5 Konzeptdokumente (01–05) sind geschrieben,
je Task von einem frischen Implementer-Subagenten gebaut und von einem
Reviewer-Subagenten geprüft (beide AP3-Tasks: je 1 Important-Befund gefunden,
behoben, Re-Review „Approved"). Michael hat nach dem AP3-Stopp „weiter"
gesagt; **AP4 (Tasks 6–10) läuft** in derselben Session weiter.

## Exakten Stand feststellen (zuerst tun!)

Diese Datei wird nicht nach jedem Task aktualisiert — der lebende Stand ist:

1. `.superpowers\sdd\progress.md` (git-ignoriert) — eine Zeile je fertigem
   Task; bei Verlust aus `git log --oneline` rekonstruieren.
2. `git log --oneline -15` — Commit-Messages tragen das AP-Präfix
   (`AP3: …`, `AP4: …`).

**Wiedereinstieg:** ersten Task ohne „complete"-Zeile im Ledger mit dem Skill
`superpowers:subagent-driven-development` fortsetzen (Task-Briefs:
`scripts/task-brief`, Review-Pakete: `scripts/review-package`, beide im
Skill-Ordner). Halbfertige Tasks: `git status` prüfen — uncommittete Reste
eines abgebrochenen Subagenten ggf. verwerfen und Task neu dispatchen.

## Maßgebliche Dokumente

| Dokument | Pfad |
|---|---|
| Spec (freigegeben) | `docs\superpowers\specs\2026-07-18-bauprozess-design.md` |
| Umsetzungsplan (10 Tasks, AP1–AP4) | `docs\superpowers\plans\2026-07-18-bauprozess.md` |
| Fortschritts-Ledger | `.superpowers\sdd\progress.md` |
| Entscheidungsprotokoll (E1–E13) | `docs\konzept\00-entscheidungsprotokoll.md` |

## Erledigt bei Erstellung dieser Datei (Stand: nach Task 5)

| Task | Inhalt | Commits |
|---|---|---|
| 1–3 (AP1/AP2) | siehe Übergabe 3 | `288a8e7`, `a77d300`, `5ae68e0`+`32bec40` |
| 4 (AP3) | `04-bedienkonzept.md` | `c727f5a` + Review-Fix `26b108b` |
| 5 (AP3) | `05-architektur-roadmap.md` | `933e0d8` + Review-Fix `c82ed94` |

## AP4-Zuschnitt (Tasks 6–10, alle Details im Plan)

- **6:** `tools\validate_katalog.py` + Tests + `.gitignore` (TDD; Code steht
  vollständig im Plan). Achtung: Katalog hat **5** Bausteine — erwartete
  CLI-Ausgabe „5 Baustein(e) gueltig", nicht „4" wie im Plan-Beispiel.
- **7:** `tools\check_profil.py` + Tests (TDD; Code im Plan)
- **8:** `tools\graph_export.py` + Tests (TDD; Code im Plan). Soll-Abgleich:
  Stichprobe in 05 = **5 Knoten, 5 Kanten** (symmetrisches kollidiert-Paar
  als 2 Kanten).
- **9:** Python-Prüfungen in `tools\check-docs.ps1` einbinden (Snippet im Plan)
  + Gegenprobe (absichtlicher Fehler muss CI rot machen)
- **10:** `90-validierungsbericht-etappe-a.md` + Abnahmekriterien-Check +
  AP5-Zuschnitt-Vorschlag → **AP4-STOPP (B3)**, danach Haltepunkt (gebündelte
  Abnahme inkl. Laien-Test vor erstem GitHub-Push, B2)

## Offene Entscheidungen für Michael

- **E-Nummern-Vorschläge aus 05** (dort als Empfehlung markiert, nicht
  beschlossen): Backend Python/FastAPI; Graph-Rendering Cytoscape.js statt
  D3. Bei Zustimmung als E14/E15 fortschreiben (B4).
- Produktivtest MAG-Profil (`artefakte\mag-rechercheassistenz\`) — fließt in
  die Abnahme ein.
- „OS Builder Paul" (`docs\werkbank.md`) und Dual-Layer-Brainstorming:
  unverändert offen, eigene Sessions.

## Fürs Abschluss-Review notierte Minor-Befunde (nicht vorziehen)

Aus AP1/AP2 (siehe Übergabe 3): 01-vision-Nicht-Ziele; Wording „kuratierter
Vorschlag" fehlt in 03; Baustein-Reihenfolge Profil-YAML vs. 03-Tabelle;
verstaerkt-Einseitigkeit in Task 6 als Semantik bestätigen. Neu aus AP3:
„B-Tree" in 05 unerklärt; E9/E11-Zuordnung bei graphify in 05 wortgleich aus
`werkbank.md` übernommen (Quelle selbst unpräzise).

## Arbeitsregeln (unverändert)

UTF-8 + Datei nach Schreiben erneut einlesen (Python/PowerShell-Dateien
bewusst reines ASCII); Wording „kuratierter Vorschlag", nie „Best Practice";
Git nur lokal, **kein Push**; CI = `tools\check-docs.ps1` (auch pre-commit);
E-Nummern fortschreiben (B4); Eskalationsregel der Spec (Beschluss-kippende
Korrekturen → Stopp statt Autonomie).
