#!/usr/bin/env node
/**
 * Uzbek Latin → Cyrillic. Reads uzL.ts, converts string values, writes uzC.ts.
 * Run from repo root: node frontend/scripts/lat2cyr-uz.js
 */
const fs = require('fs');
const path = require('path');

const LAT = `abdefghijklmnopqrstuvxyzABDEFGHIJKLMNOPQRSTUVXYZo'g'O'G'chChCHshShSHngNG`;
const CYR = `абдефғижклмнопқрстувхйзАБДЕФҒИЖКЛМНОПҚРСТУВХЙЗўғЎҒчЧЧшШШнгНГ`;

const map = {};
for (let i = 0; i < LAT.length; i++) map[LAT[i]] = (CYR[i] || LAT[i]);

// multi-char (order matters)
const multi = [
  ["o'", 'ў'], ["O'", 'Ў'], ["g'", 'ғ'], ["G'", 'Ғ'],
  ['ch', 'ч'], ['Ch', 'Ч'], ['CH', 'Ч'], ['sh', 'ш'], ['Sh', 'Ш'], ['SH', 'Ш'],
  ['ng', 'нг'], ['Ng', 'Нг'], ['NG', 'НГ']
];

function lat2cyr(s) {
  let out = '';
  let i = 0;
  while (i < s.length) {
    let found = false;
    for (const [lat, cyr] of multi) {
      if (s.slice(i, i + lat.length) === lat) {
        out += cyr;
        i += lat.length;
        found = true;
        break;
      }
    }
    if (!found) {
      out += map[s[i]] || s[i];
      i++;
    }
  }
  return out;
}

const src = path.join(__dirname, '../src/i18n/locales/uzL.ts');
const out = path.join(__dirname, '../src/i18n/locales/uzC.ts');
let content = fs.readFileSync(src, 'utf8');

content = content.replace(/export const uzL: TranslationSet = \{/, 'export const uzC: TranslationSet = {');

// Convert each line like "  key: 'value'," or "  key: 'value'"
content = content.replace(/^(\s+)(\w+):\s*'([^']*(?:\\'[^']*)*)'\s*,?\s*$/gm, (_, indent, key, val) => {
  const raw = val.replace(/\\'/g, "'");
  const converted = lat2cyr(raw);
  const escaped = converted.replace(/'/g, "\\'");
  return `${indent}${key}: '${escaped}',`;
});

fs.writeFileSync(out, content, 'utf8');
console.log('Written:', out);
