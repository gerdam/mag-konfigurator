"""Graph-Extraktion (AP4): Katalog -> Knoten/Kanten-Liste (Abnahmekriterium
Graph-Tauglichkeit). Schreibt graph/knoten-kanten.json. Exit 0/1.
"""
import json
import sys
from pathlib import Path

from validate_katalog import lade_bausteine, pruefe_beziehungen

REPO = Path(__file__).resolve().parents[1]
BEZIEHUNGSTYPEN = ["benoetigt", "verstaerkt", "kollidiert"]


def exportiere(bausteine):
    knoten = [{"id": bid, "name": d.get("name"), "ebene": d.get("ebene")}
              for bid, d in sorted(bausteine.items())]
    kanten = []
    for bid, d in sorted(bausteine.items()):
        for typ in BEZIEHUNGSTYPEN:
            for ziel in (d.get("beziehungen") or {}).get(typ) or []:
                kanten.append({"von": bid, "zu": ziel, "typ": typ})
    return {"knoten": knoten, "kanten": kanten}


def main():
    bausteine, befunde = lade_bausteine(REPO / "katalog" / "bausteine")
    befunde += pruefe_beziehungen(bausteine)
    if befunde:
        print("graph_export: Katalog hat Befunde, kein Export.")
        for b in befunde:
            print(f"  {b}")
        return 1
    graph = exportiere(bausteine)
    ziel = REPO / "graph" / "knoten-kanten.json"
    ziel.parent.mkdir(exist_ok=True)
    ziel.write_text(json.dumps(graph, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"graph_export: {len(graph['knoten'])} Knoten, {len(graph['kanten'])} Kanten -> {ziel.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
