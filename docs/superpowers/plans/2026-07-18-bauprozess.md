# Bauprozess Konfigurator — Umsetzungsplan (Etappe A + Validierungslauf)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Etappe A des Konfigurators umsetzen: Konzeptdokumente 01–05 schreiben, danach der gesammelte Validierungslauf gegen Code (Variante V3), bis das lokale CI grün ist.

**Architecture:** Dokumente entstehen zügig in drei Arbeitspaketen (AP1–AP3), maschinelle Prüfung folgt gebündelt in AP4. Bausteine und Profile leben von Anfang an als YAML-Dateien unter `katalog\`; die AP4-Werkzeuge (Schema-Validator, Artefakt-Probe, Graph-Extraktion) prüfen diese Dateien und wandern dauerhaft ins lokale CI (`tools\check-docs.ps1`) ein.

**Tech Stack:** Markdown (Konzeptdokumente), YAML (Katalog), Python 3.13 + PyYAML 6 + sqlite3 + unittest (alle bereits installiert, keine neuen Abhängigkeiten), PowerShell 5.1 (`check-docs.ps1`, pre-commit-Hook).

**Spec:** `docs\superpowers\specs\2026-07-18-bauprozess-design.md`

## Global Constraints

- **Arbeitspaket-Stopps (B3):** Paketenden sind Task 2 (AP1), Task 3 (AP2), Task 5 (AP3), Task 10 (AP4). Dort: Commit + kurzer Bericht (was entstand, neue E-Nummern, was als Nächstes ansteht) — dann STOPP. Checkpoints der Ausführung an diesen Grenzen setzen.
- **Eskalationsregel (Spec §3):** Würde eine Korrektur einen Beschluss E1–E11/B1–B5 kippen → außerplanmäßiger Stopp mit Bericht an Michael, nicht autonom umbauen.
- **UTF-8-Pflicht:** jede neue/geänderte Datei nach dem Schreiben erneut einlesen (Kodierungsfehler-Historie); `check-docs.ps1` prüft zusätzlich.
- **Wording:** „kuratierter Vorschlag", niemals „Best Practice" (E6b).
- **Git:** nur lokal, kein Push (bis E7-Umzug). Commit je abgeschlossenem Schritt.
- **Leitplanken:** nur die 3 Claude-Oberflächen ausarbeiten (E3); Suche/Speicherung über SQLite/B-Tree (E8).
- **Platzhalterwörter** (die drei Marker, die `check-docs.ps1` Schritt 4 sucht) dürfen in keinem Dokument unter `docs\` stehen.
- **Technische Entscheidungen** als Fortschreibung E12, E13, … in `docs\konzept\00-entscheidungsprotokoll.md` dokumentieren (B4).

## Dateistruktur (wird in diesem Plan angelegt)

| Pfad | Verantwortung | Task |
|---|---|---|
| `docs\konzept\01-vision.md` | Problem, Zielgruppen, Nutzen, Abgrenzung | 1 |
| `docs\konzept\02-taxonomie.md` | 5 Ebenen, YAML-Schema, Kombinier-/Konfliktregeln | 2 |
| `katalog\bausteine\*.yaml` | 3–4 echte Beispiel-Bausteine (eine Datei je Baustein) | 2 |
| `docs\konzept\03-profilkatalog.md` | Tracer Bullet MAG-Rechercheassistenz + Steckbriefe | 3 |
| `katalog\profile\mag-rechercheassistenz.yaml` | Profil = kuratierte Bausteinliste | 3 |
| `artefakte\mag-rechercheassistenz\` | system-prompt.md, CLAUDE.md, settings.json, api-parameter.json | 3 |
| `docs\konzept\04-bedienkonzept.md` | Dialoglogik, Netzwerkansicht, Export | 4 |
| `docs\konzept\05-architektur-roadmap.md` | Datenhaltung, Tech-Stack, Roadmap ②–④ | 5 |
| `tools\validate_katalog.py` | Schema-Validator + SQLite-Index (E8) | 6 |
| `tools\tests\test_validate_katalog.py` | Tests Validator | 6 |
| `tools\check_profil.py` | Artefakt-Probe: Profil ↔ Katalog ↔ Artefakte | 7 |
| `tools\tests\test_check_profil.py` | Tests Artefakt-Probe | 7 |
| `tools\graph_export.py` | Knoten/Kanten-Extraktion für die Netzwerkansicht | 8 |
| `tools\tests\test_graph_export.py` | Tests Graph-Export | 8 |
| `tools\check-docs.ps1` (erweitern) | CI-Einbindung der drei Python-Prüfungen | 9 |
| `.gitignore` | generierte Dateien (`katalog\index.sqlite`, `graph\`) | 6 |
| `docs\konzept\90-validierungsbericht-etappe-a.md` | Ergebnis des Validierungslaufs | 10 |

## Baustein-Schema (Arbeitsstand für alle Tasks)

Dieses Schema setzt die Beschlüsse E6 und den Etappenplan um; Task 2 schreibt
es verbindlich in `02-taxonomie.md` fest. Weicht Task 2 begründet davon ab,
wird die Abweichung als E-Nummer dokumentiert und die Tasks 6–8 verwenden die
festgeschriebene Fassung.

```yaml
id: antwortstil-quellenpflicht        # = Dateiname ohne .yaml, kebab-case
name: "Antwortstil: Quellenpflicht"
ebene: verhalten                       # Pflicht: identitaet | verhalten | wissen | werkzeuge | leitplanken
art: wunsch                            # wunsch | erzwungen (E6a)
klartext_wirkung: >
  Der Assistent nennt zu jeder Tatsachenbehauptung die Quelle und sagt
  offen, wenn er keine hat.
risiken:
  - "Antworten werden länger und langsamer."
beziehungen:
  benoetigt: []                        # Listen von Baustein-IDs
  verstaerkt: []
  kollidiert: []
mappings:                              # genau die 3 Oberflächen (E3)
  claude-code:
    adapter_status: supported          # supported | degraded | unsupported (E6c)
    umsetzung: "Abschnitt in CLAUDE.md"
  claude-ai-projekte:
    adapter_status: supported
    umsetzung: "Absatz in den Projekt-Anweisungen"
  api:
    adapter_status: supported
    umsetzung: "Absatz im System-Prompt"
```

---

### Task 1: AP1 beginnen — Entscheidungen E12/E13 + `01-vision.md`

**Files:**
- Modify: `docs\konzept\00-entscheidungsprotokoll.md` (Beschluss-Tabelle + Notizen)
- Create: `docs\konzept\01-vision.md`

**Interfaces:**
- Consumes: Spec `docs\superpowers\specs\2026-07-18-bauprozess-design.md`; Entscheidungsprotokoll E1–E11
- Produces: E12/E13 (Werkzeug-Stack, Dateistruktur) — Grundlage aller Folge-Tasks; `01-vision.md` als Referenz für Abgrenzungsfragen in 03/04

- [ ] **Step 1: Entscheidungsprotokoll fortschreiben (E12, E13)**

In `docs\konzept\00-entscheidungsprotokoll.md` an die Beschluss-Tabelle anhängen:

```markdown
| E12 | Werkzeug-Stack Prüfcode | Python 3.13 (vorhanden) + PyYAML 6 + sqlite3 + unittest, keine neuen Abhängigkeiten; PowerShell bleibt CI-Einstieg (`check-docs.ps1`) | Bordmittel statt Installationen; YAML+SQLite direkt abgedeckt (E8) |
| E13 | Katalog-Dateistruktur | Bausteine als je eine YAML-Datei unter `katalog\bausteine\`, Profile unter `katalog\profile\`, erzeugte Artefakte unter `artefakte\<profil-id>\`; `katalog\index.sqlite` und `graph\` werden generiert und nicht versioniert | YAML versionierbar (05-Vorgabe), eine Datei je Baustein = saubere Diffs; Index ist ableitbar |
```

Außerdem im Abschnitt „Notizen / offene Punkte" ergänzen:

```markdown
- **Bauprozess beschlossen (18.07.2026):** Variante V3 samt Arbeitspaketen
  AP1–AP4; Spec: `..\superpowers\specs\2026-07-18-bauprozess-design.md`,
  Plan: `..\superpowers\plans\2026-07-18-bauprozess.md`
```

- [ ] **Step 2: `01-vision.md` schreiben**

Pflicht-Gliederung (aus dem Etappenplan im Entscheidungsprotokoll):

```markdown
---
titel: "01 — Vision"
erstellt: 2026-07-18
status: Entwurf (Abnahme gebündelt vor GitHub-Push, B2)
---

# 01 — Vision

## Das Problem            <!-- Menschen ohne KI-Expertise konfigurieren Claude schlecht/gar nicht -->
## Zielgruppen            <!-- konkret benennen, mind. Laien + Power-User-Abgrenzung -->
## Nutzenversprechen      <!-- geführter Dialog -> kuratiertes Profil; Netzwerkansicht als Landkarte -->
## Was der Konfigurator nicht ist   <!-- Abgrenzung; Dual-Layer/Trialog = eigenes Produkt, Verweis auf Dual-layer\ -->
```

Die Kommentare sind Inhaltsvorgaben und werden durch ausformulierten,
laienverständlichen Text ersetzt (Laien-Test ist Abnahmekriterium).
Wording-Regel E6b beachten.

- [ ] **Step 3: Datei erneut einlesen (UTF-8-Kontrolle), dann CI laufen lassen**

Run: `powershell -File tools\check-docs.ps1`
Expected: `Alles in Ordnung.` (Exit 0)

- [ ] **Step 4: Commit**

```powershell
git add docs/konzept/00-entscheidungsprotokoll.md docs/konzept/01-vision.md
git commit -m "AP1: E12/E13 + 01-vision"
```

---

### Task 2: AP1 abschließen — `02-taxonomie.md` + Beispiel-Bausteine

**Files:**
- Create: `docs\konzept\02-taxonomie.md`
- Create: `katalog\bausteine\<id>.yaml` (3–4 Dateien)

**Interfaces:**
- Consumes: Baustein-Schema (Arbeitsstand oben), E6, E8
- Produces: verbindliches YAML-Schema (Feldnamen exakt wie im Arbeitsstand: `id`, `name`, `ebene`, `art`, `klartext_wirkung`, `risiken`, `beziehungen.benoetigt/verstaerkt/kollidiert`, `mappings.<oberflaeche>.adapter_status/umsetzung`); 3–4 Baustein-Dateien, die Tasks 3 und 6–8 direkt weiterverwenden

- [ ] **Step 1: `02-taxonomie.md` schreiben**

Pflicht-Gliederung:

```markdown
---
titel: "02 — Taxonomie"
erstellt: 2026-07-18
status: Entwurf (Abnahme gebündelt vor GitHub-Push, B2)
---

# 02 — Taxonomie

## Die 5 Wirkungsebenen        <!-- Identität, Verhalten, Wissen, Werkzeuge, Leitplanken: je Definition + Beispiel -->
## Das Baustein-Schema          <!-- YAML-Schema aus dem Plan-Arbeitsstand, Feld für Feld laienverständlich erklärt -->
## Kombinierbarkeit und Konflikte  <!-- Regeln: benoetigt = Pflichtnachzug, verstaerkt = Empfehlung, kollidiert = harte Warnung; Konflikterkennung = kollidiert-Kante innerhalb eines Profils -->
## Beispiel-Bausteine           <!-- die 3–4 Bausteine aus katalog\bausteine\ verlinken und je in 2 Sätzen einordnen -->
```

- [ ] **Step 2: 3–4 Beispiel-Bausteine als YAML anlegen**

Unter `katalog\bausteine\`, gewählt so, dass sie das MAG-Rechercheassistenz-
Profil (Task 3) tragen und alle Schema-Aspekte vorkommen (mind. je 1×
`art: erzwungen`, 1× `adapter_status: degraded`, 1× nicht-leere
`kollidiert`-Liste). Kandidaten:

1. `antwortstil-quellenpflicht.yaml` (Beispiel im Plan-Arbeitsstand, Ebene Verhalten)
2. `rolle-rechercheassistent.yaml` (Ebene Identität)
3. `leitplanke-keine-rechtsberatung.yaml` (Ebene Leitplanken, `art: erzwungen`)
4. `werkzeug-websuche.yaml` (Ebene Werkzeuge; `adapter_status: degraded` dort, wo eine Oberfläche keine Websuche hat; `kollidiert` z. B. mit einem Offline-Baustein)

Jede Datei folgt exakt dem Schema; `id` = Dateiname ohne Endung.

- [ ] **Step 3: Papier-Validierung (Etappenplan-Vorgabe „Schema validieren, bevor 03 entsteht")**

Jeden Beispiel-Baustein Feld für Feld gegen das Schema in 02 durchgehen;
jede nötige Schema-Änderung direkt in 02 nachziehen (maschinell prüft das
erst AP4 — das ist die V3-Entscheidung).

- [ ] **Step 4: Dateien erneut einlesen, CI laufen lassen**

Run: `powershell -File tools\check-docs.ps1`
Expected: `Alles in Ordnung.` (Exit 0)

- [ ] **Step 5: Commit + AP1-Bericht + STOPP**

```powershell
git add docs/konzept/02-taxonomie.md katalog/
git commit -m "AP1: 02-taxonomie + Beispiel-Bausteine"
```

Bericht an Michael (was entstand, neue E-Nummern, nächstes Paket = AP2),
dann STOPP (B3). Kein Weiterarbeiten ohne neuen Lauf.

---

### Task 3: AP2 — `03-profilkatalog.md`, Profil-YAML, reale Artefakte

**Files:**
- Create: `docs\konzept\03-profilkatalog.md`
- Create: `katalog\profile\mag-rechercheassistenz.yaml`
- Create: `artefakte\mag-rechercheassistenz\system-prompt.md`
- Create: `artefakte\mag-rechercheassistenz\CLAUDE.md`
- Create: `artefakte\mag-rechercheassistenz\settings.json`
- Create: `artefakte\mag-rechercheassistenz\api-parameter.json`

**Interfaces:**
- Consumes: Schema + Bausteine aus Task 2 (exakte Feldnamen und IDs)
- Produces: Profil-Format für Task 7: `id`, `name`, `beschreibung`, `bausteine` (Liste von Baustein-IDs); Artefakt-Dateinamen exakt wie oben (Task 7 prüft genau diese vier)

- [ ] **Step 1: Profil-YAML anlegen**

```yaml
id: mag-rechercheassistenz
name: "MAG-Rechercheassistenz"
beschreibung: >
  Rechercheassistenz für Michaels Arbeitsalltag (E5) — der Realitätscheck
  des Konfigurators.
bausteine:
  - rolle-rechercheassistent
  - antwortstil-quellenpflicht
  - leitplanke-keine-rechtsberatung
  - werkzeug-websuche
```

(Liste an die tatsächlichen IDs aus Task 2 anpassen; keine zwei Bausteine
mit `kollidiert`-Beziehung zueinander aufnehmen.)

- [ ] **Step 2: Die 4 realen Artefakte erzeugen**

Inhalt jeweils vollständig aus den Bausteinen ableiten — jede Aussage in
einem Artefakt muss auf einen Baustein des Profils zurückführbar sein
(Umkehrung des Konsistenz-Abnahmekriteriums):

- `system-prompt.md`: fertiger System-Prompt für die API-Oberfläche
- `CLAUDE.md`: einsatzfertig für Claude Code
- `settings.json`: gültiges JSON, zu CLAUDE.md passende Einstellungen
- `api-parameter.json`: gültiges JSON, z. B. `{"model": "...", "max_tokens": ..., "system": "<Verweis auf system-prompt.md>"}`

Michael soll dieses Profil produktiv einsetzen können (Abnahmekriterium
Tragfähigkeit).

- [ ] **Step 3: `03-profilkatalog.md` schreiben**

Pflicht-Gliederung:

```markdown
---
titel: "03 — Profilkatalog"
erstellt: 2026-07-18
status: Entwurf (Abnahme gebündelt vor GitHub-Push, B2)
---

# 03 — Profilkatalog

## Tracer Bullet: MAG-Rechercheassistenz   <!-- Bausteinliste -> Profil -> Artefakte, mit Links auf katalog\ und artefakte\ -->
## Steckbriefe weiterer Profile             <!-- je 5–10 Zeilen: Finanzanalyst, Fachübersetzer, Text-Enhancer, Rechtsassistent, Software-Entwickler -->
```

- [ ] **Step 4: Dateien erneut einlesen, CI laufen lassen**

Run: `powershell -File tools\check-docs.ps1`
Expected: `Alles in Ordnung.` (Exit 0)

- [ ] **Step 5: Commit + AP2-Bericht + STOPP**

```powershell
git add docs/konzept/03-profilkatalog.md katalog/profile/ artefakte/
git commit -m "AP2: 03-profilkatalog + MAG-Profil + Artefakte"
```

Bericht + STOPP (B3).

---

### Task 4: AP3 — `04-bedienkonzept.md`

**Files:**
- Create: `docs\konzept\04-bedienkonzept.md`

**Interfaces:**
- Consumes: Taxonomie (02), Profil + Bausteine (03) als konkrete Beispiele im Text
- Produces: Fragenlogik + Netzwerkansicht-Spezifikation, an der sich Task 8 (Kantentypen) und Etappe B orientieren

- [ ] **Step 1: `04-bedienkonzept.md` schreiben**

Pflicht-Gliederung:

```markdown
---
titel: "04 — Bedienkonzept"
erstellt: 2026-07-18
status: Entwurf (Abnahme gebündelt vor GitHub-Push, B2)
---

# 04 — Bedienkonzept

## Der geführte Dialog        <!-- Fragenlogik Domäne -> Aufgabentyp -> Risikoprofil/Autonomie; je Frage: Formulierung + Antwortoptionen + Wirkung auf die Profilauswahl; mit dem MAG-Profil als durchgespieltem Beispiel -->
## Die Netzwerkansicht         <!-- Knoten farbig nach Ebene (5 Farben benennen), Kanten = Beziehungstyp (benoetigt/verstaerkt/kollidiert), Zu-/Abwahl mit sofortiger Konflikt-Warnung (kollidiert-Kante) -->
## Der Export-Schritt          <!-- vom gewählten Profil zu den Artefakten je Oberfläche, inkl. adapter_status-Anzeige (E6c) -->
```

- [ ] **Step 2: Datei erneut einlesen, CI laufen lassen**

Run: `powershell -File tools\check-docs.ps1`
Expected: `Alles in Ordnung.` (Exit 0)

- [ ] **Step 3: Commit**

```powershell
git add docs/konzept/04-bedienkonzept.md
git commit -m "AP3: 04-bedienkonzept"
```

---

### Task 5: AP3 abschließen — `05-architektur-roadmap.md`

**Files:**
- Create: `docs\konzept\05-architektur-roadmap.md`

**Interfaces:**
- Consumes: E7, E8, E10, `docs\werkbank.md` (graphify-Rechercheergebnis), 04-Netzwerkansicht
- Produces: Roadmap, aus der Task 10 den AP5-Zuschnitt (Prototyp-Meilensteine) ableitet

- [ ] **Step 1: `05-architektur-roadmap.md` schreiben**

Pflicht-Gliederung:

```markdown
---
titel: "05 — Architektur und Roadmap"
erstellt: 2026-07-18
status: Entwurf (Abnahme gebündelt vor GitHub-Push, B2)
---

# 05 — Architektur und Roadmap

## Datenhaltung            <!-- Baustein-Katalog als YAML (versionierbar) + SQLite-Index für die Suche (E8, E13); Verweis auf tools\validate_katalog.py als Index-Erzeuger -->
## Tech-Stack-Empfehlung   <!-- Web-App; Graph-Rendering Cytoscape.js vs. D3 mit Empfehlung, graphify-Ergebnis aus werkbank.md einarbeiten -->
## Graph-Tauglichkeit      <!-- Stichprobe: Knoten/Kanten der 03-Daten als Tabelle (Abnahmekriterium) -->
## Roadmap                 <!-- ② klickbarer Prototyp -> GitHub + GitHub Actions (E7) -> ③ Export echter Konfigurationen -> Deploy Railway/Vercel/Space (E10) -> ④ Profil-Pflege und Evaluation (erst danach „Best Practice", E6b) -->
```

- [ ] **Step 2: Datei erneut einlesen, CI laufen lassen**

Run: `powershell -File tools\check-docs.ps1`
Expected: `Alles in Ordnung.` (Exit 0)

- [ ] **Step 3: Commit + AP3-Bericht + STOPP**

```powershell
git add docs/konzept/05-architektur-roadmap.md
git commit -m "AP3: 05-architektur-roadmap"
```

Bericht + STOPP (B3). Damit sind alle 5 Konzeptdokumente geschrieben;
AP4 (Validierungslauf) ist das nächste Paket.

---

### Task 6: AP4 — Schema-Validator `tools\validate_katalog.py` (TDD)

**Files:**
- Create: `tools\validate_katalog.py`
- Create: `tools\tests\test_validate_katalog.py`
- Create: `.gitignore`

**Interfaces:**
- Consumes: Baustein-YAML-Dateien aus Task 2 (`katalog\bausteine\*.yaml`), Schema aus 02
- Produces: `lade_bausteine(katalog_dir: Path) -> tuple[dict, list[str]]`, `pruefe_beziehungen(bausteine: dict) -> list[str]`, `baue_index(bausteine: dict, db_pfad: Path) -> None`; CLI: Exit 0 = gültig, 1 = Befunde (Befunde als Zeilen auf stdout). Task 8 und 9 rufen das CLI auf; die SQLite-Tabellen heißen `bausteine(id, name, ebene, art)`, `beziehungen(von_id, typ, zu_id)`, `mappings(baustein_id, oberflaeche, adapter_status)`.

- [ ] **Step 1: Failing Test schreiben**

`tools\tests\test_validate_katalog.py`:

```python
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from validate_katalog import lade_bausteine, pruefe_beziehungen, baue_index

GUELTIG = """\
id: test-baustein
name: "Testbaustein"
ebene: verhalten
art: wunsch
klartext_wirkung: "Tut etwas Nachvollziehbares."
risiken: []
beziehungen:
  benoetigt: []
  verstaerkt: []
  kollidiert: []
mappings:
  claude-code: {adapter_status: supported, umsetzung: "x"}
  claude-ai-projekte: {adapter_status: supported, umsetzung: "x"}
  api: {adapter_status: supported, umsetzung: "x"}
"""


class TestValidator(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def schreibe(self, name, text):
        (self.dir / name).write_text(text, encoding="utf-8")

    def test_gueltiger_baustein_ohne_befunde(self):
        self.schreibe("test-baustein.yaml", GUELTIG)
        bausteine, befunde = lade_bausteine(self.dir)
        self.assertEqual(befunde, [])
        self.assertIn("test-baustein", bausteine)

    def test_falsche_ebene_wird_gemeldet(self):
        self.schreibe("test-baustein.yaml", GUELTIG.replace("ebene: verhalten", "ebene: stimmung"))
        _, befunde = lade_bausteine(self.dir)
        self.assertTrue(any("ebene" in b for b in befunde))

    def test_id_muss_dateiname_sein(self):
        self.schreibe("anderer-name.yaml", GUELTIG)
        _, befunde = lade_bausteine(self.dir)
        self.assertTrue(any("Dateiname" in b for b in befunde))

    def test_fehlendes_pflichtfeld_wird_gemeldet(self):
        self.schreibe("test-baustein.yaml", GUELTIG.replace('name: "Testbaustein"\n', ""))
        _, befunde = lade_bausteine(self.dir)
        self.assertTrue(any("name" in b for b in befunde))

    def test_beziehung_ins_leere_wird_gemeldet(self):
        self.schreibe("test-baustein.yaml", GUELTIG.replace("benoetigt: []", "benoetigt: [gibt-es-nicht]"))
        bausteine, befunde = lade_bausteine(self.dir)
        self.assertEqual(befunde, [])
        befunde = pruefe_beziehungen(bausteine)
        self.assertTrue(any("gibt-es-nicht" in b for b in befunde))

    def test_index_wird_gebaut(self):
        import sqlite3
        self.schreibe("test-baustein.yaml", GUELTIG)
        bausteine, _ = lade_bausteine(self.dir)
        db = self.dir / "index.sqlite"
        baue_index(bausteine, db)
        mit = sqlite3.connect(db)
        self.assertEqual(mit.execute("SELECT COUNT(*) FROM bausteine").fetchone()[0], 1)
        self.assertEqual(mit.execute("SELECT COUNT(*) FROM mappings").fetchone()[0], 3)
        mit.close()


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Test laufen lassen — er muss scheitern**

Run: `python -m unittest discover -s tools\tests -v`
Expected: FAIL/ERROR (`ModuleNotFoundError: No module named 'validate_katalog'`)

- [ ] **Step 3: `tools\validate_katalog.py` implementieren**

```python
"""Schema-Validator fuer den Baustein-Katalog (E8/E12, AP4).

Prueft katalog/bausteine/*.yaml gegen das Schema aus docs/konzept/02-taxonomie.md
und baut den Suchindex katalog/index.sqlite. Exit 0 = gueltig, 1 = Befunde.
"""
import sqlite3
import sys
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parents[1]
EBENEN = {"identitaet", "verhalten", "wissen", "werkzeuge", "leitplanken"}
ARTEN = {"wunsch", "erzwungen"}
OBERFLAECHEN = {"claude-code", "claude-ai-projekte", "api"}
ADAPTER_STATUS = {"supported", "degraded", "unsupported"}
PFLICHTFELDER = ["id", "name", "ebene", "art", "klartext_wirkung",
                 "risiken", "beziehungen", "mappings"]
BEZIEHUNGSTYPEN = ["benoetigt", "verstaerkt", "kollidiert"]


def lade_bausteine(katalog_dir):
    bausteine, befunde = {}, []
    for pfad in sorted(Path(katalog_dir).glob("*.yaml")):
        try:
            daten = yaml.safe_load(pfad.read_text(encoding="utf-8"))
        except yaml.YAMLError as fehler:
            befunde.append(f"{pfad.name}: ungueltiges YAML ({fehler})")
            continue
        if not isinstance(daten, dict):
            befunde.append(f"{pfad.name}: kein YAML-Mapping")
            continue
        for feld in PFLICHTFELDER:
            if feld not in daten:
                befunde.append(f"{pfad.name}: Pflichtfeld '{feld}' fehlt")
        if daten.get("id") != pfad.stem:
            befunde.append(f"{pfad.name}: id '{daten.get('id')}' entspricht nicht dem Dateinamen")
        if "ebene" in daten and daten["ebene"] not in EBENEN:
            befunde.append(f"{pfad.name}: unbekannte ebene '{daten['ebene']}'")
        if "art" in daten and daten["art"] not in ARTEN:
            befunde.append(f"{pfad.name}: unbekannte art '{daten['art']}'")
        beziehungen = daten.get("beziehungen") or {}
        for typ in BEZIEHUNGSTYPEN:
            if typ not in beziehungen:
                befunde.append(f"{pfad.name}: beziehungen.{typ} fehlt")
        mappings = daten.get("mappings") or {}
        if set(mappings) != OBERFLAECHEN:
            befunde.append(f"{pfad.name}: mappings muessen genau {sorted(OBERFLAECHEN)} abdecken")
        for oberflaeche, mapping in mappings.items():
            status = (mapping or {}).get("adapter_status")
            if status not in ADAPTER_STATUS:
                befunde.append(f"{pfad.name}: mappings.{oberflaeche}.adapter_status '{status}' ungueltig")
        bausteine[pfad.stem] = daten
    return bausteine, befunde


def pruefe_beziehungen(bausteine):
    befunde = []
    for bid, daten in bausteine.items():
        for typ in BEZIEHUNGSTYPEN:
            for ziel in (daten.get("beziehungen") or {}).get(typ) or []:
                if ziel not in bausteine:
                    befunde.append(f"{bid}: beziehungen.{typ} verweist auf unbekannten Baustein '{ziel}'")
    return befunde


def baue_index(bausteine, db_pfad):
    db_pfad = Path(db_pfad)
    db_pfad.unlink(missing_ok=True)
    db = sqlite3.connect(db_pfad)
    db.executescript(
        "CREATE TABLE bausteine (id TEXT PRIMARY KEY, name TEXT, ebene TEXT, art TEXT);"
        "CREATE TABLE beziehungen (von_id TEXT, typ TEXT, zu_id TEXT);"
        "CREATE TABLE mappings (baustein_id TEXT, oberflaeche TEXT, adapter_status TEXT);"
        "CREATE INDEX idx_ebene ON bausteine(ebene);"
        "CREATE INDEX idx_bez ON beziehungen(von_id, typ);"
    )
    for bid, daten in bausteine.items():
        db.execute("INSERT INTO bausteine VALUES (?,?,?,?)",
                   (bid, daten.get("name"), daten.get("ebene"), daten.get("art")))
        for typ in BEZIEHUNGSTYPEN:
            for ziel in (daten.get("beziehungen") or {}).get(typ) or []:
                db.execute("INSERT INTO beziehungen VALUES (?,?,?)", (bid, typ, ziel))
        for oberflaeche, mapping in (daten.get("mappings") or {}).items():
            db.execute("INSERT INTO mappings VALUES (?,?,?)",
                       (bid, oberflaeche, (mapping or {}).get("adapter_status")))
    db.commit()
    db.close()


def main():
    katalog = REPO / "katalog" / "bausteine"
    bausteine, befunde = lade_bausteine(katalog)
    befunde += pruefe_beziehungen(bausteine)
    if befunde:
        print("validate_katalog: BEFUNDE")
        for b in befunde:
            print(f"  {b}")
        return 1
    baue_index(bausteine, REPO / "katalog" / "index.sqlite")
    print(f"validate_katalog: {len(bausteine)} Baustein(e) gueltig, Index gebaut.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: Tests laufen lassen — alle grün**

Run: `python -m unittest discover -s tools\tests -v`
Expected: `OK` (6 Tests)

- [ ] **Step 5: Validator gegen den echten Katalog laufen lassen**

Run: `python tools\validate_katalog.py`
Expected bei sauberem Katalog: `validate_katalog: 4 Baustein(e) gueltig, Index gebaut.` — Befunde sind hier **erwünschtes V3-Ergebnis**: unterhalb der Beschluss-Schwelle sofort in Katalog/02 korrigieren (Eskalationsregel beachten), dann erneut laufen lassen.

- [ ] **Step 6: `.gitignore` anlegen und committen**

`.gitignore`:

```
katalog/index.sqlite
graph/
```

```powershell
git add tools/validate_katalog.py tools/tests/test_validate_katalog.py .gitignore
git commit -m "AP4: Schema-Validator + SQLite-Index (E8/E12)"
```

---

### Task 7: AP4 — Artefakt-Probe `tools\check_profil.py` (TDD)

**Files:**
- Create: `tools\check_profil.py`
- Create: `tools\tests\test_check_profil.py`

**Interfaces:**
- Consumes: `lade_bausteine`, `pruefe_beziehungen` aus `validate_katalog` (Task 6); Profil-Format aus Task 3 (`id`, `name`, `beschreibung`, `bausteine`)
- Produces: `pruefe_profil(profil_pfad: Path, bausteine: dict, artefakte_wurzel: Path) -> list[str]`; CLI: Exit 0/1 wie Task 6. Erwartete Artefakte je Profil: `system-prompt.md`, `CLAUDE.md`, `settings.json`, `api-parameter.json` unter `artefakte\<profil-id>\`.

- [ ] **Step 1: Failing Test schreiben**

`tools\tests\test_check_profil.py`:

```python
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from check_profil import ARTEFAKTE, pruefe_profil

BAUSTEINE = {
    "a": {"beziehungen": {"benoetigt": [], "verstaerkt": [], "kollidiert": ["b"]}},
    "b": {"beziehungen": {"benoetigt": [], "verstaerkt": [], "kollidiert": ["a"]}},
    "c": {"beziehungen": {"benoetigt": [], "verstaerkt": [], "kollidiert": []}},
}
PROFIL = """\
id: testprofil
name: "Testprofil"
beschreibung: "Nur fuer Tests."
bausteine: [a, c]
"""


class TestArtefaktProbe(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.wurzel = Path(self.tmp.name)
        self.profil = self.wurzel / "testprofil.yaml"
        self.profil.write_text(PROFIL, encoding="utf-8")
        ordner = self.wurzel / "artefakte" / "testprofil"
        ordner.mkdir(parents=True)
        for name in ARTEFAKTE:
            inhalt = "{}" if name.endswith(".json") else "Inhalt"
            (ordner / name).write_text(inhalt, encoding="utf-8")

    def tearDown(self):
        self.tmp.cleanup()

    def test_sauberes_profil_ohne_befunde(self):
        befunde = pruefe_profil(self.profil, BAUSTEINE, self.wurzel / "artefakte")
        self.assertEqual(befunde, [])

    def test_unbekannter_baustein_wird_gemeldet(self):
        self.profil.write_text(PROFIL.replace("[a, c]", "[a, fehlt]"), encoding="utf-8")
        befunde = pruefe_profil(self.profil, BAUSTEINE, self.wurzel / "artefakte")
        self.assertTrue(any("fehlt" in b for b in befunde))

    def test_kollision_im_profil_wird_gemeldet(self):
        self.profil.write_text(PROFIL.replace("[a, c]", "[a, b]"), encoding="utf-8")
        befunde = pruefe_profil(self.profil, BAUSTEINE, self.wurzel / "artefakte")
        self.assertTrue(any("kollidiert" in b for b in befunde))

    def test_fehlendes_artefakt_wird_gemeldet(self):
        (self.wurzel / "artefakte" / "testprofil" / "CLAUDE.md").unlink()
        befunde = pruefe_profil(self.profil, BAUSTEINE, self.wurzel / "artefakte")
        self.assertTrue(any("CLAUDE.md" in b for b in befunde))

    def test_ungueltiges_json_wird_gemeldet(self):
        ziel = self.wurzel / "artefakte" / "testprofil" / "settings.json"
        ziel.write_text("kein json", encoding="utf-8")
        befunde = pruefe_profil(self.profil, BAUSTEINE, self.wurzel / "artefakte")
        self.assertTrue(any("settings.json" in b for b in befunde))


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Test laufen lassen — er muss scheitern**

Run: `python -m unittest discover -s tools\tests -v`
Expected: ERROR (`No module named 'check_profil'`); die Task-6-Tests bleiben grün

- [ ] **Step 3: `tools\check_profil.py` implementieren**

```python
"""Artefakt-Probe (AP4): Profil <-> Katalog <-> Artefakte.

Prueft jedes Profil unter katalog/profile/: alle Baustein-IDs existieren,
keine kollidiert-Beziehung innerhalb des Profils, alle 4 Artefakte unter
artefakte/<profil-id>/ vorhanden, nicht leer, JSON-Dateien parsen.
Exit 0 = gueltig, 1 = Befunde.
"""
import json
import sys
from pathlib import Path

import yaml

from validate_katalog import lade_bausteine, pruefe_beziehungen

REPO = Path(__file__).resolve().parents[1]
ARTEFAKTE = ["system-prompt.md", "CLAUDE.md", "settings.json", "api-parameter.json"]


def pruefe_profil(profil_pfad, bausteine, artefakte_wurzel):
    befunde = []
    profil = yaml.safe_load(Path(profil_pfad).read_text(encoding="utf-8"))
    pid = profil.get("id")
    if pid != Path(profil_pfad).stem:
        befunde.append(f"{Path(profil_pfad).name}: id '{pid}' entspricht nicht dem Dateinamen")
    gewaehlt = profil.get("bausteine") or []
    for bid in gewaehlt:
        if bid not in bausteine:
            befunde.append(f"{pid}: unbekannter Baustein '{bid}'")
    vorhanden = [b for b in gewaehlt if b in bausteine]
    for bid in vorhanden:
        kollidiert = (bausteine[bid].get("beziehungen") or {}).get("kollidiert") or []
        for anderer in vorhanden:
            if anderer in kollidiert:
                befunde.append(f"{pid}: '{bid}' kollidiert mit '{anderer}' im selben Profil")
    ordner = Path(artefakte_wurzel) / str(pid)
    for name in ARTEFAKTE:
        pfad = ordner / name
        if not pfad.is_file() or not pfad.read_text(encoding="utf-8").strip():
            befunde.append(f"{pid}: Artefakt '{name}' fehlt oder ist leer")
        elif name.endswith(".json"):
            try:
                json.loads(pfad.read_text(encoding="utf-8"))
            except json.JSONDecodeError as fehler:
                befunde.append(f"{pid}: '{name}' ist kein gueltiges JSON ({fehler})")
    return befunde


def main():
    bausteine, befunde = lade_bausteine(REPO / "katalog" / "bausteine")
    befunde += pruefe_beziehungen(bausteine)
    profile = sorted((REPO / "katalog" / "profile").glob("*.yaml"))
    for profil_pfad in profile:
        befunde += pruefe_profil(profil_pfad, bausteine, REPO / "artefakte")
    if befunde:
        print("check_profil: BEFUNDE")
        for b in befunde:
            print(f"  {b}")
        return 1
    print(f"check_profil: {len(profile)} Profil(e) gueltig.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: Tests laufen lassen — alle grün**

Run: `python -m unittest discover -s tools\tests -v`
Expected: `OK` (11 Tests)

- [ ] **Step 5: Probe gegen die echten Daten, Befunde korrigieren, Commit**

Run: `python tools\check_profil.py`
Befunde wie in Task 6 Step 5 behandeln (korrigieren, erneut laufen lassen).

```powershell
git add tools/check_profil.py tools/tests/test_check_profil.py
git commit -m "AP4: Artefakt-Probe Profil/Katalog/Artefakte"
```

---

### Task 8: AP4 — Graph-Extraktion `tools\graph_export.py` (TDD)

**Files:**
- Create: `tools\graph_export.py`
- Create: `tools\tests\test_graph_export.py`

**Interfaces:**
- Consumes: `lade_bausteine`, `pruefe_beziehungen` aus `validate_katalog`
- Produces: `exportiere(bausteine: dict) -> dict` mit Schlüsseln `knoten` (Liste `{id, name, ebene}`) und `kanten` (Liste `{von, zu, typ}`); CLI schreibt `graph\knoten-kanten.json`, Exit 0/1. Format = Eingabeformat des Prototyp-Graphen (Etappe B).

- [ ] **Step 1: Failing Test schreiben**

`tools\tests\test_graph_export.py`:

```python
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from graph_export import exportiere

BAUSTEINE = {
    "a": {"name": "A", "ebene": "verhalten",
          "beziehungen": {"benoetigt": ["b"], "verstaerkt": [], "kollidiert": []}},
    "b": {"name": "B", "ebene": "wissen",
          "beziehungen": {"benoetigt": [], "verstaerkt": [], "kollidiert": []}},
}


class TestGraphExport(unittest.TestCase):
    def test_knoten_und_kanten_vollstaendig(self):
        graph = exportiere(BAUSTEINE)
        self.assertEqual({k["id"] for k in graph["knoten"]}, {"a", "b"})
        self.assertEqual(graph["kanten"], [{"von": "a", "zu": "b", "typ": "benoetigt"}])

    def test_jede_kante_hat_existierende_knoten(self):
        graph = exportiere(BAUSTEINE)
        ids = {k["id"] for k in graph["knoten"]}
        for kante in graph["kanten"]:
            self.assertIn(kante["von"], ids)
            self.assertIn(kante["zu"], ids)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Test laufen lassen — er muss scheitern**

Run: `python -m unittest discover -s tools\tests -v`
Expected: ERROR (`No module named 'graph_export'`)

- [ ] **Step 3: `tools\graph_export.py` implementieren**

```python
"""Graph-Extraktion (AP4): Katalog -> Knoten/Kanten-Liste (Abnahmekriterium
Graph-Tauglichkeit). Schreibt graph/knoten-kanten.json. Exit 0/1.
"""
import json
import sys
from pathlib import Path

from validate_katalog import lade_bausteine, pruefe_beziehungen

REPO = Path(__file__).resolve().parents[1]
BEZIEHUNGSTYPEN = ["benoetigt", "verstaerkt", "kollidiert"]


def exportiere(bausteine):
    knoten = [{"id": bid, "name": d.get("name"), "ebene": d.get("ebene")}
              for bid, d in sorted(bausteine.items())]
    kanten = []
    for bid, d in sorted(bausteine.items()):
        for typ in BEZIEHUNGSTYPEN:
            for ziel in (d.get("beziehungen") or {}).get(typ) or []:
                kanten.append({"von": bid, "zu": ziel, "typ": typ})
    return {"knoten": knoten, "kanten": kanten}


def main():
    bausteine, befunde = lade_bausteine(REPO / "katalog" / "bausteine")
    befunde += pruefe_beziehungen(bausteine)
    if befunde:
        print("graph_export: Katalog hat Befunde, kein Export.")
        for b in befunde:
            print(f"  {b}")
        return 1
    graph = exportiere(bausteine)
    ziel = REPO / "graph" / "knoten-kanten.json"
    ziel.parent.mkdir(exist_ok=True)
    ziel.write_text(json.dumps(graph, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"graph_export: {len(graph['knoten'])} Knoten, {len(graph['kanten'])} Kanten -> {ziel.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: Tests laufen lassen — alle grün**

Run: `python -m unittest discover -s tools\tests -v`
Expected: `OK` (13 Tests)

- [ ] **Step 5: Export gegen die echten Daten, Commit**

Run: `python tools\graph_export.py`
Expected: `graph_export: … Knoten, … Kanten -> knoten-kanten.json` — die Zahlen mit der Stichproben-Tabelle in `05-architektur-roadmap.md` abgleichen; Abweichungen dort korrigieren.

```powershell
git add tools/graph_export.py tools/tests/test_graph_export.py
git commit -m "AP4: Graph-Extraktion Knoten/Kanten"
```

---

### Task 9: AP4 — CI-Einbindung in `tools\check-docs.ps1`

**Files:**
- Modify: `tools\check-docs.ps1` (nach dem Datei-Loop, vor der Ausgabe-Zusammenfassung ab Zeile 74)

**Interfaces:**
- Consumes: die drei CLI-Werkzeuge aus Tasks 6–8 (Exit 0/1)
- Produces: `check-docs.ps1` schlägt fehl, wenn eine Python-Prüfung Befunde hat — greift damit automatisch im pre-commit-Hook

- [ ] **Step 1: Prüfblock ergänzen**

In `tools\check-docs.ps1` direkt vor `Write-Host ("check-docs: {0} Datei(en) geprueft." ...)` einfügen (Skript bleibt bewusst reines ASCII):

```powershell
# 5. Katalog-Pruefungen (AP4, Beschluss B5/V3): nur wenn Katalog + Python vorhanden
$katalog = Join-Path $repoRoot 'katalog\bausteine'
if ((Test-Path $katalog) -and (Get-Command python -ErrorAction SilentlyContinue)) {
    foreach ($skript in @('tools\validate_katalog.py', 'tools\check_profil.py', 'tools\graph_export.py')) {
        $pfad = Join-Path $repoRoot $skript
        if (Test-Path $pfad) {
            & python $pfad | Out-Null
            if ($LASTEXITCODE -ne 0) { $befunde.Add("$skript : Befunde (erneut direkt aufrufen fuer Details)") }
        }
    }
}
```

- [ ] **Step 2: CI komplett laufen lassen**

Run: `powershell -File tools\check-docs.ps1`
Expected: `Alles in Ordnung.` (Exit 0) — jetzt inklusive der drei Python-Prüfungen

- [ ] **Step 3: Gegenprobe — CI muss Fehler bemerken**

Vorübergehend in einer Baustein-YAML `ebene:` auf einen ungültigen Wert setzen, `powershell -File tools\check-docs.ps1` ausführen, Expected: `BEFUNDE` + Exit 1. Änderung rückgängig machen, CI erneut grün laufen lassen.

- [ ] **Step 4: Commit**

```powershell
git add tools/check-docs.ps1
git commit -m "AP4: Python-Pruefungen ins lokale CI eingebunden"
```

---

### Task 10: AP4 abschließen — Validierungsbericht, Korrekturen, AP5-Zuschnitt

**Files:**
- Create: `docs\konzept\90-validierungsbericht-etappe-a.md`
- Modify: `docs\konzept\00-entscheidungsprotokoll.md` (falls neue E-Nummern anfielen)
- Modify: Konzeptdokumente 01–05 / Katalog / Artefakte (nur soweit Befunde es verlangen)

**Interfaces:**
- Consumes: Ergebnisse der Tasks 6–9; Roadmap aus `05-architektur-roadmap.md`
- Produces: abgeschlossene Etappe A; AP5-Zuschnitt (Prototyp-Meilensteine) als Vorschlag für den nächsten Planungslauf

- [ ] **Step 1: Gesamtlauf und Abnahmekriterien-Check**

Run: `powershell -File tools\check-docs.ps1` und `python -m unittest discover -s tools\tests`
Expected: beide grün. Danach die 5 Abnahmekriterien aus dem
Entscheidungsprotokoll einzeln durchgehen (Konsistenz, Laien-Test-Vorbereitung,
Tragfähigkeit, Graph-Tauglichkeit, CI) und je Kriterium notieren: erfüllt /
Befund / wartet auf Michael (Laien-Test und Produktiveinsatz können nur
vorbereitet werden — sie gehören zur gebündelten Abnahme am Haltepunkt, B2).

- [ ] **Step 2: `90-validierungsbericht-etappe-a.md` schreiben**

```markdown
---
titel: "90 — Validierungsbericht Etappe A"
erstellt: <Datum des Laufs>
status: Ergebnis des V3-Validierungslaufs (AP4)
---

# Validierungsbericht Etappe A

## Prüfläufe            <!-- je Werkzeug: Aufruf, Ergebnis, Zahl der Befunde -->
## Korrekturen           <!-- jede Korrektur: Befund -> geänderte Datei -> Commit -->
## Abnahmekriterien      <!-- Tabelle: Kriterium | Status | Nachweis -->
## Offen für den Haltepunkt   <!-- Laien-Test, Produktiveinsatz MAG-Profil, ggf. gekippte E-Nummern -->
## Vorschlag AP5-Zuschnitt    <!-- Prototyp-Meilensteine aus der 05-Roadmap abgeleitet, je mit Stopp-Kriterium (B3) -->
```

- [ ] **Step 3: Datei erneut einlesen, CI laufen lassen**

Run: `powershell -File tools\check-docs.ps1`
Expected: `Alles in Ordnung.` (Exit 0)

- [ ] **Step 4: Commit + AP4-Bericht + STOPP**

```powershell
git add docs/konzept/90-validierungsbericht-etappe-a.md docs/konzept/00-entscheidungsprotokoll.md
git commit -m "AP4: Validierungsbericht Etappe A"
```

Bericht + STOPP. **Damit endet dieser Plan.** Es folgt der Haltepunkt
(gebündelte Abnahme inkl. Laien-Test vor dem GitHub-Push, B2); die
Prototyp-Meilensteine (AP5 ff.) bekommen nach der Abnahme einen eigenen
Plan auf Basis des AP5-Zuschnitt-Vorschlags.
