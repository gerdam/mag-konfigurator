import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from graph_export import exportiere

BAUSTEINE = {
    "a": {"name": "A", "ebene": "verhalten",
          "beziehungen": {"benoetigt": ["b"], "verstaerkt": [], "kollidiert": []}},
    "b": {"name": "B", "ebene": "wissen",
          "beziehungen": {"benoetigt": [], "verstaerkt": [], "kollidiert": []}},
}


class TestGraphExport(unittest.TestCase):
    def test_knoten_und_kanten_vollstaendig(self):
        graph = exportiere(BAUSTEINE)
        self.assertEqual({k["id"] for k in graph["knoten"]}, {"a", "b"})
        self.assertEqual(graph["kanten"], [{"von": "a", "zu": "b", "typ": "benoetigt"}])

    def test_jede_kante_hat_existierende_knoten(self):
        graph = exportiere(BAUSTEINE)
        ids = {k["id"] for k in graph["knoten"]}
        for kante in graph["kanten"]:
            self.assertIn(kante["von"], ids)
            self.assertIn(kante["zu"], ids)


if __name__ == "__main__":
    unittest.main()
