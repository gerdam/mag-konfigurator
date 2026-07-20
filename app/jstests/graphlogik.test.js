// Tests fuer app/static/graphlogik.js (Review-Befund nach AP5c: ehemals
// abhaengigeVon dateilokal in app.js, jetzt eigenstaendiges Skript ohne
// DOM- oder Cytoscape-Kenntnis). Laden per node:vm statt Import, weil
// graphlogik.js ein Browser-Skript ohne Modul-Syntax ist ("var Graphlogik =
// (function () { ... })();"). Die Funktion braucht keinen DOM-Zugriff --
// kanten und auswahl kommen als Parameter, ein leerer vm-Kontext genuegt.
//
// abhaengigeVon() baut ihre Rueckgabe innerhalb des vm-Kontexts per
// Object.keys(...).sort() -- das Ergebnis ist ein Array aus der Realm des
// vm-Kontexts. assert.deepEqual (strict) vergleicht Arrays ueber Realm-
// Grenzen als "nicht gleich", obwohl der Inhalt identisch ist. Der Wrapper
// abhaengigeVon() unten normalisiert das Ergebnis per Array.from() auf die
// Realm dieser Testdatei, bevor verglichen wird.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const graphlogikPfad = path.join(__dirname, '..', 'static', 'graphlogik.js');
const graphlogikQuelltext = fs.readFileSync(graphlogikPfad, 'utf8');

function neuesGraphlogik() {
  const kontext = {};
  vm.runInNewContext(graphlogikQuelltext, kontext);
  return kontext.Graphlogik;
}

function abhaengigeVon(id, kanten, auswahl) {
  const Graphlogik = neuesGraphlogik();
  return Array.from(Graphlogik.abhaengigeVon(id, kanten, auswahl));
}

function kante(von, zu, typ) {
  return { von: von, zu: zu, typ: typ || 'benoetigt' };
}

test('Baustein ohne Abhaengige liefert eine leere Liste', () => {
  assert.deepEqual(abhaengigeVon('b', [], ['b']), []);
});

test('einfache Abhaengigkeit: antwortstil-quellenpflicht benoetigt werkzeug-websuche', () => {
  const kanten = [kante('antwortstil-quellenpflicht', 'werkzeug-websuche')];
  const auswahl = ['antwortstil-quellenpflicht', 'werkzeug-websuche'];
  assert.deepEqual(
    abhaengigeVon('werkzeug-websuche', kanten, auswahl),
    ['antwortstil-quellenpflicht']
  );
});

test('transitive Kette ueber mehrere Stufen: A benoetigt B, B benoetigt C', () => {
  const kanten = [kante('a', 'b'), kante('b', 'c')];
  const auswahl = ['a', 'b', 'c'];
  assert.deepEqual(abhaengigeVon('c', kanten, auswahl), ['a', 'b']);
});

test('nicht gewaehlte Bausteine tauchen nicht auf, auch mit passender Kante', () => {
  const kanten = [kante('a', 'b')]; // a benoetigt b, aber a ist nicht gewaehlt
  const auswahl = ['b'];
  assert.deepEqual(abhaengigeVon('b', kanten, auswahl), []);
});

test('Kanten anderer Typen loesen keine Abhaengigkeit aus', () => {
  const kanten = [kante('a', 'b', 'verstaerkt'), kante('c', 'b', 'kollidiert')];
  const auswahl = ['a', 'b', 'c'];
  assert.deepEqual(abhaengigeVon('b', kanten, auswahl), []);
});

test('die Ausgangs-ID selbst ist nie Teil der Rueckgabe', () => {
  const kanten = [kante('a', 'b')];
  const auswahl = ['a', 'b'];
  const ergebnis = abhaengigeVon('b', kanten, auswahl);
  assert.equal(ergebnis.indexOf('b'), -1);
});

test('ein Zyklus terminiert und liefert ein sinnvolles Ergebnis', () => {
  const kanten = [kante('a', 'b'), kante('b', 'a')];
  const auswahl = ['a', 'b'];
  assert.deepEqual(abhaengigeVon('a', kanten, auswahl), ['b']);
});
