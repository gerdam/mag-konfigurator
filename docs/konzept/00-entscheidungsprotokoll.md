---
titel: "Konfigurator: Entscheidungsprotokoll und Etappenplan"
erstellt: 2026-07-17
status: gültig — Grundlage für die Konzeptdokumente 01–05
autor: Claude (Fable 5), Brainstorming-Session mit Michael am 17.07.2026
ersetzt: den Plan vom 12.07. und die Trialog-Erweiterung vom 13.07. (beide archiviert unter ..\..\protokolle\ bzw. ..\..\Dual-layer\)
---

# Konfigurator — Entscheidungsprotokoll (Neuschnitt vom 17.07.2026)

## Was der Konfigurator ist

Ein Konfigurator, der Menschen ohne KI-Expertise über einen **geführten
Dialog** (Domäne → Aufgabentyp → Risikoprofil/Autonomie) ein passendes,
kuratiertes Konfigurationsprofil für Claude auswählt. Eine interaktive
**Netzwerkansicht** (Knoten = Bausteine/Profile, Kanten = Beziehungen) dient
als Landkarte zum Verstehen und Verfeinern. Grundmodell: **Bausteine +
fünf Wirkungsebenen** (Identität, Verhalten, Wissen, Werkzeuge, Leitplanken).

Die Idee, **zwei KI-Systeme zu koppeln** (Trialog/Dual-Layer), ist seit dem
17.07.2026 ein **eigenes Produkt** und lebt in `..\..\Dual-layer\`. Sie ist
nicht Teil dieses Konzepts.

## Beschlüsse (Stand 17.07.2026, fortgeschrieben — nicht neu aufrollen)

| # | Thema | Beschluss | Begründung |
|---|---|---|---|
| E1 | Produkttrennung | Dual-Layer-KI = eigenständiges Produkt, eigener Ordner `Dual-layer\`; heute nur ausgelagert + Ideenskizze | Zwei Produktideen in einem Plan blockierten beide |
| E2 | Plan-Schnitt | Konfigurator-Plan komplett neu geschnitten; Punkte aus 12.07. und 13.07. einzeln entschieden (E3–E6) | Weder der alte Plan noch die Codex-Erweiterung passten als Ganzes |
| E3 | Zielsysteme | Konkret ausgearbeitet werden nur die 3 Claude-Oberflächen (Claude Code, claude.ai-Projekte, API). Das Datenmodell bleibt adapterfähig: andere Anbieter sind später andockbar, werden jetzt nicht ausgearbeitet | Kleinster Schnitt mit offener Tür; 9 Oberflächen = Papierprodukt-Risiko, Capability-Matrix veraltet ab Tag 1 |
| E4 | Profilbreite | Tracer Bullet: **1 Profil** wird lückenlos durchdekliniert (Baustein → Profil → fertige Artefakte für alle 3 Oberflächen). Weitere Profile nur als Steckbriefe (5–10 Zeilen) | Erst beweisen, dass die Taxonomie trägt, dann verbreitern |
| E5 | Referenzprofil | **MAG-Rechercheassistenz** | Real testbar in Michaels Arbeitsalltag — der beste Realitätscheck |
| E6 | Codex-Übernahmen | **Ja:** (a) Baustein-Feld `art: wunsch \| erzwungen` — Prompt-Wunsch ist keine erzwungene Policy; (b) Wording „kuratierter Vorschlag" statt „Best Practice" bis zur Evaluation; (c) `adapter_status: supported \| degraded \| unsupported` je Baustein-Mapping. **Nein:** Die 5 Wirkungsebenen bleiben festes Datenmodell-Feld jedes Bausteins (nicht bloß UI-Facette) | (a) verhindert Schein-Sicherheit, (b) Ehrlichkeit im Wording, (c) ehrlich statt scheinbar installierbar; Ebenen als Pflichtfeld halten die Taxonomie und den Graphen konsistent |
| E7 | CI-Modul | Jetzt: `git init` lokal (kein Push) + Prüfskript `tools\check-docs.ps1` + pre-commit-Hook. GitHub + GitHub Actions erst mit der Prototyp-Etappe | Sofort machbar ohne Remote; Umzug steht in der Roadmap |
| E8 | Speicher-Leitlinie | Überall, wo gesucht/gespeichert wird: indexierte Speicherung auf B-Tree/B+-Tree-Basis. Default-Umsetzung SQLite (nutzt intern B-Trees), keine Eigenimplementierung. Gilt für beide Produkte | Wunschliste 16.07.; SQLite liefert die Struktur fertig und versionierbar |
| E9 | Werkbank | Einrichten: find skill (Skillsuche), markitdown MCP (Formate → Markdown), OS Builder Paul (`/paul:init`), graphify recherchieren. Regel: `/Goal` nur mit explizitem Stopp-Kriterium/Token-Budget | Wunschliste 16.07.; /Goal ohne Stopp verbraucht Token grenzenlos |
| E10 | Deployment | Railway / Vercel / gemieteter Space = Roadmap-Punkt der Prototyp-Etappe | Es gibt noch nichts zu deployen |
| E11 | Ressource | GitHub-Repo „everything claude code" (28 Subagents, 118 Skills) als Quelle für Werkbank-Skills und Katalog-Inhalte auswerten | Fertige Bausteine statt Neuerfindung |
| E12 | Werkzeug-Stack Prüfcode | Python 3.13 (vorhanden) + PyYAML 6 + sqlite3 + unittest, keine neuen Abhängigkeiten; PowerShell bleibt CI-Einstieg (`check-docs.ps1`) | Bordmittel statt Installationen; YAML+SQLite direkt abgedeckt (E8) |
| E13 | Katalog-Dateistruktur | Bausteine als je eine YAML-Datei unter `katalog\bausteine\`, Profile unter `katalog\profile\`, erzeugte Artefakte unter `artefakte\<profil-id>\`; `katalog\index.sqlite` und `graph\` werden generiert und nicht versioniert | YAML versionierbar (05-Vorgabe), eine Datei je Baustein = saubere Diffs; Index ist ableitbar |
| E14 | Backend Prototyp | Web-App-Backend des Prototyps (Etappe B) in Python 3.13 + FastAPI | Von Michael am 19.07.2026 beschlossen (Empfehlung aus 05); bleibt beim vorhandenen Python-Stack (E12), keine neue Sprache im Projekt |
| E15 | Graph-Rendering | Die Netzwerkansicht rendert mit Cytoscape.js (statt D3) | Von Michael am 19.07.2026 beschlossen (Empfehlung aus 05); graphspezifische Bibliothek reduziert Eigenbau für Knoten, Kanten und Interaktion |

## Etappenplan

### Etappe A — Konzeptdokumente (nächste Etappe)

Alle unter `docs\konzept\`, Reihenfolge 01 → 05; die Taxonomie (02) ist das
Fundament, an dem sich 03–05 ausrichten:

1. **01-vision.md** — Problem, Zielgruppen, Nutzenversprechen, Abgrenzung
   (was der Konfigurator nicht ist; Verweis auf Dual-Layer als Nicht-Ziel)
2. **02-taxonomie.md** — die 5 Wirkungsebenen im Detail; Baustein-Schema als
   formales Datenmodell (YAML-Schema) mit den Feldern: Ebene (Pflicht),
   Klartext-Wirkung, Risiken/Nebenwirkungen, Beziehungen
   (benötigt / verstärkt / kollidiert), `art: wunsch|erzwungen`,
   je Zieloberfläche ein Mapping mit `adapter_status`; Regeln für
   Kombinierbarkeit und Konflikterkennung. Schema mit 3–4 echten
   Beispiel-Bausteinen validieren, bevor 03 entsteht
3. **03-profilkatalog.md** — Tracer Bullet **MAG-Rechercheassistenz**
   vollständig: Bausteinliste → Profil → reale Artefakte für alle 3
   Oberflächen (fertiger System-Prompt, fertige CLAUDE.md + settings.json,
   API-Parametersatz). Übrige Profile (z. B. Finanzanalyst, Fachübersetzer,
   Text-Enhancer, Rechtsassistent, Software-Entwickler) nur als Steckbriefe
4. **04-bedienkonzept.md** — Fragenlogik des geführten Dialogs; Netzwerkansicht
   (Knoten farbig nach Ebene, Kanten = Beziehungstyp, Zu-/Abwahl mit sofortiger
   Konflikt-Warnung); Export-Schritt
5. **05-architektur-roadmap.md** — Datenhaltung: Baustein-Katalog als
   YAML-Dateien (versionierbar) + SQLite-Index für die Suche (E8);
   Tech-Stack-Empfehlung Web-App, Graph-Rendering (Cytoscape.js / D3;
   graphify-Rechercheergebnis einarbeiten); Roadmap: ② klickbarer Prototyp →
   GitHub + GitHub Actions (E7) → ③ Export echter Konfigurationen → Deploy
   auf Railway/Vercel/Space (E10) → ④ Profil-Pflege und Evaluation (erst
   danach darf ein Profil „Best Practice" heißen, E6b)

### Etappe B — Prototyp (nach Abnahme der Konzepte)

Siehe Roadmap in 05. Nicht Teil dieser Etappe.

## Abnahmekriterien für Etappe A

- **Konsistenz:** Jedes in 03 verwendete Baustein-Attribut existiert im
  Schema von 02; keine Widersprüche zwischen 04 und 02
- **Laien-Test:** Baustein- und Profilbeschreibungen ohne KI-Vorwissen
  verständlich (Michael liest gegen) — **entfällt** per Beschluss von Michael
  am 19.07.2026 (siehe Notizen); die Abnahme stützt sich auf die übrigen
  vier Kriterien
- **Tragfähigkeit:** Das Referenzprofil erzeugt für alle 3 Oberflächen ein
  vollständiges, real einsetzbares Artefakt — Michael setzt die
  MAG-Rechercheassistenz produktiv ein
- **Graph-Tauglichkeit:** Die Beispieldaten aus 03 lassen sich vollständig
  als Knoten/Kanten-Liste darstellen (Stichprobe als Tabelle im Konzept)
- **CI:** `tools\check-docs.ps1` läuft fehlerfrei über alle Dokumente

## Arbeitsregeln

- Wording: „kuratierter Vorschlag", nicht „Best Practice", bis eine
  Evaluation existiert (E6b)
- UTF-8-Pflicht; jede neue Datei nach dem Schreiben erneut einlesen
  (bekannte Kodierungsfehler-Historie); der pre-commit-Hook prüft zusätzlich
- Git: nur lokal, kein Push (bis E7-Umzug); Commits je abgeschlossenem Schritt
- `/Goal` nur mit explizitem Stopp-Kriterium/Token-Budget (E9)

## Notizen / offene Punkte

- **Werkbank-Status, graphify-Recherche und everything-claude-code-Fundliste:**
  siehe [werkbank.md](../werkbank.md) (Stand 17.07.2026)
- **Offen:** Installation „OS Builder Paul" wartet auf Michaels Bestätigung
  des recherchierten Kandidaten (Details in werkbank.md)
- **Bauprozess beschlossen (18.07.2026):** Variante V3 samt Arbeitspaketen
  AP1–AP4; Spec: `..\superpowers\specs\2026-07-18-bauprozess-design.md`,
  Plan: `..\superpowers\plans\2026-07-18-bauprozess.md`
- **Haltepunkt-Entscheidungen (19.07.2026):** E14/E15 beschlossen (siehe
  Tabelle); Abnahmekriterium „Laien-Test" entfällt auf Michaels Entscheidung;
  für den Produktivtest des MAG-Profils liegt eine Einsatz-Anleitung unter
  `..\..\artefakte\mag-rechercheassistenz\anleitung.md`
