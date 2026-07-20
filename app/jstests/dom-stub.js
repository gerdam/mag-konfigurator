// Minimaler DOM-Stub fuer node:vm-Tests von app/static/zustand.js.
// Deckt genau das ab, was zustand.js tatsaechlich braucht -- nicht mehr:
// document.getElementById, document.addEventListener/removeEventListener/
// dispatchEvent sowie CustomEvent mit detail. Kein echtes DOM, kein jsdom.
'use strict';

function erzeugeDomStub() {
  const elemente = {};
  const listenerNachTyp = {};

  function holeElement(id) {
    if (!elemente[id]) {
      elemente[id] = { id: id, textContent: '', hidden: false };
    }
    return elemente[id];
  }

  const document = {
    getElementById: function (id) {
      return holeElement(id);
    },
    addEventListener: function (typ, handler) {
      if (!listenerNachTyp[typ]) {
        listenerNachTyp[typ] = [];
      }
      listenerNachTyp[typ].push(handler);
    },
    removeEventListener: function (typ, handler) {
      const liste = listenerNachTyp[typ];
      if (!liste) { return; }
      const index = liste.indexOf(handler);
      if (index !== -1) { liste.splice(index, 1); }
    },
    dispatchEvent: function (event) {
      // Kopie der Liste, damit sich ein Handler waehrend des Aufrufs
      // selbst entfernen darf (genau das macht wennBereit).
      const liste = (listenerNachTyp[event.type] || []).slice();
      liste.forEach(function (handler) { handler(event); });
      return true;
    }
  };

  function CustomEvent(typ, optionen) {
    this.type = typ;
    this.detail = optionen ? optionen.detail : undefined;
  }

  return { document: document, CustomEvent: CustomEvent };
}

module.exports = { erzeugeDomStub: erzeugeDomStub };
