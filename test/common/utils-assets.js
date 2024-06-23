import { test } from 'node:test';
import assert from 'node:assert/strict';

import { dirPathToJs, urlPathToJs, routePathToDynamicJs } from '../../lib/common/utils-assets.js';
import Config from '../../lib/common/config.js';

test('.dirPathToJs() - Defaults', () => {
  const config = new Config();
  const uri = dirPathToJs(config, '/some/file.js');
  assert.match(uri, /build\/js\/some\/file.js/, 'Should be "/build/js/some/file.js"');
});

test('.dirPathToJs() - with .dirBuild set', () => {
  const config = new Config();
  config.dirBuild = './out';
  const uri = dirPathToJs(config, '/some/file.js');
  assert.match(uri, /out\/js\/some\/file.js/, 'Should be "/out/js/some/file.js"');
});

test('.dirPathToJs() - with .dirJs set', () => {
  const config = new Config();
  config.dirJs = './scripts';
  const uri = dirPathToJs(config, '/some/file.js');
  assert.match(uri, /build\/scripts\/some\/file.js/, 'Should be "/build/scripts/some/file.js"');
});

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

test('.urlPathToJs() - Development mode - With .dirJs set', () => {
  const config = new Config();
  config.dirJs = './script';
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

test('.urlPathToJs() - Production mode - With .dirJs set', () => {
  const config = new Config({ development: false });
  config.dirJs = './script';
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
  config.dirJs = './script';
  const uri = routePathToDynamicJs(config, '/some/file.js');
  assert.equal(uri, '/_/script/some/file.js', 'Should be "/_/script/some/file.js"');
});
