"""Auswahl-Logik (AP5b): Pflichtnachzug (benoetigt) und Konflikte (kollidiert).

Fachliche Regeln aus docs/konzept/04-bedienkonzept.md, Abschnitt
"Zu-/Abwahl und Konflikt-Warnung".
"""


def mit_pflichtnachzug(bausteine, auswahl):
    """Ergaenzt die Auswahl um die transitive benoetigt-Huelle, sortiert."""
    ergebnis = set(auswahl)
    offen = list(auswahl)
    while offen:
        bid = offen.pop()
        for ziel in (bausteine[bid].get("beziehungen") or {}).get("benoetigt") or []:
            if ziel not in ergebnis:
                ergebnis.add(ziel)
                offen.append(ziel)
    return sorted(ergebnis)


def finde_konflikte(bausteine, auswahl):
    """Liefert kollidiert-Paare innerhalb der Auswahl, je Paar genau einmal."""
    auswahl_set = set(auswahl)
    gesehen = set()
    konflikte = []
    for bid in sorted(auswahl_set):
        for ziel in (bausteine[bid].get("beziehungen") or {}).get("kollidiert") or []:
            paar = frozenset((bid, ziel))
            if ziel in auswahl_set and paar not in gesehen:
                gesehen.add(paar)
                konflikte.append({"von": bid, "zu": ziel})
    return konflikte
