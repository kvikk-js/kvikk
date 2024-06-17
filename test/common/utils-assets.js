import { test } from 'node:test';
import assert from 'node:assert/strict';

import { urlPathToJs, routePathToDynamicJs } from '../../lib/common/utils-assets.js';
import Config from '../../lib/common/config.js';

test('.urlPathToJs() - Development mode - Defaults', () => {
  const config = new Config();
  const uri = urlPathToJs(config, '/some/file.js');
  assert.equal(uri, '/_/js/some/file.js', 'Should be "/_/js/some/file.js"');
});

test('.urlPathToJs() - Development mode - With .urlPathBase set', () => {
  const config = new Config();
  config.urlPathBase = '/foo';
  const uri = urlPathToJs(config, '/some/file.js');
  assert.equal(uri, '/foo/_/js/some/file.js', 'Should be "/foo/_/js/some/file.js"');
});

test('.urlPathToJs() - Development mode - With .urlPathJs set', () => {
  const config = new Config();
  config.urlPathJs = '/script';
  const uri = urlPathToJs(config, '/some/file.js');
  assert.equal(uri, '/_/script/some/file.js', 'Should be "/_/script/some/file.js"');
});

test('.urlPathToJs() - Production mode - Defaults', () => {
  const config = new Config({ development: false });
  const uri = urlPathToJs(config, '/some/file.js');
  assert.equal(uri, '/public/js/some/file.js', 'Should be "/public/js/some/file.js"');
});

test('.urlPathToJs() - Production mode - With .urlPathBase set', () => {
  const config = new Config({ development: false });
  config.urlPathBase = '/foo';
  const uri = urlPathToJs(config, '/some/file.js');
  assert.equal(uri, '/foo/public/js/some/file.js', 'Should be "/foo/public/js/some/file.js"');
});

test('.urlPathToJs() - Production mode - With .urlPathJs set', () => {
  const config = new Config({ development: false });
  config.urlPathJs = '/script';
  const uri = urlPathToJs(config, '/some/file.js');
  assert.equal(uri, '/public/script/some/file.js', 'Should be "/public/script/some/file.js"');
});

test('.routePathToDynamicJs() - Defaults', () => {
  const config = new Config();
  const uri = routePathToDynamicJs(config, '/some/file.js');
  assert.equal(uri, '/_/js/some/file.js', 'Should be "/_/js/some/file.js"');
});

test('.routePathToDynamicJs() - With .urlPathBase set', () => {
  const config = new Config();
  config.urlPathBase = '/foo';
  const uri = routePathToDynamicJs(config, '/some/file.js');
  assert.equal(uri, '/foo/_/js/some/file.js', 'Should be "/foo/_/js/some/file.js"');
});

test('.routePathToDynamicJs() - With .urlPathBase set', () => {
  const config = new Config();
  config.urlPathJs = '/script';
  const uri = routePathToDynamicJs(config, '/some/file.js');
  assert.equal(uri, '/_/script/some/file.js', 'Should be "/_/script/some/file.js"');
});
