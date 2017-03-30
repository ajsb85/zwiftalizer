var test = require('tape');

import { cpuClass } from '../src/parser';

test('should extract CPU class details for core i7', assert => {
  const entry = 'PC / Intel Core i7-2600K @ 3.40GHz / Nvidia GeForce GTX 980 Ti/PCIe/SSE2';
  const expected = '2nd generation Intel Core family processor - Unlocked frequency multiplier';
  const actual = cpuClass(entry);
  console.log(actual);
  assert.equals(actual, expected);
  assert.end();
});

test('should get 1st gen core right', assert => {
  const entry = 'PC / Intel Core i7 840 @ 2.93GHz / Nvidia GeForce GTX 980 Ti/PCIe/SSE2';
  const expected = '1st generation Intel Core family processor';
  const actual = cpuClass(entry);
  console.log(actual);
  assert.equals(actual, expected);
  assert.end();
});

test('should recognise alienware alpha cpu', assert => {
  const entry = 'PC / Intel Core i3-4130T @ 2.90GHz / Nvidia GeForce GPU/PCIe/SSE2';
  const expected = '4th generation Intel Core family processor - Power-optimized lifestyle (Alienware Alpha or possibly IBM ThinkStation)';
  const actual = cpuClass(entry);
  console.log(actual);
  assert.equals(actual, expected);
  assert.end();
});

test('should recognise alienware alpha R2', assert => {
  const entry = 'PC / Intel Core i5-6400T @ 2.20GHz / ATi AMD Radeon R9 M470X';
  const expected = '6th generation Intel Core family processor - Power-optimized lifestyle (Alienware Alpha or possibly IBM ThinkStation)';
  const actual = cpuClass(entry);
  console.log(actual);
  assert.equals(actual, expected);
  assert.end();
});

test('should recognize 20th anniversary pentium', assert => {
  const entry = 'PC / Intel Pentium G3258 @ 4.20GHz / Nvidia GeForce GTX 970/PCIe/SSE2';
  const expected = '4th generation (Haswell) unlocked Intel Pentium family processor';
  const actual = cpuClass(entry);
  console.log(actual);
  assert.equals(actual, expected);
  assert.end();
});

test('should recognize Pentium Dual-Core', assert => {
  const entry = 'PC / Pentium Dual-Core E5700 @ 3.00GHz / ATi AMD Radeon HD 7900 Series';
  const expected = 'Unknown generation Intel Dual-Core family processor';
  const actual = cpuClass(entry);
  console.log(actual);
  assert.equals(actual, expected);
  assert.end();
});

test('should be undefined for AMD', assert => {
  const entry = 'PC / AMD Athlon X4 845 Quad Core Processor / Nvidia GeForce GTX 950/PCIe/SSE2';
  const expected = undefined;
  const actual = cpuClass(entry);
  console.log(actual);
  assert.equals(actual, expected);
  assert.end();
});

test('should be undefined for core2 quad', assert => {
  const entry = 'PC / Intel Core2 Quad Q9650 @ 3.00GHz / ATi Radeon RX 470 Graphics';
  const expected = undefined;
  const actual = cpuClass(entry);
  console.log(actual);
  assert.equals(actual, expected);
  assert.end();
});
// PC / Intel Core i7 Q 720 @ 1.60GHz / ATi AMD Mobility Radeon HD 5000 Series
