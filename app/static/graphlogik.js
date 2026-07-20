/* Reine Graphlogik (Review-Befund nach AP5c): abhaengigeVon berechnet per
   Fixpunkt-Iteration die transitive Huelle ueber benoetigt-Kanten. Kennt
   weder DOM noch Cytoscape -- kanten und auswahl kommen als Parameter,
   damit die Funktion ohne Kontext testbar ist. Wird vor app.js geladen,
   das die Funktion mit seinen eigenen kanten/Zustand.holeAuswahl()-Werten
   aufruft. */
var Graphlogik = (function () {
  return {
    abhaengigeVon: function (id, kanten, auswahl) {
      /* Alle gewaehlten Bausteine, die transitiv ueber benoetigt an id
         haengen -- sortierte Liste ohne id selbst. */
      var gewaehlt = {};
      auswahl.forEach(function (b) { gewaehlt[b] = true; });
      var betroffen = {};
      betroffen[id] = true;
      var geaendert = true;
      while (geaendert) {
        geaendert = false;
        kanten.forEach(function (kante) {
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
  };
})();
