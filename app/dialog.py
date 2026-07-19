"""Fragenlogik des gefuehrten Dialogs (AP5b, 04-bedienkonzept.md).

Drei Fragen in fester Reihenfolge (Domaene, Aufgabentyp, Risikoprofil);
das Ergebnis ist ein kuratierter Vorschlag als Bausteinliste.
"""
import json
from pathlib import Path

from app.auswahl import finde_konflikte, mit_pflichtnachzug

DATEN = Path(__file__).resolve().parent / "daten" / "dialog-fragen.json"


def lade_fragen():
    return json.loads(DATEN.read_text(encoding="utf-8"))


def werte_aus(bausteine, antworten):
    """antworten: dict frage_id -> option_id. Liefert (auswahl, konflikte)."""
    basis = []
    for frage in lade_fragen():
        option_id = antworten.get(frage["id"])
        if option_id is None:
            raise ValueError(f"Antwort auf Frage '{frage['id']}' fehlt")
        optionen = {o["id"]: o for o in frage["optionen"]}
        if option_id not in optionen:
            raise ValueError(
                f"Unbekannte Option '{option_id}' fuer Frage '{frage['id']}'")
        option = optionen[option_id]
        if not option.get("verfuegbar", True):
            raise ValueError(
                f"Option '{option_id}' ist in dieser Ausbaustufe nicht verfuegbar")
        basis += option.get("bausteine", [])
    auswahl = mit_pflichtnachzug(bausteine, basis)
    return auswahl, finde_konflikte(bausteine, auswahl)
