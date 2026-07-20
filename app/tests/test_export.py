"""Tests fuer den Export-Schritt (AP5c, Task 7)."""
import sys
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO))

from fastapi.testclient import TestClient

from app.main import app

MAG = ["antwortstil-quellenpflicht", "leitplanke-keine-rechtsberatung",
       "rolle-rechercheassistent", "werkzeug-websuche"]


class TestExport(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_mag_export_claude_code_liefert_echte_artefakte(self):
        antwort = self.client.post("/api/export", json={
            "bausteine": MAG, "oberflaeche": "claude-code"})
        self.assertEqual(antwort.status_code, 200)
        daten = antwort.json()
        self.assertEqual(daten["profil"], "mag-rechercheassistenz")
        self.assertEqual(sorted(daten["dateien"]), ["CLAUDE.md", "settings.json"])
        for dateiname in sorted(daten["dateien"]):
            soll = (REPO / "artefakte" / "mag-rechercheassistenz" / dateiname
                    ).read_text(encoding="utf-8")
            self.assertEqual(daten["dateien"][dateiname], soll,
                              "Inhalt weicht ab bei Datei: " + dateiname)

    def test_status_matrix_nennt_jeden_baustein(self):
        antwort = self.client.post("/api/export", json={
            "bausteine": MAG, "oberflaeche": "claude-ai-projekte"})
        self.assertEqual(antwort.status_code, 200)
        daten = antwort.json()
        self.assertEqual([z["baustein"] for z in daten["status"]], MAG)
        status_websuche = [z for z in daten["status"]
                           if z["baustein"] == "werkzeug-websuche"][0]
        self.assertEqual(status_websuche["adapter_status"], "degraded")

    def test_konflikt_sperrt_export_409(self):
        antwort = self.client.post("/api/export", json={
            "bausteine": ["werkzeug-websuche", "wissen-nur-freigegebene-quellen"],
            "oberflaeche": "api"})
        self.assertEqual(antwort.status_code, 409)

    def test_ohne_passendes_profil_404(self):
        antwort = self.client.post("/api/export", json={
            "bausteine": ["rolle-rechercheassistent"], "oberflaeche": "api"})
        self.assertEqual(antwort.status_code, 404)

    def test_unbekannte_oberflaeche_400(self):
        antwort = self.client.post("/api/export", json={
            "bausteine": MAG, "oberflaeche": "fax"})
        self.assertEqual(antwort.status_code, 400)

    def test_unbekannte_bausteine_400(self):
        antwort = self.client.post("/api/export", json={
            "bausteine": MAG + ["baustein-erfunden"], "oberflaeche": "api"})
        self.assertEqual(antwort.status_code, 400)
        self.assertIn("baustein-erfunden", antwort.json()["detail"])


if __name__ == "__main__":
    unittest.main()
