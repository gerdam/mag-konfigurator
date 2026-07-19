import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from check_profil import ARTEFAKTE, pruefe_profil

BAUSTEINE = {
    "a": {"beziehungen": {"benoetigt": [], "verstaerkt": [], "kollidiert": ["b"]}},
    "b": {"beziehungen": {"benoetigt": [], "verstaerkt": [], "kollidiert": ["a"]}},
    "c": {"beziehungen": {"benoetigt": [], "verstaerkt": [], "kollidiert": []}},
}
PROFIL = """\
id: testprofil
name: "Testprofil"
beschreibung: "Nur fuer Tests."
bausteine: [a, c]
"""


class TestArtefaktProbe(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.wurzel = Path(self.tmp.name)
        self.profil = self.wurzel / "testprofil.yaml"
        self.profil.write_text(PROFIL, encoding="utf-8")
        ordner = self.wurzel / "artefakte" / "testprofil"
        ordner.mkdir(parents=True)
        for name in ARTEFAKTE:
            inhalt = "{}" if name.endswith(".json") else "Inhalt"
            (ordner / name).write_text(inhalt, encoding="utf-8")

    def tearDown(self):
        self.tmp.cleanup()

    def test_sauberes_profil_ohne_befunde(self):
        befunde = pruefe_profil(self.profil, BAUSTEINE, self.wurzel / "artefakte")
        self.assertEqual(befunde, [])

    def test_unbekannter_baustein_wird_gemeldet(self):
        self.profil.write_text(PROFIL.replace("[a, c]", "[a, fehlt]"), encoding="utf-8")
        befunde = pruefe_profil(self.profil, BAUSTEINE, self.wurzel / "artefakte")
        self.assertTrue(any("fehlt" in b for b in befunde))

    def test_kollision_im_profil_wird_gemeldet(self):
        self.profil.write_text(PROFIL.replace("[a, c]", "[a, b]"), encoding="utf-8")
        befunde = pruefe_profil(self.profil, BAUSTEINE, self.wurzel / "artefakte")
        self.assertTrue(any("kollidiert" in b for b in befunde))

    def test_fehlendes_artefakt_wird_gemeldet(self):
        (self.wurzel / "artefakte" / "testprofil" / "CLAUDE.md").unlink()
        befunde = pruefe_profil(self.profil, BAUSTEINE, self.wurzel / "artefakte")
        self.assertTrue(any("CLAUDE.md" in b for b in befunde))

    def test_ungueltiges_json_wird_gemeldet(self):
        ziel = self.wurzel / "artefakte" / "testprofil" / "settings.json"
        ziel.write_text("kein json", encoding="utf-8")
        befunde = pruefe_profil(self.profil, BAUSTEINE, self.wurzel / "artefakte")
        self.assertTrue(any("settings.json" in b for b in befunde))


if __name__ == "__main__":
    unittest.main()
