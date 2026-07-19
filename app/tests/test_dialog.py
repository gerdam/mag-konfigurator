"""Tests fuer die Fragenlogik des gefuehrten Dialogs (AP5b, Task 4)."""
import sys
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO))

from fastapi.testclient import TestClient

from app.dialog import lade_fragen, werte_aus
from app.main import BAUSTEINE, app

MAG_ANTWORTEN = {"domaene": "recherche", "aufgabentyp": "quellen",
                 "risiko": "feste-grenzen"}


class TestDialog(unittest.TestCase):
    def test_drei_fragen_in_fester_reihenfolge(self):
        fragen = lade_fragen()
        self.assertEqual([f["id"] for f in fragen],
                         ["domaene", "aufgabentyp", "risiko"])

    def test_mag_antworten_ergeben_mag_profil(self):
        auswahl, konflikte = werte_aus(BAUSTEINE, MAG_ANTWORTEN)
        self.assertEqual(auswahl, [
            "antwortstil-quellenpflicht",
            "leitplanke-keine-rechtsberatung",
            "rolle-rechercheassistent",
            "werkzeug-websuche",
        ])
        self.assertEqual(konflikte, [])

    def test_zusammenfassen_ohne_sperren_nur_rolle(self):
        auswahl, konflikte = werte_aus(BAUSTEINE, {
            "domaene": "recherche", "aufgabentyp": "zusammenfassen",
            "risiko": "ohne-sperren"})
        self.assertEqual(auswahl, ["rolle-rechercheassistent"])
        self.assertEqual(konflikte, [])

    def test_fehlende_antwort_ist_fehler(self):
        with self.assertRaises(ValueError):
            werte_aus(BAUSTEINE, {"domaene": "recherche"})

    def test_nicht_verfuegbare_domaene_ist_fehler(self):
        with self.assertRaises(ValueError):
            werte_aus(BAUSTEINE, {"domaene": "finanzen",
                                  "aufgabentyp": "quellen",
                                  "risiko": "ohne-sperren"})


class TestDialogRouten(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_get_dialog_liefert_fragen(self):
        antwort = self.client.get("/api/dialog")
        self.assertEqual(antwort.status_code, 200)
        self.assertEqual(len(antwort.json()), 3)

    def test_post_dialog_mag(self):
        antwort = self.client.post("/api/dialog", json=MAG_ANTWORTEN)
        self.assertEqual(antwort.status_code, 200)
        self.assertEqual(len(antwort.json()["bausteine"]), 4)

    def test_post_dialog_unbekannte_option_400(self):
        antwort = self.client.post("/api/dialog", json={
            "domaene": "recherche", "aufgabentyp": "quatsch",
            "risiko": "ohne-sperren"})
        self.assertEqual(antwort.status_code, 400)


if __name__ == "__main__":
    unittest.main()
