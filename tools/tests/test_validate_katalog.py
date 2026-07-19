import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from validate_katalog import lade_bausteine, pruefe_beziehungen, baue_index

GUELTIG = """\
id: test-baustein
name: "Testbaustein"
ebene: verhalten
art: wunsch
klartext_wirkung: "Tut etwas Nachvollziehbares."
risiken: []
beziehungen:
  benoetigt: []
  verstaerkt: []
  kollidiert: []
mappings:
  claude-code: {adapter_status: supported, umsetzung: "x"}
  claude-ai-projekte: {adapter_status: supported, umsetzung: "x"}
  api: {adapter_status: supported, umsetzung: "x"}
"""


class TestValidator(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def schreibe(self, name, text):
        (self.dir / name).write_text(text, encoding="utf-8")

    def test_gueltiger_baustein_ohne_befunde(self):
        self.schreibe("test-baustein.yaml", GUELTIG)
        bausteine, befunde = lade_bausteine(self.dir)
        self.assertEqual(befunde, [])
        self.assertIn("test-baustein", bausteine)

    def test_falsche_ebene_wird_gemeldet(self):
        self.schreibe("test-baustein.yaml", GUELTIG.replace("ebene: verhalten", "ebene: stimmung"))
        _, befunde = lade_bausteine(self.dir)
        self.assertTrue(any("ebene" in b for b in befunde))

    def test_id_muss_dateiname_sein(self):
        self.schreibe("anderer-name.yaml", GUELTIG)
        _, befunde = lade_bausteine(self.dir)
        self.assertTrue(any("Dateiname" in b for b in befunde))

    def test_fehlendes_pflichtfeld_wird_gemeldet(self):
        self.schreibe("test-baustein.yaml", GUELTIG.replace('name: "Testbaustein"\n', ""))
        _, befunde = lade_bausteine(self.dir)
        self.assertTrue(any("name" in b for b in befunde))

    def test_beziehung_ins_leere_wird_gemeldet(self):
        self.schreibe("test-baustein.yaml", GUELTIG.replace("benoetigt: []", "benoetigt: [gibt-es-nicht]"))
        bausteine, befunde = lade_bausteine(self.dir)
        self.assertEqual(befunde, [])
        befunde = pruefe_beziehungen(bausteine)
        self.assertTrue(any("gibt-es-nicht" in b for b in befunde))

    def test_index_wird_gebaut(self):
        import sqlite3
        self.schreibe("test-baustein.yaml", GUELTIG)
        bausteine, _ = lade_bausteine(self.dir)
        db = self.dir / "index.sqlite"
        baue_index(bausteine, db)
        mit = sqlite3.connect(db)
        self.assertEqual(mit.execute("SELECT COUNT(*) FROM bausteine").fetchone()[0], 1)
        self.assertEqual(mit.execute("SELECT COUNT(*) FROM mappings").fetchone()[0], 3)
        mit.close()


if __name__ == "__main__":
    unittest.main()
