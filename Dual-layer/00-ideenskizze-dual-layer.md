---
titel: "Dual-Layer-KI: Ideenskizze"
erstellt: 2026-07-17
status: ideenskizze — noch kein Konzept
autor: Claude (Fable 5), Trennungs-Session mit Michael
herkunft: ausgelagert aus dem Konfigurator-Projekt (Beschluss E1 vom 17.07.2026)
---

# Dual-Layer-KI — Ideenskizze

> **Status:** Dies ist eine bewusst kurze Startskizze. Das eigentliche
> Konzept-Brainstorming findet in einer eigenen Session statt.

## Kernidee

Zwei KI-Systeme werden **zur Laufzeit gekoppelt** und arbeiten als Schichten
(Layer) zusammen — nicht als bloßes Arbeitsmodell zweier Assistenten, sondern
als eigenständiges Produkt. Das im Trialog (Juli 2026) erprobte Muster ist der
Ausgangspunkt: eine KI erzeugt, die andere prüft/kritisiert, ein Mensch
entscheidet. Die Gegenkritiken fanden nachweislich echte Lücken — dieser
Nutzen soll produktisiert werden.

## Was schon existiert (in diesem Ordner)

| Datei | Inhalt |
|---|---|
| `Trialog-Etappe2-Arbeitsplan-ENTWURF-2026-07-13.md` | Erprobtes Kopplungs-Arbeitsmodell: Debatten-Ledger in Markdown, Rollen (Claude erzeugt, Codex prüft, Michael entscheidet), Debattenformat mit IDs (D-001 …), Regeln (keine KI ändert Beiträge der anderen, UTF-8-Pflicht, Quellen-URL + Abrufdatum bei Capability-Aussagen) |
| `Triage-plan-2-13072026.md.txt` | Vorstufe desselben Entwurfs (Sitzungsprotokoll) |
| `Codex-Installation-13072026.md` | Installationsprotokoll der zweiten KI (Codex CLI). **Offen: `codex login` wurde nie ausgeführt** |

## Abgrenzung zum Konfigurator

Der Konfigurator (Produkt A, `docs\konzept\` im übergeordneten Ordner) hilft
Menschen, **eine** KI richtig zu konfigurieren. Dual-Layer (Produkt B) koppelt
**zwei** KI-Systeme miteinander. Berührungspunkt: Ein Dual-Layer-System könnte
später selbst per Konfigurator-Profil eingestellt werden — mehr nicht. Kein
gemeinsames Datenmodell, keine gemeinsame Roadmap.

## Architektur-Notiz

Leitlinie beider Produkte (Beschluss E8 vom 17.07.2026): Wo gesucht und
gespeichert wird — etwa ein gemeinsames Gedächtnis oder Debatten-Index der
beiden KIs — kommt **indexierte Speicherung auf B-Tree/B+-Tree-Basis** zum
Einsatz. Pragmatische Default-Umsetzung: SQLite (arbeitet intern mit
B-Trees); keine Eigenimplementierung.

## Offene Fragen für die eigene Brainstorming-Session

1. **Zweck:** Qualitätssicherung (Erzeuger/Prüfer), Arbeitsteilung (parallele
   Rollen) oder Steuerung (eine KI orchestriert die andere) — was ist der
   Produktkern?
2. **Kopplungsgrad:** Asynchron über Dateien (wie Trialog) oder echte
   Laufzeit-Kopplung (API-zu-API, gemeinsamer Speicher)?
3. **Anbieterpaar:** Claude + Codex/OpenAI fest, oder austauschbar?
4. **Mensch im Kreislauf:** Entscheidet immer ein Mensch (wie im Trialog),
   oder gibt es autonome Runden mit Stopp-Kriterien (Token-/Runden-Budget)?
5. **Zielgruppe:** Nur MAG-intern oder als Produkt für Dritte?
6. **Erster Anwendungsfall:** Woran wird der Nutzen zuerst bewiesen?
