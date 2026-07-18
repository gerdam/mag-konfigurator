---
titel: "Design: Bauprozess Konfigurator (Konzept → Deploy)"
erstellt: 2026-07-18
status: von Michael freigegeben (Brainstorming-Session 17./18.07.2026)
grundlage: docs\konzept\00-entscheidungsprotokoll.md (E1–E11), Beschlüsse B1–B4, Varianten-Entscheidung V3
---

# Design: Bauprozess des Konfigurators

## Zweck

Dieses Dokument legt fest, **wie** der Konfigurator gebaut wird — vom
Konzeptdokument bis zum Deployment (B1). Es beschreibt keinen Inhalt der
Konzeptdokumente 01–05; deren Inhalt regelt das Entscheidungsprotokoll.

## Getroffene Prozess-Entscheidungen

| # | Frage | Entscheidung |
|---|---|---|
| B1 | Umfang | Gesamtprozess Konzept → Deploy als durchgängiger Prozess |
| B2 | Einbindung Michael | Autonom; harte Haltepunkte nur vor Außenwirkung (GitHub-Push, Deployment); Abnahme inkl. Laien-Test gebündelt am ersten Außenwirkungs-Haltepunkt |
| B3 | Stopp-Kriterium | Arbeitspaket je Lauf; Paketende = Commit + kurzer Bericht, dann Stopp |
| B4 | Technische Entscheidungen | Claude entscheidet selbst und dokumentiert als E12, E13, … im Entscheidungsprotokoll; Michael kann am Haltepunkt kippen; Leitplanken E3 und E8 gelten |
| B5 | Prozess-Variante | **V3 — Validierungslauf am Etappenende:** Dokumente zügig durchschreiben, danach ein gesammelter Prüflauf gegen Code vor Etappe B |

## 1. Gesamtablauf: Arbeitspakete

Der Prozess läuft als Folge klar umrissener Arbeitspakete. Jedes Paket
endet mit Commit + kurzem Bericht, dann Stopp (Berichtspunkt, keine
Abnahme — Michael kann eingreifen, muss aber nicht).

| Paket | Inhalt | Etappe |
|---|---|---|
| AP1 | `01-vision.md` + `02-taxonomie.md` (inkl. 3–4 Beispiel-Bausteine im YAML-Schema) | A |
| AP2 | `03-profilkatalog.md` — Tracer Bullet MAG-Rechercheassistenz vollständig + Steckbriefe | A |
| AP3 | `04-bedienkonzept.md` + `05-architektur-roadmap.md` | A |
| AP4 | Validierungslauf (V3): gesammelter Prüflauf aller Dokumente gegen Code + Korrektur-Paket(e) | A-Abschluss |
| AP5 ff. | Prototyp-Meilensteine; Zuschnitt wird am Ende von AP4 festgelegt, wenn 05 die Roadmap konkretisiert hat | B |

Harte Haltepunkte (B2):

1. **Vor dem GitHub-Push** (E7-Umzug, Beginn Etappe B): gebündelte Abnahme
   von Etappe A nach den Abnahmekriterien des Entscheidungsprotokolls,
   inkl. Laien-Test durch Michael.
2. **Vor dem Deployment** (E10).

## 2. Der Validierungslauf (AP4)

Kern der Variante V3: Der Code holt die Prüfung nach, die während AP1–AP3
nicht stattfand. Drei Prüf-Artefakte entstehen:

1. **Schema-Validator für 02:** Skript liest die YAML-Beispiel-Bausteine,
   prüft sie gegen das in 02 definierte Schema (Pflichtfeld Ebene,
   `art: wunsch|erzwungen`, `adapter_status`, Beziehungstypen) und baut
   den SQLite-Index auf (E8). Der Validator wandert dauerhaft ins lokale
   CI (`tools\check-docs.ps1` bzw. pre-commit-Hook).
2. **Artefakt-Probe für 03:** Die drei realen Artefakte des
   Tracer-Bullet-Profils (System-Prompt, CLAUDE.md + settings.json,
   API-Parametersatz) werden als echte Dateien erzeugt und gegen die
   Bausteinliste geprüft; jedes verwendete Attribut muss im 02-Schema
   existieren (Konsistenz-Abnahmekriterium).
3. **Graph-Extraktion für 04/05:** Skript erzeugt aus den 03-Daten die
   Knoten/Kanten-Liste und prüft die vollständige Darstellbarkeit
   (Graph-Tauglichkeits-Kriterium).

Ergebnis von AP4 ist ein **Validierungsbericht**. Gefundene Widersprüche
werden als Korrektur-Paket direkt an AP4 angehängt und in den Dokumenten
behoben. AP4 ist erst abgeschlossen, wenn das CI grün ist. Die drei
Prüf-Werkzeuge bleiben erhalten und bilden den Grundstock für Etappe B.

## 3. Autonomie, Entscheidungen, Eskalation

- **Entscheidungen unterwegs (B4):** Jede technische Wahl wird als neue
  Nummer (E12, E13, …) mit Begründung im Entscheidungsprotokoll
  fortgeschrieben. Leitplanken E3 (nur die 3 Claude-Oberflächen) und E8
  (SQLite/B-Tree) sind nicht verhandelbar.
- **Arbeitsregeln je Paket:** UTF-8-Pflicht mit Wiedereinlesen jeder
  neuen Datei; Wording „kuratierter Vorschlag" statt „Best Practice";
  Git nur lokal, kein Push (bis E7-Umzug); `/Goal` nur mit
  Stopp-Kriterium/Token-Budget.
- **Berichtsformat am Paketende:** was entstand, welche E-Nummern neu
  sind, was im nächsten Paket ansteht.
- **Eskalationsregel (einzige Ausnahme von der Autonomie):** Deckt ein
  Lauf ein Problem auf, dessen Behebung einen bestehenden Beschluss
  (E1–E11, B1–B5) kippen würde — etwa: die Taxonomie trägt das
  Referenzprofil nicht —, stoppt der Lauf außerplanmäßig mit Bericht an
  Michael, statt autonom umzubauen. Alles unterhalb dieser Schwelle wird
  autonom korrigiert und dokumentiert.

## Fehlerbehandlung und Testing

- Fehlerbehandlung: AP4-Korrektur-Mechanismus (unterhalb der
  Beschluss-Schwelle) und Eskalationsregel (oberhalb).
- Testing: Die AP4-Prüf-Werkzeuge wandern ins lokale CI ein und laufen
  ab dann bei jedem Commit (pre-commit-Hook).

## Nächster Schritt

Umsetzungsplan nach Skill `superpowers:writing-plans`; erstes
Arbeitspaket ist AP1.
