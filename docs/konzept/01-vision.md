---
titel: "01 — Vision"
erstellt: 2026-07-18
status: Entwurf (Abnahme gebündelt vor GitHub-Push, B2)
---

# 01 — Vision

## Das Problem

Claude lässt sich weitreichend konfigurieren: Systemprompts, Projektregeln,
Werkzeuge, Automatisierungen, Sicherheitsleitplanken. Für Menschen ohne
KI-Expertise ist genau das ein Problem statt einer Chance. Sie kennen die
Fachbegriffe nicht, wissen nicht, welche Kombination von Einstellungen
zusammenpasst, und können nicht einschätzen, welche Risiken eine bestimmte
Einstellung mit sich bringt. In der Praxis führt das zu zwei schlechten
Ergebnissen: Entweder bleibt Claude auf den Werkszustand beschränkt, weil
niemand sich an die Konfiguration herantraut — dann bleibt viel Nutzen
liegen. Oder es wird wahllos aus Vorlagen und Foren-Tipps kopiert, ohne zu
verstehen, was die einzelnen Teile bewirken und ob sie sich vertragen —
dann entstehen unbemerkt Widersprüche oder Sicherheitslücken. Der
Konfigurator setzt genau hier an: Er nimmt Menschen die fachliche
Entscheidung nicht ab, aber er führt sie so durch die Möglichkeiten, dass
am Ende ein stimmiges, nachvollziehbares Ergebnis steht.

## Zielgruppen

- **Laien (Hauptzielgruppe):** Personen ohne Vorwissen zu KI-Konfiguration,
  die Claude für eine konkrete Aufgabe einsetzen wollen (z. B. Recherche,
  Übersetzung, Textarbeit) und dafür eine passende, verständlich erklärte
  Einstellung suchen — ohne selbst Systemprompts oder Regeldateien
  schreiben zu müssen. Für sie ist der geführte Dialog der Haupteinstieg.
- **Fortgeschrittene Anwender / Power-User (Nebenzielgruppe):** Personen,
  die die Fachbegriffe bereits kennen, gezielt einzelne Bausteine
  vergleichen oder kombinieren wollen und die Netzwerkansicht direkt zum
  Erkunden und Feinjustieren nutzen, statt den Dialog Schritt für Schritt
  zu durchlaufen.

Der Konfigurator bedient beide Gruppen mit derselben Datengrundlage, aber
über zwei unterschiedliche Zugänge: geführter Dialog für Laien, freies
Erkunden im Netzwerk für erfahrene Anwender.

## Nutzenversprechen

Der Konfigurator führt durch einen **geführten Dialog** — Domäne, dann
Aufgabentyp, dann gewünschtes Risikoprofil bzw. gewünschte Autonomie — und
setzt daraus ein passendes, **kuratiertes Konfigurationsprofil** für
Claude zusammen. „Kuratiert" heißt: von Menschen zusammengestellt und
begründet, nicht durch eine noch unbewiesene „Best Practice" geadelt —
die Ehrlichkeit dieser Einstufung ist Teil des Versprechens.

Wer mehr sehen will als das fertige Ergebnis, bekommt eine interaktive
**Netzwerkansicht**: Bausteine und Profile erscheinen als Knoten, ihre
Beziehungen zueinander (etwa „baut auf" oder „kollidiert mit") als Kanten.
Diese Ansicht dient als **Landkarte** — sie macht sichtbar, warum ein
Profil so aussieht, wie es aussieht, und erlaubt es, einzelne Bausteine
abzuwählen oder zu ersetzen, ohne den Überblick über Wechselwirkungen zu
verlieren.

Am Ende steht ein reales, einsetzbares Artefakt für die jeweilige
Ziel-Oberfläche (Claude Code, claude.ai-Projekte oder API) — kein
theoretisches Modell, sondern eine fertige Konfiguration, die sofort
genutzt werden kann.

## Was der Konfigurator nicht ist

Der Konfigurator ist kein Werkzeug zur Kopplung mehrerer KI-Systeme. Die
Idee, zwei KI-Systeme im Dialog miteinander arbeiten zu lassen
(„Trialog"/Dual-Layer), wurde bewusst als **eigenständiges Produkt**
abgetrennt und wird hier nicht weiterverfolgt. Sie lebt vollständig in
`..\..\Dual-layer\` und hat einen eigenen Planungsstand; wer sich dafür
interessiert, findet dort die entsprechenden Unterlagen.

Ebenso ist der Konfigurator kein Werkzeug, das Konfigurationsentscheidungen
automatisch und ohne nachvollziehbare Begründung trifft: Jeder Vorschlag
bleibt ein von Menschen kuratierter Vorschlag mit erklärten Bausteinen,
keine algorithmisch erzeugte oder als „Best Practice" ausgegebene Lösung.
Und er ist — zumindest in dieser Konzept-Etappe — kein Werkzeug für
beliebig viele KI-Anbieter: Ausgearbeitet werden zunächst nur die drei
Claude-Oberflächen; das Datenmodell bleibt für weitere Anbieter offen,
wird aber jetzt nicht dafür ausgebaut.
