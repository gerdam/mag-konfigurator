---
titel: "03 — Profilkatalog"
erstellt: 2026-07-18
status: Entwurf (Abnahme gebündelt vor GitHub-Push, B2)
---

# 03 — Profilkatalog

## Tracer Bullet: MAG-Rechercheassistenz

Das Referenzprofil (Beschluss E5) heißt
[`mag-rechercheassistenz.yaml`](../../katalog/profile/mag-rechercheassistenz.yaml)
und besteht aus vier Bausteinen — je einem pro betroffener Wirkungsebene:

| Baustein | Ebene | Datei |
|---|---|---|
| `rolle-rechercheassistent` | Identität | [katalog\bausteine\rolle-rechercheassistent.yaml](../../katalog/bausteine/rolle-rechercheassistent.yaml) |
| `antwortstil-quellenpflicht` | Verhalten | [katalog\bausteine\antwortstil-quellenpflicht.yaml](../../katalog/bausteine/antwortstil-quellenpflicht.yaml) |
| `werkzeug-websuche` | Werkzeuge | [katalog\bausteine\werkzeug-websuche.yaml](../../katalog/bausteine/werkzeug-websuche.yaml) |
| `leitplanke-keine-rechtsberatung` | Leitplanken | [katalog\bausteine\leitplanke-keine-rechtsberatung.yaml](../../katalog/bausteine/leitplanke-keine-rechtsberatung.yaml) |

### Warum `werkzeug-websuche` und nicht `wissen-nur-freigegebene-quellen`

Der Katalog enthält zwei Bausteine der Ebenen Werkzeuge und Wissen, die
sich laut ihrer `kollidiert`-Beziehung gegenseitig ausschließen:
`werkzeug-websuche` (freie Internetrecherche erlaubt) und
`wissen-nur-freigegebene-quellen` (Tatsachenaussagen ausschließlich aus
freigegebenen Dokumenten). Für dieses Profil fällt die Wahl aus zwei
Gründen eindeutig auf `werkzeug-websuche`:

1. **Technischer Zwang:** `antwortstil-quellenpflicht` — ein Baustein, der
   für einen Rechercheassistenten unverzichtbar ist — `benötigt`
   `werkzeug-websuche` (Pflichtnachzug, siehe 02-taxonomie.md). Wer die
   Quellenpflicht will, bekommt die Websuche automatisch dazu; das schließt
   `wissen-nur-freigegebene-quellen` für dieses Profil bereits technisch
   aus.
2. **Fachliche Passung:** Michaels Arbeitsalltag verlangt Recherche zu
   wechselnden, oft aktuellen Themen — nicht die Arbeit an einem fest
   umrissenen, vorab freigegebenen Dokumentenbestand. Ein
   Rechercheassistent, der nur bereits freigegebene Quellen kennt, wäre für
   diesen Einsatzzweck die schlechtere Wahl, selbst ohne den technischen
   Zwang.

`wissen-nur-freigegebene-quellen` bleibt im Katalog verfügbar für Profile,
die Michael künftig auf einen abgeschlossenen Dokumentenbestand begrenzen
möchte (z. B. eine Vertragsprüfung anhand ausschließlich hochgeladener
Unterlagen).

### Profil → Artefakte

Aus der Bausteinliste sind vier reale, sofort einsetzbare Artefakte unter
[`artefakte\mag-rechercheassistenz\`](../../artefakte/mag-rechercheassistenz/)
entstanden — eines je Ziel-Oberfläche (Beschluss E3), plus der
API-Parametersatz:

- [`system-prompt.md`](../../artefakte/mag-rechercheassistenz/system-prompt.md)
  — fertiger System-Prompt für die API-Oberfläche. Jeder Absatz entspricht
  genau einem Baustein: Rolle → `rolle-rechercheassistent`, Quellenpflicht
  → `antwortstil-quellenpflicht`, Websuche-Hinweis →
  `werkzeug-websuche`, Rechtsberatungs-Grenze →
  `leitplanke-keine-rechtsberatung`.
- [`CLAUDE.md`](../../artefakte/mag-rechercheassistenz/CLAUDE.md) —
  einsatzfertig für Claude Code, dieselben vier Bausteine als eigene
  Abschnitte, mit demselben Inhalt wie der System-Prompt, aber in der
  Umsetzung „Abschnitt in CLAUDE.md" aus den jeweiligen `mappings`.
- [`settings.json`](../../artefakte/mag-rechercheassistenz/settings.json) —
  gültiges JSON, aktiviert das Websuche-Werkzeug
  (`permissions.allow: ["WebSearch"]`) passend zur
  `claude-code`-Umsetzung von `werkzeug-websuche`. Keine weiteren
  Schlüssel, da kein weiterer Baustein eine Claude-Code-Einstellung
  außerhalb von CLAUDE.md verlangt.
- [`api-parameter.json`](../../artefakte/mag-rechercheassistenz/api-parameter.json)
  — gültiges JSON mit `model`, `max_tokens`, einem Verweis auf
  `system-prompt.md` und der Aktivierung des serverseitigen
  Websuche-Werkzeugs im API-Aufruf, wie es die `api`-Umsetzung von
  `werkzeug-websuche` vorsieht.

Damit ist jede Aussage in den vier Artefakten auf einen Baustein des
Profils zurückführbar (Umkehrung des Konsistenz-Abnahmekriteriums), und das
Profil enthält kein `kollidiert`-Paar.

## Steckbriefe weiterer Profile

Die folgenden fünf Profile sind laut Beschluss E4 nur skizziert — keine
YAML-Dateien, keine Artefakte. Sie zeigen, dass die Taxonomie über den
Tracer Bullet hinaus trägt.

**Finanzanalyst** — Unterstützt bei der Auswertung von Geschäftszahlen,
Kennzahlen und Marktberichten. Bausteine: eine Identität als
zahlenorientierter, nüchterner Analyst (Ebene Identität), strikte
Quellenpflicht für jede Kennzahl (Ebene Verhalten), Websuche für aktuelle
Marktdaten (Ebene Werkzeuge) und eine Leitplanke „keine verbindliche
Anlageempfehlung" analog zur Rechtsberatungs-Leitplanke (Ebene
Leitplanken). Risiko: Zahlen können veraltet oder falsch interpretiert
werden, wenn die Quelle nicht geprüft wird.

**Fachübersetzer** — Übersetzt Fachtexte (z. B. Verträge, technische
Dokumentation) unter Beibehaltung von Terminologie und Register. Bausteine:
Identität als präziser Übersetzer ohne eigene inhaltliche Meinung, ein
Verhaltens-Baustein „Terminologietreue" statt Quellenpflicht, Wissen
begrenzt auf vom Nutzer bereitgestellte Glossare
(`wissen-nur-freigegebene-quellen` passt hier besser als Websuche). Keine
zusätzliche Leitplanke nötig, da keine Rechts- oder Finanzrisiken
entstehen.

**Text-Enhancer** — Verbessert Stil, Klarheit und Lesbarkeit vorhandener
Texte, ohne den Inhalt eigenständig zu verändern. Bausteine: Identität als
zurückhaltender Lektor, Verhaltens-Baustein „inhaltliche Neutralität"
(keine Tatsachenbehauptungen ergänzen), keine Werkzeuge nötig. Risiko:
Ohne klare Leitplanke könnte der Assistent versehentlich Bedeutung
verschieben — ein Verhaltens-Baustein „Rückfrage bei Unklarheit" wäre
sinnvoll.

**Rechtsassistent** — Bereitet allgemeine rechtliche Informationen auf und
ordnet Fundstellen ein, ohne selbst zu beraten. Nutzt dieselbe
Leitplanke `leitplanke-keine-rechtsberatung` wie das Referenzprofil, dazu
strikte Quellenpflicht für jede Aussage zu Gesetzestexten und
Websuche für aktuelle Rechtsprechung. Höheres Risiko-Profil als die
anderen Steckbriefe, deshalb `art: erzwungen` bei der Leitplanke besonders
wichtig.

**Software-Entwickler** — Unterstützt beim Schreiben, Prüfen und
Refaktorieren von Code. Bausteine: Identität als sorgfältiger
Pair-Programmer, Werkzeuge für Dateizugriff und Codeausführung (neue
Werkzeug-Bausteine nötig, im aktuellen Katalog noch nicht vorhanden),
Leitplanke „keine destruktiven Aktionen ohne Bestätigung". Zeigt, dass die
Werkzeug-Ebene über Websuche hinaus erweiterbar ist, ohne das Datenmodell
zu ändern.
