---
titel: "05 — Architektur und Roadmap"
erstellt: 2026-07-18
status: Entwurf (Abnahme gebündelt vor GitHub-Push, B2)
---

# 05 — Architektur und Roadmap

## Datenhaltung

Der Konfigurator hält seine Daten zweistufig: eine von Menschen gepflegte
Quelle und einen daraus erzeugten, technischen Suchindex. Nur die erste
Stufe wird versioniert, die zweite ist jederzeit neu erzeugbar und deshalb
bewusst nicht Teil des Git-Verlaufs (Beschluss E13).

**Quelle (versioniert):** Jeder Baustein ist eine einzelne YAML-Datei unter
`katalog\bausteine\`, jedes Profil eine einzelne YAML-Datei unter
`katalog\profile\` (Schema siehe 02-taxonomie.md). Eine Datei je Baustein
sorgt für saubere, kleine Diffs bei jeder Änderung — wer einen Baustein
anpasst, ändert genau eine Datei, nicht ein großes Sammeldokument. Die für
das Referenzprofil erzeugten Artefakte liegen ebenfalls versioniert unter
`artefakte\<profil-id>\` (siehe 04-bedienkonzept.md, Abschnitt „Der
Export-Schritt").

**Suchindex (generiert, nicht versioniert):** `katalog\index.sqlite` ist
die durchsuchbare Ablage aller Bausteine und Profile für die Laufzeit des
Konfigurators — als SQLite-Datenbank, weil überall dort, wo im
Konfigurator gesucht oder gespeichert wird, eine indexierte Speicherung
auf B-Tree-Basis gilt und SQLite diese Struktur fertig mitbringt, ohne
eine Eigenimplementierung zu erfordern (Beschluss E8). Der Index bedient
zum Beispiel die Frage-2-Logik des geführten Dialogs (04), die passende
Bausteine zu einem Aufgabentyp findet, und ein freies Suchfeld für
Fortgeschrittene Anwender, die gezielt einzelne Bausteine nachschlagen
wollen (01-vision.md, Abschnitt „Zielgruppen"). Ebenfalls generiert und
nicht versioniert ist der Ordner `graph\`: Er enthält die für die
Netzwerkansicht aufbereitete Knoten-/Kantendarstellung (siehe Abschnitt
„Graph-Tauglichkeit" unten) — ein Exportformat, das die Rendering-Schicht
im Browser direkt einlesen kann, statt bei jedem Seitenaufruf erneut alle
YAML-Dateien zu durchsuchen.

**Geplanter Index-Erzeuger:** `tools\validate_katalog.py` existiert noch
nicht — es entsteht als eigenständiges Arbeitspaket (Task 6 im laufenden
Bauprozess) und ist hier als geplantes Werkzeug beschrieben, nicht als
vorhandenes. Seine vorgesehene Aufgabe ist zweigeteilt: Erstens prüft es
jede Baustein- und Profil-YAML-Datei gegen das verbindliche Schema aus
02-taxonomie.md — Pflichtfelder vorhanden, `ebene` einer der fünf
erlaubten Werte, jede in `beziehungen` referenzierte Baustein-`id`
existiert tatsächlich als Datei, jedes `mappings`-Feld deckt genau die
drei Zieloberflächen aus Beschluss E3 ab. Zweitens erzeugt es aus den
geprüften Daten `katalog\index.sqlite` neu. Weil beide generierten
Ablagen — Suchindex und Graph-Export — vollständig aus den YAML-Dateien
ableitbar sind, ist ihr Verlust unkritisch: Ein erneuter Lauf von
`tools\validate_katalog.py` stellt beide wieder her, ohne dass irgendwo
Daten doppelt gepflegt werden müssten.

## Tech-Stack-Empfehlung

**Produktform:** Web-App. Der Konfigurator braucht eine interaktive,
klickbare Oberfläche (geführter Dialog, Netzwerkansicht, Export-Schritt,
siehe 04-bedienkonzept.md) und soll ohne lokale Installation nutzbar sein
— Michael soll die MAG-Rechercheassistenz produktiv im Arbeitsalltag
einsetzen können (01-vision.md), und die Roadmap sieht ein späteres
Deployment auf Railway, Vercel oder einem gemieteten Space vor (Beschluss
E10). Alle drei Zielplattformen hosten Web-Apps, keine Desktop-Programme
— die Produktform ergibt sich also bereits aus dem geplanten
Deployment-Weg.

**Backend:** Python wird empfohlen, als konsequente Fortführung des
bereits für den Prüfcode festgelegten Werkzeug-Stacks (Beschluss E12:
Python 3.13, PyYAML, `sqlite3`, ohne neue Abhängigkeiten). Ein schlankes
Web-Framework (Kandidat: FastAPI) liest die YAML-Quelle und den
`katalog\index.sqlite`-Suchindex und stellt daraus die Schritte des
geführten Dialogs, die Daten für die Netzwerkansicht und den
Export-Schritt als Programmierschnittstelle für das Frontend bereit.
Damit kommt für Backend und Prüfcode dieselbe Sprache zum Einsatz statt
zweier getrennter Technologiewelten für ein und denselben Datenbestand.
Diese konkrete Framework-Wahl geht über die bisherigen Beschlüsse E1–E13
hinaus und wird hier als Empfehlung markiert, nicht als getroffene
Entscheidung.

**Frontend und Graph-Rendering:** Die Netzwerkansicht aus 04 braucht eine
Bibliothek, die Knoten und Kanten interaktiv im Browser darstellt. Zwei
Kandidaten wurden verglichen:

- **D3.js** ist eine sehr flexible, aber grundlegende
  Visualisierungsbibliothek: Sie liefert keine fertige
  Graph-Darstellung, sondern nur die Bausteine (Skalen, Zeichenflächen,
  Datenbindung), aus denen Knoten, Kanten, Layout, Klick-Erkennung und
  Hervorhebung selbst zusammengesetzt werden müssten. Das eröffnet
  praktisch unbegrenzte Gestaltungsfreiheit, verlangt für genau die in
  04 geforderten Funktionen — Einfärbung nach Wirkungsebene, je
  Beziehungstyp unterschiedliche Kantendarstellung, Zu-/Abwahl per Klick,
  Kollisions-Warnung nur bei gleichzeitiger Auswahl beider Enden — aber
  erheblichen eigenen Programmieraufwand.
- **Cytoscape.js** ist eine auf Netzwerk-/Graphdarstellung
  spezialisierte Bibliothek: Layout-Algorithmen, Klick- und
  Tipp-Ereignisse auf Knoten und Kanten sowie eine Formatierungssprache,
  die Farbe und Linienstil direkt aus Datenfeldern eines Knotens oder
  einer Kante ableitet, sind bereits eingebaut. Genau das deckt sich mit
  den Anforderungen aus 04: „Farbe nach Wirkungsebene" und „Kante nach
  Beziehungstyp" lassen sich unmittelbar aus dem Feld `ebene` jedes
  Knotens und dem Beziehungstyp jeder Kante im Graph-Export (siehe
  Abschnitt „Datenhaltung") ableiten, ohne eigene Zeichenroutinen zu
  schreiben.

**Empfehlung:** Cytoscape.js, weil es die in 04 beschriebenen Anforderungen
weitgehend fertig mitbringt und der Konfigurator seinen
Entwicklungsaufwand stattdessen in die fachliche Logik stecken kann
(Konflikterkennung, Export, Anzeige des `adapter_status`) statt in die
Grundlagen der Graph-Darstellung. Auch diese Bibliothekswahl geht über
die Beschlüsse E1–E13 hinaus und ist als Empfehlung zu verstehen, die noch
formal entschieden werden müsste.

**Einordnung von graphify (werkbank.md):** Die Werkbank-Recherche zu
graphify (Beschlüsse E9/E11) beschreibt ein Werkzeug, das eine Codebasis
per Tree-sitter/AST in einen persistenten Wissensgraphen verwandelt, den
Obsidian visualisiert und Claude Code statt einer Volltextsuche liest, um
bei der Code-Recherche Token zu sparen. Das ist ein anderer Zweck als die
Netzwerkansicht des Konfigurators: graphify richtet sich an Claude Code
als Leser eines Codebasis-Graphen, nicht an einen Menschen, der im
Browser Bausteine an- und abklickt, und liefert kein Exportformat, das
sich in eine Produkt-Web-App einbetten ließe. graphify bleibt damit ein
Werkbank-Kandidat für Michaels eigene Vault- und Code-Projekte, aber kein
Baustein der Netzwerkansicht — diese Einschätzung aus werkbank.md wird
hier bestätigt: Die Netzwerkansicht braucht eine eigene
Rendering-Schicht, die dieser Abschnitt mit Cytoscape.js vorschlägt.

## Graph-Tauglichkeit

Ob sich die Taxonomie aus 02 tatsächlich als interaktiver Graph darstellen
lässt, wird hier nicht behauptet, sondern an den fünf realen Bausteinen
und dem realen Referenzprofil aus 03 nachgerechnet — vollständig und ohne
Auslassung, damit sich die Zahlen mit einem späteren maschinellen Export
(Task 8 im laufenden Bauprozess) abgleichen lassen.

**Knoten** — ein Knoten je Baustein-Datei unter `katalog\bausteine\`, mit
`id`, `name` und `ebene` aus dem jeweiligen Schema:

| id | name | ebene |
|---|---|---|
| `rolle-rechercheassistent` | Rolle: Rechercheassistent | identitaet |
| `antwortstil-quellenpflicht` | Antwortstil: Quellenpflicht | verhalten |
| `wissen-nur-freigegebene-quellen` | Wissen: Nur freigegebene Quellen | wissen |
| `werkzeug-websuche` | Werkzeug: Websuche | werkzeuge |
| `leitplanke-keine-rechtsberatung` | Leitplanke: Keine Rechtsberatung | leitplanken |

Fünf Baustein-Dateien, fünf Knoten — jeder Baustein gehört, wie in 02
festgelegt, zu genau einer Ebene, es gibt also keinen Sonderfall mit
mehrdeutiger Knotenfarbe.

**Kanten** — eine Kante je Eintrag in den drei `beziehungen`-Listen
(`benoetigt`, `verstaerkt`, `kollidiert`) jeder Baustein-Datei, gelesen
Feld für Feld:

| von | zu | typ |
|---|---|---|
| `antwortstil-quellenpflicht` | `werkzeug-websuche` | benoetigt |
| `rolle-rechercheassistent` | `antwortstil-quellenpflicht` | verstaerkt |
| `leitplanke-keine-rechtsberatung` | `antwortstil-quellenpflicht` | verstaerkt |
| `werkzeug-websuche` | `wissen-nur-freigegebene-quellen` | kollidiert |
| `wissen-nur-freigegebene-quellen` | `werkzeug-websuche` | kollidiert |

Fünf Listeneinträge über alle fünf Dateien hinweg, also fünf Kanten. Die
`kollidiert`-Beziehung ist als einzige der drei symmetrisch im Katalog
eingetragen — `werkzeug-websuche` führt `wissen-nur-freigegebene-quellen`
in seiner eigenen `kollidiert`-Liste und umgekehrt —, wodurch sie beim
feldweisen Auszählen als zwei Kanten erscheint, eine je Blickrichtung.
Das ist kein Zählfehler, sondern spiegelt genau die Katalogdaten wider,
gegen die ein mechanischer Export ebenfalls Feld für Feld arbeiten würde.
Für die Anzeige in der Netzwerkansicht (04) genügt in der Praxis eine
optisch einzige Kante je Kollisionspaar; die vollständige, ungekürzte
Auszählung für dieses Abnahmekriterium bleibt dennoch fünf Kanten.

Von den fünf Bausteinen sind vier Teil des Referenzprofils
`mag-rechercheassistenz` (`rolle-rechercheassistent`,
`antwortstil-quellenpflicht`, `werkzeug-websuche`,
`leitplanke-keine-rechtsberatung`); `wissen-nur-freigegebene-quellen` ist
im Katalog vorhanden, aber nicht Teil dieses Profils — genau der Knoten,
den 04 als Beispiel für einen blass dargestellten, nicht ausgewählten
Baustein nennt.

**Ergebnis:** Fünf Knoten und fünf Kanten aus den realen Katalogdaten
decken bereits alle drei Beziehungstypen ab (Pflichtnachzug, Empfehlung,
harte Warnung) und lassen sich vollständig, ohne Sonderfall und ohne
Informationsverlust als Knoten-/Kantenliste darstellen. Das
Abnahmekriterium „Graph-Tauglichkeit" aus dem Entscheidungsprotokoll (00)
ist damit an echten Daten nachgewiesen, nicht nur behauptet.

## Roadmap

Mit diesem Dokument sind alle fünf Konzeptdokumente aus Etappe A
(01–05) geschrieben; die folgenden Schritte gehören zu Etappe B, dem
Prototyp, und bauen aufeinander auf.

**② Klickbarer Prototyp:** Aus den Konzeptdokumenten 01–05 und dem
Referenzprofil MAG-Rechercheassistenz entsteht ein im Browser lauffähiger
Prototyp, der den geführten Dialog, die Netzwerkansicht (Cytoscape.js,
siehe Abschnitt „Tech-Stack-Empfehlung") und zumindest den Export für das
MAG-Profil abbildet. Parallel dazu wandert die bisher rein lokale
CI-Prüfung — `tools\check-docs.ps1` als pre-commit-Hook ohne Remote,
Beschluss E7 — auf GitHub um: Das Repository erhält ein GitHub-Remote,
und GitHub Actions führt die Prüfungen (künftig ergänzt um
`tools\validate_katalog.py` aus Task 6) bei jedem Push automatisch aus,
statt sich auf den lokalen Hook allein zu verlassen.

**③ Export echter Konfigurationen:** Der Prototyp wird um den
vollständigen Export für alle drei Zieloberflächen erweitert — nicht nur
für das MAG-Profil, sondern grundsätzlich für jedes im Katalog gepflegte
Profil, einschließlich der in 03 zunächst nur als Steckbrief skizzierten
Profile (Finanzanalyst, Fachübersetzer, Text-Enhancer, Rechtsassistent,
Software-Entwickler), sobald diese vollständig ausgearbeitet sind. Der
Konfigurator wird auf Railway, Vercel oder einem gemieteten Space
deployt (Beschluss E10) und damit von überall statt nur lokal erreichbar
— eine Voraussetzung dafür, dass echte Konfigurationen nicht nur erzeugt,
sondern auch tatsächlich im Alltag abgerufen werden können.

**④ Profil-Pflege und Evaluation:** Der Katalog erhält einen
eingespielten Pflegeprozess — neue Bausteine und Profile werden ergänzt,
`tools\validate_katalog.py` läuft dabei nicht nur in der CI, sondern
routinemäßig bei jeder Katalogänderung, um Schema-Fehler und
widersprüchliche Beziehungen sofort sichtbar zu machen. Begleitend
beginnt eine systematische Evaluation der bisher kuratierten Vorschläge:
Profile werden im echten Einsatz genutzt und beobachtet, statt nur
konzeptionell für plausibel gehalten zu werden. Erst wenn diese
Evaluation vorliegt, darf ein Profil laut Beschluss E6b als „Best
Practice" bezeichnet werden — vorher bleibt es, wie in allen bisherigen
Konzeptdokumenten, ausdrücklich ein kuratierter Vorschlag.
