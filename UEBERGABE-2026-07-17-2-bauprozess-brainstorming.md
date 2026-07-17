---
titel: "Übergabe 2: Brainstorming Bauprozess — Stand vor der Varianten-Entscheidung"
erstellt: 2026-07-17
zweck: Wiedereinstieg nach Pause — Brainstorming-Session zum Bauprozess fortsetzen
vorgänger: UEBERGABE-2026-07-17.md (Produkttrennung, weiterhin gültig)
---

# Übergabe 2 — Brainstorming „Bauprozess" (17.07.2026, abends)

## Wo wir stehen

Nach der Produkttrennung (siehe `UEBERGABE-2026-07-17.md`) lief eine
Brainstorming-Session nach dem Superpowers-Skill `superpowers:brainstorming`
über den **Bauprozess**. Die Klärungsfragen sind beantwortet, die
Prozess-Varianten liegen auf dem Tisch — **die Wahl der Variante steht als
Allererstes aus.**

## Bereits getroffene Entscheidungen (nicht neu aufrollen)

| # | Frage | Michaels Entscheidung |
|---|---|---|
| B1 | Was heißt „Bauprozess"? | **Gesamtprozess Konzept → Deploy**: von den Konzeptdokumenten 01–05 über den Prototyp bis zum Deployment, als durchgängiger Prozess |
| B2 | Einbindung Michael | **Autonom mit Stopp-Kriterien**; Haltepunkte **nur vor Außenwirkung** (GitHub-Push, Deployment). Abnahmekriterien inkl. Laien-Test werden am ersten Außenwirkungs-Haltepunkt gebündelt |
| B3 | Stopp-Kriterium (E9-Regel) | **Arbeitspaket je Lauf**: jeder autonome Lauf bekommt ein klar umrissenes Paket (z. B. Dokumente 01+02, dann 03, dann 04+05, dann Prototyp-Meilensteine); Paketende = Commit + kurzer Bericht, dann Stopp |
| B4 | Technische Entscheidungen | **Claude entscheidet selbst, dokumentiert**: jede Wahl mit Begründung als Fortschreibung des Entscheidungsprotokolls (E12, E13, …); Michael kann am Haltepunkt jede Entscheidung kippen. Leitplanken E3 (nur Claude-Oberflächen) und E8 (SQLite/B-Tree) gelten weiter |

## Offene Entscheidung: Welche Prozess-Variante?

Drei Varianten wurden vorgestellt (alle respektieren E1–E11):

1. **V1 — Strikt sequenziell:** Erst alle 5 Konzeptdokumente, dann Prototyp.
   Einfachster Ablauf; Schwäche: keine technische Validierung während
   Etappe A, Papierprodukt-Risiko.
2. **V2 — Verschränkter Tracer-Bullet (Empfehlung von Claude):** Jedes
   Konzeptpaket wird sofort von einem maschinell prüfbaren Artefakt begleitet:
   zu 02-taxonomie ein Schema-Validator (YAML-Bausteine + SQLite-Index, E8),
   der ins lokale CI einwandert; zu 03 die realen Profil-Artefakte
   (System-Prompt, CLAUDE.md + settings.json, API-Parameter); zu 04/05 ein
   klickbares Graph-Skelett mit den echten Beispieldaten. Begründung: Weil
   Michael erst spät draufschaut, übernimmt Code die Rolle des frühen
   Gegenlesers; der Prototyp wächst als Nebenprodukt. Kosten: mehr Aufwand
   je Paket, Konzepte müssen ggf. nachgezogen werden.
3. **V3 — Validierungslauf am Etappenende:** Dokumente zügig durchschreiben,
   danach ein gesammelter Prüflauf gegen Code vor Etappe B. Mittelweg beim
   Aufwand, aber spätes, gebündeltes Feedback.

## So geht es weiter (Wiedereinstieg)

1. Neue Session starten, diese Datei lesen lassen.
2. Skill `superpowers:brainstorming` fortsetzen — nächster Schritt laut
   Skill-Checkliste: **Variante wählen**, dann Design abschnittsweise
   präsentieren und freigeben, dann Spec nach
   `docs\superpowers\specs\2026-07-17-bauprozess-design.md` (Datum ggf.
   anpassen) schreiben, Selbst-Review, Michael liest gegen, danach Skill
   `writing-plans` für den Umsetzungsplan.
3. Die Entscheidungen B1–B4 gelten als gesetzt; nur die Varianten-Frage
   (und alles danach) ist offen.

## Unverändert offen aus Übergabe 1

- **„OS Builder Paul"**: Installation wartet weiter auf Michaels Bestätigung
  (Kandidat npm `paul-framework`, Details in `docs\werkbank.md`)
- **Dual-Layer-Brainstorming**: eigene Session (6 Fragen in
  `Dual-layer\00-ideenskizze-dual-layer.md`)
- **Etappe A selbst ist noch nicht begonnen** — sie startet erst, wenn der
  Bauprozess beschlossen ist
