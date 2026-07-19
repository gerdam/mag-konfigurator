---
titel: "90 — Validierungsbericht Etappe A"
erstellt: 2026-07-19
status: Ergebnis des V3-Validierungslaufs (AP4)
---

# Validierungsbericht Etappe A

## Prüfläufe

Alle drei Python-Prüfwerkzeuge aus AP4 (Tasks 6–8) wurden gegen die echten
Katalogdaten (5 Baustein-YAMLs unter `katalog\bausteine\`, 1 Profil-YAML
unter `katalog\profile\`, 4 Artefakte unter
`artefakte\mag-rechercheassistenz\`) ausgeführt und im Rahmen von Task 10
erneut verifiziert:

| Werkzeug | Aufruf | Ausgabe | Befunde |
|---|---|---|---|
| Schema-Validator | `python tools\validate_katalog.py` | `validate_katalog: 5 Baustein(e) gueltig, Index gebaut.` | 0 |
| Artefakt-Probe | `python tools\check_profil.py` | `check_profil: 1 Profil(e) gueltig.` | 0 |
| Graph-Extraktion | `python tools\graph_export.py` | `graph_export: 5 Knoten, 5 Kanten -> knoten-kanten.json` | 0 |

Die Zahlen aus dem Graph-Export (5 Knoten, 5 Kanten) sind exakt
deckungsgleich mit der handgerechneten Stichprobe im Abschnitt
„Graph-Tauglichkeit" von `05-architektur-roadmap.md`.

Seit Task 9 sind diese drei Prüfungen zusätzlich in das lokale CI
eingebunden. Der Gesamtlauf, erneut ausgeführt im Rahmen von Task 10:

```
> powershell -File tools\check-docs.ps1
check-docs: 13 Datei(en) geprueft.
Alles in Ordnung.
```

Exit-Code 0. Dieser Lauf prüft je Markdown-/Text-Datei unter `docs\` und
`Dual-layer\` UTF-8-Gültigkeit, Mojibake-Muster, tote relative Links und
unerledigte Platzhalter-Marker aus offenen Arbeitspunkten, und führt
anschließend die drei Python-Prüfungen oben aus.

Die Gegenprobe aus Task 9 bestätigt, dass die Einbindung nicht nur grün
läuft, sondern Fehler auch tatsächlich erkennt: Eine testweise ungültige
`ebene:`-Angabe in `werkzeug-websuche.yaml` führte zu Befunden in allen
drei Python-Prüfungen und Exit-Code 1; nach exakter Rücknahme lief das CI
wieder grün.

Parallel dazu die Test-Suite:

```
> python -m unittest discover -s tools\tests -v
Ran 13 tests in 0.171s
OK
```

13/13 Tests grün — für jedes der drei Prüfwerkzeuge nach TDD entwickelt
(RED-Phase mit fehlendem Modul, GREEN-Phase nach Implementierung; im
Detail dokumentiert in `task-6-report.md` bis `task-8-report.md`).

## Korrekturen

Der Validierungslauf gegen die echten Katalog- und Artefaktdaten ergab
**null Befunde** über alle drei Prüfwerkzeuge und den CI-Gesamtlauf hinweg.
Es gab damit keine Korrekturen, die aus den Prüfläufen selbst folgten —
das ist das Ergebnis dieser Etappe, keine Lücke im Validierungslauf: Der
Katalog, das Referenzprofil und die vier Artefakte waren zum Zeitpunkt der
maschinellen Prüfung bereits schema- und konsistenzkonform.

Zur Einordnung, klar getrennt von den maschinellen Prüfläufen: Während der
vorausgehenden Dokument-Erstellung (AP3) fanden die planmäßigen
Task-Reviews zwei inhaltliche Important-Befunde, die vor Beginn von AP4
behoben wurden:

| Task | Befund | Geänderte Datei | Fix-Commit |
|---|---|---|---|
| Task 4 (04-bedienkonzept) | Fehlende Wirkungs-Angabe bei einer Antwortoption im geführten Dialog | `docs\konzept\04-bedienkonzept.md` | `26b108b` — "AP3: 04-bedienkonzept Review-Fix" |
| Task 5 (05-architektur-roadmap) | Widerspruch zwischen den in `validate_katalog` und `graph_export` beschriebenen Zuständigkeiten | `docs\konzept\05-architektur-roadmap.md` | `c82ed94` — "AP3: 05-architektur-roadmap Review-Fix" |

Beide Fixes liegen vor AP4 und sind bereits Teil des Stands, gegen den der
Validierungslauf oben lief.

## Abnahmekriterien

Bewertung der fünf Abnahmekriterien für Etappe A aus
`00-entscheidungsprotokoll.md`:

| Kriterium | Status | Nachweis |
|---|---|---|
| Konsistenz | erfüllt | 04↔02 (das vom Kriterium konkret geforderte Paar): `04-bedienkonzept.md` verwendet ausschließlich Baustein-IDs, `ebene`-Werte und Beziehungstypen (`benoetigt`/`verstaerkt`/`kollidiert`), die exakt aus 02 und dem Katalog stammen — im Task-4-Review gegen die YAML-Dateien verifiziert, keine Abweichung gefunden. Zusätzlich bestätigen die maschinellen Prüfläufe die Katalog-Konsistenz: `validate_katalog` prüft jede der 5 Baustein-YAMLs gegen das Schema aus 02 — 0 Befunde; `check_profil` prüft das Referenzprofil aus 03 gegen Katalog und Artefakte — 0 Befunde. Die während AP3 in den Task-Reviews gefundenen zwei Befunde waren jeweils dokumentinterne Korrekturen (Task 4 innerhalb von 04, Task 5 innerhalb von 05, kein Widerspruch zwischen zwei Dokumenten — siehe Abschnitt „Korrekturen") und vor AP4 behoben |
| Laien-Test | entfällt (19.07.2026) | Michael hat am Haltepunkt entschieden, auf den Laien-Test zu verzichten (protokolliert in `00-entscheidungsprotokoll.md`, Abschnitte „Abnahmekriterien" und „Notizen"); die Abnahme stützt sich auf die übrigen vier Kriterien |
| Tragfähigkeit | erfüllt (19.07.2026) | Alle vier Artefakte für die MAG-Rechercheassistenz existieren, sind vollständig und maschinell geprüft (`check_profil`: 1 Profil gültig, keine fehlenden Artefakte, keine Kollision); Michael hat das Profil am 19.07.2026 produktiv eingesetzt und die Tragfähigkeit im Rahmen der Haltepunkt-Abnahme (B2) bestätigt |
| Graph-Tauglichkeit | erfüllt | `graph_export` liefert 5 Knoten und 5 Kanten aus den realen Katalogdaten — exakt deckungsgleich mit der Stichprobe in `05-architektur-roadmap.md` |
| CI | erfüllt | `check-docs.ps1` läuft fehlerfrei über alle 13 geprüften Dateien inkl. der drei Python-Prüfungen (Exit 0); die Gegenprobe aus Task 9 belegt, dass echte Fehler auch tatsächlich erkannt werden |

Kurzfassung: 4 von 5 Kriterien erfüllt, 1 entfällt per Beschluss vom
19.07.2026 (Laien-Test) — die Abnahme-Grundlage der Etappe A ist damit
vollständig.

## Offen für den Haltepunkt

Folgende Punkte sind bewusst nicht Teil dieses Validierungslaufs, sondern
gehören zur gebündelten Abnahme am Haltepunkt vor dem GitHub-Push (B2):

- **Laien-Test der Dokumente 01–05** — erledigt durch Beschluss: entfällt
  seit dem 19.07.2026 auf Michaels Entscheidung (siehe Abnahmekriterien
  oben).
- **Produktiveinsatz der MAG-Rechercheassistenz** im Arbeitsalltag, mit den
  Artefakten unter `artefakte\mag-rechercheassistenz\` (Abnahmekriterium
  „Tragfähigkeit", siehe oben) — erledigt: von Michael am 19.07.2026
  bestätigt; eine Einsatz-Anleitung liegt seit dem 19.07.2026 unter
  `artefakte\mag-rechercheassistenz\anleitung.md`.
- **Zwei zunächst offene, als Empfehlung markierte Vorschläge** aus
  `05-architektur-roadmap.md` — am 19.07.2026 von Michael beschlossen und
  als **E14** (Backend Python/FastAPI) und **E15** (Graph-Rendering
  Cytoscape.js) ins Entscheidungsprotokoll fortgeschrieben.
- **Notierte Minor-Befunde** aus dem Abschluss-Review, ohne Auswirkung auf
  die Abnahmekriterien, zur Kenntnisnahme für ein späteres Redaktions-Update:
  - `01-vision.md` nennt im Abschnitt „Was der Konfigurator nicht ist" zwei
    Nicht-Ziele, die über den ursprünglichen Task-4-Brief hinausgehen, aber
    inhaltlich deckungsgleich mit E3 (nur 3 Claude-Oberflächen) und E6b
    (kein „Best Practice" ohne Evaluation) sind.
  - Das Wording „kuratierter Vorschlag" (E6b) fehlt wörtlich in
    `03-profilkatalog.md`, obwohl der Inhalt dem Beschluss nicht
    widerspricht.
  - Die Baustein-Reihenfolge in `katalog\profile\mag-rechercheassistenz.yaml`
    (`rolle`, `antwortstil`, `leitplanke`, `werkzeug`) wich kosmetisch von
    der Reihenfolge in der Tabelle in `03-profilkatalog.md` ab — im Zuge
    des Abschluss-Reviews am 19.07.2026 angeglichen, die Tabelle folgt
    jetzt der YAML-Reihenfolge.
  - Der Begriff „B-Tree" wird in `05-architektur-roadmap.md` (Beschluss E8)
    verwendet, aber im Dokument selbst nicht erklärt.
  - Die Zuordnung von graphify zu den Beschlüssen E9/E11 in
    `05-architektur-roadmap.md` ist wortgleich aus `werkbank.md`
    übernommen; die Quelle selbst ist an dieser Stelle unpräzise.
  - `graph_export.py` prüft plangemäß nicht, ob das `graph`-Zielverzeichnis
    bereits als Datei existiert — laut Brief so vorgesehen, hier nur zur
    Vollständigkeit notiert.

## Vorschlag AP5-Zuschnitt

Aus der Roadmap-Phase ② in `05-architektur-roadmap.md` („Klickbarer
Prototyp") lassen sich fünf Meilensteine für einen möglichen AP5-Plan
ableiten. Dies ist ein **Vorschlag** für den nächsten Planungslauf, kein
Beschluss — jeder Meilenstein bekäme im tatsächlichen Plan ein explizites
Stopp-Kriterium/Token-Budget (Beschluss E9, B3):

1. **Backend-Grundgerüst.** Ein schlanker Web-Service (Kandidat: FastAPI,
   siehe offene Empfehlung oben) liest den YAML-Katalog und stellt ihn über
   die bestehenden Prüfwerkzeuge validiert bereit. Stopp-Kriterium: Der
   Service liefert über eine erste Route dieselben 5 Knoten und 5 Kanten,
   die `graph_export.py` erzeugt — Abgleich gegen die Stichprobe in 05.
2. **Geführter Dialog (MVP).** Die Fragenlogik aus `04-bedienkonzept.md`
   (Domäne → Aufgabentyp → Risikoprofil) als klickbare Oberfläche.
   Stopp-Kriterium: Der Dialog erzeugt für die MAG-Rechercheassistenz-
   Eingaben exakt das bestehende Profil
   `katalog\profile\mag-rechercheassistenz.yaml`.
3. **Netzwerkansicht.** Integration einer Graph-Rendering-Bibliothek
   (Kandidat: Cytoscape.js, siehe offene Empfehlung oben), die den
   Graph-Export rendert: Einfärbung nach Wirkungsebene,
   Kantendarstellung nach Beziehungstyp, Zu-/Abwahl mit Kollisions-Warnung.
   Stopp-Kriterium: Alle 5 Knoten und 5 Kanten aus der Etappe-A-Stichprobe
   sind interaktiv sichtbar; das `kollidiert`-Paar
   `werkzeug-websuche`/`wissen-nur-freigegebene-quellen` löst beim
   gleichzeitigen Anwählen die vorgesehene Warnung aus.
4. **Export-Schritt.** Aus Dialog und Netzwerkansicht heraus wird
   mindestens das MAG-Profil real exportiert. Stopp-Kriterium: Das im
   Prototyp erzeugte Artefakt stimmt inhaltlich mit dem bereits
   vorhandenen Satz unter `artefakte\mag-rechercheassistenz\` überein.
5. **CI-Umzug auf GitHub.** Das Repository erhält ein GitHub-Remote,
   GitHub Actions führt die bisher lokalen Prüfungen (`check-docs.ps1`
   samt der drei Python-Prüfungen) bei jedem Push aus (Beschluss E7).
   Stopp-Kriterium: Eine bewusst eingebaute, testweise ungültige
   Katalogänderung lässt den Actions-Lauf rot werden — analog zur
   Gegenprobe aus Task 9 —, die Rücknahme lässt ihn wieder grün werden.

Dieser Zuschnitt bekommt nach der Abnahme am Haltepunkt einen eigenen,
formalen Plan; die fünf Meilensteine hier sind eine Grundlage für diesen
Plan, keine Festlegung.
