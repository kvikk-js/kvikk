import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';

import { config } from 'hubro/test';
import server from 'hubro/server';

test('Integration', async (t) => {
  const app = await server({}, config);
  const address = await app.start();

  await t.test('Route: ./error', async () => {
    const response = await fetch(new URL('./error', address));

    assert.equal(response.status, 404, 'Should result in an http status 404 response');
    assert.equal(response.ok, false, 'Should result in an NON OK response');

    // Body must be consumed, if not test will not exit
    await response.text();
  });

  await app.stop();
});

test('Integration', async (t) => {
  const app = await server({
    cwd: path.join(process.cwd(), '/fixtures/router-paths/'),
  });
  const address = await app.start();

  await t.test('Route: ./', async () => {
    const response = await fetch(address);
    const body = await response.text();

    const route = /\.\/page\.js/g;

    assert.equal(response.status, 200, 'Should result in an http status 200 response');
    assert.equal(response.ok, true, 'Should result in an OK response');
    assert.equal(route.test(body), true, 'Should contain route path');
  });
  /*
  await t.test('Route: ./pages/fixed/', async () => {
    const response = await fetch(new URL('./pages/fixed/', address));
    const body = await response.text();

    const route = /\.\/pages\/fixed\/page\.js/g;

    assert.equal(response.status, 200, 'Should result in an http status 200 response');
    assert.equal(response.ok, true, 'Should result in an OK response');
    assert.equal(route.test(body), true, 'Should contain route path');
  });

  await t.test('Route: ./pages/[bar]/', async () => {
    const response = await fetch(new URL('./pages/a/', address));
    const body = await response.text();

    const route = /\.\/pages\/\[bar\]\/page\.js/g;

    assert.equal(response.status, 200, 'Should result in an http status 200 response');
    assert.equal(response.ok, true, 'Should result in an OK response');
    assert.equal(route.test(body), true, 'Should contain route path');
  });

  await t.test('Route: ./pages/[bar]/[foo]/', async () => {
    const response = await fetch(new URL('./pages/a/b/', address));
    const body = await response.text();

    const route = /\.\/pages\/\[bar\]\/\[foo\]\/page\.js/g;

    assert.equal(response.status, 200, 'Should result in an http status 200 response');
    assert.equal(response.ok, true, 'Should result in an OK response');
    assert.equal(route.test(body), true, 'Should contain route path');
  });
*/
  await app.stop();
});
