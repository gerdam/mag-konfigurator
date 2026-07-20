/* Gefuehrter Dialog (AP5c): drei Fragen -> kuratierter Vorschlag.
   Fachliche Vorgaben aus docs/konzept/04-bedienkonzept.md. */
function zeichneFragen(fragen) {
  var behaelter = document.getElementById("dialog-fragen");
  fragen.forEach(function (frage) {
    var block = document.createElement("fieldset");
    var titel = document.createElement("legend");
    titel.textContent = frage.text;
    block.appendChild(titel);
    frage.optionen.forEach(function (option) {
      var zeile = document.createElement("label");
      var knopf = document.createElement("input");
      knopf.type = "radio";
      knopf.name = frage.id;
      knopf.value = option.id;
      if (option.verfuegbar === false) {
        knopf.disabled = true;
        zeile.className = "nicht-verfuegbar";
        zeile.title = option.hinweis || "";
      }
      zeile.appendChild(knopf);
      zeile.appendChild(document.createTextNode(" " + option.text));
      block.appendChild(zeile);
    });
    behaelter.appendChild(block);
  });
}

function dialogAuswerten() {
  var antworten = {};
  var fehlt = false;
  document.querySelectorAll("#dialog-fragen fieldset").forEach(function (block) {
    var gewaehlt = block.querySelector("input:checked");
    var name = block.querySelector("input").name;
    if (gewaehlt) { antworten[name] = gewaehlt.value; } else { fehlt = true; }
  });
  var ergebnis = document.getElementById("dialog-ergebnis");
  if (fehlt) {
    ergebnis.textContent = "Bitte alle drei Fragen beantworten.";
    return;
  }
  fetch("/api/dialog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(antworten)
  }).then(function (antwort) {
      if (!antwort.ok) {
        throw new Error("Dialog-Antwort " + antwort.status);
      }
      return antwort.json();
    })
    .then(function (daten) {
      Zustand.verbergeFehler("dialogfragen");
      ergebnis.textContent = "Kuratierter Vorschlag: " +
        daten.bausteine.join(", ") +
        " — prüfbar und veränderbar in der Netzwerkansicht.";
      Zustand.setzeAuswahl(daten.bausteine, daten.konflikte);
    })
    .catch(function () {
      ergebnis.textContent = "Der Vorschlag konnte nicht erstellt werden." +
        " Bitte prüfen Sie Ihre Antworten und versuchen Sie es erneut.";
    });
}

Zustand.wennBereit(["graph", "dialogfragen"], function () {
  document.getElementById("dialog-auswerten").disabled = false;
});

fetch("/api/dialog")
  .then(function (antwort) {
    if (!antwort.ok) {
      throw new Error("Fehlerantwort von /api/dialog (Status " +
        antwort.status + ")");
    }
    return antwort.json();
  })
  .then(function (fragen) {
    Zustand.verbergeFehler("dialogfragen");
    zeichneFragen(fragen);
    Zustand.meldeBereit("dialogfragen");
  })
  .catch(function () {
    Zustand.zeigeFehler("dialogfragen", "Die Dialog-Fragen konnten nicht geladen werden. Bitte" +
      " laden Sie die Seite neu und prüfen Sie, ob der Server noch läuft.");
  });
document.getElementById("dialog-auswerten")
  .addEventListener("click", dialogAuswerten);
