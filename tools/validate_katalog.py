"""Schema-Validator fuer den Baustein-Katalog (E8/E12, AP4).

Prueft katalog/bausteine/*.yaml gegen das Schema aus docs/konzept/02-taxonomie.md
und baut den Suchindex katalog/index.sqlite. Exit 0 = gueltig, 1 = Befunde.
"""
import sqlite3
import sys
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parents[1]
EBENEN = {"identitaet", "verhalten", "wissen", "werkzeuge", "leitplanken"}
ARTEN = {"wunsch", "erzwungen"}
OBERFLAECHEN = {"claude-code", "claude-ai-projekte", "api"}
ADAPTER_STATUS = {"supported", "degraded", "unsupported"}
PFLICHTFELDER = ["id", "name", "ebene", "art", "klartext_wirkung",
                 "risiken", "beziehungen", "mappings"]
BEZIEHUNGSTYPEN = ["benoetigt", "verstaerkt", "kollidiert"]


def lade_bausteine(katalog_dir):
    bausteine, befunde = {}, []
    for pfad in sorted(Path(katalog_dir).glob("*.yaml")):
        try:
            daten = yaml.safe_load(pfad.read_text(encoding="utf-8"))
        except yaml.YAMLError as fehler:
            befunde.append(f"{pfad.name}: ungueltiges YAML ({fehler})")
            continue
        if not isinstance(daten, dict):
            befunde.append(f"{pfad.name}: kein YAML-Mapping")
            continue
        for feld in PFLICHTFELDER:
            if feld not in daten:
                befunde.append(f"{pfad.name}: Pflichtfeld '{feld}' fehlt")
        if daten.get("id") != pfad.stem:
            befunde.append(f"{pfad.name}: id '{daten.get('id')}' entspricht nicht dem Dateinamen")
        if "ebene" in daten and daten["ebene"] not in EBENEN:
            befunde.append(f"{pfad.name}: unbekannte ebene '{daten['ebene']}'")
        if "art" in daten and daten["art"] not in ARTEN:
            befunde.append(f"{pfad.name}: unbekannte art '{daten['art']}'")
        beziehungen = daten.get("beziehungen") or {}
        for typ in BEZIEHUNGSTYPEN:
            if typ not in beziehungen:
                befunde.append(f"{pfad.name}: beziehungen.{typ} fehlt")
        mappings = daten.get("mappings") or {}
        if set(mappings) != OBERFLAECHEN:
            befunde.append(f"{pfad.name}: mappings muessen genau {sorted(OBERFLAECHEN)} abdecken")
        for oberflaeche, mapping in mappings.items():
            status = (mapping or {}).get("adapter_status")
            if status not in ADAPTER_STATUS:
                befunde.append(f"{pfad.name}: mappings.{oberflaeche}.adapter_status '{status}' ungueltig")
        bausteine[pfad.stem] = daten
    return bausteine, befunde


def pruefe_beziehungen(bausteine):
    befunde = []
    for bid, daten in bausteine.items():
        for typ in BEZIEHUNGSTYPEN:
            for ziel in (daten.get("beziehungen") or {}).get(typ) or []:
                if ziel not in bausteine:
                    befunde.append(f"{bid}: beziehungen.{typ} verweist auf unbekannten Baustein '{ziel}'")
    return befunde


def baue_index(bausteine, db_pfad):
    db_pfad = Path(db_pfad)
    db_pfad.unlink(missing_ok=True)
    db = sqlite3.connect(db_pfad)
    db.executescript(
        "CREATE TABLE bausteine (id TEXT PRIMARY KEY, name TEXT, ebene TEXT, art TEXT);"
        "CREATE TABLE beziehungen (von_id TEXT, typ TEXT, zu_id TEXT);"
        "CREATE TABLE mappings (baustein_id TEXT, oberflaeche TEXT, adapter_status TEXT);"
        "CREATE INDEX idx_ebene ON bausteine(ebene);"
        "CREATE INDEX idx_bez ON beziehungen(von_id, typ);"
    )
    for bid, daten in bausteine.items():
        db.execute("INSERT INTO bausteine VALUES (?,?,?,?)",
                   (bid, daten.get("name"), daten.get("ebene"), daten.get("art")))
        for typ in BEZIEHUNGSTYPEN:
            for ziel in (daten.get("beziehungen") or {}).get(typ) or []:
                db.execute("INSERT INTO beziehungen VALUES (?,?,?)", (bid, typ, ziel))
        for oberflaeche, mapping in (daten.get("mappings") or {}).items():
            db.execute("INSERT INTO mappings VALUES (?,?,?)",
                       (bid, oberflaeche, (mapping or {}).get("adapter_status")))
    db.commit()
    db.close()


def main():
    katalog = REPO / "katalog" / "bausteine"
    bausteine, befunde = lade_bausteine(katalog)
    befunde += pruefe_beziehungen(bausteine)
    if befunde:
        print("validate_katalog: BEFUNDE")
        for b in befunde:
            print(f"  {b}")
        return 1
    baue_index(bausteine, REPO / "katalog" / "index.sqlite")
    print(f"validate_katalog: {len(bausteine)} Baustein(e) gueltig, Index gebaut.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
