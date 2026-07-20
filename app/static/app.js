/* Netzwerkansicht (AP5c, E15): Cytoscape.js rendert den Katalog-Graphen.
   Fachliche Vorgaben aus docs/konzept/04-bedienkonzept.md. */
var EBENEN_FARBEN = {
  identitaet: "#2563eb",
  verhalten: "#16a34a",
  wissen: "#ca8a04",
  werkzeuge: "#ea580c",
  leitplanken: "#dc2626"
};

var zustand = { cy: null, kanten: [], auswahl: [], konflikte: [],
                graphBereit: false };

function setzeAuswahl(bausteine, konflikte) {
  zustand.auswahl = bausteine;
  zustand.konflikte = konflikte;
  if (zustand.cy) { zeichneZustand(); }
  var anzeige = document.getElementById("auswahl-anzeige");
  anzeige.textContent = bausteine.length
    ? "Aktuelle Auswahl: " + bausteine.join(", ")
    : "Noch kein Baustein ausgewählt.";
  zeigeKonflikte();
  document.dispatchEvent(new CustomEvent("auswahl-geaendert"));
}

function zeigeKonflikte() {
  var bereich = document.getElementById("konflikt-bereich");
  var text = document.getElementById("konflikt-text");
  if (!zustand.konflikte.length) {
    bereich.hidden = true;
    text.textContent = "";
    return;
  }
  var paare = zustand.konflikte.map(function (k) {
    return k.von + " ↔ " + k.zu;
  });
  text.textContent = "⚠ Konflikt: " + paare.join("; ") +
    " — diese Bausteine schließen sich laut Katalog gegenseitig" +
    " aus. Bitte einen der beiden abwählen; mit ungelöstem" +
    " Konflikt ist kein Export möglich.";
  bereich.hidden = false;
}

function zeigeFehler(text) {
  var bereich = document.getElementById("fehler-bereich");
  var textfeld = document.getElementById("fehler-text");
  textfeld.textContent = text;
  bereich.hidden = false;
}

function verbergeFehler() {
  document.getElementById("fehler-bereich").hidden = true;
}

function zeichneZustand() {
  var gewaehlt = {};
  zustand.auswahl.forEach(function (id) { gewaehlt[id] = true; });
  zustand.cy.nodes().forEach(function (knoten) {
    knoten.toggleClass("gewaehlt", Boolean(gewaehlt[knoten.id()]));
  });
  zustand.cy.edges().forEach(function (kante) {
    var aktiv = kante.data("typ") === "kollidiert" &&
      gewaehlt[kante.data("source")] && gewaehlt[kante.data("target")];
    kante.toggleClass("konflikt", Boolean(aktiv));
  });
}

function abhaengigeVon(id) {
  /* Alle gewaehlten Bausteine, die transitiv ueber benoetigt an id haengen. */
  var gewaehlt = {};
  zustand.auswahl.forEach(function (b) { gewaehlt[b] = true; });
  var betroffen = {};
  betroffen[id] = true;
  var geaendert = true;
  while (geaendert) {
    geaendert = false;
    zustand.kanten.forEach(function (kante) {
      if (kante.typ === "benoetigt" && betroffen[kante.zu] &&
          gewaehlt[kante.von] && !betroffen[kante.von]) {
        betroffen[kante.von] = true;
        geaendert = true;
      }
    });
  }
  delete betroffen[id];
  return Object.keys(betroffen).sort();
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
      verbergeFehler();
      setzeAuswahl(daten.bausteine, daten.konflikte);
    })
    .catch(function () {
      zeigeFehler("Die Auswahl konnte nicht geprüft werden. Bitte laden Sie" +
        " die Seite neu und prüfen Sie, ob der Server noch läuft.");
    });
}

function knotenGeklickt(id) {
  var hinweis = document.getElementById("hinweis-bereich");
  if (!hinweis.hidden) { return; }
  if (zustand.auswahl.indexOf(id) === -1) {
    pruefeUndSetze(zustand.auswahl.concat([id]));
    return;
  }
  var abhaengige = abhaengigeVon(id);
  if (!abhaengige.length) {
    pruefeUndSetze(zustand.auswahl.filter(function (b) { return b !== id; }));
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
  abhaengigeVon(id).forEach(function (b) { raus[b] = true; });
  hinweis.hidden = true;
  pruefeUndSetze(zustand.auswahl.filter(function (b) { return !raus[b]; }));
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
      verbergeFehler();
      zustand.kanten = graph.kanten;
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
      zustand.cy = cytoscape({
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
      zustand.cy.on("tap", "node", function (ereignis) {
        knotenGeklickt(ereignis.target.id());
      });
      zustand.graphBereit = true;
      document.dispatchEvent(new CustomEvent("graph-bereit"));
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
      zeigeFehler("Der Netzwerk-Graph konnte nicht geladen werden. Bitte" +
        " laden Sie die Seite neu und prüfen Sie, ob der Server noch läuft.");
    });
}

document.getElementById("hinweis-bestaetigen")
  .addEventListener("click", hinweisBestaetigt);
document.getElementById("hinweis-abbrechen")
  .addEventListener("click", function () {
    document.getElementById("hinweis-bereich").hidden = true;
  });
starteGraph();
