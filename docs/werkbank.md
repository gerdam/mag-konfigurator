---
titel: "Werkbank: Installationsstatus und Fundliste"
erstellt: 2026-07-17
status: gültig
bezug: Beschlüsse E9 und E11 in [00-entscheidungsprotokoll](konzept/00-entscheidungsprotokoll.md)
---

# Werkbank — Status vom 17.07.2026

## Installiert und verifiziert

| Werkzeug | Was | Wo | Verifikation |
|---|---|---|---|
| **markitdown** 0.1.6 + **markitdown-mcp** | Konvertiert PDF/Office/u. a. nach Markdown; MCP-Server für Claude Code | pip --user; MCP im User-Scope registriert (`claude mcp list` → `markitdown`) | Testkonvertierung Photovoltaics-Report.pdf erfolgreich. Achtung: PDF-Extraktion kann selbst Sonderzeichen-Müll erzeugen — vor Übernahme in Konzeptdokumente prüfen (check-docs schlägt sonst an) |
| **find-skills** (vercel-labs/skills) | Skill-Suche: durchsucht das offene Skill-Ökosystem (skills.sh) per `npx skills find` | `~\.claude\skills\find-skills` (user-weit) | Sicherheitsbewertung beim Install: Gen „Safe", Socket 0 Alerts, Snyk „Med Risk"; SKILL.md gesichtet, unauffällig. Wird in neuen Sessions automatisch angeboten |

## Offen — Entscheidung Michael

| Werkzeug | Stand |
|---|---|
| **OS Builder „Paul"** | Kandidat identifiziert: **PAUL Framework** (Plan-Apply-Unify Loop) von ChristopherKahler, npm-Paket `paul-framework` v1.4.0, GitHub github.com/ChristopherKahler/paul. Install wäre `npx paul-framework --global` (legt `/paul:init` u. a. 26 Befehle unter `~\.claude\commands\paul\` ab). **Nicht installiert:** Die Zuordnung „OS Builder Paul" → dieses npm-Paket ist Recherche, keine bestätigte Quelle — Michael bestätigt oder verwirft. Hinweis: `/paul:init` erst nach Neustart von Claude Code verfügbar; im Konfigurator-Projekt bewusst einsetzen (PROJECT.md-Workflow überschneidet sich mit unserem Etappenplan) |

## Recherchiert — kein Install nötig

- **graphify**: Open-Source-Tool, das eine Codebasis per Tree-sitter/AST in einen
  persistenten Wissensgraphen wandelt (JSON/HTML); Obsidian dient als
  Visualisierungsschicht, Claude Code liest den Graphen statt zu greppen
  (Anspruch: deutlich weniger Token pro Suche). Install wäre
  `graphify install --platform claude` (Skill unter `~\.claude\skills\graphify\`).
  **Bewertung:** Werkbank-Kandidat für Michaels Vault/Code-Projekte — aber
  **kein** Baustein für die Netzwerkansicht des Konfigurator-Produkts; die
  braucht eine eigene Rendering-Schicht (Cytoscape.js/D3, siehe künftiges
  05-architektur-roadmap.md)
- **/Goal-Regel (E9):** `/Goal` nur mit explizitem Stopp-Kriterium bzw.
  Token-/Runden-Budget starten — sonst grenzenloser Verbrauch

## Fundliste „everything-claude-code" (E11)

Repo: github.com/affaan-m/everything-claude-code (MIT-Lizenz, Anthropic-Hackathon-Gewinner
Affaan Mustafa; Stand 17.07.2026: **278 Skills, 67 Agents**, dazu commands/, rules/,
hooks/, mcp-configs/ — deutlich gewachsen gegenüber „28 Subagents / 118 Skills" aus der
Wunschliste). Gesichtet per flachem Klon; Klon lag im temporären Scratchpad, bei Bedarf
neu klonen.

**Für die Werkbank interessant (Skills):** `deep-research`, `search-first`,
`context-budget`, `knowledge-ops`, `research-ops`, `rules-distill`,
`hookify-rules`, `documentation-lookup`, `plan-orchestrate`

**Für die Werkbank interessant (Agents):** `planner`, `code-reviewer`,
`doc-updater`, `spec-miner`, `silent-failure-hunter`

**Für den Konfigurator-Katalog (Quellmaterial für Bausteine/Profile):** Die
Repo-Struktur spiegelt die fünf Wirkungsebenen erstaunlich gut und taugt als
Steinbruch für Etappe A:

| Repo-Bereich | Wirkungsebene |
|---|---|
| `agents/` (Rollen wie architect, reviewer) | E1 Identität / E2 Verhalten |
| `rules/`, `contexts/` | E2 Verhalten / E5 Leitplanken |
| `skills/`, `commands/` | E4 Werkzeuge |
| `mcp-configs/` | E4 Werkzeuge |
| `hooks/` | E5 Leitplanken (technisch erzwungen — Paradebeispiel für `art: erzwungen` aus E6a) |

**Nächster Schritt (Etappe A, Dokument 02/03):** Beim Ausarbeiten der
Beispiel-Bausteine 3–4 konkrete Kandidaten aus diesem Repo ableiten, z. B. eine
Rule als „erzwungene Leitplanke" und einen Skill als „Werkzeug-Baustein".
