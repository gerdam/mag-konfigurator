# MAG-Konfigurator — Prototyp (AP5)

Lokal laufender Prototyp: FastAPI-Backend (`app/`) plus statisches Frontend
ohne Build-Werkzeug (`app/static/`). Geführter Dialog, Netzwerkansicht und
Export als kuratierter Vorschlag — kein Ergebnis ist eine „beste" Lösung.

## Start

```
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Danach im Browser öffnen: http://127.0.0.1:8000

## Hinweis zum Export

In dieser Ausbaustufe liefert der Export nur für vollständig gepflegte
Profile echte Artefakte (aktuell: `mag-rechercheassistenz`). Eine
generische Artefakt-Erzeugung für beliebige Bausteinkombinationen ist als
Roadmap-Phase ③ vorgesehen, siehe `docs/konzept/05-architektur-roadmap.md`.
