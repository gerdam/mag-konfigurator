/* Geteilter Zustand (Refactoring nach AP5-Abschlussreview): Auswahl,
   Konflikte, Bereitschaftsmeldungen und Fehleranzeige. Kennt kein
   Cytoscape -- die Graph-Instanz und das Zeichnen bleiben dateilokal
   in app.js. Wird als erstes Skript geladen, damit app.js, dialog.js
   und export.js beim eigenen Laden bereits darauf zugreifen koennen. */
var Zustand = (function () {
  var auswahl = [];
  var konflikte = [];
  var bereitschaft = {};

  function zeigeKonflikte() {
    var bereich = document.getElementById("konflikt-bereich");
    var text = document.getElementById("konflikt-text");
    if (!konflikte.length) {
      bereich.hidden = true;
      text.textContent = "";
      return;
    }
    var paare = konflikte.map(function (k) {
      return k.von + " ↔ " + k.zu;
    });
    text.textContent = "⚠ Konflikt: " + paare.join("; ") +
      " — diese Bausteine schließen sich laut Katalog gegenseitig" +
      " aus. Bitte einen der beiden abwählen; mit ungelöstem" +
      " Konflikt ist kein Export möglich.";
    bereich.hidden = false;
  }

  function alleBereit(namen) {
    return namen.every(function (name) { return Boolean(bereitschaft[name]); });
  }

  return {
    holeAuswahl: function () {
      return auswahl.slice();
    },
    holeKonflikte: function () {
      return konflikte.slice();
    },
    setzeAuswahl: function (bausteine, konflikteNeu) {
      auswahl = bausteine;
      konflikte = konflikteNeu;
      var anzeige = document.getElementById("auswahl-anzeige");
      anzeige.textContent = bausteine.length
        ? "Aktuelle Auswahl: " + bausteine.join(", ")
        : "Noch kein Baustein ausgewählt.";
      zeigeKonflikte();
      document.dispatchEvent(new CustomEvent("auswahl-geaendert", {
        detail: { auswahl: auswahl.slice(), konflikte: konflikte.slice() }
      }));
    },
    meldeBereit: function (name) {
      if (bereitschaft[name]) { return; }
      bereitschaft[name] = true;
      document.dispatchEvent(new CustomEvent("bereit-geaendert", {
        detail: { name: name }
      }));
    },
    istBereit: function (name) {
      return Boolean(bereitschaft[name]);
    },
    wennBereit: function (namen, funktion) {
      /* Ruft funktion genau einmal auf, sobald alle genannten
         Komponenten gemeldet haben -- reihenfolgeunabhaengig, ohne
         Polling und ohne Timer. */
      function pruefen() {
        if (alleBereit(namen)) {
          document.removeEventListener("bereit-geaendert", pruefen);
          funktion();
        }
      }
      if (alleBereit(namen)) {
        funktion();
      } else {
        document.addEventListener("bereit-geaendert", pruefen);
      }
    },
    zeigeFehler: function (text) {
      var bereich = document.getElementById("fehler-bereich");
      var textfeld = document.getElementById("fehler-text");
      textfeld.textContent = text;
      bereich.hidden = false;
    },
    verbergeFehler: function () {
      document.getElementById("fehler-bereich").hidden = true;
    }
  };
})();
