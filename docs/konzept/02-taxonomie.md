---
titel: "02 — Taxonomie"
erstellt: 2026-07-18
status: Entwurf (Abnahme gebündelt vor GitHub-Push, B2)
---

# 02 — Taxonomie

## Die 5 Wirkungsebenen

Jeder Baustein des Konfigurators wirkt auf genau einer von fünf Ebenen.
Diese Einteilung ist kein Bedienelement der Oberfläche, sondern ein
festes Datenmodell-Feld jedes Bausteins (Beschluss E6): Sie entscheidet
mit, wie ein Baustein technisch umgesetzt wird und mit welchen anderen
Bausteinen er zusammenpasst oder in Konflikt gerät.

- **Identität** — legt fest, *wer* der Assistent in dieser Konfiguration
  ist: seine Rolle, sein Selbstverständnis, sein grundsätzlicher
  Blickwinkel auf die Aufgabe. Beispiel: Ein Baustein könnte festlegen,
  dass sich der Assistent als sorgfältiger Rechercheassistent versteht,
  der Aussagen prüft, bevor er sie präsentiert, statt als lockerer
  Schreibpartner. (Ein solcher Identitäts-Baustein ist im aktuellen
  Katalog noch nicht als eigene Datei angelegt; er entsteht mit dem
  Profilkatalog in 03.)
- **Verhalten** — legt fest, *wie* der Assistent antwortet: Tonfall,
  Ausführlichkeit, Umgang mit Unsicherheit, wiederkehrende Antwortmuster.
  Beispiel: der Baustein `antwortstil-quellenpflicht` (siehe unten), der
  den Assistenten verpflichtet, zu jeder Tatsachenbehauptung die Quelle
  zu nennen.
- **Wissen** — legt fest, *worauf* sich der Assistent bei seinen
  Aussagen stützen darf: welche Quellen erlaubt, bevorzugt oder
  ausgeschlossen sind. Beispiel: der Baustein
  `wissen-nur-freigegebene-quellen` (siehe unten), der Tatsachenaussagen
  auf vom Nutzer freigegebene Dokumente beschränkt.
- **Werkzeuge** — legt fest, *was* der Assistent aktiv tun darf: welche
  Funktionen, Schnittstellen oder externen Dienste er nutzen kann.
  Beispiel: der Baustein `werkzeug-websuche` (siehe unten), der aktive
  Internetrecherche erlaubt.
- **Leitplanken** — legt fest, *was der Assistent nicht tun darf*: harte
  Grenzen, die unabhängig vom sonstigen Verhalten gelten. Beispiel: der
  Baustein `leitplanke-keine-rechtsberatung` (siehe unten), der
  verbindliche Rechtsberatung im Einzelfall ausschließt.

Die fünf Ebenen schließen sich gegenseitig aus: Ein Baustein gehört
immer zu genau einer Ebene, auch wenn seine Wirkung im Alltag mehrere
Aspekte berührt. Das hält die Taxonomie und den späteren Beziehungsgraphen
konsistent und macht die Netzwerkansicht (04) übersichtlich, weil jeder
Knoten eindeutig einer Farbe/Kategorie zugeordnet werden kann.

## Das Baustein-Schema

Jeder Baustein ist eine einzelne YAML-Datei unter `katalog\bausteine\`
(Beschluss E13). Das folgende Schema ist verbindlich für alle
Bausteine — Feldnamen und erlaubte Werte gelten exakt so, wie sie hier
stehen; spätere Werkzeuge (Arbeitspaket AP4) prüfen automatisch dagegen:

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

Feld für Feld, in verständlicher Sprache:

- **`id`** — der eindeutige Name des Bausteins, identisch mit dem
  Dateinamen ohne die Endung `.yaml`. Nur Kleinbuchstaben, Ziffern und
  Bindestriche (kebab-case), keine Umlaute — technische Schlüssel
  bleiben bewusst ASCII, damit sie in Dateinamen, Links und späterem
  Code ohne Sonderfälle funktionieren.
- **`name`** — die für Menschen lesbare Bezeichnung, wie sie im Dialog
  und in der Netzwerkansicht angezeigt wird. Hier dürfen Umlaute und
  Satzzeichen stehen.
- **`ebene`** — Pflichtfeld, genau einer der fünf Werte
  `identitaet | verhalten | wissen | werkzeuge | leitplanken` (siehe
  oben). Legt fest, welcher der fünf Wirkungsebenen der Baustein
  angehört.
- **`art`** — entweder `wunsch` oder `erzwungen` (Beschluss E6a). Ein
  `wunsch` ist eine Bitte an das Sprachmodell, die es in aller Regel
  befolgt, aber nicht befolgen muss (etwa ein Formulierungsstil). Ein
  `erzwungen`-Baustein wird so umgesetzt, dass er tatsächlich
  durchgesetzt wird oder zumindest als unverhandelbare Vorgabe
  formuliert ist — er darf keine Schein-Sicherheit vortäuschen, indem
  er als bloßer Wunsch getarnt wird.
- **`klartext_wirkung`** — ein kurzer, laienverständlicher Absatz, der
  ohne Fachbegriffe erklärt, was der Baustein konkret bewirkt. Das ist
  der Text, den auch jemand ohne KI-Vorwissen im geführten Dialog liest.
- **`risiken`** — eine Liste möglicher Nebenwirkungen oder Nachteile,
  ebenfalls in Klartext. Zeigt ehrlich, dass jeder Baustein einen Preis
  hat, statt nur Nutzen zu versprechen.
- **`beziehungen`** — die drei Beziehungstypen zu anderen Bausteinen,
  jeweils als Liste von Baustein-`id`s:
  - `benoetigt` — Bausteine, die zwingend mit dazugehören müssen, damit
    dieser Baustein funktioniert (Pflichtnachzug).
  - `verstaerkt` — Bausteine, die gut dazu passen und empfohlen werden,
    aber nicht zwingend nötig sind (Empfehlung).
  - `kollidiert` — Bausteine, die sich mit diesem Baustein nicht
    sinnvoll kombinieren lassen (harte Warnung).
  Die genaue Wirkung dieser drei Listen erklärt der nächste Abschnitt.
- **`mappings`** — je Zieloberfläche (genau `claude-code`,
  `claude-ai-projekte` und `api`, Beschluss E3) ein Eintrag mit:
  - `adapter_status` — `supported`, `degraded` oder `unsupported`
    (Beschluss E6c): ehrlich ausgezeichnet, ob die Oberfläche den
    Baustein vollständig, nur eingeschränkt oder gar nicht umsetzen
    kann, statt eine Umsetzung vorzutäuschen, die es nicht gibt.
  - `umsetzung` — ein kurzer Satz, *wie* der Baustein auf dieser
    Oberfläche konkret technisch umgesetzt wird (z. B. als Abschnitt in
    einer bestimmten Datei).

## Kombinierbarkeit und Konflikte

Die drei Beziehungstypen in `beziehungen` steuern, wie Bausteine sich
zu einem Profil zusammensetzen lassen:

- **`benoetigt` (Pflichtnachzug):** Wählt jemand einen Baustein aus, der
  einen anderen Baustein `benoetigt`, wird dieser andere Baustein
  automatisch mit in das Profil aufgenommen — ohne ihn wäre der erste
  Baustein technisch nicht sinnvoll umsetzbar. Beispiel aus dem Katalog:
  `antwortstil-quellenpflicht` benötigt `werkzeug-websuche`, denn eine
  verlässliche Quellenangabe setzt voraus, dass der Assistent Quellen
  tatsächlich nachschlagen kann, statt sie aus dem Gedächtnis zu
  erfinden.
- **`verstaerkt` (Empfehlung):** Ein Baustein in dieser Liste passt gut
  zum aktuellen Baustein und wird im Dialog vorgeschlagen, muss aber
  nicht übernommen werden. Beispiel: `leitplanke-keine-rechtsberatung`
  verstärkt `antwortstil-quellenpflicht` — wer ohnehin Quellen nennen
  muss, hält die Grenze zur Rechtsberatung leichter ein, das eine ist
  aber ohne das andere weiterhin sinnvoll nutzbar.
- **`kollidiert` (harte Warnung):** Zwei Bausteine, die sich gegenseitig
  in der `kollidiert`-Liste führen, widersprechen sich inhaltlich oder
  technisch so stark, dass ihre gleichzeitige Verwendung im selben
  Profil vermieden werden sollte. Beispiel: `werkzeug-websuche` (freie
  Internetrecherche erlaubt) kollidiert mit
  `wissen-nur-freigegebene-quellen` (Tatsachenaussagen ausschließlich
  aus freigegebenen Dokumenten) — beides gleichzeitig zu aktivieren
  ergäbe einen inneren Widerspruch, welche Quellen nun eigentlich
  gelten dürfen.

**Konflikterkennung:** Ein Konflikt liegt vor, sobald innerhalb eines
Profils zwei Bausteine ausgewählt sind, die sich gegenseitig in ihrer
`kollidiert`-Liste führen — technisch also eine `kollidiert`-Kante
*innerhalb* der aktuellen Profilauswahl existiert. Die geplante
Netzwerkansicht (04) markiert eine solche Kante sofort sichtbar, sobald
sie durch eine Zu- oder Abwahl entsteht, damit niemand unbemerkt ein
widersprüchliches Profil zusammenstellt. Wichtig ist der Unterschied zu
`benoetigt`: Ein Pflichtnachzug kann eine Kollision erst *auslösen* —
wählt jemand `antwortstil-quellenpflicht`, zieht das `werkzeug-websuche`
zwangsläufig nach; wer zusätzlich `wissen-nur-freigegebene-quellen`
möchte, bekommt an dieser Stelle die Konflikt-Warnung angezeigt und muss
sich bewusst entscheiden, welchen der beiden Bausteine er aufgibt.

## Beispiel-Bausteine

Die Taxonomie wurde gegen vier reale Beispiel-Bausteine unter
`katalog\bausteine\` geprüft (Papier-Validierung, siehe Bericht). Sie
tragen gemeinsam das Referenzprofil MAG-Rechercheassistenz aus 03:

- [`antwortstil-quellenpflicht.yaml`](../../katalog/bausteine/antwortstil-quellenpflicht.yaml)
  — Ebene Verhalten, `wunsch`. Verpflichtet den Assistenten zur
  Quellenangabe und ist zugleich das durchgängige Beispiel dieses
  Dokuments für das Schema selbst.
- [`leitplanke-keine-rechtsberatung.yaml`](../../katalog/bausteine/leitplanke-keine-rechtsberatung.yaml)
  — Ebene Leitplanken, `erzwungen`. Verhindert verbindliche
  Rechtsberatung im Einzelfall und liefert das Beispiel für einen
  tatsächlich durchgesetzten statt bloß gewünschten Baustein.
- [`werkzeug-websuche.yaml`](../../katalog/bausteine/werkzeug-websuche.yaml)
  — Ebene Werkzeuge, `wunsch`. Erlaubt aktive Internetrecherche und
  zeigt mit `adapter_status: degraded` auf `claude-ai-projekte`, dass
  nicht jede Oberfläche jeden Baustein gleich gut umsetzen kann.
- [`wissen-nur-freigegebene-quellen.yaml`](../../katalog/bausteine/wissen-nur-freigegebene-quellen.yaml)
  — Ebene Wissen, `wunsch`. Beschränkt Tatsachenaussagen auf freigegebene
  Dokumente und bildet den Gegenpol zu `werkzeug-websuche`, an dem sich
  eine harte `kollidiert`-Warnung demonstrieren lässt.
