# Einsatz-Anleitung: MAG-Rechercheassistenz

Diese Anleitung beschreibt, wie du die vier Artefakte in diesem Ordner in
den drei Claude-Oberflächen (E3) produktiv einsetzt — für den
Tragfähigkeits-Test der Etappe-A-Abnahme. Sie ist Begleitmaterial und
selbst kein Artefakt des Profils.

## 1. Claude Code (nutzt `CLAUDE.md` + `settings.json`)

1. Lege einen Projektordner an (oder wähle einen bestehenden Arbeitsordner,
   z. B. den Ordner, in dem deine Recherche-Unterlagen liegen).
2. Kopiere die Datei `CLAUDE.md` aus diesem Ordner unverändert in die
   oberste Ebene des Projektordners.
3. Lege im Projektordner den Unterordner `.claude\` an und kopiere
   `settings.json` dorthin: `<Projektordner>\.claude\settings.json`.
   (Existiert dort schon eine `settings.json`, ergänze stattdessen den
   Eintrag `"WebSearch"` in deren `permissions.allow`-Liste.)
4. Starte Claude Code in diesem Ordner (`claude` im Terminal). Die Rolle,
   die Quellenpflicht, die Websuche-Erlaubnis und die
   Rechtsberatungs-Leitplanke sind damit aktiv.
5. Kurztest: Stelle eine Recherchefrage mit aktuellem Bezug — die Antwort
   muss Quellen nennen; stelle eine konkrete Rechtsfrage — die Antwort muss
   auf anwaltliche Beratung verweisen.

## 2. claude.ai-Projekte (nutzt `system-prompt.md`)

1. Öffne claude.ai → „Projekte" → neues Projekt anlegen (z. B.
   „MAG-Rechercheassistenz").
2. Öffne die Projekt-Anweisungen („Instructions") und füge den Text aus
   `system-prompt.md` ein — nur den Teil **unterhalb** der Trennlinie
   (`---`); die Zeilen darüber sind Herkunfts-Hinweise, keine Anweisung.
3. Hinweis aus dem Baustein `werkzeug-websuche` (`adapter_status:
   degraded`): In claude.ai kannst du die Websuche nicht per Anweisung
   erzwingen — sie muss in den Konto-Einstellungen aktiviert sein und
   Claude entscheidet je Anfrage, ob es sucht. Prüfe daher beim Kurztest,
   ob Suchergebnisse mit Quellen kommen.
4. Kurztest wie oben (Recherchefrage + Rechtsfrage).

## 3. API (nutzt `api-parameter.json` + `system-prompt.md`)

1. Grundlage ist `api-parameter.json`: Modell `claude-opus-4-8`,
   `max_tokens` 4096, Websuche-Werkzeug `web_search_20260209`.
2. Ersetze den Platzhalter-Wert des Feldes `system` („siehe
   system-prompt.md …") durch den vollständigen Text aus
   `system-prompt.md` unterhalb der Trennlinie.
3. Beispiel-Aufruf (Python, `pip install anthropic`, API-Key in der
   Umgebungsvariable `ANTHROPIC_API_KEY`):

```python
import json
from pathlib import Path

import anthropic

ordner = Path(__file__).parent
params = json.loads((ordner / "api-parameter.json").read_text(encoding="utf-8"))
prompt = (ordner / "system-prompt.md").read_text(encoding="utf-8")
params["system"] = prompt.split("---", 1)[1].strip()

client = anthropic.Anthropic()
antwort = client.messages.create(
    **params,
    messages=[{"role": "user", "content": "Deine Recherchefrage hier"}],
)
print(antwort.content[-1].text)
```

4. Kurztest wie oben (Recherchefrage + Rechtsfrage).

## Ergebnis festhalten

Für die Abnahme reicht ein kurzes Urteil je genutzter Oberfläche:
**trägt** / **trägt mit Befunden** (Befunde bitte konkret nennen — sie
fließen in die Abnahme und ggf. in Baustein-Korrekturen ein).
