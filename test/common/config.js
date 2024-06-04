import { strictEqual, match } from 'node:assert';
import { test } from 'node:test';
import Config from '../../lib/common/config.js';

test('Config - .libVersion', () => {
  const config = new Config();
  strictEqual(config.libVersion, '0.0.1', 'Should contain a semver value');
  try {
    config.libVersion = '1.0.0-test.1';
  } catch (err) {
    match(err.message, /Cannot set read-only property./, 'Should throw');
  }
});
