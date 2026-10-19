import test from 'node:test';
import assert from 'node:assert/strict';
import { convertText, resolveSeparator, countWords } from '../src/converter.ts';

test('resolveSeparator handles standard and custom separators', () => {
  assert.equal(resolveSeparator(' '), ' ');
  assert.equal(resolveSeparator(', '), ', ');
  assert.equal(resolveSeparator('__otro', ' | '), ' | ');
  assert.equal(resolveSeparator('__otro', ''), '');
});

test('countWords accurately counts words', () => {
  assert.equal(countWords(''), 0);
  assert.equal(countWords('   '), 0);
  assert.equal(countWords('hola mundo'), 2);
  assert.equal(countWords('  uno   dos tres  '), 3);
});

test('convertText with default options (sin separador, quita vacías)', () => {
  const input = `línea 1
línea 2

línea 3`;

  const res = convertText(input, {
    separator: '',
    removeSpaces: false,
    trimLines: true,
    ignoreEmptyLines: true,
  });

  assert.equal(res.text, 'línea 1línea 2línea 3');
  assert.equal(res.stats.inputLines, 4);
  assert.equal(res.stats.outputChars, 'línea 1línea 2línea 3'.length);
});

test('convertText with comma separator and space removal', () => {
  const input = `manzana
pera
plátano`;

  const res = convertText(input, {
    separator: ', ',
    removeSpaces: false,
    trimLines: true,
    ignoreEmptyLines: true,
  });

  assert.equal(res.text, 'manzana, pera, plátano');
  assert.equal(res.stats.outputWords, 3);
});

test('convertText with removeSpaces true', () => {
  const input = `a b c
d e f`;

  const res = convertText(input, {
    separator: '',
    removeSpaces: true,
    trimLines: true,
    ignoreEmptyLines: true,
  });

  assert.equal(res.text, 'abcdef');
});

test('convertText handles Windows CR-LF line breaks', () => {
  const input = "primero\r\nsegundo\r\ntercero";

  const res = convertText(input, {
    separator: ' - ',
    removeSpaces: false,
    trimLines: true,
    ignoreEmptyLines: true,
  });

  assert.equal(res.text, 'primero - segundo - tercero');
});
