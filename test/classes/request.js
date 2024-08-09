import { test } from 'node:test';
import assert from 'node:assert/strict';

import HRequest from '../../lib/classes/request.js';

test('Request - .toRequest()', async (t) => {
  await t.test('Default value', () => {
    const request = new HRequest('http://hubro.dev/foo/index.html?bar=xyz', {
      headers: {
        'x-hubro': 'owl',
      },
    });
    const copy = request.toRequest();
    assert.ok(copy instanceof Request, 'Should be instance of Request');
  });
});
