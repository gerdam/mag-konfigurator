"""Artefakt-Probe (AP4): Profil <-> Katalog <-> Artefakte.

Prueft jedes Profil unter katalog/profile/: alle Baustein-IDs existieren,
keine kollidiert-Beziehung innerhalb des Profils, alle 4 Artefakte unter
artefakte/<profil-id>/ vorhanden, nicht leer, JSON-Dateien parsen.
Exit 0 = gueltig, 1 = Befunde.
"""
import json
import sys
from pathlib import Path

import yaml

from validate_katalog import lade_bausteine, pruefe_beziehungen

REPO = Path(__file__).resolve().parents[1]
ARTEFAKTE = ["system-prompt.md", "CLAUDE.md", "settings.json", "api-parameter.json"]


def pruefe_profil(profil_pfad, bausteine, artefakte_wurzel):
    befunde = []
    profil = yaml.safe_load(Path(profil_pfad).read_text(encoding="utf-8"))
    pid = profil.get("id")
    if pid != Path(profil_pfad).stem:
        befunde.append(f"{Path(profil_pfad).name}: id '{pid}' entspricht nicht dem Dateinamen")
    gewaehlt = profil.get("bausteine") or []
    for bid in gewaehlt:
        if bid not in bausteine:
            befunde.append(f"{pid}: unbekannter Baustein '{bid}'")
    vorhanden = [b for b in gewaehlt if b in bausteine]
    for bid in vorhanden:
        kollidiert = (bausteine[bid].get("beziehungen") or {}).get("kollidiert") or []
        for anderer in vorhanden:
            if anderer in kollidiert:
                befunde.append(f"{pid}: '{bid}' kollidiert mit '{anderer}' im selben Profil")
    ordner = Path(artefakte_wurzel) / str(pid)
    for name in ARTEFAKTE:
        pfad = ordner / name
        if not pfad.is_file() or not pfad.read_text(encoding="utf-8").strip():
            befunde.append(f"{pid}: Artefakt '{name}' fehlt oder ist leer")
        elif name.endswith(".json"):
            try:
                json.loads(pfad.read_text(encoding="utf-8"))
            except json.JSONDecodeError as fehler:
                befunde.append(f"{pid}: '{name}' ist kein gueltiges JSON ({fehler})")
    return befunde


def main():
    bausteine, befunde = lade_bausteine(REPO / "katalog" / "bausteine")
    befunde += pruefe_beziehungen(bausteine)
    profile = sorted((REPO / "katalog" / "profile").glob("*.yaml"))
    for profil_pfad in profile:
        befunde += pruefe_profil(profil_pfad, bausteine, REPO / "artefakte")
    if befunde:
        print("check_profil: BEFUNDE")
        for b in befunde:
            print(f"  {b}")
        return 1
    print(f"check_profil: {len(profile)} Profil(e) gueltig.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
