/* Export-Schritt (AP5c): adapter_status zuerst anzeigen, dann Artefakt. */
var STATUS_SYMBOLE = { supported: "✓", degraded: "⚠",
                       unsupported: "✗" };

function exportAnfragen(oberflaeche) {
  var status = document.getElementById("export-status");
  var dateien = document.getElementById("export-dateien");
  status.textContent = "";
  dateien.textContent = "";
  fetch("/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bausteine: zustand.auswahl,
                           oberflaeche: oberflaeche })
  }).then(function (antwort) {
      return antwort.json().then(function (daten) {
        return { ok: antwort.ok, daten: daten };
      });
    })
    .then(function (ergebnis) {
      if (!ergebnis.ok) {
        status.textContent = ergebnis.daten.detail ||
          "Export nicht möglich.";
        return;
      }
      var liste = document.createElement("ul");
      ergebnis.daten.status.forEach(function (zeile) {
        var punkt = document.createElement("li");
        punkt.textContent = STATUS_SYMBOLE[zeile.adapter_status] + " " +
          zeile.baustein + " (" + zeile.adapter_status + "): " +
          zeile.umsetzung;
        liste.appendChild(punkt);
      });
      status.appendChild(liste);
      var knopf = document.createElement("button");
      knopf.type = "button";
      knopf.textContent = "Artefakt für Profil '" +
        ergebnis.daten.profil + "' anzeigen";
      knopf.addEventListener("click", function () {
        Object.keys(ergebnis.daten.dateien).forEach(function (name) {
          var titel = document.createElement("h3");
          titel.textContent = name;
          var block = document.createElement("pre");
          block.textContent = ergebnis.daten.dateien[name];
          dateien.appendChild(titel);
          dateien.appendChild(block);
        });
        knopf.remove();
      });
      status.appendChild(knopf);
    })
    .catch(function () {
      status.textContent = "Der Export konnte nicht abgerufen werden." +
        " Bitte prüfen Sie Ihre Auswahl und versuchen Sie es erneut.";
    });
}

document.querySelectorAll("#export-bereich button[data-oberflaeche]")
  .forEach(function (knopf) {
    knopf.addEventListener("click", function () {
      exportAnfragen(knopf.dataset.oberflaeche);
    });
  });
document.addEventListener("auswahl-geaendert", function () {
  var gesperrt = zustand.konflikte.length > 0 || zustand.auswahl.length === 0;
  document.querySelectorAll("#export-bereich button[data-oberflaeche]")
    .forEach(function (knopf) { knopf.disabled = gesperrt; });
});
