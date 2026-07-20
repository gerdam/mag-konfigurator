"""Export-Schritt (AP5c, 04-bedienkonzept.md).

In dieser Ausbaustufe liefert der Export die real vorliegenden, kuratierten
Artefakte aus artefakte/<profil-id>/ fuer eine Auswahl, die exakt einem
gepflegten Profil entspricht. Generische Artefakt-Erzeugung fuer beliebige
Zusammenstellungen ist Roadmap-Phase 3 und bewusst nicht Teil von AP5.
"""
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]

ARTEFAKT_DATEIEN = {
    "claude-code": ["CLAUDE.md", "settings.json"],
    "claude-ai-projekte": ["system-prompt.md"],
    "api": ["api-parameter.json", "system-prompt.md"],
}


def finde_profil(profile, auswahl):
    """Liefert die Profil-id, deren Bausteinliste exakt der Auswahl entspricht."""
    for profil_id, daten in sorted(profile.items()):
        if sorted(daten.get("bausteine") or []) == sorted(auswahl):
            return profil_id
    return None


def status_matrix(bausteine, auswahl, oberflaeche):
    """adapter_status und umsetzung je gewaehltem Baustein (E6c)."""
    zeilen = []
    for bid in sorted(auswahl):
        mapping = (bausteine[bid].get("mappings") or {}).get(oberflaeche) or {}
        zeilen.append({"baustein": bid,
                       "adapter_status": mapping.get("adapter_status"),
                       "umsetzung": mapping.get("umsetzung")})
    return zeilen


def lade_artefakte(profil_id, oberflaeche):
    ordner = REPO / "artefakte" / profil_id
    return {name: (ordner / name).read_text(encoding="utf-8")
            for name in ARTEFAKT_DATEIEN[oberflaeche]}
