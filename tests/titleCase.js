var test = require('tape');

import { titleCase } from '../src/parser';

test('should title case except for exceptions', assert => {
  const test = 'Pc, apple, amd, ati, OpenGL, NVIDIA';
  const expect = 'PC, Apple, AMD, ATi, OpenGL, Nvidia';
  const actual = titleCase(test);
  assert.equal(actual, expect, 'title case exceptions');
  assert.end();
});
