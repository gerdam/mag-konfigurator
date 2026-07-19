"""FastAPI-Backend des Konfigurator-Prototyps (AP5, Beschluss E14).

Liest den YAML-Katalog ueber die bestehenden Pruefwerkzeuge (tools/) und
stellt die Routen fuer Graph, Profile, Auswahl, Dialog und Export bereit.
Start (Entwicklung): python -m uvicorn app.main:app --reload
"""
import sys
from pathlib import Path

import yaml
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO / "tools"))

from graph_export import exportiere  # noqa: E402
from validate_katalog import lade_bausteine, pruefe_beziehungen  # noqa: E402

from app.auswahl import finde_konflikte, mit_pflichtnachzug  # noqa: E402

from app.dialog import lade_fragen, werte_aus  # noqa: E402


def lade_katalog():
    bausteine, befunde = lade_bausteine(REPO / "katalog" / "bausteine")
    befunde += pruefe_beziehungen(bausteine)
    if befunde:
        raise RuntimeError("Katalog hat Befunde: " + "; ".join(befunde))
    return bausteine


def lade_profile():
    profile = {}
    for pfad in sorted((REPO / "katalog" / "profile").glob("*.yaml")):
        daten = yaml.safe_load(pfad.read_text(encoding="utf-8"))
        profile[daten["id"]] = daten
    return profile


app = FastAPI(title="Konfigurator-Prototyp")
BAUSTEINE = lade_katalog()
PROFILE = lade_profile()


@app.get("/api/graph")
def graph():
    return exportiere(BAUSTEINE)


@app.get("/api/profil/{profil_id}")
def profil(profil_id: str):
    if profil_id not in PROFILE:
        raise HTTPException(404, f"Profil '{profil_id}' unbekannt")
    return PROFILE[profil_id]


@app.post("/api/auswahl/pruefen")
def auswahl_pruefen(daten: dict):
    gewaehlt = daten.get("bausteine") or []
    unbekannt = [b for b in gewaehlt if b not in BAUSTEINE]
    if unbekannt:
        raise HTTPException(400, f"Unbekannte Bausteine: {', '.join(unbekannt)}")
    voll = mit_pflichtnachzug(BAUSTEINE, gewaehlt)
    return {"bausteine": voll, "konflikte": finde_konflikte(BAUSTEINE, voll)}


@app.get("/api/dialog")
def dialog_fragen():
    return lade_fragen()


@app.post("/api/dialog")
def dialog_auswerten(antworten: dict):
    try:
        auswahl, konflikte = werte_aus(BAUSTEINE, antworten)
    except ValueError as fehler:
        raise HTTPException(400, str(fehler))
    return {"bausteine": auswahl, "konflikte": konflikte}


app.mount("/", StaticFiles(directory=Path(__file__).resolve().parent / "static",
                           html=True), name="static")
