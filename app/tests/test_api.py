"""API-Tests fuer das Backend-Grundgeruest (AP5a, Task 2)."""
import sys
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO))
sys.path.insert(0, str(REPO / "tools"))

from fastapi.testclient import TestClient

from app.main import app
from graph_export import exportiere
from validate_katalog import lade_bausteine


class TestApi(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_graph_liefert_export_daten(self):
        bausteine, befunde = lade_bausteine(REPO / "katalog" / "bausteine")
        self.assertEqual(befunde, [])
        antwort = self.client.get("/api/graph")
        self.assertEqual(antwort.status_code, 200)
        self.assertEqual(antwort.json(), exportiere(bausteine))

    def test_graph_hat_fuenf_knoten_und_fuenf_kanten(self):
        daten = self.client.get("/api/graph").json()
        self.assertEqual(len(daten["knoten"]), 5)
        self.assertEqual(len(daten["kanten"]), 5)

    def test_profil_mag_liefert_vier_bausteine(self):
        antwort = self.client.get("/api/profil/mag-rechercheassistenz")
        self.assertEqual(antwort.status_code, 200)
        self.assertEqual(sorted(antwort.json()["bausteine"]), [
            "antwortstil-quellenpflicht",
            "leitplanke-keine-rechtsberatung",
            "rolle-rechercheassistent",
            "werkzeug-websuche",
        ])

    def test_unbekanntes_profil_404(self):
        self.assertEqual(self.client.get("/api/profil/gibt-es-nicht").status_code, 404)

    def test_startseite_wird_ausgeliefert(self):
        antwort = self.client.get("/")
        self.assertEqual(antwort.status_code, 200)
        self.assertIn("Netzwerkansicht", antwort.text)

    def test_cytoscape_bibliothek_wird_ausgeliefert(self):
        self.assertEqual(self.client.get("/cytoscape.min.js").status_code, 200)

    def test_skripte_werden_ausgeliefert(self):
        """zustand.js zuerst -- app.js, dialog.js und export.js setzen die
        Zustand-Schnittstelle beim eigenen Laden bereits voraus.
        graphlogik.js (reine Graphlogik, kein DOM) muss vor app.js geladen
        werden, das sie aufruft."""
        for name in ["zustand.js", "graphlogik.js", "app.js", "dialog.js", "export.js"]:
            self.assertEqual(self.client.get("/" + name).status_code, 200,
                             "Skript nicht ausgeliefert: " + name)
        seite = self.client.get("/").text
        self.assertLess(seite.index("zustand.js"), seite.index("app.js"),
                        "zustand.js muss vor app.js geladen werden")
        self.assertLess(seite.index("graphlogik.js"), seite.index("app.js"),
                        "graphlogik.js muss vor app.js geladen werden")


if __name__ == "__main__":
    unittest.main()
