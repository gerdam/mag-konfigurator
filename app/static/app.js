/* Netzwerkansicht (AP5c, E15): Cytoscape.js rendert den Katalog-Graphen.
   Fachliche Vorgaben aus docs/konzept/04-bedienkonzept.md.
   cy und kanten sind Rendering-Details und bleiben dateilokal (IIFE) --
   geteilt wird nur ueber die Zustand-Schnittstelle aus zustand.js. */
(function () {
  var EBENEN_FARBEN = {
    identitaet: "#2563eb",
    verhalten: "#16a34a",
    wissen: "#ca8a04",
    werkzeuge: "#ea580c",
    leitplanken: "#dc2626"
  };

  var cy = null;
  var kanten = [];

  function zeichneZustand() {
    if (!cy) { return; }
    var gewaehlt = {};
    Zustand.holeAuswahl().forEach(function (id) { gewaehlt[id] = true; });
    cy.nodes().forEach(function (knoten) {
      knoten.toggleClass("gewaehlt", Boolean(gewaehlt[knoten.id()]));
    });
    cy.edges().forEach(function (kante) {
      var aktiv = kante.data("typ") === "kollidiert" &&
        gewaehlt[kante.data("source")] && gewaehlt[kante.data("target")];
      kante.toggleClass("konflikt", Boolean(aktiv));
    });
  }

  function pruefeUndSetze(bausteine) {
    return fetch("/api/auswahl/pruefen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bausteine: bausteine })
    }).then(function (antwort) {
        if (!antwort.ok) {
          throw new Error("Fehlerantwort von /api/auswahl/pruefen (Status " +
            antwort.status + ")");
        }
        return antwort.json();
      })
      .then(function (daten) {
        Zustand.verbergeFehler("graph");
        Zustand.setzeAuswahl(daten.bausteine, daten.konflikte);
      })
      .catch(function () {
        Zustand.zeigeFehler("graph", "Die Auswahl konnte nicht geprüft werden. Bitte laden Sie" +
          " die Seite neu und prüfen Sie, ob der Server noch läuft.");
      });
  }

  function knotenGeklickt(id) {
    var hinweis = document.getElementById("hinweis-bereich");
    if (!hinweis.hidden) { return; }
    var auswahl = Zustand.holeAuswahl();
    if (auswahl.indexOf(id) === -1) {
      pruefeUndSetze(auswahl.concat([id]));
      return;
    }
    var abhaengige = Graphlogik.abhaengigeVon(id, kanten, auswahl);
    if (!abhaengige.length) {
      pruefeUndSetze(auswahl.filter(function (b) { return b !== id; }));
      return;
    }
    document.getElementById("hinweis-text").textContent =
      "Abwahl von '" + id + "' entfernt auch die abhängigen Bausteine: " +
      abhaengige.join(", ") + ".";
    hinweis.hidden = false;
    hinweis.dataset.id = id;
  }

  function hinweisBestaetigt() {
    var hinweis = document.getElementById("hinweis-bereich");
    var id = hinweis.dataset.id;
    var raus = {};
    raus[id] = true;
    Graphlogik.abhaengigeVon(id, kanten, Zustand.holeAuswahl())
      .forEach(function (b) { raus[b] = true; });
    hinweis.hidden = true;
    pruefeUndSetze(Zustand.holeAuswahl().filter(function (b) { return !raus[b]; }));
  }

  function starteGraph() {
    fetch("/api/graph")
      .then(function (antwort) {
        if (!antwort.ok) {
          throw new Error("Fehlerantwort von /api/graph (Status " +
            antwort.status + ")");
        }
        return antwort.json();
      })
      .then(function (graph) {
        Zustand.verbergeFehler("graph");
        kanten = graph.kanten;
        var elemente = graph.knoten.map(function (k) {
          return { data: { id: k.id, name: k.name, ebene: k.ebene } };
        });
        var gesehen = {};
        graph.kanten.forEach(function (kante, i) {
          if (kante.typ === "kollidiert") {
            var schluessel = [kante.von, kante.zu].sort().join("|");
            if (gesehen[schluessel]) { return; }
            gesehen[schluessel] = true;
          }
          elemente.push({ data: { id: "kante-" + i, source: kante.von,
                                  target: kante.zu, typ: kante.typ } });
        });
        cy = cytoscape({
          container: document.getElementById("cy"),
          elements: elemente,
          layout: { name: "cose", animate: false },
          style: [
            { selector: "node", style: {
                label: "data(name)", "font-size": "11px",
                "text-wrap": "wrap", "text-max-width": "120px",
                "text-valign": "bottom", "text-margin-y": "6px",
                width: "34px", height: "34px", opacity: 0.35,
                "background-color": function (ele) {
                  return EBENEN_FARBEN[ele.data("ebene")] || "#6b7280";
                } } },
            { selector: "node.gewaehlt", style: { opacity: 1 } },
            { selector: "edge", style: { "curve-style": "bezier", width: 2 } },
            { selector: "edge[typ = 'benoetigt']", style: {
                "line-color": "#374151",
                "target-arrow-shape": "triangle",
                "target-arrow-color": "#374151" } },
            { selector: "edge[typ = 'verstaerkt']", style: {
                "line-style": "dashed", "line-color": "#94a3b8" } },
            { selector: "edge[typ = 'kollidiert']", style: {
                "line-color": "#fca5a5" } },
            { selector: "edge.konflikt", style: {
                "line-color": "#dc2626", width: 5,
                label: "⚠", "font-size": "18px" } }
          ]
        });
        cy.on("tap", "node", function (ereignis) {
          knotenGeklickt(ereignis.target.id());
        });
        Zustand.meldeBereit("graph");
        return fetch("/api/profil/mag-rechercheassistenz");
      })
      .then(function (antwort) {
        if (!antwort.ok) {
          throw new Error("Fehlerantwort von /api/profil/mag-rechercheassistenz" +
            " (Status " + antwort.status + ")");
        }
        return antwort.json();
      })
      .then(function (profil) { return pruefeUndSetze(profil.bausteine); })
      .catch(function () {
        Zustand.zeigeFehler("graph", "Der Netzwerk-Graph konnte nicht geladen werden. Bitte" +
          " laden Sie die Seite neu und prüfen Sie, ob der Server noch läuft.");
      });
  }

  document.addEventListener("auswahl-geaendert", zeichneZustand);

  document.getElementById("hinweis-bestaetigen")
    .addEventListener("click", hinweisBestaetigt);
  document.getElementById("hinweis-abbrechen")
    .addEventListener("click", function () {
      document.getElementById("hinweis-bereich").hidden = true;
    });
  starteGraph();
})();
