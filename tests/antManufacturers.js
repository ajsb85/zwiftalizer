var test = require('tape');

import { antManufacturers } from '../src/parser';

test('should get stages manufacturer', assert => {
  const line = '[13:41:35] ANT  : dID 775327 MFG 69 Model 1';
  const expect = 'Stages';
  const actual = antManufacturers(line);
  assert.equal(
    actual[0].manufacturer,
    expect,
    'manufacturer should be Stages Cycling'
  );
  assert.end();
});

test('should get 4iiiis manufacturer', assert => {
  const line = '[6:33:40] ANT  : dID 766475 MFG 51 Model 7';
  const expect = '4iiii';
  const actual = antManufacturers(line);
  assert.equal(actual[0].manufacturer, expect, 'manufacturer should be 4iiiis');
  assert.end();
});

test('should get quarq manufacturer', assert => {
  const line = '[10:58:43] ANT  : dID 743018 MFG 7 Model 1';
  const expect = 'Quarq';
  const actual = antManufacturers(line);
  assert.equal(actual[0].manufacturer, expect, 'manufacturer should be Quarq');
  assert.end();
});
