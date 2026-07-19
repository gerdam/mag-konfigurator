"""Tests fuer Pflichtnachzug und Konflikterkennung (AP5b, Task 3)."""
import sys
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO))

from fastapi.testclient import TestClient

from app.auswahl import finde_konflikte, mit_pflichtnachzug
from app.main import BAUSTEINE, app


class TestAuswahl(unittest.TestCase):
    def test_pflichtnachzug_zieht_websuche_mit(self):
        ergebnis = mit_pflichtnachzug(BAUSTEINE, ["antwortstil-quellenpflicht"])
        self.assertEqual(ergebnis, ["antwortstil-quellenpflicht", "werkzeug-websuche"])

    def test_pflichtnachzug_ohne_beziehung_unveraendert(self):
        ergebnis = mit_pflichtnachzug(BAUSTEINE, ["rolle-rechercheassistent"])
        self.assertEqual(ergebnis, ["rolle-rechercheassistent"])

    def test_konflikt_wird_genau_einmal_gemeldet(self):
        konflikte = finde_konflikte(
            BAUSTEINE, ["werkzeug-websuche", "wissen-nur-freigegebene-quellen"])
        self.assertEqual(len(konflikte), 1)
        paar = {konflikte[0]["von"], konflikte[0]["zu"]}
        self.assertEqual(paar, {"werkzeug-websuche", "wissen-nur-freigegebene-quellen"})

    def test_keine_konflikte_im_mag_profil(self):
        mag = ["antwortstil-quellenpflicht", "leitplanke-keine-rechtsberatung",
               "rolle-rechercheassistent", "werkzeug-websuche"]
        self.assertEqual(finde_konflikte(BAUSTEINE, mag), [])


class TestAuswahlRoute(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_pruefen_liefert_huelle_und_konflikte(self):
        antwort = self.client.post("/api/auswahl/pruefen", json={
            "bausteine": ["antwortstil-quellenpflicht",
                          "wissen-nur-freigegebene-quellen"]})
        self.assertEqual(antwort.status_code, 200)
        daten = antwort.json()
        self.assertIn("werkzeug-websuche", daten["bausteine"])
        self.assertEqual(len(daten["konflikte"]), 1)

    def test_unbekannter_baustein_400(self):
        antwort = self.client.post("/api/auswahl/pruefen",
                                   json={"bausteine": ["gibt-es-nicht"]})
        self.assertEqual(antwort.status_code, 400)


if __name__ == "__main__":
    unittest.main()
