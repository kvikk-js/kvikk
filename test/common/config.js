import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';

import Config from '../../lib/common/config.js';

// Semver regex
// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
const semver = (str) => {
  const regex = new RegExp(
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm,
  );
  return regex.test(str);
};

test('Config - .libVersion', () => {
  const config = new Config();
  assert.ok(semver(config.libVersion), 'Should contain a valid semver value');
  try {
    config.libVersion = '1.0.0-test.1';
  } catch (err) {
    assert.match(err.message, /Cannot set read-only property./, 'Should throw if being set');
  }
});

test('Config - .cwd - Default behaviour', () => {
  const config = new Config();
  assert.ok(path.isAbsolute(config.cwd), 'Should absolute path');
  try {
    config.cwd = '/tmp';
  } catch (err) {
    assert.match(err.message, /Cannot set read-only property./, 'Should throw if being set');
  }
});

test('Config - .cwd - Custom cwd - Absolute path', () => {
  const config = new Config({ cwd: '/tmp' });
  assert.ok(path.isAbsolute(config.cwd), 'Should resolve to an absolute path');
  assert.equal(config.cwd, '/tmp', 'Should be same as set on constructor');
});

test('Config - .cwd - Custom cwd - Relative path', () => {
  const config = new Config({ cwd: './tmp' });
  assert.ok(path.isAbsolute(config.cwd), 'Should resolve to an absolute path');
  assert.notEqual(config.cwd, '/tmp', 'Should NOT be same as set on constructor');
});

test('Config - .dirSrc', () => {
  const config = new Config({ cwd: '/tmp' });
  config.dirSrc = './src';

  assert.ok(path.isAbsolute(config.dirSrc), 'Should resolve to an absolute path');
  assert.equal(config.dirSrc, '/tmp/src', 'Should be /tmp/src');

  try {
    config.dirSrc = '/src';
  } catch (err) {
    assert.match(
      err.message,
      /Value for directories.src is not relative. Must be relative path./,
      'Should throw if absolute',
    );
  }
});

test('Config - .dirBuild', () => {
  const config = new Config({ cwd: '/tmp' });
  config.dirSrc = './src';
  config.dirBuild = './build';

  assert.ok(path.isAbsolute(config.dirBuild), 'Should resolve to an absolute path');
  assert.equal(config.dirBuild, '/tmp/src/build', 'Should be /tmp/src/build');

  try {
    config.dirBuild = '/build';
  } catch (err) {
    assert.match(
      err.message,
      /Value for directories.build is not relative. Must be relative path./,
      'Should throw if absolute',
    );
  }
});

test('Config - .dirCompoents', () => {
  const config = new Config({ cwd: '/tmp' });
  config.dirSrc = './src';
  config.dirComponents = './components';

  assert.ok(path.isAbsolute(config.dirComponents), 'Should resolve to an absolute path');
  assert.equal(config.dirComponents, '/tmp/src/components', 'Should be /tmp/src/build');

  try {
    config.dirComponents = '/components';
  } catch (err) {
    assert.match(
      err.message,
      /Value for directories.components is not relative. Must be relative path./,
      'Should throw if absolute',
    );
  }
});

test('Config - .dirLayouts', () => {
  const config = new Config({ cwd: '/tmp' });
  config.dirSrc = './src';
  config.dirLayouts = './layouts';

  assert.ok(path.isAbsolute(config.dirLayouts), 'Should resolve to an absolute path');
  assert.equal(config.dirLayouts, '/tmp/src/layouts', 'Should be /tmp/src/layouts');

  try {
    config.dirLayouts = '/layouts';
  } catch (err) {
    assert.match(
      err.message,
      /Value for directories.layouts is not relative. Must be relative path./,
      'Should throw if absolute',
    );
  }
});

test('Config - .dirPublic', () => {
  const config = new Config({ cwd: '/tmp' });
  config.dirSrc = './src';
  config.dirPublic = './public';

  assert.ok(path.isAbsolute(config.dirPublic), 'Should resolve to an absolute path');
  assert.equal(config.dirPublic, '/tmp/src/public', 'Should be /tmp/src/public');

  try {
    config.dirPublic = '/public';
  } catch (err) {
    assert.match(
      err.message,
      /Value for directories.public is not relative. Must be relative path./,
      'Should throw if absolute',
    );
  }
});

test('Config - .dirSystem', () => {
  const config = new Config({ cwd: '/tmp' });
  config.dirSrc = './src';
  config.dirSystem = './system';

  assert.ok(path.isAbsolute(config.dirSystem), 'Should resolve to an absolute path');
  assert.equal(config.dirSystem, '/tmp/src/system', 'Should be /tmp/src/system');

  try {
    config.dirSystem = '/system';
  } catch (err) {
    assert.match(
      err.message,
      /Value for directories.system is not relative. Must be relative path./,
      'Should throw if absolute',
    );
  }
});

test('Config - .dirPages', () => {
  const config = new Config({ cwd: '/tmp' });
  config.dirSrc = './src';
  config.dirPages = './pages';

  assert.ok(path.isAbsolute(config.dirPages), 'Should resolve to an absolute path');
  assert.equal(config.dirPages, '/tmp/src/pages', 'Should be /tmp/src/pages');

  try {
    config.dirPages = '/pages';
  } catch (err) {
    assert.match(
      err.message,
      /Value for directories.pages is not relative. Must be relative path./,
      'Should throw if absolute',
    );
  }
});
