var test = require('tape');
var fs = require('fs');

import {
  normalize,
  mapBTLELines,
  getBTLEDeviceManufacturer,
  toArray
} from '../src/parser';
import {
  WAHOO_MANUFACTURER_ID,
  TACX_MANUFACTURER_ID
} from '../src/parser/constants';

test('should extract raw Tacx BTLE lines', assert => {
  // path is relative to the root of the project
  const tacxlog = normalize(
    fs.readFileSync('./testdata/tacx-btle.txt', 'utf8')
  );

  const actual = mapBTLELines(tacxlog);

  const expectedLength = 44;

  console.log(actual.length);

  assert.true(actual.length > 0);

  assert.true(actual.length === expectedLength);

  const manufacturerId = getBTLEDeviceManufacturer(tacxlog);

  assert.true(
    manufacturerId,
    TACX_MANUFACTURER_ID,
    'expected Tacx manufacturer id'
  );

  assert.end();
});

test('should extract raw Kickr BTLE lines', assert => {
  // path is relative to the root of the project
  const kickrlog = normalize(
    fs.readFileSync('./testdata/kickr-btle.txt', 'utf8')
  );

  const actual = mapBTLELines(kickrlog);

  const expectedLength = 6;

  console.log(actual.length);

  assert.true(actual.length > 0);

  assert.true(actual.length === expectedLength, 'expected more messages');

  const manufacturerId = getBTLEDeviceManufacturer(kickrlog);

  assert.true(
    manufacturerId,
    WAHOO_MANUFACTURER_ID,
    'expected Wahoo manufacturer id'
  );

  assert.end();
});
