import { join } from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';

import { Glob } from 'glob';
import abslog from 'abslog';

/**
 * @typedef {import('./config.js').default} Config
 */

const HASH_LENGTH = 8;
const ACTION = /action(\.js|\.ts)/;
const ROUTE = /route(\.js|\.ts)/;
const PAGE = /page(\.js|\.ts)/;

const createHash = (value, seed = '') => {
  const v = seed === '' ? value : `${value}#${seed}`;
  return crypto.createHash('shake256', { outputLength: HASH_LENGTH }).update(v).digest('hex');
};

export default class HierarchyRoutes {
  /**
   * @param {object} options
   * @param {Config} [options.config]
   * @param {string} [options.seed]
   */
  constructor({ config, seed = '', logger }) {
    this.logger = abslog(logger);
    this.config = config;
    this.seed = seed;

    this.routerGlob = new Glob(
      [
        `${this.config.dirPages}/**/action.{ts,js}`,
        `${this.config.dirPages}/**/route.{ts,js}`,
        `${this.config.dirPages}/**/page.{ts,js}`,
      ],
      {
        withFileTypes: true,
        nodir: true,
      },
    );
    this.router = new Map();

    this.document = '';
    this.notFound = '';
    this.error = '';
  }

  async *scan() {
    this.router.clear();

    for await (const entry of this.routerGlob) {
      if (ACTION.test(entry.name)) {
        yield this.setAction(entry.parentPath, entry.name);
      }

      if (ROUTE.test(entry.name)) {
        yield this.setRoute(entry.parentPath, entry.name);
      }

      if (PAGE.test(entry.name)) {
        yield this.setPage(entry.parentPath, entry.name);
      }

      // TODO: Handle unknown files if any????
    }
  }

  setAction(parentPath, name) {
    let route = parentPath.replace(this.config.dirPages, '');
    if (route === '') route = '/'; // Make sure root route is a /
    route = join(this.config.urlPathBase, route); // Append base path if configures

    const source = join(parentPath, name);
    const hash = createHash(route, this.seed);

    this.logger.trace(`Action: ${hash} - ${source}`);

    const entry = {
      source,
      bundle: false,
      route,
      hash,
      type: 'action',
    };

    // console.log('SCANNING - ACTION', hash, source, route);

    // this.map.set(hash, entry);
    return entry;
  }

  setRoute(parentPath, name) {
    let route = parentPath.replace(this.config.dirPages, '');
    if (route === '') route = '/'; // Make sure root route is a /
    route = join(this.config.urlPathBase, route); // Append base path if configures

    const source = join(parentPath, name);
    const hash = createHash(route, this.seed);

    this.logger.trace(`Route: ${hash} - ${source}`);

    const entry = {
      source,
      bundle: false,
      route,
      hash,
      type: 'route',
    };

    // console.log('SCANNING - ROUTE', hash, source, route);

    // this.map.set(hash, entry);
    return entry;
  }

  setPage(parentPath, name) {
    let route = parentPath.replace(this.config.dirPages, '');
    if (route === '') route = '/'; // Make sure root route is a /
    route = join(this.config.urlPathBase, route); // Append base path if configures

    const source = join(parentPath, name);
    const hash = createHash(route, this.seed);

    this.logger.trace(`Page: ${hash} - ${source}`);

    const entry = {
      source,
      bundle: true,
      route,
      hash,
      type: 'page',
    };

    // console.log('SCANNING - PAGE', hash, source, route);

    this.router.set(hash, entry);
    return entry;
  }

  getEntryByHash(hash) {
    return this.router.get(hash);
  }

  getEntryByPath(path) {
    // TODO: Can be made more efficient
    return Array.from(this.router.values()).filter((entry) => {
      return path === entry.source;
    })[0];
  }

  toBundle() {
    return Array.from(this.router.values())
      .filter((entry) => {
        return entry.bundle;
      })
      .map((entry) => {
        return entry.source;
      });
  }

  async setDocument() {
    const filePath = join(this.config.dirSystem, 'document.js');
    try {
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        this.document = filePath;
        this.logger.trace(`Using user defined document.js at ${this.document}`);
      }
    } catch (err) { // eslint-disable-line
      this.document = join(this.config.pkgDefaults, '/system', 'document.js');
      this.logger.trace(`No user defined document.js found. Using system default.`);
    }
  }

  getDocument() {
    return this.document;
  }

  async setNotFound() {
    const filePath = join(this.config.dirSystem, 'not-found.js');
    try {
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        this.notFound = filePath;
        this.logger.trace(`Using user defined not-found.js at ${this.notFound}`);
      }
    } catch (err) { // eslint-disable-line
      this.notFound = join(this.config.pkgDefaults, '/system', 'not-found.js');
      this.logger.trace(`No user defined not-found.js found. Using system default.`);
    }
  }

  getNotFound() {
    return this.notFound;
  }

  async setError() {
    const filePath = join(this.config.dirSystem, 'error.js');
    try {
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        this.error = filePath;
        this.logger.trace(`Using user defined error.js at ${this.error}`);
      }
    } catch (err) { // eslint-disable-line
      this.error = join(this.config.pkgDefaults, '/system', 'error.js');
      this.logger.trace(`No user defined error.js found. Using system default.`);
    }
  }

  getError() {
    return this.error;
  }
}
