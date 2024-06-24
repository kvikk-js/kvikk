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

test('Config - .libVersion', async (t) => {
  await t.test('Get value', () => {
    const config = new Config();
    assert.ok(semver(config.libVersion), 'Should contain a valid semver value');
  });

  await t.test('Set value', () => {
    const config = new Config();
    try {
      config.libVersion = '1.0.0-test.1';
    } catch (err) {
      assert.match(err.message, /Cannot set read-only property./, 'Should throw if being set');
    }
  });
});

test('Config - .development', async (t) => {
  await t.test('Default', () => {
    const config = new Config();
    assert.ok(config.development, 'Should be true');
  });

  await t.test('Set value by constructor', () => {
    const config = new Config({ development: false });
    assert.strictEqual(config.development, false, 'Should be false');
  });

  await t.test('Set value by setter', () => {
    const config = new Config();
    try {
      config.development = false;
    } catch (err) {
      assert.match(err.message, /Cannot set read-only property./, 'Should throw if being set');
    }
  });
});

test('Config - .name', async (t) => {
  await t.test('Get value', () => {
    const config = new Config();
    assert.strictEqual(config.name, 'Kvikk.js', 'Should be "kvikk.js"');
  });

  await t.test('Set value', () => {
    const config = new Config();
    config.name = 'foo';
    assert.strictEqual(config.name, 'foo', 'Should be set');
  });
});

test('Config - .cwd', async (t) => {
  await t.test('Default behaviour', () => {
    const config = new Config();
    assert.ok(path.isAbsolute(config.cwd), 'Should absolute path');

    try {
      config.cwd = '/tmp';
    } catch (err) {
      assert.match(err.message, /Cannot set read-only property./, 'Should throw if being set');
    }
  });

  await t.test('Custom cwd - Relative path', () => {
    const config = new Config({ cwd: './tmp' });
    assert.ok(path.isAbsolute(config.cwd), 'Should resolve to an absolute path');
    assert.notEqual(config.cwd, '/tmp', 'Should NOT be same as set on constructor');
  });

  await t.test('Custom cwd - Absolute path', () => {
    const config = new Config({ cwd: '/tmp' });
    assert.ok(path.isAbsolute(config.cwd), 'Should resolve to an absolute path');
    assert.equal(config.cwd, '/tmp', 'Should be same as set on constructor');
  });
});

test('Config - .dirSrc', async (t) => {
  await t.test('Custom cwd - Relative path', () => {
    const config = new Config({ cwd: '/tmp' });
    config.dirSrc = './src';

    assert.ok(path.isAbsolute(config.dirSrc), 'Should resolve to an absolute path');
    assert.equal(config.dirSrc, '/tmp/src', 'Should be /tmp/src');
  });

  await t.test('Custom cwd - Absolute path', () => {
    const config = new Config({ cwd: '/tmp' });
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
});

test('Config - .dirBuild', async (t) => {
  await t.test('Custom cwd - Relative path', () => {
    const config = new Config({ cwd: '/tmp' });
    config.dirSrc = './src';
    config.dirBuild = './build';

    assert.ok(path.isAbsolute(config.dirBuild), 'Should resolve to an absolute path');
    assert.equal(config.dirBuild, '/tmp/src/build', 'Should be /tmp/src/build');
  });

  await t.test('Custom cwd - Absolute path', () => {
    const config = new Config({ cwd: '/tmp' });
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
});

test('Config - .dirCompoents', async (t) => {
  await t.test('Custom cwd - Relative path', () => {
    const config = new Config({ cwd: '/tmp' });
    config.dirSrc = './src';
    config.dirComponents = './components';

    assert.ok(path.isAbsolute(config.dirComponents), 'Should resolve to an absolute path');
    assert.equal(config.dirComponents, '/tmp/src/components', 'Should be /tmp/src/build');
  });

  await t.test('Custom cwd - Absolute path', () => {
    const config = new Config({ cwd: '/tmp' });
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
});

test('Config - .dirLayouts', async (t) => {
  await t.test('Custom cwd - Relative path', () => {
    const config = new Config({ cwd: '/tmp' });
    config.dirSrc = './src';
    config.dirLayouts = './layouts';

    assert.ok(path.isAbsolute(config.dirLayouts), 'Should resolve to an absolute path');
    assert.equal(config.dirLayouts, '/tmp/src/layouts', 'Should be /tmp/src/layouts');
  });

  await t.test('Custom cwd - Absolute path', () => {
    const config = new Config({ cwd: '/tmp' });
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
});

test('Config - .dirPublic', async (t) => {
  await t.test('Custom cwd - Relative path', () => {
    const config = new Config({ cwd: '/tmp' });
    config.dirSrc = './src';
    config.dirPublic = './public';

    assert.ok(path.isAbsolute(config.dirPublic), 'Should resolve to an absolute path');
    assert.equal(config.dirPublic, '/tmp/src/public', 'Should be /tmp/src/public');
  });

  await t.test('Custom cwd - Absolute path', () => {
    const config = new Config({ cwd: '/tmp' });
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
});

test('Config - .dirSystem', async (t) => {
  await t.test('Custom cwd - Relative path', () => {
    const config = new Config({ cwd: '/tmp' });
    config.dirSrc = './src';
    config.dirSystem = './system';

    assert.ok(path.isAbsolute(config.dirSystem), 'Should resolve to an absolute path');
    assert.equal(config.dirSystem, '/tmp/src/system', 'Should be /tmp/src/system');
  });

  await t.test('Custom cwd - Absolute path', () => {
    const config = new Config({ cwd: '/tmp' });
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
});

test('Config - .dirPages', async (t) => {
  await t.test('Custom cwd - Relative path', () => {
    const config = new Config({ cwd: '/tmp' });
    config.dirSrc = './src';
    config.dirPages = './pages';

    assert.ok(path.isAbsolute(config.dirPages), 'Should resolve to an absolute path');
    assert.equal(config.dirPages, '/tmp/src/pages', 'Should be /tmp/src/pages');
  });

  await t.test('Custom cwd - Absolute path', () => {
    const config = new Config({ cwd: '/tmp' });
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
});

test('Config - .dirCss', async (t) => {
  await t.test('Custom cwd - Relative path', () => {
    const config = new Config({ cwd: '/tmp' });
    config.dirCss = './styles';
    assert.equal(config.dirCss, './styles', 'Should be ./styles');
  });

  await t.test('Custom cwd - Absolute path', () => {
    const config = new Config({ cwd: '/tmp' });
    try {
      config.dirCss = '/styles';
    } catch (err) {
      assert.match(
        err.message,
        /Value for directories.css is not relative. Must be relative path./,
        'Should throw if absolute',
      );
    }
  });
});

test('Config - .dirJs', async (t) => {
  await t.test('Custom cwd - Relative path', () => {
    const config = new Config({ cwd: '/tmp' });
    config.dirJs = './scripts';
    assert.equal(config.dirJs, './scripts', 'Should be ./scripts');
  });

  await t.test('Custom cwd - Absolute path', () => {
    const config = new Config({ cwd: '/tmp' });
    try {
      config.dirJs = '/scripts';
    } catch (err) {
      assert.match(
        err.message,
        /Value for directories.js is not relative. Must be relative path./,
        'Should throw if absolute',
      );
    }
  });
});
