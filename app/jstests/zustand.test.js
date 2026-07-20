// Tests fuer app/static/zustand.js (E17). Laden per node:vm statt Import,
// weil zustand.js ein Browser-Skript ohne Modul-Syntax ist ("var Zustand =
// (function () { ... })();") und unveraendert bleiben soll. Jeder Test
// erzeugt sich per neuerZustand() eine frische Instanz -- Zustand haelt
// internen Zustand (Auswahl, Konflikte, Bereitschaft), Tests duerfen sich
// nicht gegenseitig beeinflussen.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { erzeugeDomStub } = require('./dom-stub');

const zustandPfad = path.join(__dirname, '..', 'static', 'zustand.js');
const zustandQuelltext = fs.readFileSync(zustandPfad, 'utf8');

function neuerZustand() {
  const kontext = erzeugeDomStub();
  vm.runInNewContext(zustandQuelltext, kontext);
  return kontext; // { document, CustomEvent, Zustand }
}

// 1. Kapselung

test('holeAuswahl gibt eine Kopie, keine Referenz', () => {
  const { Zustand } = neuerZustand();
  Zustand.setzeAuswahl(['baustein-a', 'baustein-b'], []);
  const auswahl = Zustand.holeAuswahl();
  auswahl.push('eingeschmuggelt');
  assert.deepEqual(Zustand.holeAuswahl(), ['baustein-a', 'baustein-b']);
});

test('holeKonflikte gibt eine Kopie, keine Referenz', () => {
  const { Zustand } = neuerZustand();
  const konflikt = { von: 'baustein-a', zu: 'baustein-b' };
  Zustand.setzeAuswahl(['baustein-a', 'baustein-b'], [konflikt]);
  const konflikte = Zustand.holeKonflikte();
  konflikte.push({ von: 'x', zu: 'y' });
  assert.equal(Zustand.holeKonflikte().length, 1);
  assert.deepEqual(Zustand.holeKonflikte()[0], konflikt);
});

// 2. setzeAuswahl

test('setzeAuswahl aktualisiert die Anzeige bei gefuellter Auswahl', () => {
  const { Zustand, document } = neuerZustand();
  Zustand.setzeAuswahl(['baustein-a', 'baustein-b'], []);
  assert.equal(
    document.getElementById('auswahl-anzeige').textContent,
    'Aktuelle Auswahl: baustein-a, baustein-b'
  );
});

test('setzeAuswahl aktualisiert die Anzeige bei leerer Auswahl', () => {
  const { Zustand, document } = neuerZustand();
  Zustand.setzeAuswahl([], []);
  assert.equal(
    document.getElementById('auswahl-anzeige').textContent,
    'Noch kein Baustein ausgewählt.'
  );
});

test('setzeAuswahl feuert auswahl-geaendert genau einmal mit korrektem detail', () => {
  const { Zustand, document } = neuerZustand();
  let aufrufe = 0;
  let empfangenesDetail = null;
  document.addEventListener('auswahl-geaendert', (event) => {
    aufrufe += 1;
    empfangenesDetail = event.detail;
  });
  const konflikt = { von: 'baustein-a', zu: 'baustein-b' };
  Zustand.setzeAuswahl(['baustein-a', 'baustein-b'], [konflikt]);
  assert.equal(aufrufe, 1);
  assert.deepEqual(empfangenesDetail.auswahl, ['baustein-a', 'baustein-b']);
  assert.deepEqual(empfangenesDetail.konflikte, [konflikt]);
});

// 3. Konfliktanzeige

test('ohne Konflikte bleibt der Konflikt-Bereich versteckt und der Text leer', () => {
  const { Zustand, document } = neuerZustand();
  Zustand.setzeAuswahl(['baustein-a'], []);
  assert.equal(document.getElementById('konflikt-bereich').hidden, true);
  assert.equal(document.getElementById('konflikt-text').textContent, '');
});

test('mit Konflikten wird der Bereich sichtbar und der Text nennt beide Bausteine', () => {
  const { Zustand, document } = neuerZustand();
  Zustand.setzeAuswahl(
    ['baustein-a', 'baustein-b'],
    [{ von: 'baustein-a', zu: 'baustein-b' }]
  );
  const bereich = document.getElementById('konflikt-bereich');
  const text = document.getElementById('konflikt-text');
  assert.equal(bereich.hidden, false);
  assert.match(text.textContent, /baustein-a/);
  assert.match(text.textContent, /baustein-b/);
});

// 4. Die Bereitschafts-Naht

test('wennBereit ruft die Funktion nicht auf, solange nur eine Komponente bereit ist', () => {
  const { Zustand } = neuerZustand();
  let aufrufe = 0;
  Zustand.wennBereit(['graph', 'dialogfragen'], () => { aufrufe += 1; });
  Zustand.meldeBereit('graph');
  assert.equal(aufrufe, 0);
});

test('wennBereit ruft die Funktion auf, sobald beide bereit sind (graph zuerst)', () => {
  const { Zustand } = neuerZustand();
  let aufrufe = 0;
  Zustand.wennBereit(['graph', 'dialogfragen'], () => { aufrufe += 1; });
  Zustand.meldeBereit('graph');
  Zustand.meldeBereit('dialogfragen');
  assert.equal(aufrufe, 1);
});

test('wennBereit ruft die Funktion auf, sobald beide bereit sind (dialogfragen zuerst)', () => {
  const { Zustand } = neuerZustand();
  let aufrufe = 0;
  Zustand.wennBereit(['graph', 'dialogfragen'], () => { aufrufe += 1; });
  Zustand.meldeBereit('dialogfragen');
  Zustand.meldeBereit('graph');
  assert.equal(aufrufe, 1);
});

test('wennBereit ruft die Funktion genau einmal auf, auch bei weiteren Meldungen danach', () => {
  const { Zustand } = neuerZustand();
  let aufrufe = 0;
  Zustand.wennBereit(['graph', 'dialogfragen'], () => { aufrufe += 1; });
  Zustand.meldeBereit('graph');
  Zustand.meldeBereit('dialogfragen');
  Zustand.meldeBereit('graph');
  Zustand.meldeBereit('sonstwas');
  assert.equal(aufrufe, 1);
});

test('wennBereit ruft die Funktion sofort auf, wenn beide schon bereit sind', () => {
  const { Zustand } = neuerZustand();
  Zustand.meldeBereit('graph');
  Zustand.meldeBereit('dialogfragen');
  let aufrufe = 0;
  Zustand.wennBereit(['graph', 'dialogfragen'], () => { aufrufe += 1; });
  assert.equal(aufrufe, 1);
});

test('meldeBereit feuert bei doppelter Meldung desselben Namens kein zweites Ereignis', () => {
  const { Zustand, document } = neuerZustand();
  let aufrufe = 0;
  document.addEventListener('bereit-geaendert', () => { aufrufe += 1; });
  Zustand.meldeBereit('graph');
  Zustand.meldeBereit('graph');
  assert.equal(aufrufe, 1);
});

test('realer Fehlerfall: nur dialogfragen meldet sich, graph nie - fn laeuft nie', () => {
  const { Zustand } = neuerZustand();
  let aufrufe = 0;
  Zustand.wennBereit(['graph', 'dialogfragen'], () => { aufrufe += 1; });
  Zustand.meldeBereit('dialogfragen');
  assert.equal(aufrufe, 0);
});

// 5. Fehleranzeige

test('zeigeFehler setzt den Text und macht den Bereich sichtbar', () => {
  const { Zustand, document } = neuerZustand();
  Zustand.zeigeFehler('graph', 'Etwas ist schiefgelaufen.');
  assert.equal(
    document.getElementById('fehler-text').textContent,
    'Etwas ist schiefgelaufen.'
  );
  assert.equal(document.getElementById('fehler-bereich').hidden, false);
});

test('verbergeFehler versteckt den Fehler-Bereich wieder, wenn keine Quelle mehr aktiv ist', () => {
  const { Zustand, document } = neuerZustand();
  Zustand.zeigeFehler('graph', 'Fehler');
  Zustand.verbergeFehler('graph');
  assert.equal(document.getElementById('fehler-bereich').hidden, true);
});

test('zwei Quellen gleichzeitig aktiv zeigen beide Texte', () => {
  const { Zustand, document } = neuerZustand();
  Zustand.zeigeFehler('graph', 'Graph-Fehler.');
  Zustand.zeigeFehler('dialogfragen', 'Dialog-Fehler.');
  const text = document.getElementById('fehler-text').textContent;
  assert.match(text, /Graph-Fehler\./);
  assert.match(text, /Dialog-Fehler\./);
  assert.equal(document.getElementById('fehler-bereich').hidden, false);
});

test('eine Quelle verbergen laesst die andere sichtbar und den Bereich sichtbar', () => {
  const { Zustand, document } = neuerZustand();
  Zustand.zeigeFehler('graph', 'Graph-Fehler.');
  Zustand.zeigeFehler('dialogfragen', 'Dialog-Fehler.');
  Zustand.verbergeFehler('graph');
  const text = document.getElementById('fehler-text').textContent;
  assert.doesNotMatch(text, /Graph-Fehler\./);
  assert.match(text, /Dialog-Fehler\./);
  assert.equal(document.getElementById('fehler-bereich').hidden, false);
});

test('die letzte aktive Quelle verbergen versteckt den Bereich wieder', () => {
  const { Zustand, document } = neuerZustand();
  Zustand.zeigeFehler('graph', 'Graph-Fehler.');
  Zustand.zeigeFehler('dialogfragen', 'Dialog-Fehler.');
  Zustand.verbergeFehler('graph');
  Zustand.verbergeFehler('dialogfragen');
  assert.equal(document.getElementById('fehler-bereich').hidden, true);
  assert.equal(document.getElementById('fehler-text').textContent, '');
});

test('dieselbe Quelle zweimal zeigen ersetzt die Meldung statt sie zu sammeln', () => {
  const { Zustand, document } = neuerZustand();
  Zustand.zeigeFehler('graph', 'Erster Fehler.');
  Zustand.zeigeFehler('graph', 'Zweiter Fehler.');
  assert.equal(
    document.getElementById('fehler-text').textContent,
    'Zweiter Fehler.'
  );
});
