---
titel: "04 — Bedienkonzept"
erstellt: 2026-07-18
status: Entwurf (Abnahme gebündelt vor GitHub-Push, B2)
---

# 04 — Bedienkonzept

## Der geführte Dialog

Der geführte Dialog ist der Haupteinstieg für Laien (siehe 01-vision.md).
Er stellt genau drei Fragen in fester Reihenfolge — Domäne, dann
Aufgabentyp, dann Risikoprofil/Autonomie — und leitet aus den Antworten
Schritt für Schritt eine Bausteinauswahl ab. Am Ende steht kein fertiges,
unveränderliches Ergebnis, sondern ein **kuratierter Vorschlag**: eine
begründete, von Menschen zusammengestellte Auswahl an Bausteinen, die der
Nutzer in der Netzwerkansicht (nächster Abschnitt) noch prüfen und
verändern kann. Der Dialog ersetzt also nicht die eigene Entscheidung,
er bereitet sie nur so vor, dass jemand ohne KI-Vorwissen nicht bei null
anfangen muss.

### Frage 1: Domäne

**Formulierung:** „In welchem Bereich soll dich der Assistent
unterstützen?"

**Antwortoptionen:** Recherche & Informationsbeschaffung · Finanzen &
Kennzahlen · Übersetzung von Fachtexten · Überarbeitung vorhandener Texte
· Rechtliche Informationen · Softwareentwicklung

**Wirkung auf die Profilauswahl:** Die Domäne bestimmt die Profil-Familie
und damit den ersten Baustein der Ebene Identität — die grundsätzliche
Rolle, die der Assistent einnehmen soll (z. B. „Rechercheassistent" bei
der Domäne Recherche & Informationsbeschaffung). Jede Domäne entspricht
einem der Profile aus dem Profilkatalog (03): dem Tracer Bullet
MAG-Rechercheassistenz oder einem der skizzierten Steckbriefe
(Finanzanalyst, Fachübersetzer, Text-Enhancer, Rechtsassistent,
Software-Entwickler).

### Frage 2: Aufgabentyp

**Formulierung:** „Was genau soll der Assistent dabei tun?"

**Antwortoptionen (Beispiel für die Domäne Recherche &
Informationsbeschaffung):** „Aktuelle Fakten recherchieren und mit
Quellen belegen" · „Ausschließlich mit Unterlagen arbeiten, die ich
selbst bereitstelle" · „Nur vorhandenes Wissen zusammenfassen, ohne aktiv
zu recherchieren"

**Wirkung auf die Profilauswahl:** Der Aufgabentyp konkretisiert, wie die
Domäne umgesetzt wird, und wählt die Bausteine der Ebenen Verhalten,
Wissen und Werkzeuge. „Aktuelle Fakten recherchieren und mit Quellen
belegen" führt zum Baustein `antwortstil-quellenpflicht` (Ebene
Verhalten), der wegen seiner `benoetigt`-Beziehung automatisch den
Baustein `werkzeug-websuche` (Ebene Werkzeuge) nach sich zieht.
„Ausschließlich mit Unterlagen arbeiten, die ich selbst bereitstelle"
führt stattdessen zum Baustein `wissen-nur-freigegebene-quellen` (Ebene
Wissen) — der laut Katalog mit `werkzeug-websuche` `kollidiert` und daher
mit der ersten Antwortoption nicht gemeinsam gewählt werden kann. „Nur
vorhandenes Wissen zusammenfassen, ohne aktiv zu recherchieren" fügt
bewusst *keinen* Baustein der Ebenen Wissen oder Werkzeuge hinzu —
insbesondere wird `werkzeug-websuche` nicht ausgewählt. Da
`antwortstil-quellenpflicht` laut Katalog `werkzeug-websuche` `benoetigt`
(eine verlässliche Quellenangabe setzt voraus, dass tatsächlich recherchiert
werden kann, siehe 02-taxonomie.md, Abschnitt „Kombinierbarkeit und
Konflikte"), bleibt bei dieser dritten Antwort auch der
Verhaltens-Baustein `antwortstil-quellenpflicht` unausgewählt: Das Profil
verzichtet an dieser Stelle bewusst auf eine Quellenpflicht, statt eine
Recherchemöglichkeit vorzutäuschen, die nicht genutzt werden soll.

### Frage 3: Risikoprofil/Autonomie

**Formulierung:** „Wie streng sollen Grenzen für den Assistenten gelten?"

**Antwortoptionen:** „Feste, nicht verhandelbare Grenzen bei heiklen
Themen" · „Sinnvolle Vorschläge reichen mir, ohne zusätzliche feste
Sperren"

**Wirkung auf die Profilauswahl:** Diese Frage wählt Bausteine der Ebene
Leitplanken und bestimmt deren Feld `art`. „Feste, nicht verhandelbare
Grenzen bei heiklen Themen" wählt einen Leitplanken-Baustein mit
`art: erzwungen` — etwa `leitplanke-keine-rechtsberatung`, sofern die
Domäne Berührungspunkte mit Rechtsfragen hat. „Sinnvolle Vorschläge
reichen mir" verzichtet auf einen zusätzlichen Leitplanken-Baustein und
belässt es bei den `wunsch`-Bausteinen der übrigen Ebenen.

### Durchgespielt: Das MAG-Profil

Michael beantwortet die drei Fragen für seinen Arbeitsalltag so:

1. **Domäne:** „Recherche & Informationsbeschaffung." Der Dialog schlägt
   als ersten Baustein `rolle-rechercheassistent` (Ebene Identität) vor.
2. **Aufgabentyp:** „Aktuelle Fakten recherchieren und mit Quellen
   belegen" — denn Michaels Themen wechseln und sind oft aktuell, ein
   fest umrissener Dokumentenbestand würde nicht reichen (siehe 03,
   Abschnitt „Warum `werkzeug-websuche` und nicht
   `wissen-nur-freigegebene-quellen`"). Der Dialog nimmt
   `antwortstil-quellenpflicht` (Ebene Verhalten) auf und zieht
   `werkzeug-websuche` (Ebene Werkzeuge) automatisch als Pflichtnachzug
   mit.
3. **Risikoprofil/Autonomie:** „Feste, nicht verhandelbare Grenzen bei
   heiklen Themen" — Michael möchte bei Rechtsfragen keine verbindliche
   Empfehlung erhalten. Der Dialog nimmt `leitplanke-keine-rechtsberatung`
   (Ebene Leitplanken, `art: erzwungen`) auf.

Der Dialog präsentiert daraufhin den kuratierten Vorschlag mit genau den
vier Bausteinen des Profils
[`mag-rechercheassistenz.yaml`](../../katalog/profile/mag-rechercheassistenz.yaml):
`rolle-rechercheassistent`, `antwortstil-quellenpflicht`,
`werkzeug-websuche` und `leitplanke-keine-rechtsberatung` — bereit zur
Prüfung in der Netzwerkansicht.

## Die Netzwerkansicht

Die Netzwerkansicht ist die Landkarte zum kuratierten Vorschlag aus dem
Dialog (siehe 01-vision.md, Abschnitt „Nutzenversprechen"). Sie zeigt
jeden Baustein als Knoten und jede Beziehung zwischen zwei Bausteinen als
Kante, damit auch jemand ohne KI-Vorwissen nachvollziehen kann, warum ein
Profil so zusammengestellt wurde und was eine Änderung auslöst.

### Knoten: Farbe nach Wirkungsebene

Jeder Knoten wird nach der Wirkungsebene seines Bausteins (siehe
02-taxonomie.md) eingefärbt. Da jeder Baustein zu genau einer der fünf
Ebenen gehört, ist die Farbzuordnung immer eindeutig — es gibt keine
Mischfarben oder Sonderfälle:

| Wirkungsebene | Farbe    | Beispiel-Baustein (aus dem Katalog)                                                             |
|---------------|----------|--------------------------------------------------------------------------------------------------|
| Identität     | Blau     | `rolle-rechercheassistent`                                                                       |
| Verhalten     | Grün     | `antwortstil-quellenpflicht`                                                                     |
| Wissen        | Gelb     | `wissen-nur-freigegebene-quellen`                                                                |
| Werkzeuge     | Orange   | `werkzeug-websuche`                                                                               |
| Leitplanken   | Rot      | `leitplanke-keine-rechtsberatung`                                                                 |

Nicht ausgewählte Bausteine (im Katalog vorhanden, aber nicht Teil des
aktuellen Profils) werden blass/abgedunkelt in derselben Ebenenfarbe
dargestellt, ausgewählte Bausteine kräftig — so bleibt die Ebenenfarbe
auch für Bausteine außerhalb des aktuellen Profils erkennbar, etwa für
`wissen-nur-freigegebene-quellen`, das im MAG-Profil nicht enthalten ist.

### Kanten: Beziehungstyp

Jede Kante entspricht einer der drei Beziehungen aus dem Baustein-Schema
(`beziehungen.benoetigt`, `beziehungen.verstaerkt`,
`beziehungen.kollidiert`) und wird optisch unterschieden, damit die drei
Typen auch ohne Legende auseinanderzuhalten sind:

- **`benoetigt` (Pflichtnachzug):** durchgezogener Pfeil in neutralem
  Dunkelgrau, vom voraussetzenden zum vorausgesetzten Baustein. Wird der
  vorausgesetzte Baustein nicht ausgewählt, kann der voraussetzende
  Baustein gar nicht erst aktiviert werden.
- **`verstaerkt` (Empfehlung):** gestrichelte Linie in hellem Blaugrau,
  vom empfehlenden zum empfohlenen Baustein (analog zur Richtung bei
  `benoetigt`, aber ohne Pfeilspitze dargestellt, weil die Empfehlung
  nicht zwingend ist), als Hinweis auf einen gut passenden, aber nicht
  zwingenden Baustein.
- **`kollidiert` (harte Warnung):** durchgezogene, kräftig rote Linie mit
  Warnsymbol. Diese Kante wird nur dann sichtbar hervorgehoben, wenn
  *beide* verbundenen Bausteine gleichzeitig ausgewählt sind — vorher
  bleibt sie unauffällig, damit die Ansicht nicht überladen wirkt.

Beispielhaft für die fünf Bausteine des Katalogs ergibt sich folgende
Knoten-/Kantenliste (Stichprobe zur Prüfung der Graph-Tauglichkeit):

| Kante (von → nach)                                                    | Beziehungstyp |
|-------------------------------------------------------------------------|---------------|
| `rolle-rechercheassistent` → `antwortstil-quellenpflicht`              | verstärkt     |
| `antwortstil-quellenpflicht` → `werkzeug-websuche`                     | benötigt      |
| `leitplanke-keine-rechtsberatung` → `antwortstil-quellenpflicht`       | verstärkt     |
| `werkzeug-websuche` → `wissen-nur-freigegebene-quellen`                | kollidiert    |

### Zu-/Abwahl und Konflikt-Warnung

Ein Klick auf einen Knoten wählt den zugehörigen Baustein ab oder zu und
verändert das Profil sofort, ohne Zwischenschritt:

- **Zuwahl:** Wird ein Baustein zugewählt, der andere Bausteine
  `benoetigt`, werden diese automatisch mit zugewählt und ebenfalls
  hervorgehoben — genau wie beim geführten Dialog, wenn
  `antwortstil-quellenpflicht` automatisch `werkzeug-websuche` mitzieht.
- **Konflikt-Warnung:** Entsteht durch eine Zu- oder Abwahl eine Situation,
  in der zwei ausgewählte Bausteine über eine `kollidiert`-Kante
  verbunden sind, erscheint sofort eine unübersehbare Warnung an genau
  dieser Kante (rot hervorgehoben, mit erklärendem Text, welche zwei
  Bausteine sich widersprechen und warum). Wählt Michael zusätzlich zum
  MAG-Profil testweise `wissen-nur-freigegebene-quellen` zu, erscheint
  die Konflikt-Warnung sofort an der Kante zu `werkzeug-websuche` (das
  über die `benoetigt`-Beziehung von `antwortstil-quellenpflicht` bereits
  Teil des Profils ist). Der Nutzer muss die Warnung aktiv auflösen,
  indem er sich für einen der beiden Bausteine entscheidet und den
  anderen abwählt — ein Profil mit ungelöster Konflikt-Warnung lässt sich
  nicht exportieren (siehe nächster Abschnitt).
- **Abwahl:** Wird ein Baustein abgewählt, von dem andere ausgewählte
  Bausteine über `benoetigt` abhängen, erhält der Nutzer einen Hinweis,
  welche abhängigen Bausteine dadurch ebenfalls entfernt würden, bevor
  die Abwahl bestätigt wird.

## Der Export-Schritt

Der Export-Schritt setzt ein Profil ohne ungelöste Konflikt-Warnung in
reale, einsetzbare Artefakte um — für jede der drei Zieloberflächen
`claude-code`, `claude-ai-projekte` und `api` (Beschluss E3) einzeln.
Grundlage ist für jeden ausgewählten Baustein dessen `mappings`-Eintrag
aus dem Baustein-Schema (02-taxonomie.md): Feld `umsetzung` beschreibt,
*wie* der Baustein auf der jeweiligen Oberfläche technisch umgesetzt
wird, Feld `adapter_status` (Beschluss E6c), *wie gut* das gelingt.

### Ablauf

1. Der Nutzer wählt eine oder mehrere der drei Zieloberflächen.
2. Für jede gewählte Oberfläche fasst der Konfigurator die
   `umsetzung`-Texte aller ausgewählten Bausteine zu einem Artefakt
   zusammen — je nach Oberfläche etwa ein System-Prompt, eine
   `CLAUDE.md` mit begleitender `settings.json` oder ein
   API-Parametersatz. Für das Referenzprofil MAG-Rechercheassistenz
   liegen diese Artefakte bereits real vor unter
   [`artefakte\mag-rechercheassistenz\`](../../artefakte/mag-rechercheassistenz/):
   [`system-prompt.md`](../../artefakte/mag-rechercheassistenz/system-prompt.md),
   [`CLAUDE.md`](../../artefakte/mag-rechercheassistenz/CLAUDE.md),
   [`settings.json`](../../artefakte/mag-rechercheassistenz/settings.json)
   und
   [`api-parameter.json`](../../artefakte/mag-rechercheassistenz/api-parameter.json).
3. Vor dem eigentlichen Export zeigt der Konfigurator je Baustein und
   Oberfläche den `adapter_status` an, damit der Nutzer weiß, worauf er
   sich verlässt, statt eine Umsetzung anzunehmen, die es so nicht gibt.

### Anzeige des `adapter_status`

Die drei Werte werden unterschiedlich dargestellt, jeweils mit dem Text
aus `umsetzung` als Begründung:

- **`supported`** — grünes Häkchen, Baustein wird auf dieser Oberfläche
  vollständig umgesetzt. Beispiel: `antwortstil-quellenpflicht` ist auf
  allen drei Oberflächen `supported`.
- **`degraded`** — gelbes Warndreieck, Baustein wird nur eingeschränkt
  umgesetzt; der `umsetzung`-Text erklärt die Einschränkung im Klartext.
  Beispiel: `werkzeug-websuche` ist auf `claude-ai-projekte` `degraded`,
  weil Websuche dort eine globale Chat-Funktion und kein
  Projekt-spezifischer Schalter ist — sie lässt sich für das Projekt nur
  empfehlen, nicht erzwingen. Diese Einschränkung wird dem Nutzer vor dem
  Export unübersehbar angezeigt, nicht erst nachträglich sichtbar.
- **`unsupported`** — rotes Kreuz, Baustein lässt sich auf dieser
  Oberfläche gar nicht umsetzen. Der Baustein wird im Artefakt dieser
  Oberfläche ausdrücklich als „nicht umsetzbar" vermerkt statt
  stillschweigend wegzufallen, damit niemand eine Sicherheit annimmt, die
  auf dieser Oberfläche tatsächlich nicht besteht.

Erst wenn der Nutzer die Statusanzeige gesehen hat, kann er den Export
für die gewählte Oberfläche auslösen und erhält das fertige Artefakt zum
Kopieren oder Herunterladen — ein reales, sofort einsetzbares Ergebnis
und kein theoretisches Modell (vgl. 01-vision.md, Abschnitt
„Nutzenversprechen").
